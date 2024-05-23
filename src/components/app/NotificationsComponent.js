"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { _get, _post } from "@/config/apiClient";
import { getUserID } from '@/config/userauth';
import { ipaddress, osdetails, browserdetails  } from "../core/jio";
import Loader from '../shared/LoaderComponent';
import { isUserToken, isBearerToken } from '@/config/userauth';

export default function NotificationsComponent() {
  const [pagemsg, setPagemsg] = useState('');
  const[loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [mounted2, setMounted2] = useState(true);
  const[notificationCount, setNotificationCount] = useState(0);
  const [notifyList, setNotifyList] = useState({});
  const Router = useRouter();
  const userID = getUserID();
  const ipInfo = ipaddress();
  const osInfo = osdetails();
  const browserInfo = browserdetails();
  const userToken  =  isUserToken();
  const bearerToken = isBearerToken();

  useEffect(() => {
    if(!userToken) { push("/login"); return  }
    if(!bearerToken) { push("/"); return  }
  }, []);



  useEffect(() => {
    _get("Customer/GetTotalOfUserNotification?userid="+ userID)
    .then((res) => {
      // console.log("GetTotalOfUserNotification  response - ", res);
      if (mounted2)
      {
        setNotificationCount(res.data.result[0].totalnotification);
      }
    }).catch((error) => {
        console.log("GetTotalOfUserNotification-",error); 
    });
   
  return () => { setMounted2(false); }
  }, [notificationCount]);



useEffect(() => {
  _get("Customer/GetUserNotifications?userid="+ userID)
  .then((res) => {
    // console.log("GetUserNotifications  response - ", res);
    if (mounted)
    {
      setNotifyList(res.data.result);
    }
  }).catch((error) => {
      console.log("GetUserNotifications-",error); 
  });
 
return () => { setMounted(false); }
}, [notifyList]);





const readNotification = (e) => {
    e.preventDefault();
    const datafinal = {
        userid: userID,
        ipaddress: ipInfo,
        osdetails: osInfo,
        browserdetails: browserInfo
    }
    setLoading(true);
    setPagemsg('Updating');

      _post("Customer/MarkReadUserNotification", datafinal)
      .then((res) => {
      //  console.log("MarkReadUserNotification", res);
        setLoading(false);
        Router.back();
      }).catch((err) => {
        console.log(err.message);
        setLoading(false); 
      });

  } 

  return (<>
    <motion.div initial={{ y: "-100vw" }} animate={{ y:0 }} transition={{ duration: 0.8, delay: 0.1, origin: 1, ease: [0, 0.71, 0.2, 1.01] }}>
    <header className='headersection headerProfiles'>
        <aside className="backarrow">
          <Image src="/assets/images/back-arrow.png" width={65} height={24} alt="back" quality={99} onClick={readNotification} title='Back' />
          <span>Notifications</span>
        </aside>
      </header>
    <div className="screenmain screennotification"> 
        <div className="screencontainer">

            <ul className='notificationList'>
              {
                parseInt(notificationCount) === 0 ? <li><h6>Notifications not available</h6></li> : null
              }

                {  
                  notifyList.map &&  notifyList.map((val, index) => <li key={val.notificationid} data-deliverystatus={val.deliverystatus} data-notificationtype={val.notificationtype}>
                    <h3>{val.notificationtitle}</h3>
                    <h4>{val.notificationmessage}</h4>
                  </li>)
                }
            </ul>

        </div>
    </div>
    </motion.div>

    <Loader showStatus={loading} message={pagemsg} />
  </>)
}
