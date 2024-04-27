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


const DashboardComponent = () => {
    const[userstatus, setUserstatus] = useState('');
  const { push } = useRouter();
  const rewardspoints = TotalrewardpointsComponent();


  useEffect(() => {
    if (typeof localStorage !== 'undefined') 
    {
        setUserstatus(localStorage.getItem('verificationstatus'));
    } 
  }, []);

  const redeemprompt = () => {
    if(userstatus === "PENDING")
    {
        toast.success('Points will redeem after profile approval.'); 
    }
    else if(userstatus === "APPROVE" && rewardspoints < 150)
    {
        toast.success('You can redeem Min. 150 Points.'); 
    }
    
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
              <section onClick={()=> push("/scanqrcode")}>
                    <aside><Image className='dashboard_scan_img' src="/assets/images/dash-qr.png" width={100} height={100} alt="qr" quality={100} /></aside>
                    <h2>Scan QR Code</h2>
                    <p>FOR YOUR KERAKOLL PRODUCTS</p>
              </section>
              <section className='dashboard_redeempointbg' onClick={ rewardspoints >= 150 &&  userstatus === "APPROVE" ? ()=> push("/redeempoints") : redeemprompt }>
                    <aside ><Image src="/assets/images/redeempoints.png" width={99} height={115} alt="redeempoints" quality={100} /></aside>
                    <h5><CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> <em>pt</em></h5>
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
                        <h2>
                            <span>Learn more</span>
                            <Image src="/assets/images/arrows.png" width={57} height={18} alt="product" quality={99} />
                        </h2>
                    </div>
                    <div className="db_item">
                        <aside><Image src="/assets/images/products/img.png" width={500} height={500} alt="product" quality={99} /></aside>
                        <h2>
                            <span>Learn more</span>
                            <Image src="/assets/images/arrows.png" width={57} height={18} alt="product" quality={99} />
                        </h2>
                    </div>
                    <div className="db_item">
                        <aside><Image src="/assets/images/products/img.png" width={500} height={500} alt="product" quality={99} /></aside>
                        <h2>
                            <span>Learn more</span>
                            <Image src="/assets/images/arrows.png" width={57} height={18} alt="product" quality={99} />
                        </h2>
                    </div>
                    <div className="db_item">
                        <aside><Image src="/assets/images/products/img.png" width={500} height={500} alt="product" quality={99} /></aside>
                        <h2>
                            <span>Learn more</span>
                            <Image src="/assets/images/arrows.png" width={57} height={18} alt="product" quality={99} />
                        </h2>
                    </div>                
                </Slider>
            </div>


      </div>
    </div> 

  </>)
}
export default DashboardComponent;  