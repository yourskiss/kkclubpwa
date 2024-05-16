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

export default function ScanqrcodeComponent() {
  const [pagemsg, setPagemsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(true);

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
 
 

  useEffect(() => {
      const sdURL = scandata.split("?") || '';
      if(sdURL[0] === process.env.NEXT_PUBLIC_COUPON_URL)
      {
          const couponvalue = sdURL[1].split("=");
          setCouponecode(couponvalue[1]);
         // toast.success("QR code scan successfully.");
      }
      else
      {
          console.count("Invalide QR code.");
      }
  }, [qrcode]);


  const handalqrisvailable = (val) => { 
    setQrcode(val);
  }
  const getData =(val) =>{
    setScandata(val);
  }

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
          setLoading(false);
          console.log(res)
          if(res.data.result === null)
          {
            toast.error(res.data.resultmessage);
            setQrcode(true);
           // push('/scanqrcode');
           } 
           else
           {
            toast.success('Coupon Successfully Verify and Added');
            push(`/scanqrcode/${res.data.result[0].pointid}`);
           }
        }).catch((err) => {
          setLoading(false); 
          toast.error(err.message);
          setQrcode(true);
        //  push('/scanqrcode');
        });

  }

  return (
    <div className='outsidescreen'>
      <HeaderDashboard />
      <div className="screenmain screenqrcode" > 
        <div className="screencontainer">
          {/* { 
            !qrcode ? <div className="scanqrcodecontainer">
              <h1>Scan Data  <span>({scandata})</span></h1>
              <h2>Coupone Code: <span>{couponecode}</span></h2>
              <form className="scanqrcodeForm" onSubmit={handleSubmitCode}>
                  <button>Validate Coupon</button>
              </form>
            </div>
            : <div className="scanqrcodesection"><h2>Scan QR code <br /> and win rewards</h2><QrReader onData={handalqrisvailable} onSuccess={getData} /></div>
          } */}

          <div className="scanqrcodesection"><h2>Scan QR code <br /> and win rewards</h2><QrReader onData={handalqrisvailable} onSuccess={getData} /></div>
        </div>


          <div className="screenqrbottom">
            <h2>
              <em>CLUB WALLET</em>
              <CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> <span>Points</span>
            </h2>
            <p><Link href='/rewards'>view points</Link></p>
          </div>


      </div> 
 

      
       <Loader showStatus={loading} message={pagemsg} /> 
    </div>
  )
}
