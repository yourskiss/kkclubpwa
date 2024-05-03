"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Loader from '../shared/LoaderComponent';
import { toast } from 'react-toastify';
import { ipaddress, osdetails, browserdetails  } from "../core/jio";
import CityStateComponent from "../shared/CitystateComponent";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { _post } from "@/config/apiClient";
import HeaderBeforeLogin from "../shared/HeaderBeforelogin";
 
export default function RegistationComponent() {
  const [step, setStep] = useState(1);
  const[loading, setLoading] = useState(false);
  
  const [cityStateName, setCityStateName] = useState('');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const[citystateErrors, setCitystateErrors] = useState('');

  const[firstname, setFirstname] = useState('');
  const[fnErrors, setfnErrors] = useState('');
  const[lastname, setLastname] = useState('');
  const[lnErrors, setlnErrors] = useState('');
  const[aadhaarinfo, setAadhaarinfo] = useState('');
  const[aadhaarErrors, setAadhaarErrors] = useState('');
  const[pincode, setPincode] = useState('');
  const[pincodeErrors, setPincodeErrors] = useState('');
  const[mobilenumber, setMobilenumber] = useState('');
  const[mobileErrors, setMobileErrors] = useState('');

  const onInputmaxLength = (e) => {
    if(e.target.value.length > e.target.maxLength)
    {
      e.target.value = e.target.value.slice(0, e.target.maxLength);
    }
  }
  const { push } = useRouter();
  const ipInfo = ipaddress();
  const osInfo = osdetails();
  const browserInfo = browserdetails();
 
 

 
 
  
  const handleOptionChange = (sc, st, ct) => {
     setCityStateName(sc);
     setStateName(st);
     setCityName(ct);
    // console.log("handel change - ", cityStateName, " - ", stateName, " - ", cityName);
  };
 
 
  const backtostep = (e) => {
    e.preventDefault();
    if(step === 2) {setStep(1);}
    if(step === 3) {setStep(2);}
  } 

  const handleStep1 = (e) => {
    e.preventDefault();
    setfnErrors('');
    setlnErrors('');
    if(firstname === '' && lastname === '') { setfnErrors('First name is required.'); setlnErrors('Last name is required.'); }
    else if(firstname === '') { setfnErrors('First name is required.'); }
    else if(lastname === '') { setlnErrors('Last name is required.'); }
    else { setStep(2); }
  } 
  const handleStep2 = (e) => {
    e.preventDefault();
    setAadhaarErrors(''); 
    setCitystateErrors(''); 
    if(cityStateName  === '' && aadhaarinfo === '') { setCitystateErrors('City is required.'); setAadhaarErrors('Aadhaar is required.'); }
    else if(cityStateName  === '') { setCitystateErrors('City is required.'); }
    else if(aadhaarinfo === '') { setAadhaarErrors('Aadhaar is required.'); }
    else if(aadhaarinfo .length !== 12) { setAadhaarErrors('Aadhaar must have at least 12 Digits.'); }
    else { setStep(3); }
  } 
  const handleStep3 = (e) => {
    e.preventDefault();
    const regexMobile = /^[6789][0-9]{9}$/i;
    setMobileErrors('');
    setPincodeErrors('');
    if(mobilenumber === '' && pincode === '') { setMobileErrors('Mobile Number is required.'); setPincodeErrors('Pin code in required'); }
    else if(pincode === '') {  setPincodeErrors('Pin code in required'); }
    else if(pincode.length !== 6) { setPincodeErrors('Pin code  must have at least 6 Digits.'); }
    else if(mobilenumber === '') { setMobileErrors('Mobile Number is required.'); }
    else if(mobilenumber.length !== 10) { setMobileErrors('Mobile Number must have at least 10 Digits.'); }
    else if(!regexMobile.test(mobilenumber)){setMobileErrors("Invalid mobile number!");}
    else { 
        // setStep(1);
        handleRegistration();
     }
  } 

   
  const handleRegistration = () => 
  {
    setLoading(true);
    const datafinal = {
      firstname: firstname,
      lastname: lastname,
      fullname: firstname + " " + lastname,
      gender: '',
      phonenumber: mobilenumber,
      emailaddress:'',
      aadhaarinfo: aadhaarinfo,
      addressline1: "",
      city: cityName,
      state: stateName,
      country: "India",
      postalcode: pincode,
      profilepictureurl: '',
      dateofbirth: "",
      languagepreference: "English",
      locationpage: "/register",
      ipaddress: ipInfo,
      osdetails: osInfo,
      browserdetails: browserInfo
    }
    // console.log(datafinal);

 
      _post("Customer/SaveUser", datafinal)
      .then((res) => {
       // console.log(res);
        setLoading(false);
        localStorage.setItem('userprofilesn',res.data.result.shortname);
        localStorage.setItem('userprofilename',  res.data.result.firstname + " " + res.data.result.lastname);
        res.data.result ? (toast.success('Registation Successfully'), push("/approval")) : toast.warn(res.data.resultmessage);
      }).catch((err) => {
        toast.error(err.message);
        setLoading(false); 
      });
  }


  return (<>
    <HeaderBeforeLogin />
    <div className="screenmain">
        <div className="screencontainer">
          <div className="registercontainer">
              {
                step !== 1 ? <div className="registerback"><span onClick={backtostep} title="Back">&#8592; Back</span></div> : null 
              }
              <div className="registerSmallHead">SIGN UP</div>
              <div className="registerHead">Setup your profile</div>

              <>
              { step === 1 ? (<form onSubmit={handleStep1}>
                <div className="registerField">
                  <div className="registertext">First Name <small>*</small></div>
                  <input
                    className="registerinput"
                    type="text"
                    name="firstname"
                    autoComplete="off"
                    maxLength={20}
                    value={firstname}
                    onInput={onInputmaxLength}
                    onChange={(e) => { setFirstname(e.target.value); setfnErrors(''); } }
                  />
                  {fnErrors && <span className="registerError">{fnErrors}</span> }
                </div>
                <div className="registerField">
                  <div className="registertext">Last Name <small>*</small></div>
                  <input
                    className="registerinput"
                    type="text"
                    name="lastname"
                    autoComplete="off"
                    maxLength={20}
                    value={lastname}
                    onInput={onInputmaxLength}
                    onChange={(e) => { setLastname(e.target.value); setlnErrors(''); } }
                  />
                  {lnErrors && <span className="registerError">{lnErrors}</span> }
                </div> 

                <div className="registerSubmit">
                  <button className="register_button">CONTINUE</button>
                </div>    
              </form>) : null }
              </>
              
              <>
              { step === 2 ? (<form onSubmit={handleStep2}>
                
                
                <div className="registerField">
                      <div className="registertext">Select City <small>*</small></div>
                      <ErrorBoundary>
                          <CityStateComponent scChange={handleOptionChange} nameSC={cityStateName} nameS={stateName} nameC={cityName} />
                      </ErrorBoundary>
                      { citystateErrors && <span className="registerError"> {citystateErrors}</span> } 
                      <div className="registerLineText">Enter State name to pick nearby City</div>
                </div>
              

                <div className="registerField">
                  <div className="registertext">Aadhaar Number <small>*</small></div>
                  <input
                    className="registerinput"
                    type="number"
                    name="aadhaarinfo"
                    autoComplete="off"
                    maxLength={12}
                    value={aadhaarinfo}
                    onInput={onInputmaxLength}
                    onChange={(e) => { setAadhaarinfo(e.target.value); }}
                  />
                  <div className="registerLineText">Profile details should match with Aadhaar</div>
                  {aadhaarErrors && <span className="registerError">{aadhaarErrors}</span> }
                </div>

                <div className="registerSubmit">
                  <button className="register_button">CONTINUE</button>
                </div>
              </form>) : null }
              </>
              

              <>
              { step === 3 ? (<form onSubmit={handleStep3}>
                <div className="registerField">
                  <div className="registertext">Pin Code <small>*</small></div>
                  <input
                    className="registerinput"
                    type="number"
                    name="pincode"
                    autoComplete="off"
                    maxLength={6}
                    value={pincode}
                    onInput={onInputmaxLength}
                    onChange={(e) => { setPincode(e.target.value);  }}
                  />
                  {pincodeErrors && <span className="registerError">{pincodeErrors}</span> }
                </div>

                <div className="registerField">
                  <div className="registertext">Mobile Number <small>*</small></div>
                  <input
                    className="registerinput"
                    type="number"
                    name="mobilenumber"
                    autoComplete="off"
                    maxLength={10}
                    value={mobilenumber}
                    onInput={onInputmaxLength}
                    onChange={(e) => { setMobilenumber(e.target.value);  }}
                  />
                  {mobileErrors && <span className="registerError">{mobileErrors}</span> }
                </div>

                <div className="registerSubmit"> 
                  <button className="register_button">Submit</button>
                </div>
              </form>) : null }
              </>

                

                <div className="registerBottomText">
                  Already have an account?  <Link href='/'>Sign in</Link>
                </div>

          </div>
        </div>
    </div>



    { loading ? <Loader message="Information Savings" /> : null }
</>)
}
