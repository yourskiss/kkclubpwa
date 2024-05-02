"use client";
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {  isUserToken, isBearerToken } from "@/config/userauth";

export default  function HeaderAfterLogin({backrouter}) {
const { push } = useRouter();
const userToken   =  isUserToken();
const bearerToken = isBearerToken();
useEffect(() => {
    if(!userToken) { push("/login"); return  }
    if(!bearerToken) { push("/"); return  }
}, []);

  return (
    <>
      <header className='headersection headerAfterlogin'>
        <aside className="backarrow">
          <Image src="/assets/images/back-arrow.png" width={65} height={24} alt="back" quality={99} onClick={() => push(backrouter)} title='Back' />
        </aside>
      </header>
    </>
  )
}
