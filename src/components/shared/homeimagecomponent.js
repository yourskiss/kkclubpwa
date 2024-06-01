"use client";
import Image from 'next/image';
export default function HomeImageComponent({showhide}) {
  return (<>
   { showhide &&  <Image src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={99} /> }
    </>)
}
