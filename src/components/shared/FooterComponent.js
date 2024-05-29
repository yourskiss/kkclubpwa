"use client";
import Link from 'next/link';
export default function FooterComponent() {
  return (
    <>
      <footer className='footersection'>
        <p>
          &copy; Kerakoll 2024.
           &nbsp; 
          <Link href="/assets/pdf/terms-of-use.pdf" target="_blank">Terms of use</Link>
           &nbsp; | &nbsp; 
          <Link href="/assets/pdf/privacy-policy.pdf" target="_blank">Privacy Policy</Link>
        </p>
      </footer>
    </>
  )
}
