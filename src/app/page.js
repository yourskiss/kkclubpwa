import { Suspense } from 'react';
import HomeComponent from '@/components/app/HomeComponent';
 
export default function Home() {
  return (
    <Suspense fallback={<p>...Loading</p>}>
      <HomeComponent/>
    </Suspense>
  );
}
