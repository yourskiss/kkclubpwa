"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserID } from "@/config/userauth";
import Loader from "../shared/LoaderComponent";
import { ipaddress, osdetails, browserdetails, geoLatitude, geoLongitude } from "../core/jio";
import {  toast } from 'react-toastify';
import { isCouponeCode, getCouponeCode } from "@/config/validecoupone";
import { _post } from "@/config/apiClient";
import HeaderDashboard from '../shared/HeaderDashboard';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import CountUp from 'react-countup';
import { removeCouponeCode } from "@/config/validecoupone";
import FooterComponent from '../shared/FooterComponent';
 

export default function GetcouponeComponent() {
  const [pagemsg, setPagemsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [couponecode, setCouponecode] = useState('');
  const rewardspoints = TotalrewardpointsComponent();
  const { push } = useRouter();
  const userID = getUserID();
  const latInfo = geoLatitude();
  const lonInfo = geoLongitude();
  const ipInfo = ipaddress();
  const osInfo = osdetails();
  const browserInfo = browserdetails();
  const isCC = isCouponeCode();
  const getCC = getCouponeCode();
  
  useEffect(() => {
      if(isCC)
      {
        setCouponecode(getCC);
       // toast.success("QR code scan successfully.")
       }
       else
       {
        toast.error("Invalide QR Code...");
        push("/rewards");
        removeCouponeCode();
       }
  }, [couponecode]);
 
 
  const handleSubmitCode = (e) => 
  {
    e.preventDefault();
    setLoading(true);
    setPagemsg('Validating Coupon');
    
    const qrdata = {
      userid: userID,
      couponcode: couponecode,
      scanlocation: `{'Latitude':'${latInfo}', 'Longitude':'${lonInfo}'}`,  
      ipaddress: ipInfo,
      osdetails: osInfo,
      browserdetails: browserInfo
    }
    // console.log(qrdata);
        _post("Customer/ValidateCouponAndSave", qrdata)
        .then((res) => {
          setLoading(false);
          // console.log(res)
            if(res.data.result === null)
            {
              toast.error(res.data.resultmessage);
              removeCouponeCode();
              push('/scanqrcode');
             }
             else
             {
              toast.success("Coupon Successfully Validated.");
              removeCouponeCode();
              push(`/scanqrcode/${res.data.result[0].pointid}`);
             }
        }).catch((err) => {
          setLoading(false); 
          toast.error(err.message);
        });
  }

  return (
    <div className='outsidescreen'>
      <HeaderDashboard />
      <div className="screenmain screenqrcode" > 
        <div className="screencontainer">

          <div className="scanqrcodecontainer">
            <h2>Coupone Code: <span>{couponecode}</span></h2>
            <form className="scanqrcodeForm" onSubmit={handleSubmitCode} >
                <button>Validate Coupon</button>
            </form>
          </div>
 

          <div className="screenqrbottom">
            <h2>
              <em>CLUB WALLET</em>
              <CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> <span>Points</span>
            </h2>
            <p><Link href='/rewards'>view points</Link></p>
          </div>
          
        </div>
      </div> 
 
      <FooterComponent />

     <Loader showStatus={loading}  message={pagemsg} />
    </div>
  )
}
