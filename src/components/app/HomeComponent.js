"use client";
import Cookies from 'js-cookie';
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Pageloading from '../shared/PageloadingComponent'

const apiURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
const apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;

export default function HomeComponent() {
  const { push } = useRouter();
  useEffect(() => {
    const isBearerToken = !!Cookies.get('bearertoken');
    if(!isBearerToken)
    {
          axios({
            url: apiURL +"ApiAuth/authtoken",
            method: "POST",
            headers: {  "Content-Type": "application/json" },
            data: JSON.stringify({ "userid": apiUsername, "password": apiPassword }),
          }).then((res) => {
            // console.log("Bearer Token - ", res);
            Cookies.set('bearertoken',  res.data.token, { expires: new Date(new Date().getTime() + 3600000), secure: true });
            window.location.reload();
          }).catch((err) => {
            toast.error(err.message); 
            window.location.reload();
          });
          
    }
    else
    {
      push("/login");
    }
   },[]);

  return (<Pageloading />)
}
