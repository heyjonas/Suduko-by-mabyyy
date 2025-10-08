import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  getFriends,
  sendFriendRequest,
  respondToFriendRequest,
  fetchPendingRequests,
  cancelFriendRequest
} from '../services/friendService';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../context/SessionContext';
import Menu from '../components/Menu';

const FriendList = () => {
  const { session } = useContext(SessionContext);
  const navigate = useNavigate();
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friendProfiles, setFriendProfiles] = useState([]);
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [mutualFriendsMap, setMutualFriendsMap] = useState({});

  useEffect(() => {
    if (!session) {
      navigate('/auth');
    }
  }, [session]);

  useEffect(() => {
    refreshFriendData();

    const channel = supabase
      .channel('friends-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'friends' }, () => {
        refreshFriendData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = friendProfiles.filter(profile =>
      (profile.username || '').toLowerCase().includes(term)
    );
    setFriendProfiles(filtered);
  }, [searchTerm]);

  const refreshFriendData = async () => {
    if (!session?.user?.id) return;

    const accepted = await getFriends(session.user.id);
    setAcceptedFriends(accepted);

    const acceptedIds = accepted.map(f =>
      f.user_id === session.user.id ? f.friend_id : f.user_id
    );
    const acceptedProfiles = await fetchProfiles(acceptedIds);
    setFriendProfiles(acceptedProfiles);

    const pending = await fetchPendingRequests(session.user.id);
    setPendingRequests(pending);

    const pendingIds = pending.map(req => req.user_id);
    const pendingProfiles = await fetchProfiles(pendingIds);
    setPendingProfiles(pendingProfiles);

    const mutualMap = {};
    for (const friendId of acceptedIds) {
      const mutual = await getFriends(friendId);
      const mutualIds = mutual.map(f =>
        f.user_id === friendId ? f.friend_id : f.user_id
      );
      const mutualProfiles = await fetchProfiles(mutualIds);
      mutualMap[friendId] = mutualProfiles.filter(p => acceptedIds.includes(p.id));
    }
    setMutualFriendsMap(mutualMap);
  };

  const fetchProfiles = async (ids) => {
    if (!ids.length) return [];
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', ids);

    if (error) {
      console.error('Error fetching profiles:', error.message);
      return [];
    }

    return data;
  };

  const handleSendRequest = async () => {
    if (!newFriendUsername) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', newFriendUsername)
      .maybeSingle();

    if (error || !data) {
      alert('User not found.');
      return;
    }

    await sendFriendRequest(data.id);
    alert('Friend request sent!');
    setNewFriendUsername('');
    refreshFriendData();
  };

  const handleRespond = async (requestId, accept) => {
    await respondToFriendRequest(requestId, accept);
    alert(`Request ${accept ? 'accepted' : 'declined'}`);
    refreshFriendData();
  };

  const handleCancelRequest = async (requestId) => {
    await cancelFriendRequest(requestId);
    alert('Friend request canceled.');
    refreshFriendData();
  };

  return (
    <div>
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Friends</h2>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by username"
          className="border px-2 py-1 mb-4 w-full"
        />

        {friendProfiles.length === 0 ? (
          <p className="mb-6 text-gray-500">No accepted friends found.</p>
        ) : (
          <ul className="mb-6">
            {friendProfiles.map((profile) => (
              <li key={profile.id} className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={profile.avatar_url || 'https://via.placeholder.com/40'}
                      alt="avatar"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <span className="font-medium">{profile.username || profile.id}</span>
                      <span className="ml-2 text-green-600 text-xs">Accepted</span>
                    </div>
                  </div>
                </div>
                {mutualFriendsMap[profile.id]?.length > 0 && (
                  <div className="ml-12 mt-1 text-sm text-gray-600">
                    Mutual friends: {mutualFriendsMap[profile.id].map(m => m.username).join(', ')}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <h3 className="text-lg font-semibold mb-2">Send Friend Request</h3>
        <div className="flex mb-6">
          <input
            type="text"
            value={newFriendUsername}
            onChange={(e) => setNewFriendUsername(e.target.value)}
            placeholder="Enter Friend's Username"
            className="border px-2 py-1 mr-2 flex-grow"
          />
          <button
            onClick={handleSendRequest}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Send
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-2">Pending Requests</h3>
        {pendingProfiles.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          <ul>
            {pendingProfiles.map((profile) => {
              const request = pendingRequests.find(r => r.user_id === profile.id);
              return (
                <li key={profile.id} className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={profile.avatar_url || 'https://via.placeholder.com/40'}
                        alt="avatar"
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <span className="font-medium">{profile.username || profile.id}</span>
                        <span className="ml-2 text-yellow-600 text-xs">Pending</span>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleRespond(request.id, true)}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(request.id, false)}
                        className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleCancelRequest(request.id)}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <Menu />
    </div>
  );
};

export default FriendList;