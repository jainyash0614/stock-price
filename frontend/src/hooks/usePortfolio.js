import { useAppContext } from '../context/AppContext';

export default function usePortfolio(token) {
  const { 
    portfolio, 
    user, 
    loading, 
    error, 
    refreshPortfolio, 
    refreshUser 
  } = useAppContext();

  return { 
    portfolio, 
    user, 
    loading, 
    error, 
    refreshPortfolio, 
    refreshUser 
  };
}
