"use client";
import { useEffect, useState } from "react";
import { getUserID } from "@/config/userauth";
import Loader from "../shared/LoaderComponent";
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import CountUp from 'react-countup';
import { _get } from "@/config/apiClient";
import HeaderAfterLogin from "../shared/HeaderAfterlogin";

export default function RewardshistoryComponent () {
  const [loading, setLoading] = useState(false);
  const [pointhistory, setPointhistory] = useState({});
  const [nodata, setNodata] = useState('');
  const userID = getUserID();
   
  
  useEffect(() => {
    setLoading(true);
    _get("Customer/UserRewardPointsHistory?userid="+ userID)
    .then((res) => {
       // console.log("UserRewardPointsHistory - response - ", res);
        setLoading(false);
        if(res.data.result.length !== 0)
        {
          setPointhistory(res.data.result)
        }
        else
        {
          setNodata('Reward history not available.');
        }
    }).catch((error) => {
        setLoading(false);
       // console.log("UserRewardPointsHistory - error - ", error);
        setNodata(error.message);
    });

  }, [userID]);

 const points = TotalrewardpointsComponent();
  return (
  <div className="outsiderewads">
    <HeaderAfterLogin />
    <div className="screenmain screenrewads"> 
      <div className="screencontainer">
 

          <div className="rewardscontainer">
            <h2>Reward Points History</h2>
            <h3>
              <CountUp duration={2} start={0}  delay={1} end={points} /> <b>PTS</b> 
              <em>Total Rewards  </em>
            </h3>
          </div>
          
            { nodata ? <div className="norewardsavailable">{nodata}</div> : (
            <div className="rewardstables">
              <h4>HISTORY TRANSITION</h4>
              <ul>
                <li>
                  <p><b>SN.</b></p>
                  <p><b>Coupon Code</b></p>
                  <p><b>Earned Points</b></p>
                </li>
                {  pointhistory.map &&  pointhistory.map((val, index) => <li key={val.pointid}>
                  <p>{index+1}</p>
                  <p>{val.couponcode} <span>{val.scandate}</span></p>
                  <p>{ val.earnedpoints }</p>
                </li>) }
              </ul>
            </div>
            )}
          
 
      </div>
    </div> 



    { loading ? <Loader message="Getting response" /> : null }
  </div>
  )
}
 

 
 

          
 
 