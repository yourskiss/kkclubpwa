"use client";
import Link from "next/link";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from "../shared/LoaderComponent";
import { toast } from 'react-toastify';
import { setUserCookies, isUserToken, isBearerToken } from "@/config/userauth";
import { encryptText } from "@/config/crypto";
import { setCouponeCode, isCouponeCode } from "@/config/validecoupone";
import Otpcountdown from "../core/timer";
import { _get } from "@/config/apiClient";
 

export default function LoginComponent() {  
    const[loading, setLoading] = useState(false);
    const [agree, setAgree] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [mobileValues, setMobileValues] = useState('');
    const [otpValues, setOtpValues] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isOTP, setIsOTP] = useState(false);
    const [OTPVerified, setOTPVerified] = useState(false);
    const [otpsent, setOtpsent] = useState(false);
    const mobileChange = (e) =>{setMobileValues(e.target.value); setMobileError(""); }
    const otpChange = (e) =>{setOtpValues(e.target.value); setOtpError(''); }
    const onInputmaxLength = (e) => {
        if(e.target.value.length > e.target.maxLength)
        {
          e.target.value = e.target.value.slice(0, e.target.maxLength);
        }
    }
    const mobileSubmit =(e) =>{
      e.preventDefault();
      const regexMobile = /^[6789][0-9]{9}$/i;
      if (!mobileValues){setMobileError("Mobile number is required!");}
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
        setIsOTP(true); 
        verifyotp();
      }
    }
    const changeNumber = (e) => {
      e.preventDefault();
      setAgree(true);
      setIsDisabled(false);
      setIsOTP(false);
      setIsMobile(false)
    }

  const { push } = useRouter();
  const searchParams = useSearchParams();
  const getqrcode = searchParams.get('code');
  const isCC = isCouponeCode();
  const userToken   =  isUserToken();
  const bearerToken = isBearerToken();
 
  const checkboxHandler = () => {
    agree === false ? setAgree(true) : setAgree(false);
  }
  const otpcountertime = new Date();
  otpcountertime.setSeconds(otpcountertime.getSeconds() + 60);  
  const getOtpTimer =(val) =>{ setOtpsent(val); }

   useEffect(() => {
     if(getqrcode !== null) { setCouponeCode('couponecodecookies',getqrcode); }
   }, [getqrcode]);
  

  useEffect(() => {
    if(!bearerToken) { push("/"); return  }
    if(userToken && !isCC) { push("/dashboard"); return }
    if(userToken && isCC) { push("/getcoupone"); return }
  }, []);

 

 
 
 

 
    function loginnow()
    {
      setLoading(true);
      _get("Customer/UserInfo?userid=0&phonenumber="+ mobileValues)
      .then(res => {
        //  console.log("login success - ", res);
        localStorage.setItem("userprofilename",res.data.result.fullname);
        localStorage.setItem("userprofilepic",res.data.result.profilepictureurl);
        localStorage.setItem("verificationstatus",res.data.result.verificationstatus);
        if(res.data.result.verificationstatus === "APPROVE" || res.data.result.verificationstatus === "PENDING")
        {
            const userinfo = res.data.result.userid + "|" + res.data.result.phonenumber
            setUserCookies('usertoken', encryptText(userinfo));       
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
        // else if(res.data.result.verificationstatus === "PENDING")
        // {
        //    res.data.result ? push("/approval") : toast.error(res.data.resultmessage);
        // }
        else if(res.data.result.verificationstatus === "REJECT")
        {
          toast.warn("Your request has been rejected. please register with another mobile number.");
        }
        else
        {
           toast.warn("Your are not registered user. please register after login");
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
        setIsOTP(false);
       // console.log("send otp  - ", res);
        toast.success(res.data.resultmessage);
      }).catch((err) => {
        toast.error(err.message);
        setLoading(false); 
      });
  }
 

  const verifyotp = () => {
    // setOTPVerified(true); // tesing

   // loginnow(); // tesing
    
      setLoading(true);
      _get("Sms/VerifyOTP?&mobile="+mobileValues+"&otp="+otpValues)
      .then((res) => {
        setLoading(false);
       // console.log("Verify OTP - ", res);
        if(res.data.isValid)
        {
          toast.success("OTP Successfully Verify");
          setOTPVerified(res.data.isOTPVerified); 
          loginnow();
        }
        else
        {
          toast.error("Invalid OTP");
          setOtpValues('');
          setIsOTP(false);
          setOTPVerified(false);
        }
      }).catch((err) => {
        toast.error(err.message);
        setLoading(false); 
      });
    
  }



  return (
  <>
    <header className='headersection'>
        <aside className="logo">
          <Image src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={99} />
        </aside>
    </header>

    <div className='screenmain'>
    <section className="screencontainer">


          { !isDisabled ? (<div className="registercontainer">
              <div className="registerHead">Welcome!</div>
              <div className="registerField">
                <div className="registertext">Enter mobile number *</div>
                <div className="registerinputformobile">
                  <span>+91-</span>
                  <input className="registerinput" type="number" name="mobile" autoComplete="off" maxLength={10} minLength={10} value={mobileValues} onChange={mobileChange} disabled={isDisabled} onInput={onInputmaxLength} />
                </div>
                { mobileError && <span className='registerError'>{mobileError}</span> } 
              </div>
              <div className="registerTncAccept">
                 <input id="accepttnc" type="checkbox" onChange={checkboxHandler}  />
                 <label htmlFor="accepttnc"><span>Accept Term and Condition</span></label>
              </div>
              </div>) : null }
          
          

        { mobileError === '' && isMobile ? (
        <>
            <div className="registercontainer">
              <div className="registerHead">Verify with OTP</div>
              <div className="registerMsgOtp">
                <span>We have sent an OTP to +91-{mobileValues}</span>
                <em className="numberedit" onClick={changeNumber}>Change</em>
              </div>
              <div className="registerOtp">
                <div><aside>
                  <input type="number" name="otpnumber" autoComplete="off" maxLength={6} minLength={6}  value={otpValues} onChange={otpChange}  onInput={onInputmaxLength} />
                </aside></div> 
              </div>
              { otpError && <span className='registerError'>{otpError}</span>  }
              {
                !otpsent ? (<div className="registerOtpText">Resend OTP in  <Otpcountdown expiryTimestamp={otpcountertime} onSuccess={getOtpTimer} /> Seconds </div>) : (<div className="registerOtpText">Not reveived?  <span onClick={sendotp}>Resend OTP</span></div>)
              }
            </div>
        </>
        ) : null }

            <div className="registerSubmit">
              { 
                !isMobile && !isOTP ?
                (<button disabled={agree} className="register_button" onClick={mobileSubmit}>SEND OTP</button>) 
                :
                (<button className="register_button" onClick={otpSubmit}>Sign In</button>)
              }
            </div>

 
      
        <div className="registerBottomText">Haven’t signed up yet? <Link href='/register'>Sign Up</Link></div>
    </section>
    </div>

    { loading ? <Loader message="Request submitting" /> : null }
  </>
  )
}
