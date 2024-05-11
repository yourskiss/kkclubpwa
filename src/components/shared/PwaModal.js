"use client";
import { motion } from "framer-motion";
import Image from 'next/image';



export default function PwaModal({showhide, onClose, onInstall}) {
    return (<>{ showhide && <div className="pwaPromptPopup" id="pwaPromptPopup">
        <motion.div initial={{ y: "0" }} animate={{  y: "100px" }} transition={{ duration: 2, delay: 0, origin: 1, ease: [0, 0.71, 0.2, 1.01] }}> 
          <section>
            <div className="pwaPromptContainer">
                <Image src="/assets/images/icons/pwa-prompt.png" width={100} height={100} alt="logo" quality={99}  />
                <h2>
                    Kerakoll Club
                    <span>Get our app. It won't take up space on your phone</span>
                </h2>
            </div>

              <p>
                  <button id="pwaInstall" className="pwaPromptButton" onClick={onInstall}>Install</button>
                  <button id="pwaCancel" className="pwaPromptButton pwacancelBtn"  onClick={onClose}>Not Now</button>
              </p>
          </section>
        </motion.div>
      </div> }</>)
  }
  