"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QrReader from '../core/QrReader';
import { getUserID } from "@/config/userauth";
import Loader from "../shared/LoaderComponent";
import { ipaddress, osdetails, browserdetails, geoLatitude, geoLongitude } from "../core/jio";
import { toast } from 'react-toastify';
import Link from 'next/link';
import CountUp from 'react-countup';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import { _post } from "@/config/apiClient";
import HeaderDashboard from '../shared/HeaderDashboard';
import FooterComponent from '../shared/FooterComponent';

export default function ScanqrcodeComponent() {
  const [pagemsg, setPagemsg] = useState('');
  const [loading, setLoading] = useState(false);
 
  const [qrcode, setQrcode] = useState(true);
  const [scandata, setScandata] = useState('');
  const [couponecode, setCouponecode] = useState('');
  const { push } = useRouter();
  const userID = getUserID();
  const latInfo = geoLatitude();
  const lonInfo = geoLongitude();
  const ipInfo = ipaddress();
  const osInfo = osdetails();
  const browserInfo = browserdetails();
  const rewardspoints = TotalrewardpointsComponent();
 
  const handalqrisvailable = (val) => { 
    setQrcode(val);
  }
  const getData =(val) =>{
    setScandata(val);
  }

  useEffect(() => {
      const sdURL = scandata.split("?") || '';
      if(sdURL[0] === process.env.NEXT_PUBLIC_COUPON_URL || sdURL[0] === process.env.NEXT_PUBLIC_COUPON_URL2)
      {
        const couponvalue = sdURL[1].split("=");
        setCouponecode(couponvalue[1]);
       // toast.success("Your code has been successfully scanned.");
      }
  }, [qrcode]);

  useEffect(() => {
    if(couponecode !== '')
    {
      handleSubmitCode();
    }
}, [couponecode]);
 


  const handleSubmitCode = () => 
  {
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
 
        _post("Customer/ValidateCouponAndSave", qrdata)
        .then((res) => {
          setTimeout(function(){setLoading(false);},2000); 
          // console.log(res)
          if(res.data.resultcode === 0)
          {
              toast.success("Your code has been successfully scanned ");
              push(`/scanqrcode/${res.data.result[0].pointid}`);
          } 
          else if(res.data.resultcode === -101)
          {
              toast.error("This code has already been scanned. Try again.");
              setTimeout(function(){window.location.reload(); },2000);
          } 
          else if(res.data.resultcode === -102)
          {
              toast.error("This coupon code is invalid. Please enter a valid coupon code.");
              setTimeout(function(){window.location.reload(); },2000);
          } 
          else if(res.data.resultcode === -103)
            {
              toast.error("This coupon code is inactive. Please enter a valid coupon code. ");
              setTimeout(function(){window.location.reload(); },2000);
          } 
          else if(res.data.resultcode === -100)
          {
              toast.error("There is an issue while availing the coupon. kindly contact to the support team.");
              setTimeout(function(){window.location.reload(); },2000);
          }
          else
          {
            window.location.reload();
          }
        }).catch((err) => {
          setLoading(false); 
          console.log(err);
          window.location.reload();
        });

  }

  return (
    <div className='outsidescreen'>
      <HeaderDashboard />
      <div className="screenmain screenqrcode" > 
        <div className="screencontainer">
           { 
            couponecode !== '' ? <div className="scanqrcodecontainer">
              <h1>Scan Data  <span>({scandata})</span></h1>
              <h2>Coupone Code: <span>{couponecode}</span></h2>
              <form className="scanqrcodeForm" onSubmit={handleSubmitCode} style={{'display':'none'}}>
                  <button>Validate Coupon</button>
              </form>
            </div>
            : <div className="scanqrcodesection"><h2>Scan QR code <br /> and win rewards</h2><QrReader onData={handalqrisvailable} onSuccess={getData} /></div>
          } 

        </div>


          <div className="screenqrbottom">
            <h2>
              <em>CLUB WALLET</em>
              <CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> <span>Points</span>
            </h2>
            <p><Link href='/rewards'>view points</Link></p>
          </div>


      </div> 
 

      <FooterComponent />
      
       <Loader showStatus={loading} message={pagemsg} /> 
    </div>
  )
}
