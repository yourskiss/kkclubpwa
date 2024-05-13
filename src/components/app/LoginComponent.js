"use client";
import Link from "next/link";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from "../shared/LoaderComponent";
import { toast } from 'react-toastify';
import {isBearerToken, setUserCookies, isUserToken, setLoginNumber } from "@/config/userauth";
import { encryptText } from "@/config/crypto";
import { setCouponeCode, isCouponeCode } from "@/config/validecoupone";
import Otpcountdown from "../core/timer";
import { _get } from "@/config/apiClient";
import HeaderFirst from "../shared/HeaderFirst";
 

 
export default function LoginComponent() {  

    const[loading, setLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [mobileValues, setMobileValues] = useState('');
    const [otpValues, setOtpValues] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [otpsent, setOtpsent] = useState(false);
    const mobileChange = (e) =>{setMobileValues(e.target.value); setMobileError(""); }
    const otpChange = (e) =>{setOtpValues(e.target.value); setOtpError(''); }

    const { push } = useRouter();
    const searchParams = useSearchParams();
    const getqrcode = searchParams.get('code');
    const isCC = isCouponeCode();
    const userToken   =  isUserToken();
    const bearerToken = isBearerToken();


    const otpcountertime = new Date();
    otpcountertime.setSeconds(otpcountertime.getSeconds() + 60);  
    const getOtpTimer =(val) =>{ setOtpsent(val); }
  
     useEffect(() => {
       if(getqrcode !== null) { setCouponeCode(getqrcode); }
     }, [getqrcode]);
    
  
    useEffect(() => {
      if(!bearerToken) { push("/"); return  }
      if(userToken && !isCC) { push("/dashboard"); return }
      if(userToken && isCC) { push("/getcoupone"); return }
    }, []);
  

    const onInputmaxLength = (e) => {
        if(e.target.value.length > e.target.maxLength)
        {
          e.target.value = e.target.value.slice(0, e.target.maxLength);
        }
    }
    const mobileSubmit =(e) =>{
      e.preventDefault();
      const regexMobile = /^[6789][0-9]{9}$/i;
      if (!mobileValues){setMobileError("Please enter your mobile number"); }
      else if(mobileValues.length < 10){setMobileError("Mobile Number  must have at least 10 Digit");}
      else if(!regexMobile.test(mobileValues)){setMobileError("Invalid mobile number!");}
      else { 
        setMobileError("");
        setIsMobile(true);   
        setIsDisabled(true);
        sendotp();
      }
    }
    const otpSubmit =(e) =>{
      e.preventDefault();
      const regexOTP = /^[0-9]{6}$/i;
      if (!otpValues){setOtpError("OTP is required!");}
      else if(otpValues.length < 6){setOtpError("OTP must have at least 6 digit");}
      else if(!regexOTP.test(otpValues)){setOtpError("Invalid otp");}
      else{ 
        setOtpError('');
        verifyotp();
      }
    }

    function loginnow()
    {
      setLoading(true);
      _get("Customer/UserInfo?userid=0&phonenumber="+ mobileValues)
      .then(res => {
        //  console.log("login success - ", res);
        if(res.data.result.verificationstatus === "APPROVE" || res.data.result.verificationstatus === "PENDING")
        {
          localStorage.setItem("userprofilename",res.data.result.fullname);
          localStorage.setItem("userprofilesn",res.data.result.shortname);
          localStorage.setItem("verificationstatus",res.data.result.verificationstatus);
            const userinfo = res.data.result.userid + "|" + res.data.result.phonenumber
            setUserCookies(encryptText(userinfo));       
            if(res.data.result && isCC)
            { 
              push('/getcoupone');
              toast.success('Coupon Added Successfully'); 
            }
            else if(res.data.result && !isCC)  
            {
              push("/dashboard");
              toast.success('Login Successfully'); 
            }
            else
            {
                toast.error(res.data.resultmessage);
            }
        }
        else if(res.data.result.verificationstatus === "REJECT")
        {
          toast.warn("Your request has been rejected. please Try with another mobile number.");
        }
        else
        {
          setLoginNumber(mobileValues);
          push('/register');
        }
        setLoading(false);
      })
      .catch(error => {
        console.log("catch loginnow");
        toast.error(error.message);
        setLoading(false); 
      });
    }


 

  const sendotp = () => {
    setLoading(true);
      _get("Sms/SendOTP?mobile="+ mobileValues)
      .then((res) => {
        setLoading(false);
        setOtpValues('');
        setOtpsent(false);
       // console.log("send otp  - ", res);
        toast.success(res.data.resultmessage);
      }).catch((err) => {
        toast.error(err.message);
        setLoading(false); 
      });
  }
 

  const verifyotp = () => {
    loginnow(); // tesing
    /*
      setLoading(true);
      _get("Sms/VerifyOTP?&mobile="+mobileValues+"&otp="+otpValues)
      .then((res) => {
        setLoading(false);
       // console.log("Verify OTP - ", res);
        if(res.data.isValid)
        {
          toast.success("OTP Successfully Verify");
          loginnow();
        }
        else
        {
          toast.error("Invalid OTP");
          setOtpValues('');
        }
      }).catch((err) => {
        toast.error(err.message);
        setLoading(false); 
      });
    */
  }



  // useEffect(() => {
  //       const ac = new AbortController();
  //       setTimeout(function(){
  //         ac.abort();
  //       }, 0.5 * 60 * 1000);
  //       navigator.credentials.get({
  //         otp: { transport:['sms'] },
  //         signal: ac.signal
  //       }).then((otp) => {
  //         setOtpValues(otp.code);
  //         ac.abort();
  //       }).catch((err) => {
  //         ac.abort();
  //         console.log(err);
  //       });
  // }, [isMobile]);

 

  useEffect(() => {
    if ('OTPCredential' in window) {
      const ac = new AbortController();
      navigator.credentials
        .get({ otp: { transport: ['sms'] }, signal: ac.signal })
        .then((otpCredential) => {
          setOtpValues(otpCredential.code);
          ac.abort();
        })
        .catch((err) => {
          ac.abort();
          console.error(err);
        });
    }
  }, []);


 
  return (
  <>
    <HeaderFirst />

    <div className='screenmain'>
    <section className="screencontainer">


          { !isDisabled ? (<form onSubmit={mobileSubmit}>
              <div className="registercontainer">
                <div className="registerHead">Welcome!</div>
                <div className="registerField">
                  <div className="registertext">Enter mobile number *</div>
                  <div className="registerinputformobile">
                    <span>+91-</span>
                    <input className="registerinput" type="number" name="mobile" autoComplete="off" min="0" maxLength={10} minLength={10} value={mobileValues} onChange={mobileChange} disabled={isDisabled} onInput={onInputmaxLength} />
                  </div>
                  { mobileError && <span className='registerError'>{mobileError}</span> } 
                </div>
 
              </div>
              <div className="registerSubmit">
                <button className="register_button">SEND OTP</button>
              </div>
            </form>) : null }
          
              

        { mobileError === '' && isMobile ? (
        <form onSubmit={otpSubmit}>
            <div className="registercontainer">
              <div className="registerHead">Verify with OTP</div>
              <div className="registerMsgOtp">
                <span>We have sent an OTP to +91-{mobileValues}</span>
              </div>
              <div className="registerOtp">
                <p style={{'background':'white'}}>{otpValues}</p>
                <div><aside>
                  <input type="number" name="otp" autoComplete="one-time-code" min="0" maxLength={6} minLength={6}  value={otpValues} onChange={otpChange}  onInput={onInputmaxLength} />
                </aside></div> 
              </div>
              { otpError && <span className='registerError'>{otpError}</span>  }
              {
                !otpsent ? (<div className="registerOtpText">Resend OTP in  <Otpcountdown expiryTimestamp={otpcountertime} onSuccess={getOtpTimer} /> Seconds </div>) : (<div className="registerOtpText">Not reveived?  <span onClick={sendotp}>Resend OTP</span></div>)
              }
            </div>
            <div className="registerSubmit">
                <button className="register_button">Sign In</button>
            </div>
        </form>
        ) : null }

 
    </section>
    </div>

    { loading ? <Loader message="Request submitting" /> : null }

  </>
  )
}



 