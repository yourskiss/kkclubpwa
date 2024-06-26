"use client";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TotalrewardpointsComponent from './TotalrewardpointsComponent';
import { getUserID } from '@/config/userauth';
import Loader from '../shared/LoaderComponent';
import { ipaddress, osname  } from "../core/jio";
import { _get } from "@/config/apiClient";
import { getUserStatus } from "@/config/userinfo";
import TotalRedeemedPoints from '../shared/totalredemption';


export default function Rewardform() {
    const [pagemsg, setPagemsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(true);
    const [pendingorder, setPendingorder] = useState(0);
    const [userOrderID, setUserOrderID] = useState('');
    const[redeempoint, setRedeempoint] = useState(''); 
    const[errorMsg, setErrorMsg] = useState(''); 
    const[userstatus, setUserstatus] = useState('');
    const gtUST = getUserStatus();
    const redeemedpointTotal = parseInt(TotalRedeemedPoints());
    const rewardspoints = parseInt(TotalrewardpointsComponent());
    const pointvalue = parseInt(process.env.NEXT_PUBLIC_POINT_VALUE);
    const redeemminimumpoint = parseInt(process.env.NEXT_PUBLIC_REDEEM_MIN_POINT);
    const redeemmaximumpoint = parseInt(process.env.NEXT_PUBLIC_REDEEM_MAX_POINT);

    const userID = getUserID();
    const { push } = useRouter();
    const ipInfo = ipaddress();
    const osn = osname();
    const exceptThisSymbols = ["e", "E", "+", "-", "."];
    
    useEffect(() => {
        setUserstatus(gtUST);
    }, []);

    useEffect(() => {
        setLoading(true);
        setPagemsg('Checking pendding order');
        _get(`/Payment/UserPendingOrder?userID=${userID}`)
        .then((res) => {
            setLoading(false);
           // console.log("Previous order - ", res.data.result[0].pendingorder,  res);
            if(mounted)
            {
                setPendingorder(res.data.result[0].pendingorder);
            }
        }).catch((error) => {
            setLoading(false);
            console.log(error); 
        });
        return () => { setMounted(false); }
    }, [pendingorder]);


    const pointvalueChange = (e) => {
        setRedeempoint(e.target.value);
        setErrorMsg('');
    }
    const pointvalueSubmit = (e) => {
        e.preventDefault();
        if(userstatus !== 'APPROVE')
        {
            setErrorMsg('Reward points will redeem after profile approval.'); 
            return;
        }
        if(redeempoint === '')
        {
            setErrorMsg('Please enter your reward points'); 
            return;
        }
        if(redeemedpointTotal === 0 && redeempoint < redeemminimumpoint)
        {  
            setErrorMsg(`You can redeem minimum ${redeemminimumpoint} reward points.`); 
            return;
        }
        if(redeempoint > rewardspoints)
        {
            setErrorMsg(`You can redeem maximum ${rewardspoints} reward points.`); 
            return;
        }
        if(redeempoint > redeemmaximumpoint)
        {
            setErrorMsg(`You can redeem maximum ${redeemmaximumpoint} reward points.`); 
            return;
        }
        if(pendingorder > 0)
        {
            setErrorMsg('');
            toast.info('Your Previous order is already in pending.'); 
            push("/redemptionhistory");
            return;
        }
        
        setLoading(true);
        setPagemsg('Payment Initiation');
        _get(`/Payment/UserPayout?userID=${userID}&points=${redeempoint}&amount=${redeempoint * pointvalue}&ipaddress=${ipInfo}&osdetails=${osn}`)
        .then((res) => {
            setLoading(false);
          // console.log("Payout request - ", res);
           if(res.data.status === 0)
            {
                if(res.data.data === null)
                {
                    setErrorMsg(res.data.message); 
                }
                else
                {
                    setErrorMsg(res.data.data.error);
                }
            }
            else
            {
                setErrorMsg('');
                setUserOrderID(res.data.userorderid);
                payoutstatus(res.data.userorderid);
            }
        }).catch((error) => {
            setLoading(false);
            console.log(error); 
        });
        
    }

    const payoutstatus = (val) => {
            if(val !== undefined || val !== null || val !== '')
            {
                _get(`/Payment/UserPayoutStatus?userID=${userID}&orderID=${val}`)
                .then((res) => {   
                   // console.log("Payout Status - ", res.data.isclose, res.data.ispayment, res.data.pgrequeystatus, res); 
                }).catch((error) => {
                    console.log(error); 
                });
            }
    }
 
    useEffect(() => {
        if(userOrderID === '' || userOrderID === ' ' || userOrderID === undefined || userOrderID === null) 
        {
            // nothing
        }
        else 
        {
            setLoading(true);
            setPagemsg('Payment Initiating');
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
                <p>1 POINTS = {pointvalue} INR</p>
                <input type="number" placeholder="ENTER POINTS" min="0" name="redeempoint" value={redeempoint} onChange={pointvalueChange} onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault() }  />
                { errorMsg && <span>{errorMsg}</span> }
                <aside>
                    <button type='submit'>Redeem Points</button>
                </aside>
            </form>
        </div>


         <Loader showStatus={loading} message={pagemsg} />  
  </>)
}
