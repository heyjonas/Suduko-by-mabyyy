
import React, { useEffect, useState } from 'react'
import {
  getFriends,
  sendFriendRequest,
  respondToFriendRequest,
  fetchPendingRequests
} from '../services/friendService'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { SessionContext } from '../context/SessionContext'
import Menu from '../components/Menu'


const FriendList = () => {
  const { session } = React.useContext(SessionContext)
  const navigate = useNavigate()
  const [friends, setFriends] = useState([])
  const [friendProfiles, setFriendProfiles] = useState([])
  const [filteredProfiles, setFilteredProfiles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [pendingRequests, setPendingRequests] = useState([])
  const [newFriendId, setNewFriendId] = useState('')

  useEffect(() => {
    if (!session) {
      navigate('/login') // redirect to login if not authenticated
    }
  }, [session]) 

  useEffect(() => {
    refreshFriendData()
  }, [])

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const filtered = friendProfiles.filter(profile =>
      (profile.username || '').toLowerCase().includes(term)
    )
    setFilteredProfiles(filtered)
  }, [searchTerm, friendProfiles])

  const refreshFriendData = async () => {
    const accepted = await getFriends()
    setFriends(accepted)

    const friendIds = accepted.map(f => f.friend_id)
    const profiles = await fetchProfiles(friendIds)
    setFriendProfiles(profiles)
    setFilteredProfiles(profiles)

    const pending = await fetchPendingRequests()
    setPendingRequests(pending)
  }

  const fetchProfiles = async (ids) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', ids)

    if (error) {
      console.error('Error fetching profiles:', error.message)
      return []
    }

    return data
  }

  const handleSendRequest = async () => {
    if (!newFriendId) return
    await sendFriendRequest(newFriendId)
    alert('Friend request sent!')
    setNewFriendId('')
    refreshFriendData()
  }

  const handleRespond = async (requestId, accept) => {
    await respondToFriendRequest(requestId, accept)
    alert(`Request ${accept ? 'accepted' : 'declined'}`)
    refreshFriendData()
  }

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

        {filteredProfiles.length === 0 ? (
          <p className="mb-6 text-gray-500">No matching friends found.</p>
        ) : (
          <ul className="mb-6">
            {filteredProfiles.map((profile) => (
              <li key={profile.id} className="flex items-center mb-4">
                <img
                  src={profile.avatar_url || 'https://via.placeholder.com/40'}
                  alt="avatar"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="font-medium">{profile.username || profile.id}</span>
              </li>
            ))}
          </ul>
        )}

        <h3 className="text-lg font-semibold mb-2">Send Friend Request</h3>
        <div className="flex mb-6">
          <input
            type="text"
            value={newFriendId}
            onChange={(e) => setNewFriendId(e.target.value)}
            placeholder="Enter Friend's User ID"
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
        {pendingRequests.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          <ul>
            {pendingRequests.map((req) => (
              <li key={req.id} className="mb-2 flex items-center justify-between">
                <span>{req.user_id}</span>
                <div>
                  <button
                    onClick={() => handleRespond(req.id, true)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(req.id, false)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Menu />
    </div>
  )
}

export default FriendList
