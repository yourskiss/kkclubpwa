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
  const userImg = "data:image/png;base64,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";
 
 

 
 
  
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
    if(mobilenumber === '') { setMobileErrors('Mobile Number is required.'); }
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
      postalcode: "",
      profilepictureurl: userImg,
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
        localStorage.setItem('userprofilepic',userImg);
        localStorage.setItem('userprofilename',  firstname + " " + lastname);
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
