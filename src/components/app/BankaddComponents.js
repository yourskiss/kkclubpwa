"use client";
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { _get, _post } from "@/config/apiClient";
import { getUserID } from '@/config/userauth';
import Loader from '../shared/LoaderComponent';
import { ipaddress, osdetails, browserdetails  } from "../core/jio";
import HeaderDashboard from '../shared/HeaderDashboard';
 
export default function BankaddComponents() {
    const [backroutepath, setbackroutepath] = useState('');
    const [pagemsg, setPagemsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [infobank, setInfobank] = useState(false);
    const [infoupi, setInfoupi] = useState(false);
    const [infopersonal, setInfopersonal] = useState(false); 

    const [errorBank, setErrorBank] = useState('');
    const [errorIfsc, setErrorIfsc] = useState('');
    const [errorAc, setErrorAc] = useState('');
    const [errorUpi, setErrorUpi] = useState('');
    const [errorName, setErrorName] = useState('');
    const [errorRmn, setErrorRmn] = useState('');
    const [errorAadhaar, setErrorAadhaar] = useState('');
    const [errorPan, setErrorPan] = useState('');

    const [step, setStep] = useState(1);
    const[option, setOption] = useState('bank');
    const[bankname,setBankname] = useState('');
    const[ifsccode,setIfsccode] = useState('');
    const[accountnumber,setAccountnumber] = useState('');
    const[upicode,setUpicode] = useState('');
    const[aadhaar,setAadhaar] = useState('');
    const[pan,setPan] = useState('');
    const[username,setUsername] = useState('');
    const[rmn,setRmn] = useState('');

     

    const userid = getUserID();
    const { push } = useRouter();
    const searchParams = useSearchParams()
    const ipInfo = ipaddress();
    const osInfo = osdetails();
    const browserInfo = browserdetails();

    const getpathfrom = searchParams.get('q') ?? "0";
    useEffect(()=>{
      getpathfrom === '1' || getpathfrom === 1 ? setbackroutepath('/redeempoints') : setbackroutepath('/dashboard')
    },[backroutepath]);
    
    const onInputmaxLength = (e) => {
      if(e.target.value.length > e.target.maxLength)
      {
        e.target.value = e.target.value.slice(0, e.target.maxLength);
      }
    }
 
    const stepHandler = (val) => {
      if(val ===  'bank') { setStep(1); setInfobank(false); }
      if(val ===  'upi') { setStep(2); setInfoupi(false); }
      if(val ===  'personal') { setStep(3); setInfopersonal(false); }
      if(val ===  'review') { setStep(4);  }
      setOption(val);
    }
    const handleBankInfo = (e) => {
      e.preventDefault();
        if(bankname === '') { setErrorBank('Bank Name is required');  return }
        else if(bankname?.length < 5) { setErrorBank('Bank Name length must be at least 5 characters long');  return }
        else if(ifsccode === '') { setErrorIfsc('IFSC Code is required');  return }
        else if(ifsccode?.length < 10) { setErrorIfsc('IFSC Code length must be at least 11 characters long');  return }
        else if(accountnumber === '') { setErrorAc('Account Number is required');  return }
        else { 
          setErrorBank('');
          setErrorIfsc('');
          setErrorAc('');
          setInfobank(true); 
          setOption('upi');
          setStep(2); 
        }
    }
  

    const handleUpiId = (e) => {
      e.preventDefault();
      if(upicode === '') { setErrorUpi('UPI ID is required');  return }
      else { 
        setErrorUpi('');
        setInfoupi(true);
        setOption('personal');
        setStep(3);
      }
    }
    const handlePersonal = (e) => {
      e.preventDefault();
        const regexMobile = /^[6789][0-9]{9}$/i;
        if(username === '') { setErrorName('Name is required');  return }
        else if(rmn === '') { setErrorRmn('Mobile number is required');  return }
        else if(rmn?.length !== 10) { setErrorRmn('Mobile number must have 10 Digit');  return }
        else if(!regexMobile.test(rmn)){ setErrorRmn("Invalid mobile number!");  return }
        else if(aadhaar === '') { setErrorAadhaar('Aadhaar number is required');  return }
        else if(aadhaar?.length !== 12) { setErrorAadhaar('Aadhaar number must have 12 Digit');  return }
        else if(pan === '') { setErrorPan('Pan Number is required');  return }
        else if(pan?.length !== 10) { setErrorPan('Pan Number must have 10 Digit'); return }
        else { 
          setErrorName('');
          setErrorRmn('');
          setErrorAadhaar('');
          setErrorPan('');
          setInfopersonal(true);
          setOption('review');
          setStep(4);
        }
    }



    const bankSkipHandal = (e) => {
      e.preventDefault();
      setErrorBank('');
      setErrorIfsc('');
      setErrorAc('');
      setInfobank(false); 
      setBankname('');
      setIfsccode('');
      setAccountnumber('');
      setOption('upi');
      setStep(2);
    } 
    const upiSkipHandal = (e) => {
      e.preventDefault();
      setErrorUpi('');
      setInfoupi(false);
      setUpicode('');
      setOption('personal');
      setStep(3);
    } 

    const reviewHandlar = (e) => {
      e.preventDefault();
      if(!infobank && !infoupi) { toast.error('Bank/upi details is required');  return }
      else if(!infopersonal) { toast.error('Personal infomation is required'); stepHandler('personal');  return }
      else
      {
        savebankdetail();
      }
    } 


    const savebankdetail = () => 
    {
      const bankinfo = {
        userid: userid,
        bankname: bankname.trim(),
        ifcscode: ifsccode.trim(),
        accountnumber: accountnumber.trim(),
        upicode: upicode.trim(),
        aadhaar: aadhaar.trim(),
        pan:pan.trim(),
        username: username.trim(),
        rmn: rmn.trim(),
        locationpage: "/bankdetailsadd",
        ipaddress: ipInfo,
        osdetails: osInfo,
        browserdetails: browserInfo
      }
      // console.log(" bank details -",bankinfo);
      setLoading(true);
      setPagemsg('Bank details saving');
      _post("/Payment/SaveUserPayoutInfo", bankinfo)
      .then((res) => {
          setLoading(false);
         // console.log("save bank details - ", res);
         if(res.data.result === null)
          {
            toast.error(res.data.resultmessage);
          }
          else
          {
            toast.success("Bank Details Successfully save."); 
            push(backroutepath);
          }
      }).catch((error) => {
          setLoading(false);
          toast.info(error); 
      });
    }
  


 
  return (<>
    <HeaderDashboard />

    <div className="screenmain"> 
        <div className="screencontainer">

            <div className='bankInfosavecontainer'>
              <h2>
                <em>Add Bank / UPI ID</em>
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</span>
              </h2> 
              {
                step !== 4 && <ul>
                  <li className={ option==='bank' ? 'active' : infobank ? 'activated' : null } onClick={()=>stepHandler('bank')}>Bank Details</li>
                  <li className='normal'><span>//</span></li>
                  <li className={ option==='upi' ? 'active' :  infoupi ? 'activated' : null } onClick={()=>stepHandler('upi')}>UPI ID</li>
                  <li className='normal'><span>//</span></li>
                  <li className={ option==='personal' ? 'active' : infopersonal ? 'activated' : null } onClick={()=>stepHandler('personal')}>Personal Details</li>
                </ul>
              }
 
              { step === 1 && <form onSubmit={handleBankInfo}>
                  <div className="bankInfoField">
                      <p>Bank Name</p>
                      <input type='text' name="bankname" maxLength={50} autoComplete="off" value={bankname} onInput={onInputmaxLength} onChange={(e)=>{setBankname(e.target.value); setErrorBank('');}} />
                      {errorBank && <span>{errorBank}</span> }
                  </div>
                  <div className="bankInfoField">
                      <p>IFSC Code</p>
                      <input type='text' name="ifsccode" maxLength={11} autoComplete="off" value={ifsccode} onInput={onInputmaxLength}  onChange={(e)=>{setIfsccode(e.target.value); setErrorIfsc(''); }} />
                      {errorIfsc && <span>{errorIfsc}</span> }
                  </div>
                  <div className="bankInfoField">
                      <p>Account Number</p>
                      <input type='number' name="accountnumber" min="0" maxLength={16} autoComplete="off" value={accountnumber} onInput={onInputmaxLength}  onChange={(e)=>{setAccountnumber(e.target.value); setErrorAc(''); }} />
                      {errorAc && <span>{errorAc}</span> }
                  </div>
                  <div className="bankInfoField"> 
                    <button>Next</button>
                    <aside onClick={bankSkipHandal}>Skip</aside>
                  </div>
                </form>  }

                { step === 2 && <form onSubmit={handleUpiId}>
                  <div className="bankInfoField">
                      <p>UPI ID</p>
                      <input type='text' name="upicode" maxLength={50} autoComplete="off" value={upicode} onInput={onInputmaxLength}  onChange={(e)=>{setUpicode(e.target.value); setErrorUpi('')}} />
                      {errorUpi && <span>{errorUpi}</span>}
                  </div>
                  <div className="bankInfoField">
                    <button>Next</button>
                    {infobank ? <aside onClick={upiSkipHandal}>Skip</aside> : <aside onClick={()=>stepHandler('bank')}>Back</aside>}
                  </div>
                </form> }

                 

                { step === 3 && <form onSubmit={handlePersonal}>
                  <div className="bankInfoField">
                      <p>Full Name</p>
                      <input type='text' name="username" maxLength={50} autoComplete="off" value={username} onInput={onInputmaxLength}  onChange={(e)=>{setUsername(e.target.value); setErrorName('');}} />
                      {errorName && <span>{errorName}</span>}
                  </div>
                  <div className="bankInfoField">
                      <p>Mobile Number</p>
                      <input type='number' name="rmn" min="0" maxLength={10} autoComplete="off" value={rmn} onInput={onInputmaxLength}  onChange={(e)=>{setRmn(e.target.value); setErrorRmn(''); }} />
                      {errorRmn && <span>{errorRmn}</span>}
                  </div>
                  <div className="bankInfoField">
                      <p>Aadhaar Number</p>
                      <input type='number' name="aadhaar" min="0" maxLength={12} autoComplete="off" value={aadhaar} onInput={onInputmaxLength}  onChange={(e)=>{setAadhaar(e.target.value); setErrorAadhaar(''); }} />
                      {errorAadhaar && <span>{errorAadhaar}</span>}
                  </div>
                  <div className="bankInfoField">
                      <p>Pan Number</p>
                      <input type='text' name="pan" maxLength={10} autoComplete="off" value={pan} onInput={onInputmaxLength}  onChange={(e)=>{setPan(e.target.value); setErrorPan(''); }} />
                      {errorPan && <span>{errorPan}</span>}
                  </div>
                  <div className="bankInfoField">
                    <button>NEXT</button>
                    <aside onClick={()=>stepHandler('upi')}>Back</aside>
                  </div>
                </form> }

                
                { step === 4 && <>

                 { infobank  && <>
                  <div className='bankinfo'>
                      <h4>
                          <Image src="/assets/images/icon_bank.png" width={25} height={25} quality={99} alt={bankname} />
                          <span>{bankname}</span>
                        </h4>
                        <h5>IFSC: {ifsccode}</h5>
                        <h6>A/c: {accountnumber}</h6> 
                        <aside onClick={()=>stepHandler('bank')} title="Edit">Edit</aside>
                  </div>
                  </>}


                  { infoupi && <>
                  <div className='bankinfo'>
                     <h4>
                          <Image src="/assets/images/icon_upi.png" width={25} height={25} quality={99} alt={upicode} />
                          <span>{upicode}</span>
                      </h4>
                    <aside  onClick={()=>stepHandler('upi')} title="Edit">Edit</aside>
                  </div>
                  </>}

                  { infopersonal && <>
                  <div className='bankinfo'>
                    <h6>Name: <b>{username}</b></h6>
                    <h6>Mobile Number: <b>{rmn}</b></h6> 
                    <h6>Aadhaar Number: <b>{aadhaar}</b></h6> 
                    <h6>Pan Number: <b>{pan}</b></h6> 
                    <aside  onClick={()=>stepHandler('personal')} title="Edit">Edit</aside>
                  </div>
                  </>}

                  
                  <div className="bankInfoField">
                    <button className='bankinfobtn' onClick={reviewHandlar}>SAVE</button>
                  </div>
                  </> }
              
            </div>
        
        </div>
    </div>
    
    <Loader showStatus={loading}  message={pagemsg} />
</>)
}
