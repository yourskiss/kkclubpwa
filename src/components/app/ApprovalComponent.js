 "use client";
import Link from "next/link";
import Image from 'next/image';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import HeaderAfterLogin from "../shared/HeaderAfterlogin";

export default function ApprovalComponent() {
    const[username, setUsername] = useState('');
    const[usersn, setUsersn] = useState('');

    useEffect(() => {
        if (typeof localStorage !== 'undefined') 
        {
            setUsername(localStorage.getItem('userprofilename'));
            setUsersn(localStorage.getItem('userprofilesn'));
        } 
    }, []);

    var settingsApproval = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };
 
  return (
    <>
    <HeaderAfterLogin  backrouter="/dashboard" />
    <div className="screenmain"> 
        <div className="screencontainer">
                <div className="approvalcontainer">
                        <dl>
                            <dt>
                                <aside><span>{usersn}</span></aside>
                            </dt>
                            <dd>
                                <p>
                                    <span><b>{username}</b>,</span>
                                    <span>your request has gone for further approval.</span>
                                </p>
                            </dd>
                        </dl>    
 
                        
                        <section>
                            <h2>PRODUCT CATEGORIES</h2>
                            <h3>We have the right solution for every building-related problem</h3>
                            <Slider className="pc_slider" {...settingsApproval}>
                                <div className="pc_item">
                                    <Image src="/assets/images/product-categories/pc1.jpg" width={100} height={100} alt="product" quality={99} />
                                    <p>Waterproofing</p>
                                </div>
                                <div className="pc_item">
                                    <Image src="/assets/images/product-categories/pc2.png" width={100} height={100} alt="product" quality={99} />
                                    <p>Waterproofing</p>
                                </div>
                                <div className="pc_item">
                                    <Image src="/assets/images/product-categories/pc3.png" width={100} height={100} alt="product" quality={99} />
                                    <p>Waterproofing</p>
                                </div>
                                <div className="pc_item">
                                    <Image src="/assets/images/product-categories/pc4.jpg" width={100} height={100} alt="product" quality={99} />
                                    <p>Waterproofing</p>
                                </div>
                            </Slider>
                        </section>
                </div>
            </div>
      </div>
    </>
  )
}
