"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
// import ProgressComponent from "../shared/ProgressComponent";
import { getUserID, removeUserToken } from '@/config/userauth';
import { _get } from "@/config/apiClient";
import { motion } from "framer-motion";
import FooterComponent from "../shared/FooterComponent";
import { getUserStatus, getUserName, getUserShort, removeUserInfo } from "@/config/userinfo";
import {  isUserToken } from "@/config/userauth";
 

export default function ProfileComponent() {
  const [mounted, setMounted] = useState(true);
  const rewardspoints = parseInt(TotalrewardpointsComponent());
  // const profileProgress = ProgressComponent();
  const redeemminimumpoint = parseInt(process.env.NEXT_PUBLIC_REDEEM_MIN_POINT);
  const userid = getUserID();
  const [resultcode, setResultcode] = useState('');
  const userstatus = getUserStatus();
  const usershort = getUserShort();
  const username = getUserName();
  const Router = useRouter();
  const userToken   =  isUserToken();
 
  useEffect(() => {
    if(!userToken) { Router.push("/login"); return  }
  }, []);


  const redeemprompt = () => {
    if(userstatus === "PENDING")
    {
      Router.push("/approval");
      return 
    }
    if(userstatus === "APPROVE" && rewardspoints < redeemminimumpoint)
    {
      toast.info(`You can redeem minimum ${redeemminimumpoint} reward points.`);
      return 
    }
    Router.push("/redeempoints");
  }

  const logoutnow = () => {
    removeUserInfo();
    removeUserToken();
    Router.push("/login") ;
    toast.success('Logout Successfully.'); 
}



useEffect(() => {
  _get("/Payment/GetUserPayoutInfo?userid="+userid)
  .then((res) => {
     // console.log(" response - ", res);
      if(mounted)
      {
        setResultcode(res.data.resultcode);
      }
  }).catch((error) => {
      console.log("GetUserPayoutInfo-",error); 
  });
  return () => { setMounted(false); }
}, [resultcode]);


const backbuttonHandal = () => {
  Router.back();
}


  return (<>
  <motion.div initial={{ x: "100vw" }} animate={{ x:0 }}  transition={{ duration: 1, delay: 0, origin: 1, ease: [0, 0.71, 0.2, 1.01] }}>
 

      <header className='headersection headerProfiles'>
        <aside className="backarrow">
          <Image src="/assets/images/back-arrow.png" width={65} height={24} alt="back" quality={99} onClick={backbuttonHandal} title='Back' />
        </aside>
        <aside className='scanqrnow'>
            <Image src="/assets/images/QR.png" width={42} height={42} alt="scanqrcode" quality={99} onClick={() => Router.push('/scanqrcode')} title='Scan QR Code' />
        </aside>
      </header>

    
    <div className="screenmain screenprofile"> 
        <div className="screencontainer">
           
 
            <div className="profile_status">
                <dl>
                  <dt className={ userstatus === "APPROVE" ? "status_approve" : "status_pending" }>
                    <span>{usershort}</span>
                  </dt>
                  <dd>
                    <h2>{username}</h2>
                    <p><b>Status:</b> <span>{userstatus}</span></p>
                    {/* <p><b>PROFILE PROGRESS</b> - <CountUp duration={2} start={0}  delay={1}  end={profileProgress} />%</p> */}
                    {/* <h3><span style={{'width':`${profileProgress}%`}}></span></h3> */}
                  </dd>
                </dl>
                <aside onClick={()=> Router.push('/update-profile')}>Edit</aside>
            </div>

            <div className="profile_menu">
                <ul>
                  {
                     resultcode === 0 ? <li onClick={()=> Router.push('/bankdetailupdate')}>UPDATE BANK DETAILS</li> : <li onClick={()=> Router.push('/bankdetailsadd?q=0')}>ADD BANK DETAILS</li>
                  }
                  <li onClick={redeemprompt}>
                    REWARD POINTS <em><CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> Points</em>
                  </li>
                  <li onClick={()=> Router.push('/rewards')}>REWARD HISTORY</li>
                  <li onClick={()=> Router.push('/redemptionhistory')}>REDEMPTION HISTORY</li>
                  <li onClick={logoutnow}>SIGN OUT</li>
                </ul>
            </div>
 


        </div>

        <div className="profile_logobottom">
            <Image src="/assets/images/logo.png" width={448} height={80} alt="logo" quality={100} />
        </div>

    </div>


    <FooterComponent />

  </motion.div>
</>)
}