"use server";
 import { Suspense } from 'react';
 import HomeComponent from '@/components/app/HomeComponent';
 const apiURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
const apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
 

 
export default async function Home() {



async function setMainToken() {
    const response = await fetch(apiURL+"ApiAuth/authtoken", {
      method: 'POST',
      body: JSON.stringify({ "userid": apiUsername, "password": apiPassword }), 
       headers: {'Content-Type': 'application/json'},
    });
    const data = await response.json();
    // console.log(data.token);
    return data.token;
}



  return (
    <Suspense fallback={<p>.</p>}>
      <HomeComponent btkn={setMainToken()} />
  </Suspense> 
  );
}
 