import { useAuth } from '@/hooks/useAuth';
import Agreements from './Agreements';
import AgreementsTeaser from './AgreementsTeaser';

export default function AgreementsRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Agreements />;
  }

  return <AgreementsTeaser />;
}
