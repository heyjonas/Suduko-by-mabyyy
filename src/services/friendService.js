import { supabase } from '../supabaseClient'

// Send a friend request
export const sendFriendRequest = async (friendId) => {
  const user = await supabase.auth.getUser()
  const userId = user?.data?.user?.id

  const { error } = await supabase.from('friends').insert([
    { user_id: userId, friend_id: friendId, status: 'pending' }
  ])

  if (error) {
    console.error('Error sending friend request:', error.message)
  }
}

// Accept or decline a friend request
export const respondToFriendRequest = async (requestId, accept = true) => {
  const { error } = await supabase
    .from('friends')
    .update({ status: accept ? 'accepted' : 'declined' })
    .eq('id', requestId)

  if (error) {
    console.error('Error updating friend request:', error.message)
  }
}

// Get accepted friends
export const getFriends = async () => {
  const user = await supabase.auth.getUser()
  const userId = user?.data?.user?.id

  const { data, error } = await supabase
    .from('friends')
    .select('friend_id')
    .eq('user_id', userId)
    .eq('status', 'accepted')

  if (error) {
    console.error('Error fetching friends:', error.message)
    return []
  }

  return data
}

// Optional: Listen for real-time updates
export const subscribeToFriendChanges = (callback) => {
  const subscription = supabase
    .from('friends')
    .on('*', payload => {
      callback(payload)
    })
    .subscribe()

  return subscription
}

export const fetchPendingRequests = async () => {
  const user = await supabase.auth.getUser()
  const userId = user?.data?.user?.id

  const { data, error } = await supabase
    .from('friends')
    .select('*')
    .eq('friend_id', userId)
    .eq('status', 'pending')

  if (error) {
    console.error('Error fetching pending requests:', error.message)
    return []
  }

  return data
}

export const getMutualFriends = async (userId, targetUserId) => {
  const { data: userFriends, error: userError } = await supabase
    .from('friends')
    .select('friend_id')
    .eq('user_id', userId)
    .eq('status', 'accepted')

  const { data: targetFriends, error: targetError } = await supabase
    .from('friends')
    .select('friend_id')
    .eq('user_id', targetUserId)
    .eq('status', 'accepted')

  if (userError || targetError) {
    console.error('Error fetching mutual friends')
    return []
  }

  const mutualIds = userFriends
    .map(f => f.friend_id)
    .filter(id => targetFriends.some(tf => tf.friend_id === id))

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', mutualIds)

  return profiles
}
