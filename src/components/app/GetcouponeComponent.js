"use client";
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserID } from "@/config/userauth";
import Loader from "../shared/LoaderComponent";
import { ipaddress, osdetails, browserdetails, geoLatitude, geoLongitude } from "../core/jio";
import {  toast } from 'react-toastify';
import { isCouponeCode, getCouponeCode } from "@/config/validecoupone";
import { _post } from "@/config/apiClient";
import HeaderAfterLogin from '../shared/HeaderAfterlogin';

export default function GetcouponeComponent() {
 
  const [loading, setLoading] = useState(false);
  const [couponecode, setCouponecode] = useState('');
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
    isCC ? (setCouponecode(getCC), toast.success("QR code added successfully.")) : (toast.error("Invalide QR Code..."), push("/rewards")); 
  }, [couponecode]);
 
 
  const handleSubmitCode = (e) => 
  {
    e.preventDefault();
    setLoading(true);
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
          res.data.result === null ? toast.error(res.data.resultmessage) : (toast.success("Coupon Successfully Validated."), Cookies.remove('couponecodecookies'), push(`/scanqrcode/${res.data.result[0].pointid}`));
        }).catch((err) => {
          setLoading(false); 
          toast.error(err.message);
          //push("/dashboard");
        });
  }

  return (
    <div className='outsidescreen'>
      <HeaderAfterLogin backrouter="/dashboard"  />
      <div className="screenmain screenqrcode" > 
        <div className="screencontainer">

          <div className="scanqrcodecontainer">
            <h2>Coupone Code: <span>{couponecode}</span></h2>
            <form className="scanqrcodeForm" onSubmit={handleSubmitCode} >
                <button>Validate and Save Coupon</button>
            </form>
          </div>
 
          
        </div>
      </div> 
 

      { loading ? <Loader message="Validating Coupon" /> : null }
    </div>
  )
}
