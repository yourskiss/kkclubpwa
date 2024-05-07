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
import HeaderAfterLogin from "../shared/HeaderAfterlogin";

export default function UpdateprofileComponent() {
    const[loading, setLoading] = useState(false);
    const { push } = useRouter();
    const userID = getUserID();
    const userMobile = getUserMobile();
    const ipInfo = ipaddress();
    const osInfo = osdetails();
    const browserInfo = browserdetails();
    const [userdata, setUserdata] = useState({});
  
    const [data, setData] = useState(false);
    const [formValue, setFormValue] = useState({});
    const [formError, setFormError] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);


    const [cityStateName, setCityStateName] = useState('');
    const [stateName, setStateName] = useState('');
    const [cityName, setCityName] = useState('');


    useEffect(() => {
        setLoading(true);
        _get("Customer/UserInfo?userid=0&phonenumber="+ userMobile)
        .then((res) => {
          //  console.log("get---", res.data.result);
            setLoading(false);
            setData(true);
            setUserdata(res.data.result);
            setCityStateName(`${res.data.result.city} (${res.data.result.state})`)
            setStateName(res.data.result.state);
            setCityName(res.data.result.city);
        }).catch((err) => {
            toast.warn(err.message);
            setLoading(false); 
        });
    }, []);
 
 
    useEffect(() => {
        setFormValue({
            'firstname':  userdata.firstname,
            'lastname':  userdata.lastname,
            'aadhaarinfo': userdata.aadhaarinfo,
            'postalcode':userdata.postalcode
        });
    }, [data]);

    const validateHandler =(val) =>{
        const error = {};
        if(val.firstname===''){error.firstname = "First name is required."}
        if(val.lastname===''){error.lastname = "Last name is required."}
        if(val.aadhaarinfo===''){error.aadhaarinfo = "Aadhaar is required."}
        else if(val.aadhaarinfo.length < 12){error.aadhaarinfo = "Aadhaar must have at least 12 Digit"}
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
        setFormValue({ ...formValue, [e.target.name] : e.target.value }); 
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
            aadhaarinfo: formValue.aadhaarinfo,
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
            _post("Customer/SaveUser", datafinal)
            .then((res) => {
               // console.log(res);
                setLoading(false);
                localStorage.setItem('userprofilesn', res.data.result.shortname);
                localStorage.setItem('userprofilename',  res.data.result.firstname + " " + res.data.result.lastname);
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
     
  return (
    <>
    <HeaderAfterLogin  backrouter="/profile" />
    <div className='screenmain'>
        <section className="screencontainer">
        <form onSubmit={handleSubmit}>
            <div className="registercontainer">
                <div className="registerHead">Update your profile</div>
                 
                
                <div className="registerField">
                    <div className="registertext">First name <small>*</small></div>
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
                    <div className="registertext">Last name <small>*</small></div>
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
                      <div className="registertext">Select City <small>*</small></div>
                      { data ? (
                      <ErrorBoundary>
                          <CitystateUpdateComponent scChange={handleOptionChange} nameSC={cityStateName} nameS={stateName} nameC={cityName} />
                      </ErrorBoundary>
                      ) : null }
                      <div className="registerLineText">Enter State name to pick nearby City</div>
                </div>

                <div className="registerField">
                    <div className="registertext">Aadhaar Number <small>*</small></div>
                    <input
                        className="registerinput"
                        type="number"
                        name="aadhaarinfo"
                        maxLength={12}
                        onInput={onInputmaxLength}
                        value={ formValue.aadhaarinfo || '' }
                        onChange={onChangeField}
                    />
                    <span className="registerError">{ formError.aadhaarinfo  ?  formError.aadhaarinfo : '' }</span> 
                </div>


                <div className="registerField">
                    <div className="registertext">Postal Code <small>*</small></div>
                    <input
                        className="registerinput"
                        type="number"
                        name="postalcode"
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
 


        { loading ? <Loader message="Getting response" /> : null }
    </>
  )
}

  
 
 