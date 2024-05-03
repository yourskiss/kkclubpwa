"use client";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { _get, _post } from "@/config/apiClient";
import { getUserID } from '@/config/userauth';
import Loader from '../shared/LoaderComponent';
import { ipaddress, osdetails, browserdetails  } from "../core/jio";
import HeaderAfterLogin from '../shared/HeaderAfterlogin';

export default function BankdetailupdateComponents() {
    const[userdata, setUserdata] = useState({});
    const [loading, setLoading] = useState(false);
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
            setUserdata(res.data.result);
        }).catch((error) => {
            setLoading(false);
            toast.info(error); 
        });
    }, []);


    const { register, handleSubmit, formState: { errors } } = useForm();
    const handleError = (errors) => { };
  
    const onInputmaxLength = (e) => {
      if(e.target.value.length > e.target.maxLength)
      {
        e.target.value = e.target.value.slice(0, e.target.maxLength);
      }
    }
  
    const registerOptions = {
      bankname : { required: "Please validate Bank Name" },
      ifsccode: { required: "Please validate IFSC Code" },
      accountnumber: { required: "Please validate Account Number" },
      upicode: { required: "Please validate UPI ID" },
      aadhaar: {
        required: "Please validate Aadhaar number",
        minLength: { value: 12, message: "Aadhaar must have at least 12 Digit" },
        maxLength: { value: 12, message: "Aadhaar not more then 12 Digit" },
        pattern: { value: /^[0-9]{12}$/i, message: "Invalid Aadhaar" }
      },
      pan: { 
        required: "Please validate Pan Number",
        minLength: { value: 10, message: "Pan Number must have at least 10 Digit" },
      },
      username: { required: "Please validate Name" },
      rmn: {
        required: "Please validate RMN",
        minLength: { value: 10, message: "RMN must have at least 10 Digit" },
        maxLength: { value: 10, message: "RMN not more then 10 Digit" },
        pattern: { value: /^[6-9]{1}[0-9]{9}$/i, message: "Invalid RMN" }
      }
    }
 
    const handleRegistration = (data) => 
    {
      
      const bankinfo = {
        userid: userid,
        bankname: data.bankname.trim(),
        ifcscode: data.ifsccode.trim(),
        accountnumber: data.accountnumber.trim(),
        upicode: data.upicode.trim(),
        aadhaar: data.aadhaar.trim(),
        pan:data.pan.trim(),
        username: data.username.trim(),
        rmn: data.rmn.trim(),
        locationpage: "/bankdetailupdate",
        ipaddress: ipInfo,
        osdetails: osInfo,
        browserdetails: browserInfo
      }
    //  console.log("update bank details -",bankinfo);
      setLoading(true);
      _post("/Payment/UpdateUserPayoutInfo", bankinfo)
      .then((res) => {
          setLoading(false);
         // console.log("Response after save bank details - ", res);
          toast.success("Bank Details Successfully updated."); 
          push('/profile');
      }).catch((error) => {
          setLoading(false);
          toast.info(error); 
      });
    }


  return (<>
    <HeaderAfterLogin backrouter="/profile" />
    <div className="screenmain"> 
        <div className="screencontainer">
            <div className='bankInfosavecontainer'>
                <h2>
                <em>Update Bank Details</em>
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</span>
                </h2>  
                <form onSubmit={handleSubmit(handleRegistration, handleError)}>
                    <div className="bankInfoField">
                        <p>Bank Name</p>
                        <input type='text' name="bankname" maxLength={50} autoComplete="off" defaultValue={userdata.bankname} onInput={onInputmaxLength} {...register('bankname', registerOptions.bankname)} />
                        {errors?.bankname && <span> {errors.bankname.message}</span> } 
                    </div>
                    <div className="bankInfoField">
                        <p>IFSC Code</p>
                        <input type='text' name="ifsccode" maxLength={20} autoComplete="off" defaultValue={userdata.ifcscode} onInput={onInputmaxLength} {...register('ifsccode', registerOptions.ifsccode)} />
                        {errors?.ifsccode && <span> {errors.ifsccode.message}</span> } 
                    </div>
                    <div className="bankInfoField">
                        <p>Account Number</p>
                        <input type='number' name="accountnumber" maxLength={20} autoComplete="off" defaultValue={userdata.accountnumber} onInput={onInputmaxLength} {...register('accountnumber', registerOptions.accountnumber)} />
                        {errors?.accountnumber && <span> {errors.accountnumber.message}</span> } 
                    </div>
                    <div className="bankInfoField">
                        <p>UPI ID</p>
                        <input type='text' name="upicode" maxLength={25} autoComplete="off" defaultValue={userdata.upicode} onInput={onInputmaxLength} {...register('upicode', registerOptions.upicode)} />
                        {errors?.upicode && <span> {errors.upicode.message}</span> } 
                    </div>
                    <div className="bankInfoField">
                        <p>Aadhaar Number</p>
                        <input type='number' name="aadhaar" maxLength={12} autoComplete="off" defaultValue={userdata.aadhaar} onInput={onInputmaxLength} {...register('aadhaar', registerOptions.aadhaar)} />
                        {errors?.aadhaar && <span> {errors.aadhaar.message}</span> } 
                    </div>
                    <div className="bankInfoField">
                        <p>Pan Number</p>
                        <input type='text' name="pan" maxLength={10} autoComplete="off" defaultValue={userdata.pan} onInput={onInputmaxLength} {...register('pan', registerOptions.pan)} />
                        {errors?.pan && <span> {errors.pan.message}</span> } 
                    </div>
                    <div className="bankInfoField">
                        <p>Name in Bank Account</p>
                        <input type='text' name="username" maxLength={50} autoComplete="off" defaultValue={userdata.username} onInput={onInputmaxLength} {...register('username', registerOptions.username)} />
                        {errors?.username && <span> {errors.username.message}</span> } 
                    </div>
                    <div className="bankInfoField">
                        <p>RMN with Bank Account</p>
                        <input type='number' name="rmn" maxLength={10} autoComplete="off" defaultValue={userdata.rmn} onInput={onInputmaxLength} {...register('rmn', registerOptions.rmn)} />
                        {errors?.rmn && <span> {errors.rmn.message}</span> } 
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
