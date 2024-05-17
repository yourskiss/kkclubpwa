"use client";
import Cookies from 'js-cookie';
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCouponeCode, isCouponeCode } from "@/config/validecoupone";

const apiURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
const apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;

export default function HomeComponent() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const getqrcode = searchParams.get('code');
  const isCC = isCouponeCode();
  const isBearerToken = !!Cookies.get('bearertoken');
  const isUserToken = !!Cookies.get('usertoken');

  useEffect(() => {
    if(getqrcode !== null) { setCouponeCode(getqrcode); }
  }, [getqrcode]);

  useEffect(() => {
    if(isBearerToken && isUserToken && isCC) { push("/getcoupone"); return }
  }, []);



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
            setTimeout(function(){  
              window.location.reload();
            }, 4000);
          }).catch((err) => {
            console.log("authtoken-",err.message); 
            setTimeout(function(){  window.location.reload(); }, 2000);
          });
    }
    else
    {
     isUserToken && !isCC ? push("/dashboard") : isUserToken && isCC ? push("/getcoupone") : push("/login");
    }
  },[]);

  return (<>
    <div className="videoloader">
      <div className='videoconainer'>
        <video autoPlay muted playsInline style={{ width: '308px', height: '58px' }} poster="/assets/images/logo.png">
          <source src="/assets/videos/homevideo-unit.mp4" type="video/mp4" />
        </video>

        {/* <img src="/assets/images/logo.png" alt="Logo"  /> */}
      </div>
    </div>
  </>)
}
