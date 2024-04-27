"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {  isUserToken, isBearerToken } from "@/config/userauth";

export default  function HeaderBeforeLogin() {
  const { push } = useRouter();
  const  userToken   =  isUserToken();
  const bearerToken = isBearerToken();
  useEffect(() => {
    if(userToken) { push("/dashboard"); return }
    if(!bearerToken) { push("/"); return  }
  }, []);
  
  return (
    <>
      <header className='headersection headerBeforelogin'>
        <aside className="logo">
          <Image src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={99} />
        </aside>
      </header>
    </>
  )
}
