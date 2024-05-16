"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default function PwaIOS () {
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const notInstalled = !window.navigator.standalone;
    const lastPrompt = localStorage.getItem('lastPrompt');
    const daysSinceLastPrompt = lastPrompt ? (new Date() - new Date(lastPrompt)) / (1000 * 60 * 60 * 24) : null;

    console.log("isIOS-",isIOS," /// notInstalled-",notInstalled," /// lastPrompt-",lastPrompt," /// daysSinceLastPrompt-",daysSinceLastPrompt);

    if (isIOS && notInstalled && (daysSinceLastPrompt === null || daysSinceLastPrompt > 1)) {
      setShouldShowPrompt(true);
    }

    
  }, []);

  const promptInstall = () => {
    // Custom logic to show your install prompt
 
    localStorage.setItem('lastPrompt', new Date().toISOString());
    setShouldShowPrompt(false);
  };

 
  return (<ErrorBoundary>
    { shouldShowPrompt && <div className='pwaIsoPrompt'>
      <motion.div initial={{ opacity: '0' }} animate={{  opacity: '1' }} transition={{ duration: 3, delay: 0, origin: 1, ease:'easeIn' }}> 
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

 