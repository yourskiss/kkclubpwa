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

export default function ProfileComponent() {
  const { push } = useRouter();
  const rewardspoints = TotalrewardpointsComponent();
  const[username, setUsername] = useState('');
  const[userdp, setUserdp] = useState('');
  const[userstatus, setUserstatus] = useState('');
  const profileProgress = ProgressComponent();

  useEffect(() => {
    if (typeof localStorage !== 'undefined') 
    {
        setUsername(localStorage.getItem('userprofilename'));
        setUserdp(localStorage.getItem('userprofilepic'));
        setUserstatus(localStorage.getItem('verificationstatus'));
    } 
  }, []);

  const redeemprompt = () => {
    if(userstatus === "PENDING")
    {
      toast.success('Points will redeem after profile approval.'); 
    }
    else if(userstatus === "APPROVE" && rewardspoints < 150)
    {
      toast.success('You can redeem Min. 150 Points.'); 
    }
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
                  <li onClick={rewardspoints >= 150 &&  userstatus === "APPROVE" ? ()=> push("/redeempoints") : redeemprompt}>
                     REDEEM POINTS <em><CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> PTS</em>
                     </li>
                  <li onClick={()=> push('/rewards')}>REWARD HISTORY</li>
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