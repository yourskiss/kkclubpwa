"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Loader from "../shared/LoaderComponent";
import { getUserID, getUserMobile } from "@/config/userauth";
import { toast } from 'react-toastify';
import { ipaddress, osdetails, browserdetails  } from "../core/jio";
import CitystateUpdateComponent from "../shared/CitystateUpdateComponent";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { _get, _post } from "@/config/apiClient";
import HeaderDashboard from "../shared/HeaderDashboard";
import FooterComponent from "../shared/FooterComponent";
import { setUserInfo } from "@/config/userinfo";

export default function UpdateprofileComponent() {
    const [pagemsg, setPagemsg] = useState('');
    const[loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(true);
    const [mounted2, setMounted2] = useState(true);

    const [data, setData] = useState(false);
    const [formValue, setFormValue] = useState({});
    const [formError, setFormError] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const [cityStateName, setCityStateName] = useState('');
    const [stateName, setStateName] = useState('');
    const [cityName, setCityName] = useState('');

    const[bankname,setBankname] = useState('');
    const[ifsccode,setIfsccode] = useState('');
    const[accountnumber,setAccountnumber] = useState('');
    const[upicode,setUpicode] = useState('');
    const[pan,setPan] = useState('');

    const [userdata, setUserdata] = useState({});
    
    const { push } = useRouter();
    const userID = getUserID();
    const userMobile = getUserMobile();
    const ipInfo = ipaddress();
    const osInfo = osdetails();
    const browserInfo = browserdetails();
    


    useEffect(() => {
        setLoading(true);
        setPagemsg('Profile details fetching');
        _get("Customer/UserInfo?userid=0&phonenumber="+ userMobile)
        .then((res) => {
          //  console.log("get---", res.data.result);
            setLoading(false);
            if (mounted)
            {
                setData(true);
                setUserdata(res.data.result);
                setCityStateName(`${res.data.result.city} (${res.data.result.state})`)
                setStateName(res.data.result.state);
                setCityName(res.data.result.city);
            }
        }).catch((err) => {
            console.log(err.message);
            setLoading(false); 
        });
        return () => { setMounted(false); }
    }, []);
 
 
    useEffect(() => {
        setFormValue({
            'firstname':  userdata.firstname,
            'lastname':  userdata.lastname,
            'postalcode':userdata.postalcode
        });
    }, [data]);

    const validateHandler =(val) =>{
        const error = {};
        if(val.firstname===''){error.firstname = "First name is required."}
        if(val.lastname===''){error.lastname = "Last name is required."}
        if(val.postalcode===''){error.postalcode = "Postal code is required"}
        else if(val.postalcode.length !== 6){error.postalcode = "Postal code have at least 6 Digit"}
        return error;
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        setFormError(validateHandler(formValue));
        setIsSubmit(true);
       // console.log("formValue on submit", formValue);
    }
    const handleOptionChange = (sc, st, ct) => {
        setCityStateName(sc);
        setStateName(st);
        setCityName(ct);
        // console.log("change update - ", cityStateName, " - ", stateName, " - ", cityName);
     };

    const onChangeField = (e) => { 
        if(e.target.name === 'firstname' || e.target.name === 'lastname')
        {
            setFormValue({ ...formValue, [e.target.name] : e.target.value.replace(/[^a-z]/gi, '') }); 
        }
        else
        {
            setFormValue({ ...formValue, [e.target.name] : e.target.value });
        }
         
    }
    useEffect(()=>{
        if(Object.keys(formError).length === 0 && isSubmit)
        {
           const datafinal = 
           {
            userid: userID,
            firstname: formValue.firstname,
            lastname: formValue.lastname,
            fullname: formValue.firstname + " " + formValue.lastname,
            gender: "",
            phonenumber: userMobile,
            emailaddress: "",
            aadhaarinfo: userdata.aadhaarinfo,
            addressline1: "",
            city: cityName,
            state: stateName,
            country: "India",
            postalcode: formValue.postalcode,
            profilepictureurl: '',
            dateofbirth: "",
            languagepreference: "English",
            locationpage: "/update-profile",
            ipaddress: ipInfo,
            osdetails: osInfo,
            browserdetails: browserInfo
          }
         // console.log("datafinal - ",datafinal);
            setLoading(true);
            setPagemsg('Profile details updating');
            _post("Customer/SaveUser", datafinal)
            .then((res) => {
               // console.log(res);
                setLoading(false);
                savebankdetail();
                setUserInfo(res.data.result.fullname, res.data.result.shortname, res.data.result.verificationstatus);
                res.data.result ? (toast.success("Profile Updated Successfully."),push("/profile")) : toast.warn(res.data.resultmessage);
            }).catch((err) => {
                setLoading(false); 
                toast.error(err.message);
            });
        }
    },[formError, isSubmit]);

    const onInputmaxLength = (e) => {
        if(e.target.value.length > e.target.maxLength)
        {
          e.target.value = e.target.value.slice(0, e.target.maxLength);
        }
    }

    useEffect(() => {
        _get("/Payment/GetUserPayoutInfo?userid="+userID)
        .then((res) => {
            // console.log("bank update response - ", res);
            if(mounted2)
            {
              res.data.result.bankname !== null ? setBankname(res.data.result.bankname) : setBankname('');
              res.data.result.ifcscode !== null ? setIfsccode(res.data.result.ifcscode) : setIfsccode('');
              res.data.result.accountnumber !== null ? setAccountnumber(res.data.result.accountnumber) : setAccountnumber('');
              res.data.result.upicode!== null ? setUpicode(res.data.result.upicode) : setUpicode('');
              setPan(res.data.result.pan);
            }
        }).catch((error) => {
            console.log("GetUserPayoutInfo-", error); 
        });
        return () => { setMounted2(false); }
    }, []);

        const savebankdetail = () => 
        {
          const bankinfo = {
            userid: userID,
            bankname: bankname,
            ifcscode: ifsccode,
            accountnumber: accountnumber,
            upicode: upicode,
            aadhaar: userdata.aadhaarinfo,
            pan:pan,
            username: formValue.firstname + " " + formValue.lastname,
            rmn: userMobile,
            locationpage: "/bankdetailsupdate",
            ipaddress: ipInfo,
            osdetails: osInfo,
            browserdetails: browserInfo
          }
          // console.log(" bank update  -",bankinfo);
          _post("/Payment/UpdateUserPayoutInfo", bankinfo)
          .then((res) => {
             //  console.log("update bank details - ", res);
          }).catch((error) => {
              console.log(error); 
          });
        }
     
  return (
    <>
    <HeaderDashboard />
    <div className='screenmain'>
        <section className="screencontainer">
        <form onSubmit={handleSubmit}>
            <div className="registercontainer">
                <div className="registerHead">Update your profile</div>
                 
                
                <div className="registerField">
                    <div className="registertext">First Name - As per Aadhaar Card<small>*</small></div>
                    <input
                        className="registerinput"
                        type="text"
                        name="firstname"
                        maxLength={25}
                        onInput={onInputmaxLength}
                        value={ formValue.firstname  || ''  }
                        onChange={onChangeField}
                    />
                    <span className="registerError">{ formError.firstname  ?  formError.firstname : '' }</span>
                </div>

                <div className="registerField">
                    <div className="registertext">Last Name - As per Aadhaar Card<small>*</small></div>
                    <input
                        className="registerinput"
                        type="text"
                        name="lastname"
                        maxLength={25}
                        onInput={onInputmaxLength}
                        value={ formValue.lastname  || ''  }
                        onChange={onChangeField}
                    />
                   <span className="registerError">{formError.lastname  ?  formError.lastname : '' }</span>
                </div>
 
 
                <div className="registerField">
                      <div className="registertext">City of work area<small>*</small></div>
                      { data ? (
                      <ErrorBoundary>
                          <CitystateUpdateComponent scChange={handleOptionChange} nameSC={cityStateName} nameS={stateName} nameC={cityName} />
                      </ErrorBoundary>
                      ) : null }
                      {/* <div className="registerLineText">Enter State name to pick nearby City</div> */}
                </div>

                <div className="registerField">
                    <div className="registertext">Pincode of work area<small>*</small></div>
                    <input
                        className="registerinput"
                        type="number"
                        name="postalcode"
                        min="0"
                        maxLength={6}
                        onInput={onInputmaxLength}
                        value={ formValue.postalcode || '' }
                        onChange={onChangeField}
                    />
                    <span className="registerError">{ formError.postalcode  ?  formError.postalcode : '' }</span> 
                </div>

       
                <div className="registerSubmit">
                  <button className="register_button">Update</button>
                </div>
            </div>
        </form>
    </section>
    </div>
 
    <FooterComponent />

    <Loader showStatus={loading} message={pagemsg} />
    </>
  )
}

  
 
 