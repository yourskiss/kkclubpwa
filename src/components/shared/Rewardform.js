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
    const[pointsEligible, setPointsEligible] = useState('');
    const[isEligible, setIsEligible] = useState('');

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

    const onInputmaxLength = (e) => {
        if(e.target.value.length > e.target.maxLength)
        {
          e.target.value = e.target.value.replace(/[e\+\-\.]/gi, "").slice(0, e.target.maxLength);
        }
        else
        {
          e.target.value = e.target.value.replace(/[e\+\-\.]/gi, "")
        }
      }

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


    const checkEligibility = (valuespoint) => {
        _get(`/Customer/CheckUserRedemptionEligibility?userid=${userID}&pointstoredeem=${valuespoint}`)
        .then((res) => {
           // console.log("CheckUserRedemptionEligibility: ", res.data.result[0]);
            setPointsEligible(res.data.result[0].pendingpoints);
            setIsEligible(res.data.result[0].isusereligiblefor2000);            
        }).catch((error) => {
            console.log(error); 
        });
    }

    const pointvalueChange = (e) => {
        const pointval = parseInt(e.target.value)
        setRedeempoint(pointval);
        checkEligibility(pointval);
        setErrorMsg('');
    }
    const pointvalueSubmit = (e) => {
        e.preventDefault();
        console.log(redeempoint);
        if(userstatus !== 'APPROVE')
        {
            setErrorMsg('Reward points will redeem after profile approval.'); 
            return;
        }
        if(pendingorder > 0)
        {
            setErrorMsg('');
            toast.info('Your Previous order is already in pending.'); 
            push("/redemptionhistory");
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
        if(!isEligible || redeempoint > parseInt(pointsEligible))
        {
            setErrorMsg(`You are eligible to redeem up to ${pointsEligible} reward points.`); 
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
                <input type="number" placeholder="ENTER POINTS" min="0"  maxLength={4} onInput={onInputmaxLength} name="redeempoint" value={redeempoint} onChange={pointvalueChange}  onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault() }  />
                { errorMsg && <span>{errorMsg}</span> }
                <aside>
                    <button type='submit'>Redeem Points</button>
                </aside>
            </form>
        </div>


         <Loader showStatus={loading} message={pagemsg} />  
  </>)
}
