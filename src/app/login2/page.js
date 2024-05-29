import { Suspense} from 'react';
import LoginComponent2 from '@/components/app/LoginComponent2';
export default function login() {
  return (
    <Suspense fallback={<p>...Loading</p>}>
      <LoginComponent2 />
    </Suspense>
  
)
}
