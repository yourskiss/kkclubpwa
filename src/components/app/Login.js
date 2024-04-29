"use client";
import { Suspense} from 'react'
import LoginComponent from './LoginComponent'
import Pwaprompt from '../shared/PwapromptComponent';

export default function Login() {
  return (
    <>
     {/* <Pwaprompt /> */}
      <Suspense fallback={<p>...Loading</p>}>
      <LoginComponent />
      </Suspense>
    </>
  )
}
