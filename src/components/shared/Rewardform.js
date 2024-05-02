"use client";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TotalrewardpointsComponent from './TotalrewardpointsComponent';
import { getUserID } from '@/config/userauth';
import Loader from '../shared/LoaderComponent';
import { ipaddress, osname  } from "../core/jio";
import { _get } from "@/config/apiClient";

export default function Rewardform() {
    const [loading, setLoading] = useState(false);
    const [pendingorder, setPendingorder] = useState(0);
    const [userOrderID, setUserOrderID] = useState('');
    const[userstatus, setUserstatus] = useState('');
    const[redeempoint, setRedeempoint] = useState(''); 
    const[isclose, setIsclose] = useState(''); 
    const[ispayment, setIspayment] = useState('');
    const[pgrequeystatus, setPgrequeystatus] = useState('');
    const rewardspoints = parseInt(TotalrewardpointsComponent());
    const pointvalue = process.env.NEXT_PUBLIC_POINT_VALUE;
    const redeemminimumpoint = process.env.NEXT_PUBLIC_REDEEM_MIN_POINT;

    const userID = getUserID();
    const { push } = useRouter();
    const ipInfo = ipaddress();
    const osn = osname();
    
    useEffect(() => {
        if (typeof localStorage !== 'undefined') 
        {
            setUserstatus(localStorage.getItem('verificationstatus'));
        } 
    }, [userstatus]);

    useEffect(() => {
        _get(`/Payment/UserPendingOrder?userID=${userID}`)
        .then((res) => {
          console.log("Previous order - ", res.data.result[0].pendingorder,  res);
          setPendingorder(res.data.result[0].pendingorder);
        }).catch((error) => {
            toast.info(error); 
        });
    }, [pendingorder]);


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
        if(pendingorder > 0)
        {
            toast.info('Your Previous order is already in pending.'); 
            push("/redemptionhistory");
            return;
        }

        setLoading(true);
        _get(`/Payment/UserPayout?userID=${userID}&points=${redeempoint}&amount=${redeempoint * pointvalue}&ipaddress=${ipInfo}&osdetails=${osn}`)
        .then((res) => {
            setLoading(false);
           console.log("Payout request - ", res.data.userorderid, res);
            setUserOrderID(res.data.userorderid);
            payoutstatus(res.data.userorderid);
        }).catch((error) => {
            setLoading(false);
            toast.info(error); 
        });
        
    }

    const payoutstatus = (val) => {
            _get(`/Payment/UserPayoutStatus?userID=${userID}&orderID=${val}`)
            .then((res) => {   
            console.log("function Status - ", res.data.isclose, res.data.ispayment, res.data.pgrequeystatus, res); 
            setIsclose(res.data.isclose);
            setIspayment(res.data.ispayment);
            setPgrequeystatus(res.data.pgrequeystatus);
            }).catch((error) => {
                toast.info(error); 
            });
    }
 
    useEffect(() => {
        if(userOrderID === '' || userOrderID === ' ' || userOrderID === undefined || userOrderID === null) 
        {
            // nothing
        }
        else 
        {
            setLoading(true);
            const interval = setInterval(() => {
                payoutstatus(userOrderID);
            }, 5000);  
        
            setTimeout(() => {
                setLoading(false);
                clearInterval(interval);
                toast.success("Payment Initiated"); 
                push("/redemptionhistory");    
            }, 30000);
        
            return () => {
                setLoading(false);
                clearInterval(interval); 
            };
        }
    }, [userOrderID]);

 

  return (<>
        <div className='redeemforms'>
            <form onSubmit={pointvalueSubmit}>
                <p>1 PT = {pointvalue} INR</p>
                <input type="number" placeholder="ENTER POINTS" name="redeempoint" value={redeempoint} onChange={pointvalueChange} />
                <aside>
                    <button type='submit'>Redeem Points</button>
                </aside>
            </form>
        </div>


        { loading ? <Loader message="Payment Initiation" /> : null }
  </>)
}
