"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {isUserToken, getUserMobile, getUserID } from '@/config/userauth';
import { isBearerToken, setBearerToken } from '@/config/bearerauth';
import { _get } from "@/config/apiClient";
import { setUserInfo } from '@/config/userinfo';
 
export default  function HeaderDashboard() {
  const [mounted, setMounted] = useState(true);
  const [mounted2, setMounted2] = useState(true);
  const[usershort, setUsershort] = useState('');
  const[userstatus, setUserstatus] = useState('');
  const[username, setUsername] = useState('');
  const[notificationCount, setNotificationCount] = useState(0);
  const { push } = useRouter();
  const userToken  =  isUserToken();
  const bearerToken = isBearerToken();
  const userMobile = getUserMobile();
  const userID = getUserID();

useEffect(() => {
  if(!userToken) { push("/login"); return  }
  if(!bearerToken) { setBearerToken('in'); return  }

}, []);


useEffect(() => {
    _get("Customer/UserInfo?userid=0&phonenumber="+ userMobile)
    .then((res) => {
     // console.log("UserInfo response - ", res);
      if (mounted)
      {
        setUserInfo(res.data.result.fullname, res.data.result.shortname, res.data.result.verificationstatus);
        setUsershort(res.data.result.shortname);
        setUserstatus(res.data.result.verificationstatus);
        setUsername(res.data.result.fullname);
      }
    }).catch((error) => {
        console.log("UserInfo-",error); 
    });
   
  return () => { setMounted(false); }
}, []);



useEffect(() => {
  _get("Customer/GetTotalOfUserNotification?userid="+ userID)
  .then((res) => {
   // console.log("GetTotalOfUserNotification  response - ", res);
    if (mounted2)
    {
      setNotificationCount(res.data.result[0].totalnotification);
    }
  }).catch((error) => {
      console.log("GetTotalOfUserNotification-",error); 
  });
 
return () => { setMounted2(false); }
}, [notificationCount]);


 

  return (
    <>
      <header className="headersection headerDashboard">
        <aside className="logo">
          <Image onClick={() => push("/dashboard") } src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={99} />
        </aside>
        <section>
            <Link href="/scanqrcode" className='header_scanqrcode'><Image src="/assets/images/QR.png" width={100} height={100} alt={username} quality={90} /></Link>
           
        
            <span className='header_notification' onClick={()=> push('/notifications') }>
              <Image src="/assets/images/notification.png" width={100} height={100} alt="notification" quality={90} />
              { parseInt(notificationCount) > 0 ? <span>{notificationCount}</span> : null} 
            </span> 
          
            
            <aside className={ userstatus === "APPROVE" ? "header_userdp status_approve" : "header_userdp status_pending" } >
              <span onClick={() => push("/profile") }>{usershort}</span>
            </aside>
        </section>
      </header>
    </>
  )
}
