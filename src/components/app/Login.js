"use client";
import { Suspense} from 'react'
import LoginComponent from './LoginComponent'

export default function Login() {
  return (
    <>
      <Suspense fallback={<p>...Loading</p>}>
      <LoginComponent />
      </Suspense>
    </>
  )
}
