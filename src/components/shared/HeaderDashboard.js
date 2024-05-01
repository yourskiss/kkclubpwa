"use client";
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { isUserToken, isBearerToken } from '@/config/userauth';
import TotalrewardpointsComponent from './TotalrewardpointsComponent';

export default  function HeaderDashboard() {

  const [logout, setLogout] = useState(false);
  const[username, setUsername] = useState('');
  const[userdp, setUserdp] = useState('');
  const[userstatus, setUserstatus] = useState('');

  const { push } = useRouter();
  const userToken  =  isUserToken();
  const bearerToken = isBearerToken();

  const rewardspoints = parseInt(TotalrewardpointsComponent());
  const redeemminimumpoint = process.env.NEXT_PUBLIC_REDEEM_MIN_POINT;

useEffect(() => {
  if(!userToken) { push("/login"); return  }
  if(!bearerToken) { push("/"); return  }
}, []);

useEffect(() => {
  if (typeof localStorage !== 'undefined') 
  {
      setUsername(localStorage.getItem('userprofilename'));
      setUserdp(localStorage.getItem('userprofilepic'));
      setUserstatus(localStorage.getItem('verificationstatus'));
  } 
}, []);


  function showhidelogout()
  {
    logout == false ? setLogout(true) : setLogout(false);
  }

  const logoutnow = () => {
      localStorage.removeItem("userprofilepic");
      localStorage.removeItem("userprofilename");
      localStorage.removeItem('verificationstatus')
      Cookies.remove('couponecodecookies');
      Cookies.remove('usertoken');
      push("/") ;
      toast.success('Logout Successfully'); 
  }

  const redeemprompt = () => {
    if(userstatus === "PENDING")
    {
      toast.info('Reward points will redeem after profile approval.'); 
      return
    }
    if(userstatus === "APPROVE" && rewardspoints <= redeemminimumpoint)
    {
      toast.info(`You can redeem min. ${redeemminimumpoint} reward points.`);
      return 
    }
    push("/redeempoints");
  }

  return (
    <>
      <header className="headersection headerDashboard">
        <aside className="logo">
          <Image src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={99} />
        </aside>
        <section>
            <Link href="/scanqrcode" className='header_scanqrcode'><Image src="/assets/images/QR.png" width={100} height={100} alt="qr" quality={90} /></Link>
            <span className='header_notification'>
              <Image src="/assets/images/notification.png" width={100} height={100} alt="notification" quality={90} />
              <span></span>
            </span>
            <aside className={ userstatus === "APPROVE" ? "header_userdp status_approve" : "header_userdp status_pending" }>
              <img src={userdp}  alt="profile" title={userstatus} onClick={showhidelogout} />
            </aside>
            { logout === true ?
              <ul className='header_menu'>
                  <li><Link href='/dashboard'>Welcome <b>{username}</b></Link></li>
                  <li><Link href='/profile'>PROFILE</Link></li>
                  <li><span onClick={redeemprompt}>REDEEM POINTS</span></li>
                  <li><Link href='/rewards'>REWARDS HISTORY</Link></li>
                  <li><Link href='/redemptionhistory'>REDEEMPTION HISTORY</Link></li>
                  <li><span onClick={logoutnow}>Logout</span></li>
              </ul>
              : null }
        </section>
      </header>
 

    </>

  )
}
