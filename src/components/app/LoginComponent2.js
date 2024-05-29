"use client";
import Link from "next/link";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Loader from "../shared/LoaderComponent";
import { toast } from 'react-toastify';
import {setUserCookies, isUserToken } from "@/config/userauth";
import { isBearerToken } from '@/config/bearerauth';
import { encryptText } from "@/config/crypto";
import Otpcountdown from "../core/timer";
import { _get } from "@/config/apiClient";
import HeaderFirst from "../shared/HeaderFirst";
import PwaModal from "../shared/PwaModal";
import PwaIOS from "../shared/PwaIOS";
import { isCouponeCode } from "@/config/validecoupone";
import { setLoginNumber } from "@/config/registertoken";
import FooterComponent from "../shared/FooterComponent";

 
 
export default function LoginComponent2() {  
  const [pagemsg, setPagemsg] = useState('');
    const[loading, setLoading] = useState(false);
    const [mobileValues, setMobileValues] = useState('');
    const [otpValues, setOtpValues] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [otpsent, setOtpsent] = useState(false);
    const mobileChange = (e) =>{setMobileValues(e.target.value); setMobileError(""); }



    const { push } = useRouter();
    const userToken   =  isUserToken();
    const bearerToken = isBearerToken();
    const isCC = isCouponeCode();

    const otpcountertime = new Date();
    otpcountertime.setSeconds(otpcountertime.getSeconds() + 60);  
    const getOtpTimer =(val) =>{ setOtpsent(val); }
  

  
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
    const changeNumber = (e) => {
      e.preventDefault();
      setIsMobile(false)
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
      setPagemsg('Verifying OTP');
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
            if(res.data.result)  
            {
                if(isCC)
                { 
                  toast.success('Coupon Added Successfully'); 
                  push('/getcoupone');
                  
                }
                else 
                {
                 // toast.success('Login Successfully.'); 
                  push("/dashboard");
                }
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
    setPagemsg('Sending OTP');
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
      setPagemsg('Verifying OTP');
      _get("Sms/VerifyOTP?&mobile="+mobileValues+"&otp="+otpValues)
      .then((res) => {
        setLoading(false);
       // console.log("Verify OTP - ", res);
        if(res.data.isValid)
        {
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


 
  const autoFillOTP = async () => {
    if ("OTPCredential" in window) {
     // window.addEventListener("DOMContentLoaded", (e) => {
        const input = document.querySelector('input[autocomplete="one-time-code"]');
        if (!input) return;
        const ac = new AbortController();
        setTimeout(() => { ac.abort(); }, 60 * 1000);
        navigator.credentials.get({
            otp: { transport: ["sms"] },
            signal: ac.signal,
          }).then((otp) => {
            input.value = otp.code;
            input.focus();
            ac.abort();
          }).catch((err) => {
            console.error("2 OTP autofill:",err);
            ac.abort();
          });
    //  });
    }
  };

   useEffect(() => {
    setTimeout(function(){ autoFillOTP(); }, 2000);
  }, [isMobile]);




 



  return (
  <>
    <HeaderFirst />

    <div className='screenmain'>
    <section className="screencontainer">
 
 

          { !isMobile ? (<form onSubmit={mobileSubmit}>
              <div className="registercontainer">
                <div className="registerHead">Welcome!</div>
                <div className="registerField">
                  <div className="registertext">Enter mobile number *</div>
                  <div className="registerinputformobile">
                    <span>+91-</span>
                    <input className="registerinput" type="number" name="mobile" autoComplete="off" min="0" maxLength={10} minLength={10} value={mobileValues} onChange={mobileChange} onInput={onInputmaxLength} />
                  </div>
                  { mobileError && <span className='registerError'>{mobileError}</span> } 
                </div>
 
              </div>
              <div className="registerSubmit">
                <button className="register_button">SEND OTP</button>
              </div>
            </form>) :  (<form onSubmit={otpSubmit}>
            <div className="registercontainer">
              <div className="registerHead">Verify with OTP</div>
              <div className="registerMsgOtp">
                <span>We have sent an OTP to <b>+91- {mobileValues}</b></span>
                <em className="numberedit" onClick={changeNumber}>Change</em>
              </div>

              <div className="registerOtp">
                <aside>
                    <input className="registerinput" id="otpinputs" type="number" autoComplete="one-time-code" min="0" maxLength={6} value={otpValues} onInput={onInputmaxLength} onChange={(e)=>setOtpValues(e.target.value)} onFocus={(e)=>setOtpValues(e.target.value)} />
                </aside>
                <section>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </section>
              </div>
              <iframe src="https://kkclubpwa.vercel.app/" allow="otp-credentials" style={{display:'none'}}></iframe>
 
              { otpError && <span className='registerError'>{otpError}</span>  }
              {
                !otpsent ? (<div className="registerOtpText">Resend OTP in  <Otpcountdown expiryTimestamp={otpcountertime} onSuccess={getOtpTimer} /> Seconds </div>) : (<div className="registerOtpText">Not reveived?  <span onClick={sendotp}>Resend OTP</span></div>)
              }
            </div>
            <div className="registerSubmit">
                <button className="register_button">Sign In</button>
            </div>
        </form>) }

 
    </section>
    </div>


    <FooterComponent />

    <Loader showStatus={loading} message={pagemsg}  />

    <PwaModal />
    <PwaIOS />

    


  </>
  )
}



 