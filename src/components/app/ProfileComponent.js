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

export default function ProfileComponent() {
  const { push } = useRouter();
  const rewardspoints = parseInt(TotalrewardpointsComponent());
  const[username, setUsername] = useState('');
  const[userdp, setUserdp] = useState('');
  const[userstatus, setUserstatus] = useState('');
  const profileProgress = ProgressComponent();
  const redeemminimumpoint = process.env.NEXT_PUBLIC_REDEEM_MIN_POINT;
  const userid = getUserID();
  const [resultcode, setResultcode] = useState('');

  useEffect(() => {
    sessionStorage.getItem('addbankfromredeempoint')
    if (typeof localStorage !== 'undefined') 
    {
        setUsername(localStorage.getItem('userprofilename'));
        setUserdp(localStorage.getItem('userprofilepic'));
        setUserstatus(localStorage.getItem('verificationstatus'));
    } 

    if (typeof sessionStorage !== 'undefined') 
    {
      sessionStorage.removeItem('addbankfromredeempoint');
    }
  }, []);

  

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

  const logoutnow = () => {
    localStorage.removeItem("userprofilepic");
    localStorage.removeItem("userprofilename");
    localStorage.removeItem('verificationstatus')
    Cookies.remove('couponecodecookies');
    Cookies.remove('usertoken');
    push("/") ;
    toast.success('Logout Successfully'); 
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
    <HeaderProfile />
    <div className="screenmain screenprofile"> 
        <div className="screencontainer">
           
 
            <div className="profile_status">
                <dl>
                  <dt className={ userstatus === "APPROVE" ? "status_approve" : "status_pending" }>
                    <Image src={userdp} width={64} height={64} alt="profile" quality={100} />
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
                resultcode
                  {
                     resultcode === 0 ? <li onClick={()=> push('/bankdetailupdate')}>UPDATE BANK DETAILS</li> : <li onClick={()=> push('/bankdetailsadd')}>ADD BANK DETAILS</li>
                  }
                  <li onClick={redeemprompt}>
                     REDEEM POINTS <em><CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> PTS</em>
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

    
</>)
}