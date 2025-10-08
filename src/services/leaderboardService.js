import { supabase } from '../supabaseClient'

export const submitScore = async (
  finalScore,
  difficulty,
  breakdown = {}
) => {
  const user = await supabase.auth.getUser()
  const userId = user?.data?.user?.id

  const {
    baseScore,
    timeInSeconds,
    difficultyMultiplier,
    accuracyBonus,
    hintPenalty
  } = breakdown

  const { error } = await supabase
    .from('leaderboard')
    .insert([
      {
        user_id: userId,
        score: finalScore,
        difficulty,
        timestamp: new Date().toISOString(),
        base_score: baseScore,
        time_in_seconds: timeInSeconds,
        difficulty_multiplier: difficultyMultiplier,
        accuracy_bonus: accuracyBonus,
        hint_penalty: hintPenalty
      }
    ])

  if (error) {
    console.error('Error submitting score:', error.message)
  }
}