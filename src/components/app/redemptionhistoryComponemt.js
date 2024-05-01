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
 

export default function RedemptionhistoryComponemt () {
  const[isclose, setIsclose] = useState(''); 
  const[ispayment, setIspayment] = useState('');
  const[pgrequeystatus, setPgrequeystatus] = useState('');
  const [btnload, setBtnload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redeemedpoints,setRedeemedPoints] = useState('');
  const [pointhistory, setPointhistory] = useState({});
  const [nodata, setNodata] = useState('');
  const userID = getUserID();
  const { push } = useRouter();

 
  useEffect(() => {
    _get(`Customer/UserTotalRedeemedPoints?userid=${userID}`)
    .then((res) => {
       // console.log("UserTotalRedeemedPoints - ", res);
        setRedeemedPoints(res.data.result[0].totalredeempoints)
    }).catch((error) => {
        toast.error(error); 
    });
  }, [redeemedpoints]);

  useEffect(() => {
      setLoading(true);
    _get(`Customer/UserRedeemedPointsHistory?userid=${userID}`)
    .then((res) => {
       // console.log("Redeemed Points History - ", res);
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
    //setBtnload(true);
    setLoading(true);
    _get(`/Payment/UserPayoutStatus?userID=${userID}&orderID=${od}`)
    .then((res) => { 
       

      if(res.status === 200)
      {
       // setBtnload(false); 
        setLoading(false);
        console.log("Status inside - ", res.data.isclose, res.data.ispayment, res.data.pgrequeystatus, res); 

        setIsclose(res.data.isclose);
        setIspayment(res.data.ispayment);
        setPgrequeystatus(res.data.pgrequeystatus);
        push("/redemptionhistory");
      }
 
       
    }).catch((error) => {
       // setLoading(false);
        setBtnload(false);
        toast.info(error); 
    });
  }
 
 
  return (
  <div className="outsiderewads">
    <HeaderAfterLogin />
    <div className="screenmain screenrewads"> 
      <div className="screencontainer">
 

          <div className="rewardscontainer">
            <h2>Redemption History</h2>
            <h3>
              <CountUp duration={2} start={0}  delay={1} end={redeemedpoints} /> <b>PTS</b> 
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
                  <p><b>Transaction</b><br /><small>Amount/ID</small></p>
                  <p><b>Status</b><br /><small>Orderid</small></p>
                  <p></p>
                </li>
                {  pointhistory.map &&  pointhistory.map((val, index) => <li key={val.transactionid} data-id={val.status}>
                  <p>{index+1}</p>
                  <p>{val.pointsredeemed} <span>{val.redemptiondate}</span></p>
                  <p>{ val.transactionamount } <span>{val.transactionid}</span></p>
                  <p>{val.status} <span>{val.orderid}</span></p>
                  <p><Image className={ btnload ? "rotedrefreshimg" : null } src="/assets/images/refresh_icon.png" onClick={()=> payoutstatus(val.orderid)}  width={20} height={20} alt="product" quality={99}  /></p>
                </li>) }
              </ol>
            </div>
            )}
          
 
      </div>
    </div> 



    { loading ? <Loader message="Payment Initiation" /> : null }
  </div>
  )
}
 

 
 

          
 
 