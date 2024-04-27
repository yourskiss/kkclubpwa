"use client";
import { Suspense, useEffect, useState } from 'react'
import LoginComponent from './LoginComponent'
import Pageloading from '../shared/PageloadingComponent'

export default function HomeComponent() {
  const[load,setLoad] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  },[]);

  return (
    <>
      <Suspense fallback={<p>...Loading</p>}>
        {
          load ? <Pageloading /> : <LoginComponent />
        }
      </Suspense>
      
    </>
  )
}
