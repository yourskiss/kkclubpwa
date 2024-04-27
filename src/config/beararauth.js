"use client";
import Cookies from 'js-cookie';
import axios from 'axios';

const apiURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
const apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;


 const setBearerToken = () => {
  const isBearerToken = !!Cookies.get('bearertoken');
  if(!isBearerToken)
  {
    console.log("before inside - ", Cookies.get('bearertoken'))
    getBearerToken();
  }
  console.log("after - ", Cookies.get('bearertoken'))
 
  return Cookies.get('bearertoken');
}

const getBearerToken = () => {
        axios({
          url: apiURL +"ApiAuth/authtoken",
          method: "POST",
          headers: {  "Content-Type": "application/json" },
          data: JSON.stringify({ "userid": apiUsername, "password": apiPassword }),
        }).then((res) => {
          // console.log("Bearer Token - ", res);
          Cookies.set('bearertoken',  res.data.token, { expires: new Date(new Date().getTime() + 3600000), secure: true });
        }).catch((err) => {
            console.log(err.message);
        });
}
 
 
export {getBearerToken, setBearerToken};