"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import HeaderAfterLogin from "../shared/HeaderAfterlogin";

export default function RedeempointsComponents() {
    const { push } = useRouter();
    const rewardspoints = TotalrewardpointsComponent();
    const pointvalue = process.env.NEXT_PUBLIC_POINT_VALUE;
    const[userstatus, setUserstatus] = useState('');
    const[redeempoint, setRedeempoint] = useState('');
    const[redeemerror, setRedeemerror] = useState('');

    useEffect(() => {
        if (typeof localStorage !== 'undefined') 
        {
            setUserstatus(localStorage.getItem('verificationstatus'));
        } 
    }, []);

    useEffect(() => {
      if(rewardspoints <= 150 && userstatus !== "APPROVE")
      {
        push('/dashboard');
      }
    }, [userstatus]);

    const pointvalueChange = (e) => {
        setRedeempoint(e.target.value);
    }
    const pointvalueSubmit = (e) => {
        e.preventDefault();
        if(redeempoint < 150)
        {
            setRedeemerror('You can redeem min. 150 point');
            return;
        }
        else
        {
            setRedeemerror('');
            toast.success('Thank you'); 
        }
    }

  return (<>
    <HeaderAfterLogin />
    <div className="screenmain redeemscreen"> 
        <div className="screencontainer">

            <div className='redeemcontainer'>
                <Image className='rdm_1' src="/assets/images/v3.png" width={95} height={95} alt="redeem img" quality={99} />
                <Image className='rdm_2' src="/assets/images/v3.png" width={95} height={95} alt="redeem img" quality={99} />
                <Image className='rdm_3' src="/assets/images/V2.png" width={95} height={95} alt="redeem img" quality={99} />
                <Image className='rdm_4' src="/assets/images/V2.png" width={95} height={95} alt="redeem img" quality={99} />

                <aside>
                    <Image src="/assets/images/redeem.png" width={459} height={448} alt="redeem img" quality={99} />
                </aside>
                <h2>Redeem your points</h2>
                <h3><CountUp duration={2} start={0}  delay={1} end={rewardspoints} /> <b>pts</b> </h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,<br /> sed do eiusmod tempor incididunt</p>
            </div>
            
            <div className='redeemforms'>
                <p>1 PT = {pointvalue} INR</p>
                <input type='number' placeholder='ENTER POINTS' name="redeempoint" value={redeempoint} onChange={pointvalueChange} />
                { redeemerror && <span>{redeemerror}</span> } 
                <aside>
                    <button type='submit' onClick={pointvalueSubmit}>Redeem Points</button>
                </aside>
            </div>



        </div>

        

        <div className="profile_logobottom">
            <Image src="/assets/images/logo.png" width={448} height={80} alt="logo" quality={100} />
        </div>

    </div>
</>)
}
