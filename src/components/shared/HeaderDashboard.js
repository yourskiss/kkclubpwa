"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isUserToken, isBearerToken } from '@/config/userauth';
import { getUserMobile } from '@/config/userauth';
import { _get } from "@/config/apiClient";
 
export default  function HeaderDashboard() {
  const [mounted, setMounted] = useState(true);
  const[usershort, setUsershort] = useState('');
  const[userstatus, setUserstatus] = useState('');
  const[username, setUsername] = useState('');
  const { push } = useRouter();
  const userToken  =  isUserToken();
  const bearerToken = isBearerToken();
  const userMobile = getUserMobile();

useEffect(() => {
  if(!userToken) { push("/login"); return  }
  if(!bearerToken) { push("/"); return  }
}, []);


useEffect(() => {
    _get("Customer/UserInfo?userid=0&phonenumber="+ userMobile)
    .then((res) => {
     // console.log("response - ", res);
      if (mounted)
      {
        localStorage.setItem("userprofilename",res.data.result.fullname);
        localStorage.setItem("userprofilesn",res.data.result.shortname);
        localStorage.setItem("verificationstatus",res.data.result.verificationstatus);
        setUsershort(res.data.result.shortname);
        setUserstatus(res.data.result.verificationstatus);
        setUsername(res.data.result.fullname);
      }
    }).catch((error) => {
        toast.info("UserInfo-",error); 
    });
   
  return () => { setMounted(false); }
}, []);


 
 

  return (
    <>
      <header className="headersection headerDashboard">
        <aside className="logo">
          <Image onClick={() => push("/dashboard") } src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={99} />
        </aside>
        <section>
            <Link href="/scanqrcode" className='header_scanqrcode'><Image src="/assets/images/QR.png" width={100} height={100} alt={username} quality={90} /></Link>
           
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
