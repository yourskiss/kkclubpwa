"use client";
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCouponeCode, isCouponeCode } from "@/config/validecoupone";

export default function HomeComponent({datatoken}) {
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
      Cookies.set('bearertoken',  datatoken, { expires: new Date(new Date().getTime() + 3600000), secure: true });
      setTimeout(function(){  
        window.location.reload();
      }, 3000);
    }
    else
    {
     isUserToken && !isCC ? push("/dashboard") : isUserToken && isCC ? push("/getcoupone") : push("/login");
    }
  },[]);

  return (<>
        <video autoPlay muted playsInline style={{ width: '308px', height: '58px' }} poster="/assets/images/logo.png">
          <source src="/assets/videos/homevideo-unit.mp4" type="video/mp4" />
        </video>
  </>)
}
