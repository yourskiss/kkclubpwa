"use client";
import Cookies from 'js-cookie';
import axios from 'axios';
import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Homevideo from '../core/Homevideo';
 
 

const apiURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
const apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;

export default function HomeComponent() {
  const { push } = useRouter();
  const isBearerToken = !!Cookies.get('bearertoken');
  const isUserToken = !!Cookies.get('usertoken');
  useEffect(() => {
    if(!isBearerToken)
    {
          axios({
            url: apiURL +"ApiAuth/authtoken",
            method: "POST",
            headers: {  "Content-Type": "application/json" },
            data: JSON.stringify({ "userid": apiUsername, "password": apiPassword }),
          }).then((res) => {
            // console.log("Bearer Token - ", res);
            Cookies.set('bearertoken',  res.data.token, { expires: new Date(new Date().getTime() + 3600000), secure: true });
            setTimeout(function(){  window.location.reload(); }, 3000);
          }).catch((err) => {
            console.log("authtoken-",err.message); 
            setTimeout(function(){  window.location.reload(); }, 3000);
          });
    }
    else
    {
      isUserToken ? push("/dashboard") : push("/login");
    }
  },[]);

  return (<>
   <Suspense fallback={<p>...Loading</p>}>
    <Homevideo />
  </Suspense>
  </>)
}
