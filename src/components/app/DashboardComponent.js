"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import CountUp from 'react-countup';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HeaderDashboard from '../shared/HeaderDashboard';
import Loader from '../shared/LoaderComponent';
import { _get } from "@/config/apiClient";

import PwaModal from "../shared/PwaModal";
import PwaIOS from "../shared/PwaIOS";
import Link from 'next/link';

 
const DashboardComponent = () => {
    const [pagemsg, setPagemsg] = useState('');
    const [loading, setLoading] = useState(false);

    const [mounted2, setMounted2] = useState(true);

    const[productimg, setProductimg] = useState({});

    const[userstatus, setUserstatus] = useState('');

    const { push } = useRouter();
    const rewardspoints = parseInt(TotalrewardpointsComponent());
    const redeemminimumpoint = parseInt(process.env.NEXT_PUBLIC_REDEEM_MIN_POINT);
    const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

 
    useEffect(() => {
        if (typeof localStorage !== 'undefined') 
        {
            setUserstatus(localStorage.getItem('verificationstatus'));
        } 
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


  useEffect(() => {
    setLoading(true);
    setPagemsg('Fatching products');
    _get("/Cms/ProductBannerImage?section=dashboard")
    .then((res) => {
        setLoading(false);
       // console.log("ProductBannerImage - ", res);
        if (mounted2)
        {
            setProductimg(res.data.result);
        }
    }).catch((error) => {
        setLoading(false);
       console.log("ProductBannerImage-",error); 
    });
  return () => { setMounted2(false); }
}, []);
 
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
                {  
                               productimg && productimg.map && productimg.map((val) => <div className="db_item" key={val.bannerid}>
                                    <aside><img src={`${imageUrl}${val.imagepath}`}   alt={val.alternativetext} /></aside>
                                    <Link href={val.hyperlink} target='_blank'>
                                        <span>Learn more</span>
                                        <Image src="/assets/images/arrows.png" width={45} height={14} alt="product" quality={99} />
                                    </Link>
                                </div>) 
                }
                </Slider>
            </div>


      </div>
    </div> 

    <Loader showStatus={loading}  message={pagemsg} />                       
    <PwaModal />
    <PwaIOS />
  </>)
}
export default DashboardComponent;  