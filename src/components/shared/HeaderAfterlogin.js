"use client";
import Image from 'next/image'
import {  isUserToken } from "@/config/userauth";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default  function HeaderAfterLogin() {
const { push } = useRouter();
const userToken   =  isUserToken();
useEffect(() => {
    // console.log(userToken, "after login");
    if(!userToken) { push("/"); return  }
}, []);

  return (
    <>
      <header className='headersection headerAfterlogin'>
        <aside className="backarrow">
          <Image src="/assets/images/back-arrow.png" width={65} height={24} alt="back" quality={99} onClick={() => push('/dashboard')} title='Back' />
        </aside>
      </header>
    </>
  )
}
