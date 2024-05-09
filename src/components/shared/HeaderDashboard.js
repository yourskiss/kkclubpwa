"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isUserToken, isBearerToken } from '@/config/userauth';

export default  function HeaderDashboard() {
  const[usershort, setUsershort] = useState('');
  const[userstatus, setUserstatus] = useState('');

  const { push } = useRouter();
  const userToken  =  isUserToken();
  const bearerToken = isBearerToken();

useEffect(() => {
  if(!userToken) { push("/login"); return  }
  if(!bearerToken) { push("/"); return  }
}, []);

useEffect(() => {
  if (typeof localStorage !== 'undefined') 
  {
      // setUsername(localStorage.getItem('userprofilename'));
      setUsershort(localStorage.getItem('userprofilesn'));
      setUserstatus(localStorage.getItem('verificationstatus'));
  } 
}, []);

 

  return (
    <>
      <header className="headersection headerDashboard">
        <aside className="logo">
          <Image src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={99} />
        </aside>
        <section>
            <Link href="/scanqrcode" className='header_scanqrcode'><Image src="/assets/images/QR.png" width={100} height={100} alt="qr" quality={90} /></Link>
            {/*             
            <span className='header_notification'>
              <Image src="/assets/images/notification.png" width={100} height={100} alt="notification" quality={90} />
              <span></span>
            </span> 
            */}
            <aside className={ userstatus === "APPROVE" ? "header_userdp status_approve" : "header_userdp status_pending" } >
              <span onClick={() => push("/profile") }>{usershort}</span>
            </aside>
        </section>
      </header>
 

    </>

  )
}
