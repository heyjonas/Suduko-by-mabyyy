import React, { useState, useEffect, useContext } from 'react'
import { supabase } from '../supabaseClient'
import { SessionContext } from '../context/SessionContext'
import { useNavigate } from 'react-router-dom'
import Menu from '../components/Menu'

const ProfileSettings = () => {
  const { session } = useContext(SessionContext)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session) {
      navigate('/login')
    } else {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    setLoading(true)
    const userId = session?.user?.id
    const { data, error } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', userId)
      .maybeSingle()

    if (!data) {
        console.warn('No profile found for this user.');
    return;
    }

    if (error) {
      console.error('Error fetching profile:', error.message)
    } else {
      setUsername(data.username || '')
      setAvatarUrl(data.avatar_url || '')
    }

    setLoading(false)
  }

  const updateProfile = async () => {
    setLoading(true)
    const userId = session?.user?.id

    const { error } = await supabase
      .from('profiles')
      .update({ username, avatar_url: avatarUrl })
      .eq('id', userId)

    if (error) {
      alert('Update failed: ' + error.message)
    } else {
      alert('Profile updated successfully!')
    }

    setLoading(false)
  }

  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true)
      const file = event.target.files[0]
      if (!file) return

      const userId = session?.user?.id
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrlData.publicUrl)
    } catch (error) {
      alert('Error uploading avatar: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>

      <input
        type="text"
        placeholder="Preferred Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border px-2 py-1 mb-4 w-full"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        disabled={uploading}
        className="mb-4"
      />

      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-24 h-24 rounded-full border mb-4"
        />
      )}

      <button
        onClick={updateProfile}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Updating...' : 'Save Changes'}
      </button>
      <Menu />
    </div>
  )
}

export default ProfileSettings