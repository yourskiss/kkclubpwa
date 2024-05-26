"use server";
 import { Suspense } from 'react';
 import HomeComponent from '@/components/app/HomeComponent';
 
export default async function Home() {

 
  return (
    <Suspense fallback={<p>...Loading</p>}>
      <div className="videoloader">
        <div className='videoconainer'>
          <HomeComponent />
      </div>
    </div>
  </Suspense> 
  );
}
 