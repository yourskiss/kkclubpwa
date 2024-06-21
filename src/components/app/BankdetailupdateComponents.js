"use client";
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { _get, _post } from "@/config/apiClient";
import { getUserID, getUserMobile } from '@/config/userauth';
import Loader from '../shared/LoaderComponent';
import { ipaddress, osdetails, browserdetails  } from "../core/jio";
import HeaderDashboard from '../shared/HeaderDashboard';
import FooterComponent from '../shared/FooterComponent';

export default function BankdetailupdateComponents() {
    const [pagemsg, setPagemsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(true);
    const [mounted2, setMounted2] = useState(true);
 
    const [accountType, setAccountType] = useState('');
    const [infobank , setInfobank] = useState(false);
    const [infoupi , setInfoupi] = useState(false);
    const [infopersonal , setInfopersonal] = useState(false);
 
    const [errorBank, setErrorBank] = useState('');
    const [errorIfsc, setErrorIfsc] = useState('');
    const [errorAc, setErrorAc] = useState('');
    const [errorUpi, setErrorUpi] = useState('');
    const [errorPan, setErrorPan] = useState('');
    
    const [step, setStep] = useState(4);
    const [option, setOption] = useState('review');
    const[bankname,setBankname] = useState('');
    const[ifsccode,setIfsccode] = useState('');
    const[accountnumber,setAccountnumber] = useState('');
    const[upicode,setUpicode] = useState('');
    const[pan,setPan] = useState('');
    const[username,setUsername] = useState('');
    const[aadhaar,setAadhaar] = useState('');

 

    const userid = getUserID();
    const usermobile = getUserMobile();
    const { push } = useRouter();
    const ipInfo = ipaddress();
    const osInfo = osdetails();
    const browserInfo = browserdetails();


  useEffect(() => {
      _get("Customer/UserInfo?userid=0&phonenumber="+ usermobile)
      .then((res) => {
          // console.log("get---", res.data.result);
          if (mounted)
          {
            setUsername(`${res.data.result.firstname} ${res.data.result.lastname}`)
            setAadhaar(res.data.result.aadhaarinfo);
          }
      }).catch((err) => {
          console.log(err.message);
      });
      return () => { setMounted(false); }
  }, []);

    useEffect(() => {
        setLoading(true);
        setPagemsg('Bank details fetching');
        _get("/Payment/GetUserPayoutInfo?userid="+userid)
        .then((res) => {
            setLoading(false);
            // console.log("bank update response - ", res);
            if(mounted2)
            {
              res.data.result.bankname !== null ? setBankname(res.data.result.bankname) : setBankname('');
              res.data.result.ifcscode !== null ? setIfsccode(res.data.result.ifcscode) : setIfsccode('');
              res.data.result.accountnumber !== null ? setAccountnumber(res.data.result.accountnumber) : setAccountnumber('');
              res.data.result.upicode!== null ? setUpicode(res.data.result.upicode) : setUpicode('');
              setPan(res.data.result.pan);
              if(res.data.result.bankname  !== null && res.data.result.ifcscode !== null && res.data.result.accountnumber  !== null){setInfobank(true);}
              if(res.data.result.upicode !== null){setInfoupi(true); }
              setInfopersonal(true);
            }
        }).catch((error) => {
            setLoading(false);
            console.log("GetUserPayoutInfo-", error); 
        });
        return () => { setMounted2(false); }
    }, []);
 
 

const onInputmaxLength = (e) => {
  if(e.target.value.length > e.target.maxLength)
  {
    e.target.value = e.target.value.slice(0, e.target.maxLength);
  }
}
const changeAccountType = (val) => {
  setAccountType(val);
}
const stepHandler = (val) => {
  if(val ===  'bank') { setStep(1); setAccountType('bank'); setInfobank(false);  }
  if(val ===  'upi') { setStep(1); setAccountType('upi'); setInfoupi(false);  }
  if(val ===  'personal') { setStep(3); setInfopersonal(false); }
  if(val ===  'review') { setStep(4);  }
  setOption(val);
}

const handleBankInfo = (e) => {
  e.preventDefault();
  if(bankname === '') { setErrorBank('Bank Name is required');  return }
  else if(bankname?.length < 5) { setErrorBank('Bank Name length must be at least 5 characters long');  return }
  else if(ifsccode === '') { setErrorIfsc('IFSC Code is required');  return }
  else if(ifsccode?.length < 11) { setErrorIfsc('IFSC Code length must be at least 11 characters long');  return }
  else if(accountnumber === '') { setErrorAc('Account Number is required');  return }
  else { 
      setErrorBank('');
      setErrorIfsc('');
      setErrorAc('');
      setInfobank(true); 
      setOption('review');
      setStep(4);
    }
}
const handleUpiId = (e) => {
  e.preventDefault();
  if(upicode === '') { setErrorUpi('UPI ID is required');  return }
  else { 
    setErrorUpi('');
    setInfoupi(true);
    setOption('review');
    setStep(4);
  }
}
const handlePersonal= (e) => {
  e.preventDefault();
  if(pan === '') { setErrorPan('Pan Number is required');  return }
  else if(pan?.length !== 10) { setErrorPan('Pan Number must have 10 Digit');  return }
  else { 
      setErrorPan('');
      setInfopersonal(true);
      setOption('review');
      setStep(4);
    }
}

const reviewHandlar = (e) => {
  e.preventDefault();
  if(!infobank && !infoupi) { toast.error('Enter bank details/UPI ID'); return }
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
    aadhaar: aadhaar,
    pan:pan.trim(),
    username: username,
    rmn: usermobile,
    locationpage: "/bankdetailsupdate",
    ipaddress: ipInfo,
    osdetails: osInfo,
    browserdetails: browserInfo
  }
  // console.log(" bank update  -",bankinfo);

  setLoading(true);
  setPagemsg('Bank details updating');
  _post("/Payment/UpdateUserPayoutInfo", bankinfo)
  .then((res) => {
      setLoading(false);
      // console.log("update bank details - ", res);
      if(res.data.result === null)
      {
        toast.error(res.data.resultmessage);
      }
      else
      {
        toast.success("Bank Details Successfully updated."); 
        push('/dashboard');
      }
  }).catch((error) => {
      setLoading(false);
      console.log(error); 
  });
}
 

  return (<>
    <HeaderDashboard />
    <div className="screenmain"> 
        <div className="screencontainer">
            <div className='bankInfosavecontainer'>
              <h2>
                <em>Update Bank / UPI ID </em>
                <span>Please share Bank account or UPI details linked to your adhaar and PAN card. </span>
              </h2>  
                        
                 
              {
                step !== 4 && <ul>
                  <li className={ option==='bank' || option==='upi' ? 'active'  : null } onClick={()=>stepHandler('bank')}>Bank Details</li>
                  <li className='normal'><span>//</span></li>
                  <li className={ option==='personal' ? 'active' : null } onClick={()=>stepHandler('personal')}>Personal Details</li>
                </ul>
              }

                  { step === 1 && <div className="bankTypeField">
                      <h6>
                        <input id='accountBank' type='radio' name='accounttype' value='bank' checked={accountType === 'bank'} onChange={()=>changeAccountType('bank')} />
                        <label htmlFor="accountBank"><span>Add Bank Detail</span></label>
                      </h6>
                      <h6>
                        <input id='accountUpi' type='radio' name='accounttype' value='upi' checked={accountType === 'upi'} onChange={()=>changeAccountType('upi')}  />
                        <label htmlFor="accountUpi"><span>Add UPI ID</span></label>
                      </h6>
                  </div> } 
              
              { step === 1 && accountType === 'bank' && <form onSubmit={handleBankInfo}>
                  <div className="bankInfoField">
                      <p>Bank Name</p>
                      <input type='text' name="bankname" maxLength={50} autoComplete="off" value={bankname || ''} onInput={onInputmaxLength} onChange={(e)=>{setBankname(e.target.value); setErrorBank('');}} />
                      {errorBank && <span>{errorBank}</span> }
                  </div>
                  <div className="bankInfoField">
                      <p>IFSC Code</p>
                      <input type='text' name="ifsccode" maxLength={11} autoComplete="off" value={ifsccode || ''} onInput={onInputmaxLength}   onChange={(e)=>{setIfsccode(e.target.value); setErrorIfsc(''); }} />
                      {errorIfsc && <span>{errorIfsc}</span> }
                  </div>
                  <div className="bankInfoField">
                      <p>Account Number</p>
                      <input type='number' name="accountnumber" min="0" maxLength={16} autoComplete="off" value={accountnumber || ''} onInput={onInputmaxLength}   onChange={(e)=>{setAccountnumber(e.target.value); setErrorAc(''); }} />
                      {errorAc && <span>{errorAc}</span> }
                  </div>
                  <div className="bankInfoField">
                    <button className='bankinfobtn'>Next</button>
                  </div>
                </form> }


                { step === 1 && accountType === 'upi' && <form onSubmit={handleUpiId}>
                  <div className="bankInfoField">
                      <p>UPI ID</p>
                      <input type='text' name="upicode" maxLength={50} autoComplete="off" value={upicode || ''} onInput={onInputmaxLength}  onChange={(e)=>{setUpicode(e.target.value); setErrorUpi('')}} />
                      {errorUpi && <span>{errorUpi}</span>}
                  </div>
                  <div className="bankInfoField">
                    <button className='bankinfobtn'>Next</button>
                  </div>
                </form> }
 
                { step === 3 && <form onSubmit={handlePersonal}>
                  <div className="bankInfoField">
                      <p>Pan Number</p>
                      <input className='textUppercase' type='text' name="pan" maxLength={10} autoComplete="off" value={pan || ''} onInput={onInputmaxLength}  onChange={(e)=>{setPan(e.target.value); setErrorPan(''); }} />
                      {errorPan && <span>{errorPan}</span>}
                  </div>
                  <div className="bankInfoField">
                    <button className='bankinfobtn'>NEXT</button>
                  </div>
                </form> }

                
                { step === 4 && <>
                  { infobank  ? <>
                  <div className='bankinfo'>
                      <h4>
                          <Image src="/assets/images/icon_bank.png" width={25} height={25} quality={99} alt={bankname} />
                          <span>{bankname}</span>
                        </h4>
                        <h5>IFSC: {ifsccode}</h5>
                        <h6>A/c: {accountnumber}</h6> 
                        <aside onClick={()=>stepHandler('bank')} title="Edit">Edit</aside>
                  </div>
                  </>: <>
                  <div className='bankinfo'>
                    <h4>
                        <Image src="/assets/images/icon_bank.png" width={25} height={25} quality={99} alt={bankname} />
                        <small>Bank Details Not Added</small>
                    </h4>
                    <aside  onClick={()=>stepHandler('bank')} title="Edit">Add Bank Info</aside>
                  </div>
                  </>}


                  { infoupi ? <>
                  <div className='bankinfo'>
                     <h4>
                          <Image src="/assets/images/icon_upi.png" width={25} height={25} quality={99} alt={upicode} />
                          <span>{upicode}</span>
                      </h4>
                    <aside  onClick={()=>stepHandler('upi')} title="Edit">Edit</aside>
                  </div>
                  </> : <>
                  <div className='bankinfo'>
                    <h4>
                        <Image src="/assets/images/icon_upi.png" width={25} height={25} quality={99} alt={upicode} />
                        <small>UPI ID Not Added</small>
                    </h4>
                    <aside  onClick={()=>stepHandler('upi')} title="Edit">Add UPI ID</aside>
                  </div>
                  </>}


                  { infopersonal && <>
                  <div className='bankinfo'>
                    <h6>Full Name: <b className='textUppercase'>{username}</b></h6>   
                    <h6>Aadhaar Number: <b className='textUppercase'>{aadhaar}</b></h6> 
                    <h6>Mobile Number: <b className='textUppercase'>{usermobile}</b></h6>
                    <h6>Pan Number: <b className='textUppercase'>{pan}</b></h6> 
                    <aside  onClick={(e)=>stepHandler('personal')} title="Edit">Edit</aside>
                  </div>
                  </>}
 

                  <div className="bankInfoField">
                    <button className='bankinfobtn' onClick={reviewHandlar}>SAVE CHANGES</button>
                  </div>
                  

                  </> }

            </div>
        </div>
    </div>

    <FooterComponent />

 <Loader showStatus={loading}  message={pagemsg}  /> 
  </>)
}
