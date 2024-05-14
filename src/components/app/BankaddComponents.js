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
    const [step, setStep] = useState(1);
    const [infobank , setInfobank] = useState(false);
    const [infoupi , setInfoupi] = useState(false);
    const [infopersonal , setInfopersonal] = useState(false);

    const [option, setOption] = useState('bank');
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
        if(bankname === '') { toast.error('Bank Name is required'); }
        else if(bankname.length <= 4) { toast.error('Bank Name length must be at least 5 characters long'); }
        else if(ifsccode === '') { toast.error('IFSC Code is required'); }
        else if(ifsccode.length <= 10) { toast.error('IFSC Code length must be at least 11 characters long'); }
        else if(accountnumber === '') { toast.error('Account Number is required'); }
        else { 
          setInfobank(true); 
          setOption('upi');
          setStep(2); 
        }
    }
 
    const handleUpiId = (e) => {
      e.preventDefault();
      if(upicode === '') { toast.error('UPI ID is required'); }
      else { 
        setInfoupi(true);
        setOption('personal');
        setStep(3);
      }
    }
    const handlePersonal = (e) => {
      e.preventDefault();
        const regexMobile = /^[6789][0-9]{9}$/i;
        if(username === '') { toast.error('Name is required'); }
        else if(rmn === '') { toast.error('RMN is required'); }
        else if(rmn.length !== 10) { toast.error('RMN must have 10 Digit'); }
        else if(!regexMobile.test(rmn)){toast.error("Invalid mobile number!");}
        else if(aadhaar === '') { toast.error('Aadhaar number is required'); }
        else if(aadhaar.length !== 12) { toast.error('Aadhaar number must have 12 Digit'); }
        else if(pan === '') { toast.error('Pan Number is required'); }
        else if(pan.length !== 10) { toast.error('Pan Number must have 10 Digit'); }
        else { 
          setInfopersonal(true);
          setOption('review');
          setStep(4);
        }
    }

    const reviewHandlar = (e) => {
      e.preventDefault();
      if(!infobank) { toast.error('Bank details is required'); stepHandler('bank') }
      else if(!infoupi) { toast.error('UPI ID is required'); stepHandler('upi') }
      else if(!infopersonal) { toast.error('Personal infomation is required'); stepHandler('personal') }
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
                      <input type='text' name="bankname" maxLength={50} autoComplete="off" value={bankname} onInput={onInputmaxLength} onChange={(e)=>setBankname(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                      <p>IFSC Code</p>
                      <input type='text' name="ifsccode" maxLength={11} autoComplete="off" value={ifsccode} onInput={onInputmaxLength}  onChange={(e)=>setIfsccode(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                      <p>Account Number</p>
                      <input type='number' name="accountnumber" min="0" maxLength={16} autoComplete="off" value={accountnumber} onInput={onInputmaxLength}  onChange={(e)=>setAccountnumber(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                    <button>CONTINUE</button>
                  </div>
                </form>  }


                { step === 2 && <form onSubmit={handleUpiId}>
                  <div className="bankInfoField">
                      <p>UPI ID</p>
                      <input type='text' name="upicode" maxLength={50} autoComplete="off" value={upicode} onInput={onInputmaxLength}  onChange={(e)=>setUpicode(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                    <button>CONTINUE</button>
                  </div>
                </form> }


                { step === 3 && <form onSubmit={handlePersonal}>
 
                  <div className="bankInfoField">
                      <p>Full Name</p>
                      <input type='text' name="username" maxLength={50} autoComplete="off" value={username} onInput={onInputmaxLength}  onChange={(e)=>setUsername(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                      <p>RMN</p>
                      <input type='number' name="rmn" min="0" maxLength={10} autoComplete="off" value={rmn} onInput={onInputmaxLength}  onChange={(e)=>setRmn(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                      <p>Aadhaar Number</p>
                      <input type='number' name="aadhaar" min="0" maxLength={12} autoComplete="off" value={aadhaar} onInput={onInputmaxLength}  onChange={(e)=>setAadhaar(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                      <p>Pan Number</p>
                      <input type='text' name="pan" maxLength={10} autoComplete="off" value={pan} onInput={onInputmaxLength}  onChange={(e)=> setPan(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                    <button>CONTINUE & REVIEW</button>
                  </div>
                </form> }

                
                { step === 4 && <>
                  <div className='bankinfo'>
                      <h4>
                          <Image src="/assets/images/icon_bank.png" width={25} height={25} quality={99} alt={bankname} />
                          <span>{bankname}</span>
                        </h4>
                        <h5>IFSC: {ifsccode}</h5>
                        <h6>A/c: {accountnumber}</h6> 
                        <aside onClick={(e)=>stepHandler('bank')} title="Edit">Edit</aside>
                  </div>

                  <div className='bankinfo'>
                     <h4>
                          <Image src="/assets/images/icon_upi.png" width={25} height={25} quality={99} alt={upicode} />
                          <span>{upicode}</span>
                      </h4>
                    <aside  onClick={(e)=>stepHandler('upi')} title="Edit">Edit</aside>
                  </div>

                  <div className='bankinfo'>
                    <h6>Name: <b>{username}</b></h6>
                    <h6>RMN: <b>{rmn}</b></h6> 
                    <h6>Aadhaar: <b>{aadhaar}</b></h6> 
                    <h6>Pan: <b>{pan}</b></h6> 
                    <aside  onClick={(e)=>stepHandler('personal')} title="Edit">Edit</aside>
                  </div>


                  
                  <div className="bankInfoField">
                    <button onClick={reviewHandlar}>Save</button>
                  </div>
                  </> }
              
            </div>
        
        </div>
    </div>
    
    <Loader showStatus={loading}  message={pagemsg} />
</>)
}
