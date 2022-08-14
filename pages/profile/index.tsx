import { useRouter } from 'next/router';
import { useAuth } from '../../utils/firebase/auth'
import { Auth } from '../../utils/types';


function RedirectPage() {
  const auth: Auth = useAuth() as Auth;
  const router = useRouter()
  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push(`/profile/${auth.username}`)
  }

  return (
    <div>
        Redirecting...
    </div>
  );
}

export default RedirectPage