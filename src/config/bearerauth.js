"use client";
import Cookies from 'js-cookie';
 
const btTime = parseInt(process.env.NEXT_PUBLIC_BEARER_TOKEN_TIME);
const domainname = process.env.NEXT_PUBLIC_DOMAIN_COOKIES;
 
const setBearerToken = (val) => {
  return Cookies.set('bearertoken',  val, { expires: new Date(new Date().getTime() + btTime), secure: true, sameSite: 'Strict', path: '/', domain:domainname });
}
const isBearerToken = () => {
  const isToken = !!Cookies.get('bearertoken', { domain:domainname  });
  return isToken;
}
const getBearerToken = () => {
  return Cookies.get('bearertoken', { domain:domainname  });
}
const removeBearerToken = () => {
  return Cookies.remove('bearertoken', { domain:domainname  });
}

export {  setBearerToken, isBearerToken, getBearerToken, removeBearerToken };