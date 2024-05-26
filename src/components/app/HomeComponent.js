"use client";
// import Image from 'next/image';
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCouponeCode, isCouponeCode } from "@/config/validecoupone";
import { setBearerToken, isBearerToken, getBearerToken, removeBearerToken } from '@/config/bearerauth';
import { isUserToken } from '@/config/userauth';

  const apiURL = process.env.NEXT_PUBLIC_BASE_URL;
  const apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
  const apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
 

export default function HomeComponent() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const getqrcode = searchParams.get('code');
  const isCC = isCouponeCode();
  const isBT = isBearerToken();
  const isUT = isUserToken();
  const getBT = getBearerToken();


 
  useEffect(() => {
    if(getqrcode !== null) { setCouponeCode(getqrcode); }
  }, [getqrcode]);

  useEffect(() => {
    if(isBT && isUT && isCC) { push("/getcoupone"); return }
  }, []);


  useEffect(() => {
    if(!isBT)
    {
      axios({
        method: 'post',
        url: `${apiURL}ApiAuth/authtoken`,
        data: JSON.stringify({ "userid": apiUsername, "password": apiPassword }), 
        headers: {'Content-Type': 'application/json'},
      })
      .then(function (response) {
          setBearerToken(response.data.token);
          setTimeout(function() {  window.location.reload(); }, 3000);
      })
      .catch(function(error){
          console.log(error);
      })
    }
    else
    {
      isUT && !isCC ? push("/dashboard") : isUT && isCC ? push("/getcoupone") : push("/login");
    }
  },[]);

 
  return (<>
    {/* {isBT && <Image src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={99} />} */}
    <video autoPlay muted playsInline style={{ width: '308px', height: '58px' }} poster="/assets/images/logo.png">
      <source src="/assets/videos/homevideo-unit.mp4" type="video/mp4"></source>
    </video>
  </>);

 
}
 