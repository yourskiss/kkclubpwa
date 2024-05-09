"use client";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { getUserID } from "@/config/userauth";
import Loader from "../shared/LoaderComponent";
import CountUp from 'react-countup';
import { _get } from "@/config/apiClient";
import HeaderAfterLogin from "../shared/HeaderAfterlogin";
import { toast } from 'react-toastify';
import TotalRedeemedPoints from '../shared/totalredemption';
 

export default function RedemptionhistoryComponemt () {
  const[isclose, setIsclose] = useState(''); 
  const[ispayment, setIspayment] = useState('');
  const[pgrequeystatus, setPgrequeystatus] = useState('');
  const [btnload, setBtnload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pointhistory, setPointhistory] = useState({});
  const [nodata, setNodata] = useState('');
  const userID = getUserID();
  const { push } = useRouter();
  const redeemedpointTotal = TotalRedeemedPoints();
 

  useEffect(() => {
     setLoading(true);
    _get(`Customer/UserRedeemedPointsHistory?userid=${userID}`)
    .then((res) => {
        console.log("Redeemed Points History - ", res);

        // res.data.result.some(element => {
        //   console.count(element.status, element.orderid);
        //   if (element.status === "Pending") 
        //   {
        //     payoutstatus(element.orderid);
        //   }
        // });

        if(res.data.result.length !== 0)
        {
          setPointhistory(res.data.result)
        }
        else
        {
          setNodata('Redemption history not available.');
        }
        setLoading(false);
    }).catch((error) => {
        setLoading(false);
        toast.error(error); 
    });
  }, []);


  const payoutstatus = (od) => {
    setLoading(true);
    setBtnload(true);
    _get(`/Payment/UserPayoutStatus?userID=${userID}&orderID=${od}`)
    .then((res) => { 
     // console.log("Status inside - ", res.data.isclose, res.data.ispayment, res.data.pgrequeystatus, res); 
      if(res.status === 200)
      {
        setIsclose(res.data.isclose);
        setIspayment(res.data.ispayment);
        setPgrequeystatus(res.data.pgrequeystatus);
        setTimeout(function(){
          setLoading(false);
          setBtnload(false);
          window.location.reload();
          // toast.info(res.statusText); 
        }, 10000);
      }
      else
      {
        toast.info(res.statusText); 
      }
    }).catch((error) => {
        setLoading(false);
        setBtnload(false);
        toast.info(error); 
    });
  }
 
 
  return (
  <div className="outsiderewads">
    <HeaderAfterLogin backrouter="/profile" />
    <div className="screenmain screenrewads"> 
      <div className="screencontainer">
 

          <div className="rewardscontainer">
            <h2>Redemption History</h2>
            <h3>
              <CountUp duration={2} start={0}  delay={1} end={redeemedpointTotal} /> <b>Points</b> 
              <em>Redeemed Points</em>
            </h3>
          </div>
          
            { nodata ? <div className="norewardsavailable">{nodata}</div> : (
            <div className="rewardstables">
              <h4>HISTORY TRANSITION</h4>
              <ol>
                <li>
                  <p><b>SN.</b></p>
                  <p><b>Points</b><br /><small>Date</small></p>
                  <p><b>Amount</b><br /><small>Transaction ID</small></p>
                  <p><b>Status</b><br /><small>Order ID</small></p>
                  <p></p>
                </li>
                {  pointhistory.map &&  pointhistory.map((val, index) => <li key={val.transactionid} data-id={val.status}>
                  <p>{index+1}</p>
                  <p>{val.pointsredeemed} <span>{val.redemptiondate}</span></p>
                  <p>{ val.transactionamount } <span>{val.transactionid}</span></p>
                  <p>{val.status} <span>{val.orderid}</span></p>
                  {
                    val.status === 'Pending' ? <><p><Image className={ btnload ? "rotedrefreshimg" : null } src="/assets/images/refresh_icon.png" onClick={()=> payoutstatus(val.orderid)}  width={20} height={20} alt="Pending" quality={99}  /></p></> :  val.status === 'Success' ? <p><Image src="/assets/images/success_icon.png"  width={20} height={20} alt="Success" quality={99} className='transition_success'  /></p> : <p><Image src="/assets/images/failed_icon.png"  width={20} height={20} alt="Failed" quality={99}  className='transition_failed' /></p>
                  }
                </li>) }
              </ol>
            </div>
            )}
          
 
      </div>
    </div> 



    { loading ? <Loader message="Validating information" /> : null }
  </div>
  )
}
 

 
 

          
 
 