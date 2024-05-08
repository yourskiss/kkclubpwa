"use client";
import Image from 'next/image';
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
    const [step, setStep] = useState(0);
    const [option, setOption] = useState('');
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
    const ipInfo = ipaddress();
    const osInfo = osdetails();
    const browserInfo = browserdetails();

    useEffect(() => {
        setLoading(true);
        _get("/Payment/GetUserPayoutInfo?userid="+userid)
        .then((res) => {
            setLoading(false);
          //  console.log("bank update response - ", res);
            setBankname(res.data.result.bankname);
            setIfsccode(res.data.result.ifcscode);
            setAccountnumber(res.data.result.accountnumber);
            setUpicode(res.data.result.upicode);
            setAadhaar(res.data.result.aadhaar);
            setPan(res.data.result.pan);
            setUsername(res.data.result.username);
            setRmn(res.data.result.rmn);
        }).catch((error) => {
            setLoading(false);
            toast.info(error); 
        });
    }, []);
 
    useEffect(() => {
        if(upicode !== '')
        {
            setStep(2);
            setOption('upi');
        }
        else
        {
          setStep(1);
          setOption('bank');
        }
    }, [upicode]); 

const onInputmaxLength = (e) => {
  if(e.target.value.length > e.target.maxLength)
  {
    e.target.value = e.target.value.slice(0, e.target.maxLength);
  }
}
const editHandler = () => {
  if(option === 'bank') { setStep(1); }
  if(option === 'upi') { setStep(2); }
}
const stepHandler = (val) => {
  if(val ===  'bank') { setStep(1);  }
  if(val ===  'upi') { setStep(2);  }
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
      setStep(3); 
     // setUpicode('');
    }
}
const handleUpiId = (e) => {
  e.preventDefault();
  if(upicode === '') { toast.error('UPI ID is required'); }
  else { 
    setStep(3);
   // setBankname('');
   // setIfsccode('');
   // setAccountnumber(''); 
  }
}
const handleSubmit= (e) => {
  e.preventDefault();
    if(username === '') { toast.error('Name is required'); }
    else if(rmn === '') { toast.error('RMN is required'); }
    else if(rmn.length !== 10) { toast.error('RMN must have 10 Digit'); }
    else if(aadhaar === '') { toast.error('Aadhaar number is required'); }
    else if(aadhaar.length !== 12) { toast.error('Aadhaar number must have 12 Digit'); }
    else if(pan === '') { toast.error('Pan Number is required'); }
    else if(pan.length !== 10) { toast.error('Pan Number must have 10 Digit'); }
    else { 
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
    locationpage: "/bankdetailsupdate",
    ipaddress: ipInfo,
    osdetails: osInfo,
    browserdetails: browserInfo
  }
  // console.log(" bank update  -",bankinfo);

  setLoading(true);
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
        push('/profile');
      }
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
                <em>Update Bank / UPI ID </em>
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</span>
              </h2>  
                        
                 
              {
                step === 3 ? null : (<ul>
                  <li className={ option==='bank' ? 'active' : null } onClick={()=>stepHandler('bank')}>Add Bank Info</li>
                  <li><span>OR</span></li>
                  <li className={ option==='upi' ? 'active' : null } onClick={()=>stepHandler('upi')}>Add UPI ID</li>
                </ul>) 
              }
              
              { step === 1 ? (<form onSubmit={handleBankInfo}>
                  <div className="bankInfoField">
                      <p>Bank Name</p>
                      <input type='text' name="bankname" maxLength={50} autoComplete="off" value={bankname || ''} onInput={onInputmaxLength} onChange={(e)=>setBankname(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                      <p>IFSC Code</p>
                      <input type='text' name="ifsccode" maxLength={11} autoComplete="off" value={ifsccode || ''} onInput={onInputmaxLength}  onChange={(e)=>setIfsccode(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                      <p>Account Number</p>
                      <input type='number' name="accountnumber" maxLength={16} autoComplete="off" value={accountnumber || ''} onInput={onInputmaxLength}  onChange={(e)=>setAccountnumber(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                    <button>CONTINUE</button>
                  </div>
                </form>) : null }


                { step === 2 ? (<form onSubmit={handleUpiId}>
                  <div className="bankInfoField">
                      <p>UPI ID</p>
                      <input type='text' name="upicode" maxLength={50} autoComplete="off" value={upicode || ''} onInput={onInputmaxLength}  onChange={(e)=>setUpicode(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                    <button>CONTINUE</button>
                  </div>
                </form>): null }


                { step === 3 ? (<form onSubmit={handleSubmit}>
                  <div className='bankinfo'>
                    {
                      option === 'bank' ? <>
                        <h4>
                          <Image src="/assets/images/icon_bank.png" width={25} height={25} quality={99} alt={bankname  || ''} />
                          <span>{bankname  || ''}</span>
                        </h4>
                        <h5>IFSC: {ifsccode  || ''}</h5>
                        <h6>A/c: {accountnumber  || ''}</h6>
                      </> : <h4>
                          <Image src="/assets/images/icon_upi.png" width={25} height={25} quality={99} alt={upicode  || ''} />
                          <span>{upicode}</span>
                        </h4>
                    }
                    <aside onClick={editHandler} title="Edit">Edit</aside>
                  </div>

                  <div className="bankInfoField">
                      <p>Full Name</p>
                      <input type='text' name="username" maxLength={50} autoComplete="off" value={username || ''} onInput={onInputmaxLength}  onChange={(e)=>setUsername(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                      <p>RMN</p>
                      <input type='number' name="rmn" maxLength={10} autoComplete="off" value={rmn || ''} onInput={onInputmaxLength}  onChange={(e)=>setRmn(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                      <p>Aadhaar Number</p>
                      <input type='number' name="aadhaar" maxLength={12} autoComplete="off" value={aadhaar || ''} onInput={onInputmaxLength}  onChange={(e)=>setAadhaar(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                      <p>Pan Number</p>
                      <input type='text' name="pan" maxLength={10} autoComplete="off" value={pan || ''} onInput={onInputmaxLength}  onChange={(e)=> setPan(e.target.value)} />
                  </div>
                  <div className="bankInfoField">
                    <button>Update</button>
                  </div>
                </form>) : null }

                


            </div>
        </div>
    </div>
  { loading ? <Loader message="Bank infomation updating" /> : null }
  </>)
}
