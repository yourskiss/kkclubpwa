"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import { isBearerToken, setBearerToken } from '@/config/bearerauth';

export default function FooterComponent() {
  const isBT = isBearerToken();
  useEffect(() => {
    if(!isBT) { setBearerToken('in'); return  }
  }, []);

  return (
    <>
      <footer className='footersection'>
        <p>
          &copy; Kerakoll 2024.
           &nbsp; 
          <Link href="/assets/pdf/terms-of-use.pdf" target="_blank" locale={false} rel="noopener noreferrer">Terms of use</Link>
           &nbsp; | &nbsp; 
          <Link href="/assets/pdf/privacy-policy.pdf" target="_blank" locale={false} rel="noopener noreferrer">Privacy Policy</Link>
        </p>
      </footer>
    </>
  )
}
