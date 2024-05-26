"use client";
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { setPwaIos, isPwaIos } from '@/config/pwa';
 
export default function PwaIOS () {
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);


  useEffect(() => {
    const getAgent = window.navigator.userAgent.toLowerCase();
    const isIOS =  /iphone|ipad|ipod/.test(getAgent);
    const notInstalled = !window.navigator.standalone;
    const lastPrompt = isPwaIos();  
    if(isIOS && notInstalled && !lastPrompt) 
    {
      setShouldShowPrompt(true);
    }
  }, []);

  const promptInstall = () => {
    setPwaIos(true);
    setShouldShowPrompt(false);
   // window.location.reload();
  };

 
  return (<ErrorBoundary>
    { shouldShowPrompt && <div className='pwaIsoPrompt'>
    <motion.div initial={{ opacity: 0 }}  whileInView={{ opacity: 1 }} transition={{ duration: 1, delay: 0, origin: 1, ease: [0, 0.71, 0.2, 1.01] }}>
        <section>
          <h2>
            <span>Add to Home Screen</span>
            <button onClick={promptInstall}>Close</button>
          </h2>
          <p>This website has app functionality. Add it to your home screen to use it in fullscreen and while offline.</p>
          <ul>
            <li>
              <img src='/assets/images/icon_share.png' alt='Share' /><span>1) Press the 'Share' button</span>
            </li>
            <li>
              <img src='/assets/images/icon_home.png' alt='Add to Home Screen' /><span>2) Press 'Add to Home Screen'</span>
            </li>
          </ul>
        </section>
      </motion.div>
    </div> }
    </ErrorBoundary>)
};

 