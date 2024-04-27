"use client";
import Image from 'next/image';
import {  isUserToken } from "@/config/userauth";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default  function HeaderBeforeLogin() {
  const { push } = useRouter();
  const  userToken   =  isUserToken();

  useEffect(() => {
    // console.log(userToken, "before login")
    if(userToken) { push("/dashboard"); return }
  }, [userToken]);
  
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
