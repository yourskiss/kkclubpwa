"use client";
import Image from 'next/image';

export default function Homevideo({showhide}) {
  console.log(showhide);
  return(<>
  {!showhide && <video autoPlay muted playsInline style={{ width: '308px', height: '58px' }} poster="/assets/images/logo.png">
    <source src="/assets/videos/homevideo-unit.mp4" type="video/mp4" /></video> }
    {showhide && <Image src="/assets/images/logo.png" width={384} height={69} alt="Logo" quality={99} /> }
  </>);
   
}