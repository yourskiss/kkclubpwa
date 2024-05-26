"use client";
// import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCouponeCode, isCouponeCode } from "@/config/validecoupone";
import { setBearerToken, isBearerToken } from '@/config/bearerauth';
import { isUserToken } from '@/config/userauth';

export default function HomeComponent({datatoken}) {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const getqrcode = searchParams.get('code');
  const isCC = isCouponeCode();
  const isBT = isBearerToken();
  const isUT = isUserToken();

 
  useEffect(() => {
    if(getqrcode !== null) { setCouponeCode(getqrcode); }
  }, [getqrcode]);

  useEffect(() => {
    if(isBT && isUT && isCC) { push("/getcoupone"); return }
  }, []);


  useEffect(() => {
    // console.log(isBT, !!Cookies.get('bearertoken'), Cookies.get('bearertoken'));
    if(!isBT)
    {
      setBearerToken(datatoken);
      setTimeout(function() {  
        window.location.reload();
      }, 3000);
    }
    else
    {
      isUT && !isCC ? push("/dashboard") : isUT && isCC ? push("/getcoupone") : push("/login");
    }
  },[]);

 
  return (<>
    {/* {isBT && <Image src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={99} />} */}
    <video autoPlay muted playsInline style={{ width: '308px', height: '58px' }} poster="/assets/images/logo.png">
      <source src="/assets/videos/homevideo-unit.mp4" type="video/mp4" />
    </video>
  </>);

 
}
