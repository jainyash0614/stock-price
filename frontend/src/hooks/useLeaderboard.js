import { useAppContext } from '../context/AppContext';

export default function useLeaderboard() {
  const { 
    leaderboard, 
    loading, 
    error, 
    refreshLeaderboard 
  } = useAppContext();

  return { 
    leaderboard, 
    loading, 
    error, 
    refreshLeaderboard 
  };
}
