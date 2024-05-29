import { Suspense} from 'react';
import LoginComponent3 from '@/components/app/LoginComponent3';
export default function login() {
  return (
    <Suspense fallback={<p>...Loading</p>}>
      <LoginComponent3 />
    </Suspense>
  
)
}
