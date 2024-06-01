"use client";
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {  isUserToken } from "@/config/userauth";
import { isBearerToken, setBearerToken } from '@/config/bearerauth';

export default  function HeaderProfile() {
const Router = useRouter();
const userToken   =  isUserToken();
const bearerToken = isBearerToken();
useEffect(() => {
  if(!userToken) { push("/login"); return  }
  if(!bearerToken) { setBearerToken('in'); return  }
}, []);

const backbuttonHandal = () => {
  Router.back();
}

  return (
    <>
      <header className='headersection headerProfiles'>
        <aside className="backarrow">
          <Image src="/assets/images/back-arrow.png" width={65} height={24} alt="back" quality={99} onClick={backbuttonHandal} title='Back' />
        </aside>
        <aside className='scanqrnow'>
            <Image src="/assets/images/QR.png" width={42} height={42} alt="scanqrcode" quality={99} onClick={() => Router.push('/scanqrcode')} title='Scan QR Code' />
        </aside>
      </header>
    </>
  )
}
