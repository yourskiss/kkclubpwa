"use client";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import { getUserID } from '@/config/userauth';
import Loader from '../shared/LoaderComponent';
import { ipaddress, osname  } from "../core/jio";
import { _get } from "@/config/apiClient";

export default function Rewardform() {
    const [loading, setLoading] = useState(false);
    const [userOrderID, setUserOrderID] = useState('');
    const[userstatus, setUserstatus] = useState('');
    const[redeempoint, setRedeempoint] = useState('');
    const[isclose, setIsclose] = useState('');
    const[ispayment, setIspayment] = useState('');
    const[pgrequeystatus, setPgrequeystatus] = useState('');
    const rewardspoints = parseInt(TotalrewardpointsComponent());
    const pointvalue = process.env.NEXT_PUBLIC_POINT_VALUE;
    const redeemminimumpoint = process.env.NEXT_PUBLIC_REDEEM_MIN_POINT;

    const userid = getUserID();
    const { push } = useRouter();
    const ipInfo = ipaddress();
    const osn = osname();
    
    useEffect(() => {
        if (typeof localStorage !== 'undefined') 
        {
            setUserstatus(localStorage.getItem('verificationstatus'));
        } 
    }, [userstatus]);


    const pointvalueChange = (e) => {
        setRedeempoint(e.target.value.trim());
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

        setLoading(true);
        _get(`/Payment/UserPayout?userID=${userid}&points=${redeempoint}&amount=${redeempoint * pointvalue}&ipaddress=${ipInfo}&osdetails=${osn}`)
        .then((res) => {
            setLoading(false);
           console.log("UserPayout - ", res);
           setUserOrderID(res.data.userorderid);
          // if(userOrderID !== '') { payoutstatus(); }
        }).catch((error) => {
            setLoading(false);
            toast.info(error); 
        });
        
    }

    const payoutstatus = () => {
        _get(`/Payment/UserPayoutStatus?userID=${userid}&orderID=${userOrderID}`)
        .then((res) => {   
           console.log("Payout Status - ", res.data.isclose, res.data.ispayment, res.data.pgrequeystatus, res); 
           setIsclose(res.data.isclose);
           setIspayment(res.data.ispayment);
           setPgrequeystatus(res.data.pgrequeystatus);
        }).catch((error) => {
            toast.info(error); 
        });
    }
 
    useEffect(() => {
        if(userOrderID !== '') 
        {
            setLoading(true);
            const interval = setInterval(() => {
                payoutstatus();
            }, 5000);  
        
            setTimeout(() => {
                setLoading(false);
                clearInterval(interval);
            }, 30000);
        
            return () => {
                clearInterval(interval); 
            };
        }
    }, [userOrderID]);

  return (<>
        <div className='redeemforms'>
                <p>1 PT = {pointvalue} INR</p>
                <input type="number" placeholder="ENTER POINTS" name="redeempoint" value={redeempoint} onChange={pointvalueChange} />
                <aside>
                    <button type='submit' onClick={pointvalueSubmit}>Redeem Points</button>
                </aside>
        </div>


        { loading ? <Loader message="Payment Initiation" /> : null }
  </>)
}
