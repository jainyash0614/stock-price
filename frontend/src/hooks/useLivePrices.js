import { useAppContext } from '../context/AppContext';

export default function useLivePrices() {
  const { 
    livePrices, 
    loading, 
    error 
  } = useAppContext();

  return { 
    data: livePrices, 
    loading, 
    error 
  };
}
