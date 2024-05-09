"use client";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import HeaderProfile from "../shared/HeaderProfile";
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import ProgressComponent from "../shared/ProgressComponent";
import { getUserID } from '@/config/userauth';
import { _get } from "@/config/apiClient";
import { motion } from "framer-motion";

export default function ProfileComponent() {
  const { push } = useRouter();
  const rewardspoints = parseInt(TotalrewardpointsComponent());
  const[username, setUsername] = useState('');
  const[usershort, setUsershort] = useState('');
  const[userstatus, setUserstatus] = useState('');
  const profileProgress = ProgressComponent();
  const redeemminimumpoint = process.env.NEXT_PUBLIC_REDEEM_MIN_POINT;
  const userid = getUserID();
  const [resultcode, setResultcode] = useState('');
 
  useEffect(() => {
    if (typeof localStorage !== 'undefined') 
    {
        setUsername(localStorage.getItem('userprofilename'));
        setUsershort(localStorage.getItem('userprofilesn'));
        setUserstatus(localStorage.getItem('verificationstatus'));
    } 

  }, []);

  

  const redeemprompt = () => {
    if(userstatus === "PENDING")
    {
      push("/approval");
      return 
    }
    if(userstatus === "APPROVE" && rewardspoints <= redeemminimumpoint)
    {
      toast.info(`You can redeem minimum ${redeemminimumpoint} reward points.`);
      return 
    }
    push("/redeempoints");
  }

  const logoutnow = () => {
    localStorage.removeItem("userprofilesn");
    localStorage.removeItem("userprofilename");
    localStorage.removeItem('verificationstatus')
    Cookies.remove('couponecodecookies');
    Cookies.remove('usertoken');
    push("/") ;
    toast.success('Logout Successfully.'); 
}



useEffect(() => {
  _get("/Payment/GetUserPayoutInfo?userid="+userid)
  .then((res) => {
     // console.log(" response - ", res);
      setResultcode(res.data.resultcode);
  }).catch((error) => {
      toast.info(error); 
  });
}, [resultcode]);

  return (<>
  <motion.div initial={{ x: "100vw" }} animate={{  x: 0 }} exit={{ x: "100vw" }} transition={{ duration: 0.8, delay: 0.1, origin: 1, ease: [0, 0.71, 0.2, 1.01] }}>
    <HeaderProfile />
    <div className="screenmain screenprofile"> 
        <div className="screencontainer">
           
 
            <div className="profile_status">
                <dl>
                  <dt className={ userstatus === "APPROVE" ? "status_approve" : "status_pending" }>
                    <span>{usershort}</span>
                  </dt>
                  <dd>
                    <h2>{username}</h2>
                    <p><b>PROFILE PROGRESS</b> - <CountUp duration={2} start={0}  delay={1}  end={profileProgress} />%</p>
                    <h3><span style={{'width':`${profileProgress}%`}}></span></h3>
                  </dd>
                </dl>
                <aside onClick={()=> push('/update-profile')}>Edit</aside>
            </div>

            <div className="profile_menu">
                <ul>
                  {
                     resultcode === 0 ? <li onClick={()=> push('/bankdetailupdate')}>UPDATE BANK DETAILS</li> : <li onClick={()=> push('/bankdetailsadd?q=0')}>ADD BANK DETAILS</li>
                  }
                  <li onClick={redeemprompt}>
                    REWARD POINTS <em><CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> PTS</em>
                  </li>
                  <li onClick={()=> push('/rewards')}>REWARD HISTORY</li>
                  <li onClick={()=> push('/redemptionhistory')}>REDEMPTION HISTORY</li>
                  <li onClick={logoutnow}>SIGN OUT</li>
                </ul>
            </div>
 


        </div>

        <div className="profile_logobottom">
            <Image src="/assets/images/logo.png" width={448} height={80} alt="logo" quality={100} />
        </div>

    </div>

  </motion.div>
</>)
}