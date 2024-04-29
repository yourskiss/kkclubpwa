"use client";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import { getUserID } from '@/config/userauth';
import Loader from '../shared/LoaderComponent';

export default function Rewardform() {
    const[userstatus, setUserstatus] = useState('');
    const[redeempoint, setRedeempoint] = useState('');
    const rewardspoints = parseInt(TotalrewardpointsComponent());
    const pointvalue = process.env.NEXT_PUBLIC_POINT_VALUE;
    const redeemminimumpoint = process.env.NEXT_PUBLIC_REDEEM_MIN_POINT;

    const [loading, setLoading] = useState(false);
    const userid = getUserID();
    const { push } = useRouter();

    useEffect(() => {
        if (typeof localStorage !== 'undefined') 
        {
            setUserstatus(localStorage.getItem('verificationstatus'));
        } 
    }, [userstatus]);


    const pointvalueChange = (e) => {
        setRedeempoint(e.target.value);
    }
    const pointvalueSubmit = (e) => {
        e.preventDefault();
        if(userstatus !== 'APPROVE')
        {
            toast.info('Reward points will redeem after profile approval.'); 
            return;
        }
        if(redeempoint === '')
        {
            toast.info('Please enter your reward points.'); 
            return;
        }
        if(redeempoint > rewardspoints)
        {
            toast.info('You can redeem max. your reward points.'); 
            return;
        }
        if(redeempoint < redeemminimumpoint)
        {
            toast.info(`You can redeem min. ${redeemminimumpoint} reward points.`); 
            return;
        }

    toast.success('Thank you'); 
    setLoading(true);
    }

  return (<>
        <div className='redeemforms'>
                <p>1 PT = {pointvalue} INR</p>
                <input type='number' placeholder='ENTER POINTS' name="redeempoint" value={redeempoint} onChange={pointvalueChange} />
                <aside>
                    <button type='submit' onClick={pointvalueSubmit}>Redeem Points</button>
                </aside>
        </div>


        { loading ? <Loader message="Request submitting" /> : null }
  </>)
}
