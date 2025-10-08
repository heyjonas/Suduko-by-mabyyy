import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Menu from './Menu'

const Leaderboard = () => {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('score, difficulty, timestamp, user_id')
      .order('score', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching leaderboard:', error.message)
      return
    }

    const userIds = data.map(entry => entry.user_id)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds)

    const profileMap = {}
    profiles.forEach(p => {
      profileMap[p.id] = p.username
    })

    const enriched = data.map(entry => ({
      ...entry,
      username: profileMap[entry.user_id] || entry.user_id
    }))

    setEntries(enriched)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🏆 Leaderboard</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Score</th>
            <th className="px-4 py-2">Difficulty</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{entry.username}</td>
              <td className="px-4 py-2">{entry.score}</td>
              <td className="px-4 py-2 capitalize">{entry.difficulty}</td>
              <td className="px-4 py-2">{new Date(entry.timestamp).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Menu />
    </div>
  )
}

export default Leaderboard