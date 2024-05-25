"use server";
 import { Suspense } from 'react';
 import HomeComponent from '@/components/app/HomeComponent';
 
const apiURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
const apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;

async function setMainToken() {
    const response = await fetch(`${apiURL}ApiAuth/authtoken`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ "userid": apiUsername, "password": apiPassword }), 
    });
    const result = await response.json(); 
   // console.log('Success:', result);
    return result.token;
}

 

export default async function Home() {
  return (
    <Suspense fallback={<p>...Loading</p>}>
      <div className="videoloader">
        <div className='videoconainer'>
          <HomeComponent datatoken={await setMainToken()} />
      </div>
    </div>
  </Suspense> 
  );
}
 