"use client";
import Image from 'next/image';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import Rewardform from '../shared/Rewardform';
import { useEffect, useState } from 'react';
import { _get } from "@/config/apiClient";
import { getUserID } from '@/config/userauth';
import Loader from '../shared/LoaderComponent';
import HeaderDashboard from '../shared/HeaderDashboard';

export default function RedeempointsComponents() {
    const [pagemsg, setPagemsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultcode, setResultcode] = useState('');
    const rewardspoints = TotalrewardpointsComponent();
    const userid = getUserID();
    const { push } = useRouter();

    useEffect(() => {
       // setLoading(true);
       // setPagemsg('Validating bank information');
        _get("/Payment/GetUserPayoutInfo?userid="+userid)
        .then((res) => {
          //  setLoading(false);
          //  console.log("User payout info - ", res);
            setResultcode(res.data.resultcode);
        }).catch((error) => {
         //   setLoading(false);
            toast.info(error); 
        });
    }, []);

 
    useEffect(() => {
        resultcode === '' || resultcode === 0 ? null : push('/bankdetailsadd?q=1')
     }, [resultcode]);

  return (<>
    <HeaderDashboard />
    <div className="screenmain redeemscreen"> 
        <div className="screencontainer">

            <div className='redeemcontainer'>
                <Image className='rdm_1' src="/assets/images/v3.png" width={95} height={95} alt="redeem img" quality={99} />
                <Image className='rdm_2' src="/assets/images/v3.png" width={95} height={95} alt="redeem img" quality={99} />
                <Image className='rdm_3' src="/assets/images/V2.png" width={95} height={95} alt="redeem img" quality={99} />
                <Image className='rdm_4' src="/assets/images/V2.png" width={95} height={95} alt="redeem img" quality={99} />

                <aside>
                    <Image src="/assets/images/redeem.png" width={459} height={448} alt="redeem img" quality={99} />
                </aside>
                <h2>Redeem your points</h2>
                <h3><CountUp duration={2} start={0}  delay={1} end={rewardspoints} /> <b>Points</b> </h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,<br /> sed do eiusmod tempor incididunt</p>
            </div>
            
            <Rewardform />
            
        
        </div>

    
        <div className="profile_logobottom">
            <Image src="/assets/images/logo.png" width={448} height={80} alt="logo" quality={100} />
        </div>

    </div>

   <Loader showStatus={loading} message={pagemsg} />  
</>)
}
