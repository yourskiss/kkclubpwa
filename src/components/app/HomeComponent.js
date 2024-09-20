"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCouponeCode, isCouponeCode } from "@/config/validecoupone";
import { isBearerToken, setBearerCookies  } from '@/config/bearerauth';
import { isUserToken } from '@/config/userauth';
 
export default function HomeComponent({btkn}) {
  const [bt, setBT] = useState(0);
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const getqrcode = searchParams.get('code');
  const isCC = isCouponeCode();
  const isBT = isBearerToken();
  const isUT = isUserToken();
 
  useEffect(() => {
    console.log(btkn.value);
    if(btkn.value !== '' || btkn.value !== undefined) { setBearerCookies(btkn.value);  }
    if(getqrcode !== null) { setCouponeCode(getqrcode); }
  }, [getqrcode]);

  useEffect(() => {
    if(!isBT)
    {
        setBT(1);
        setTimeout(function(){ window.location.reload(); }, 3000);
    }
    else
    {
        setBT(2);
        if(!isUT)
        {
          push("/login");
          return 
        }
        else
        {
            if(isCC) 
            { 
              push("/getcoupone"); 
              return 
            }
            else
            { 
              push("/dashboard");
              return 
            }
        }
    }
  },[]);

  
  
  return (<>
      <div className="videoloader">
        <div className='videoconainer'>
      
       { bt === 2 ? <Image src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={99} /> : null }
       { bt === 1 ? <video autoPlay muted playsInline style={{ width: '308px', height: '58px' }} poster="/assets/images/logo.png">
          <source src="/assets/videos/homevideo-unit.mp4" type="video/mp4" />
        </video> : null }

        </div>
    </div>
  </>);
}
 