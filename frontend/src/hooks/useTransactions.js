import { useAppContext } from '../context/AppContext';

export default function useTransactions(token) {
  const { 
    transactions, 
    loading, 
    error, 
    refreshTransactions 
  } = useAppContext();

  return { 
    transactions, 
    loading, 
    error, 
    refreshTransactions 
  };
}
