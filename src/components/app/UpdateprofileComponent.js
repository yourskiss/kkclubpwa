"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Loader from "../shared/LoaderComponent";
import { getUserID, getUserMobile } from "@/config/userauth";
import { toast } from 'react-toastify';
import { ipaddress, osdetails, browserdetails  } from "../core/jio";
import CitystateUpdateComponent from "../shared/CitystateUpdateComponent";
import { _get, _post } from "@/config/apiClient";
import HeaderDashboard from "../shared/HeaderDashboard";
import FooterComponent from "../shared/FooterComponent";
import { setUserInfo } from "@/config/userinfo";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default function UpdateprofileComponent() {
    const [pagemsg, setPagemsg] = useState('');
    const[loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(true);
    const [mounted2, setMounted2] = useState(true);
    const [mounted3, setMounted3] = useState(true);

    const [seList, setSeList] = useState([]);
    
    const [data, setData] = useState(false);
    const [formValue, setFormValue] = useState({});
    const [formError, setFormError] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const[allName, setAllName] = useState('');

    const [cityStateName, setCityStateName] = useState('');
    const [stateName, setStateName] = useState('');
    const [cityName, setCityName] = useState('');

    const [payoutinfo,setPayoutinfo] = useState({})
    const [userdata, setUserdata] = useState({});
    
    const { push } = useRouter();
    const userID = getUserID();
    const userMobile = getUserMobile();
    const ipInfo = ipaddress();
    const osInfo = osdetails();
    const browserInfo = browserdetails();
    
    const exceptThisSymbols = ["e", "E", "+", "-", "."];
        

    useEffect(() => {
        setLoading(true);
        setPagemsg('Profile details fetching');
        _get("Customer/UserInfo?userid=0&phonenumber="+ userMobile)
        .then((res) => {
          //  console.log("onload get data: ", res.data.result);
            setLoading(false);
            if (mounted)
            {
                setData(true);
                setUserdata(res.data.result);
                
                setCityStateName(`${res.data.result.city} (${res.data.result.state})`)
                setStateName(res.data.result.state);
                setCityName(res.data.result.city);

                setAllName(res.data.result.fullname);

                setExcutiveID(res.data.result.agentcode);
            }
        }).catch((err) => {
            console.log(err.message);
            setLoading(false); 
        });
        return () => { setMounted(false); }
    }, []);
    
 
    useEffect(() => {
        setFormValue({
            'agentcode': userdata.agentcode,
            'firstname':  userdata.firstname,
            'lastname':  userdata.lastname,
            'postalcode':userdata.postalcode
        });
    }, [data]);

    const validateHandler =(val) =>{
        const error = {};
        if(val.agentcode !=='' && val.agentcode.length !== 4){ error.agentcode = "Please enter valid Sales Executive ID.";  }
        if(val.firstname===''){error.firstname = "First name is required."}
      //  if(val.lastname===''){error.lastname = "Last name is required."}
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
 
     

     const onInputmaxLength = (e) => {
            if(e.target.name === 'postalcode')
            {
                if(e.target.value.length > e.target.maxLength)
                {
                  e.target.value = e.target.value.replace(/[e\+\-\.]/gi, "").slice(0, e.target.maxLength);
                }
                else
                {
                  e.target.value = e.target.value.replace(/[e\+\-\.]/gi, "")
                }
            }
            else
            {
                if(e.target.value.length > e.target.maxLength)
                {
                  e.target.value = e.target.value.slice(0, e.target.maxLength);
                }
            }
    }

    const onChangeField = (e) => { 
        if(e.target.name === 'firstname' || e.target.name === 'lastname')
        {
            setFormValue({ ...formValue, [e.target.name] : e.target.value.replace(/[^a-z]/gi, '') }); 
        }
        else if(e.target.name === 'agentcode')
        {
            setFormValue({ ...formValue, [e.target.name] : e.target.value });
            if(e.target.value.length > 0)
            {
                setFormError({...formError, [e.target.name] : "" });
            }
        }
        else if(e.target.name === 'postalcode')
        {
            setFormValue({ ...formValue, [e.target.name] : e.target.value.replace(/[^0-9]/gi, '') }); 
        }
        else
        {
            setFormValue({ ...formValue, [e.target.name] : e.target.value });
        }
         
    }
    useEffect(()=>{
        if(Object.keys(formError).length === 0 && isSubmit)
        {
            if(formValue.lastname === '')
            {
                setAllName(formValue.firstname);
            }
            else
            {
                setAllName(formValue.firstname + " " + formValue.lastname);
            }

           const datafinal = 
           {
            userid: userID,
            firstname: formValue.firstname,
            lastname: formValue.lastname,
            fullname: allName,
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
            agentcode: formValue.agentcode,
            locationpage: "/update-profile",
            ipaddress: ipInfo,
            osdetails: osInfo,
            browserdetails: browserInfo
          }
          // console.log("datafinal: ",datafinal);
            setLoading(true);
            setPagemsg('Profile details updating');
            _post("Customer/SaveUser", datafinal)
            .then((res) => {
              //  console.log("after submit response: ",res);
                setLoading(false);
                setUserInfo(res.data.result.fullname, res.data.result.shortname, res.data.result.verificationstatus);
                updatebankdetail();
                res.data.result ? (toast.success("Profile Updated Successfully."),push("/profile")) : toast.warn(res.data.resultmessage);
            }).catch((err) => {
                setLoading(false); 
                toast.error(err.message);
            });
        }
    },[formError, isSubmit]);



    useEffect(() => {
        _get("/Payment/GetUserPayoutInfo?userid="+userID)
        .then((res) => {
            // console.log("bank update response - ", res);
            if(mounted2)
            {
                setPayoutinfo(res.data.result);
            }
        }).catch((error) => {
            console.log("update - GetUserPayoutInfo-", error); 
        });
        return () => { setMounted2(false); }
    }, []);


        const updatebankdetail = () => 
        {
          const bankinfo = {
            userid: userID,
            bankname: payoutinfo.bankname || '',
            ifcscode: payoutinfo.ifsccode || '',
            accountnumber: payoutinfo.accountnumber || '',
            upicode: payoutinfo.upicode || '',
            aadhaar: userdata.aadhaarinfo || '',
            pan:payoutinfo.pan || '',
            username: allName || '',
            rmn: userMobile,
            locationpage: "/bankdetailsupdate",
            ipaddress: ipInfo,
            osdetails: osInfo,
            browserdetails: browserInfo
          }
           // console.log(" bank update  -",bankinfo);
          _post("/Payment/UpdateUserPayoutInfo", bankinfo)
          .then((res) => {
             console.log("update -  UpdateUserPayoutInfo status", res.status);
          }).catch((error) => {
              console.log(error); 
          });
        }


        useEffect(() => {
            _get("Cms/SEAgentCode")
            .then((res) => {
               // console.log("se id list - ", res);
                if(mounted3)
                {
                    setSeList(res.data.result);
                } 
            }).catch((err) => {
                console.log("StateCity add - ", err.message);
            });
          return () => { setMounted3(false); }
        }, []); 

 
        const handalonKeyup = (e) => {
           // debugger;
            if(e.target.value.length === 4)
            {
                setLoading(true);
                setPagemsg('Validating Sales Executive ID.');
                const filteredResults = filterArrayByInput(seList, e.target.value);
                console.log(filteredResults);
                if(filteredResults === 0)
                {
                    setTimeout(function(){setLoading(false); }, 500);
                    setFormError({...formError, [e.target.name] : "Invalid Sales Executive ID" });
                    setFormValue({ ...formValue, [e.target.name] : '' });
                }
                else 
                {
                    setTimeout(function(){setLoading(false); }, 500);
                    setFormError({...formError, [e.target.name] : "" });
                    setFormValue({ ...formValue, [e.target.name] : e.target.value });
                }
            }
        }
        function filterArrayByInput(datafromAPI, searchValue) {
            const filteredData = datafromAPI.filter(value => {
                const searchStr = searchValue.toUpperCase();
                const nameMatches = value.agentcode.toUpperCase().includes(searchStr);
                return nameMatches;
            });   
            return filteredData.length;
        }

  return (
    <>
      <ErrorBoundary>
        <HeaderDashboard />
      </ErrorBoundary>
    <div className='screenmain'>
        <section className="screencontainer">
        <form onSubmit={handleSubmit}>
            <div className="registercontainer">
                <div className="registerHead">Update your profile</div>


                <div className="registerField">
                    <div className="registertext">Sales Executive ID</div>
                    <input
                        className="registerinput"
                        type="text"
                        name="agentcode"
                        maxLength={4}
                        onInput={onInputmaxLength}
                        value={ formValue.agentcode || '' }
                        onChange={onChangeField}
                        onKeyUp={handalonKeyup}
                    />
                    <span className="registerError">{ formError.agentcode  ?  formError.agentcode : '' }</span>
                </div>

 
                
                <div className="registerField">
                    <div className="registertext">First Name - As per PAN Card<small>*</small></div>
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
                    <div className="registertext">Last Name - As per PAN Card </div>
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
                        onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault() }
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

  
 
 