"use client";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { _get, _post } from "@/config/apiClient";
import { getUserID } from '@/config/userauth';
import Loader from '../shared/LoaderComponent';
import { ipaddress, osdetails, browserdetails  } from "../core/jio";
import HeaderAfterLogin from '../shared/HeaderAfterlogin';

export default function BankdetailupdateComponents() {
    const [loading, setLoading] = useState(false);
    const [userdata, setUserdata] = useState({});
    const [data, setData] = useState(false);
    const [formValue, setFormValue] = useState({});
    const [formError, setFormError] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const userid = getUserID();
    const { push } = useRouter();
    const ipInfo = ipaddress();
    const osInfo = osdetails();
    const browserInfo = browserdetails();

    useEffect(() => {
        setLoading(true);
        _get("/Payment/GetUserPayoutInfo?userid="+userid)
        .then((res) => {
            setLoading(false);
           // console.log(" response - ", res);
            setData(true);
            setUserdata(res.data.result);

        }).catch((error) => {
            setLoading(false);
            toast.info(error); 
        });
    }, []);



    useEffect(() => {
      setFormValue({
        'bankname': userdata.bankname,
        'ifsccode': userdata.ifcscode,
        'accountnumber': userdata.accountnumber,
        'upicode': userdata.upicode,
        'aadhaar': userdata.aadhaar,
        'pan': userdata.pan,
        'username': userdata.username,
        'rmn': userdata.rmn,
      });
  }, [data]);

  const validateHandler =(val) =>{
    const error = {};
    if(val.bankname === '') {  error.bankname ='Bank Name is required' }
    else if(val.ifsccode === '') { error.ifsccode ='IFSC Code is required'}
    else if(val.ifsccode.length !== 11) { error.ifsccode ='IFSC must have at least 11 Characters'}
    else if(!val.accountnumber) { error.accountnumber ='Account Number is required' }
    else if(!val.upicode) {error.upicode ='UPI ID is required' }
    else if(!val.aadhaar) {error.aadhaar ='Aadhaar number is required' }
    else if(val.aadhaar.length !== 12) {  error.aadhaar ='Aadhaar must have at least 12 Characters' }
    else if(!val.pan) { error.pan ='Pan Number is required' }
    else if(val.pan.length !== 10) { error.pan ='Pan must have at least 10 Characters' }
    else if(!val.username) { error.username ='Name is required' }
    else if(!val.rmn) { error.rmn ='RMN is required' }
    else if(val.rmn.length !== 10) { error.rmn ='RMN must have at least 10 Digit' }
    return error;
}
const handleSubmit = (e) =>{
  e.preventDefault();
  setFormError(validateHandler(formValue));
  setIsSubmit(true);
 // console.log("formValue on submit", formValue);
}
const onChangeField = (e) => { 
  setFormValue({ ...formValue, [e.target.name] : e.target.value }); 
}
const onInputmaxLength = (e) => {
  if(e.target.value.length > e.target.maxLength)
  {
    e.target.value = e.target.value.slice(0, e.target.maxLength);
  }
}
useEffect(()=>{
  if(Object.keys(formError).length === 0 && isSubmit)
  {
    const bankinfo = {
      userid: userid,
      bankname: formValue.bankname.trim(),
      ifcscode: formValue.ifsccode.trim(),
      accountnumber: formValue.accountnumber.trim(),
      upicode: formValue.upicode.trim(),
      aadhaar: formValue.aadhaar.trim(),
      pan: formValue.pan.trim(),
      username: formValue.username.trim(),
      rmn: formValue.rmn.trim(),
      locationpage: "/bankdetailupdate",
      ipaddress: ipInfo,
      osdetails: osInfo,
      browserdetails: browserInfo
    }
   // console.log("update bank details -",bankinfo);
    setLoading(true);
    _post("/Payment/UpdateUserPayoutInfo", bankinfo)
    .then((res) => {
        setLoading(false);
     //   console.log("Response after save bank details - ", res);
        toast.success("Bank Details Successfully updated."); 
        push('/profile');
    }).catch((error) => {
        setLoading(false);
        toast.info(error); 
    });
  }
},[formError, isSubmit]);


 

  return (<>
    <HeaderAfterLogin backrouter="/profile" />
    <div className="screenmain"> 
        <div className="screencontainer">
            <div className='bankInfosavecontainer'>
                <h2>
                <em>Update Bank Details</em>
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</span>
                </h2>  
                        
                <form onSubmit={handleSubmit}>
                    <div className="bankInfoField">
                        <p>Bank Name</p>
                        <input type='text' name="bankname" maxLength={50} autoComplete="off" value={formValue.bankname || ''} onChange={onChangeField} onInput={onInputmaxLength} />
                        { formError.bankname  ? <span>{formError.bankname}</span> : null }
                    </div>
                    <div className="bankInfoField">
                        <p>IFSC Code</p>
                        <input type='text' name="ifsccode" maxLength={11} autoComplete="off" value={formValue.ifsccode || ''} onChange={onChangeField} onInput={onInputmaxLength} />
                        { formError.ifsccode  ? <span>{formError.ifsccode}</span> : null }
                    </div>
                    <div className="bankInfoField">
                        <p>Account Number</p>
                        <input type='number' name="accountnumber" maxLength={16} autoComplete="off" value={formValue.accountnumber || ''} onChange={onChangeField} onInput={onInputmaxLength} />
                        { formError.accountnumber  ? <span>{formError.accountnumber}</span> : null }
                    </div>
                    <div className="bankInfoField">
                        <p>UPI ID</p>
                        <input type='text' name="upicode" maxLength={50} autoComplete="off" value={formValue.upicode || ''} onChange={onChangeField} onInput={onInputmaxLength} />
                        { formError.upicode  ? <span>{formError.upicode}</span> : null }
                    </div>
                    <div className="bankInfoField">
                        <p>Aadhaar Number</p>
                        <input type='number' name="aadhaar" maxLength={12} autoComplete="off" value={formValue.aadhaar || ''} onChange={onChangeField} onInput={onInputmaxLength} />
                        { formError.aadhaar  ? <span>{formError.aadhaar}</span> : null }
                    </div>
                    <div className="bankInfoField">
                        <p>Pan Number</p>
                        <input type='text' name="pan" maxLength={10} autoComplete="off" value={formValue.pan || ''} onChange={onChangeField} onInput={onInputmaxLength} /> 
                        { formError.pan  ? <span>{formError.pan}</span> : null }
                    </div>
                    <div className="bankInfoField">
                        <p>Name in Bank Account</p>
                        <input type='text' name="username" maxLength={50} autoComplete="off" value={formValue.username || ''} onChange={onChangeField} onInput={onInputmaxLength} />
                        { formError.username  ? <span>{formError.username}</span> : null }
                    </div>
                    <div className="bankInfoField">
                        <p>RMN with Bank Account</p>
                        <input type='number' name="rmn" maxLength={10} autoComplete="off" value={formValue.rmn || ''} onChange={onChangeField} onInput={onInputmaxLength} />
                        { formError.rmn  ? <span>{formError.rmn}</span> : null }
                    </div>
                    <div className="bankInfoField">
                        <button>Update Bank Details</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  { loading ? <Loader message="Bank infomation updating" /> : null }
  </>)
}
