"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HeaderDashboard from '../shared/HeaderDashboard';
import { getUserMobile } from '@/config/userauth';
import { _get } from "@/config/apiClient";
import Loader from "../shared/LoaderComponent";

const DashboardComponent = () => {
    const [loading, setLoading] = useState(false);
    const[userstatus, setUserstatus] = useState('');
    const { push } = useRouter();
    const userMobile = getUserMobile();
    const rewardspoints = parseInt(TotalrewardpointsComponent());
    const redeemminimumpoint = process.env.NEXT_PUBLIC_REDEEM_MIN_POINT;
 
    useEffect(() => {
        setLoading(true);
        _get("Customer/UserInfo?userid=0&phonenumber="+ userMobile)
        .then((res) => {
            setLoading(false);
           // console.log(" response - ", res);
           localStorage.setItem("userprofilename",res.data.result.fullname);
           localStorage.setItem("userprofilesn",res.data.result.shortname);
           localStorage.setItem("verificationstatus",res.data.result.verificationstatus);
           setUserstatus(localStorage.getItem('verificationstatus'));
        }).catch((error) => {
            setLoading(false);
            toast.info(error); 
        });
      }, []);

  const redeemprompt = () => {
    if(userstatus === "PENDING")
    {
        push("/approval");
        return
    }
    if(userstatus === "APPROVE" && rewardspoints <= redeemminimumpoint)
    {
        toast.info(`You can redeem minimum ${redeemminimumpoint} reward points.`); 
        return
    }
    push("/redeempoints");
  }
 
  var settingsDashboard = {
    dots: true,
    arrows:false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    centerMode: false,
    centerPadding: '5px',
    responsive: [
      {
        breakpoint: 599,
        settings: {slidesToShow: 1,}
      }
    ]
  };

 
  return (<>
    <HeaderDashboard />
    <div className="screenmain screendashboard"> 
      <div className="screencontainer">
   
          <div className="dashboard_earned_point">
                <h2>You’ve earned</h2>
                <p><CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /></p>
                <dl>
                    <dd><Image className='dashStar1' src="/assets/images/dash-start.png" width={64} height={64} alt="star" quality={100} /></dd>
                    <dt>
                        <Image className='dashStar2' src="/assets/images/dash-start.png" width={24} height={24} alt="star" quality={100} />
                        <br />
                        <Image className='dashStar3' src="/assets/images/dash-start.png" width={30} height={30} alt="star" quality={100} />
                        <em>reward<br />points</em>
                    </dt>
                    
                </dl>
          </div>
          <div className="dashboard_content">
              <section className='dashboard_scanbg' onClick={()=> push("/scanqrcode")}>
                    <aside><Image className='dashboard_scan_img' src="/assets/images/dash-qr.png" width={100} height={100} alt="qr" quality={100} /></aside>
                    <h2>Scan QR Code</h2>
                    <p>FOR YOUR KERAKOLL PRODUCTS</p>
              </section>
              <section className='dashboard_redeempointbg' onClick={redeemprompt }>
                    <aside ><Image src="/assets/images/redeempoints.png" width={99} height={115} alt="redeempoints" quality={100} /></aside>
                    <h5><CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> <em>Points</em></h5>
                    <h2>Redeem Points</h2>
                    <p>IN YOUR CLUB WALLET</p>
              </section>
          </div>
        </div>
    </div>
    <div className="screenmain screendashboardbottom"> 
        <div className="screencontainer">

            <div className="dashboard_products">
                <h2>Earn rewards on every purchase</h2>
                <Slider className="dashboard_slider" {...settingsDashboard}>
                    <div className="db_item">
                        <aside><Image src="/assets/images/products/img.png" width={500} height={500} alt="product" quality={99} /></aside>
                        <p>
                            <span>Learn more</span>
                            <Image src="/assets/images/arrows.png" width={45} height={14} alt="product" quality={99} />
                        </p>
                    </div>
                    <div className="db_item">
                        <aside><Image src="/assets/images/products/img.png" width={500} height={500} alt="product" quality={99} /></aside>
                        <p>
                            <span>Learn more</span>
                            <Image src="/assets/images/arrows.png" width={45} height={14} alt="product" quality={99} />
                        </p>
                    </div>
                    <div className="db_item">
                        <aside><Image src="/assets/images/products/img.png" width={500} height={500} alt="product" quality={99} /></aside>
                        <p>
                            <span>Learn more</span>
                            <Image src="/assets/images/arrows.png" width={45} height={14} alt="product" quality={99} />
                        </p>
                    </div>
                    <div className="db_item">
                        <aside><Image src="/assets/images/products/img.png" width={500} height={500} alt="product" quality={99} /></aside>
                        <p>
                            <span>Learn more</span>
                            <Image src="/assets/images/arrows.png" width={45} height={14} alt="product" quality={99} />
                        </p>
                    </div>                
                </Slider>
            </div>


      </div>
    </div> 


    { loading ? <Loader message="Details updating" /> : null }
  </>)
}
export default DashboardComponent;  