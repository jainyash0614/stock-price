import { useAppContext } from '../context/AppContext';

export default function useEvents() {
  const { 
    events, 
    loading, 
    error 
  } = useAppContext();

  return { 
    events, 
    loading, 
    error 
  };
}
