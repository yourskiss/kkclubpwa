"use client";
import Image from 'next/image'
import {  isUserToken } from "@/config/userauth";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default  function HeaderProfile() {
const { push } = useRouter();
const userToken   =  isUserToken();
useEffect(() => {
    // console.log(userToken, " Profile");
    if(!userToken) { push("/"); return  }
}, []);

  return (
    <>
      <header className='headersection headerProfiles'>
        <aside className="backarrow">
          <Image src="/assets/images/back-arrow.png" width={65} height={24} alt="back" quality={99} onClick={() => push('/dashboard')} title='Back' />
        </aside>
        <aside className='scanqrnow'>
            <Image src="/assets/images/QR.png" width={42} height={42} alt="scanqrcode" quality={99} onClick={() => push('/scanqrcode')} title='Scan QR Code' />
        </aside>
      </header>
    </>
  )
}
