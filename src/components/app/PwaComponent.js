"use client";
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { motion } from "framer-motion";

export default function PwaComponent() {
    const[installModal, setInstallModal] = useState(false);
    const[pmtEvt, setPmtEvt] = useState(null);
 
    useEffect(()=> {
        const handalbeforeinstallprompt = (evt) => {
          evt.preventDefault();
          setPmtEvt(evt);
          if(!window.matchMedia('(display-mode:standalone)').matches)
          {
            setInstallModal(true);
          }
        }
        if(Cookies.get('pwarequest') === undefined || Cookies.get('pwarequest') === 'undefined') 
        { 
          window.addEventListener("beforeinstallprompt",handalbeforeinstallprompt); 
        }
        return () => {  window.removeEventListener("beforeinstallprompt",handalbeforeinstallprompt); }
    },[]);


    const handalCancel = (e) => {
      e.preventDefault();
      setInstallModal(false);
      Cookies.set('pwarequest',  true, { expires: new Date(new Date().getTime() + 300000), secure: true });
      window.location.reload();
    }
    const handalInstall = (e) => {
      e.preventDefault();
        if(pmtEvt)
        {
            pmtEvt.prompt();
            pmtEvt.userChoice.then(function(choiceResult)
            {
                if(choiceResult.outcome==="dismissed")
                {
                  //  toast.info("Installation Cancelled.");
                    Cookies.set('pwarequest',  true, { expires: new Date(new Date().getTime() + 300000), secure: true });
                    window.location.reload();
                }
                else
                {
                    toast.success("Installation Successfully.");
                }     
            });
            setPmtEvt(null);
            setInstallModal(false);
        }
    }




  return (<>{ installModal && <div className="pwaPromptPopup">
  <motion.div initial={{ y: "0" }} animate={{  y: "100px" }} transition={{ duration: 2, delay: 3, origin: 1, ease: [0, 0.71, 0.2, 1.01] }}> 
    <section>
      <div className="pwaPromptContainer">
          <Image src="/assets/images/icons/pwa-prompt.png" width={100} height={100} alt="logo" quality={99}  />
          <h2>
              Kerakoll Club
              <span>Get our app. It won't take up space on your phone</span>
          </h2>
      </div>

        <p>
            <button id="pwaInstall" className="pwaPromptButton" onClick={handalInstall}>Install</button>
            <button id="pwaCancel" className="pwaPromptButton pwacancelBtn"  onClick={handalCancel}>Not Now</button>
        </p>
    </section>
  </motion.div>
</div> }</>)
}


 