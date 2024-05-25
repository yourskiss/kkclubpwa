"use client";
import Cookies from 'js-cookie';
const setCouponeCode = (val) => {
  const scanqrTime = parseInt(process.env.NEXT_PUBLIC_QR_SCAN_TIME);
    return Cookies.set('couponecodecookies', val, { expires: new Date(new Date().getTime() + scanqrTime), secure: true });
 }
 const isCouponeCode = () => {
   const isToken = !!Cookies.get('couponecodecookies');
   return isToken;
 }
 const getCouponeCode = () => {
   const isValue = Cookies.get('couponecodecookies');
   return isValue;
 }


 
export {  setCouponeCode, isCouponeCode, getCouponeCode };