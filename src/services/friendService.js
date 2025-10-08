import { supabase } from '../supabaseClient';

// Get accepted friends for the current user
export const getFriends = async (userId) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('friends')
    .select('*')
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq('status', 'accepted');

  if (error) {
    console.error('Error fetching friends:', error.message);
    return [];
  }

  return data;
};

// Fetch pending friend requests sent to the current user
export const fetchPendingRequests = async (userId) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('friends')
    .select('*')
    .eq('friend_id', userId)
    .eq('status', 'pending');

  if (error) {
    console.error('Error fetching pending requests:', error.message);
    return [];
  }

  return data;
};

// Send a friend request
export const sendFriendRequest = async (userId, friendId) => {
  if (!userId || !friendId) return;
  const { error } = await supabase
    .from('friends')
    .insert([{ user_id: userId, friend_id: friendId }]);

  if (error) {
    console.error('Error sending friend request:', error.message);
  }
};

// Respond to a friend request
export const respondToFriendRequest = async (requestId, accept) => {
  const { error } = await supabase
    .from('friends')
    .update({ status: accept ? 'accepted' : 'declined' })
    .eq('id', requestId);

  if (error) {
    console.error('Error responding to friend request:', error.message);
  }
};

// Cancel a friend request
export const cancelFriendRequest = async (requestId, userId) => {
  if (!requestId || !userId) return;
  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', requestId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error canceling friend request:', error.message);
  }
};