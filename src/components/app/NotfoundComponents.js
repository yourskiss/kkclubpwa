 "use client";
import Link from "next/link";
import Image from 'next/image';
export default function NotFoundComponents() {

  return (
    <>
    <header className='headersection'>
        <aside className="logo">
          <Image src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={99} />
        </aside>
    </header>

    <div className="screenmain"> 
        <div className="screencontainer">

                <div className="pagenotfound">
                  <Image src="/assets/images/notfound.png" width={616} height={500} alt="notfound" quality={100} />
                  <h2>Back to <Link href="/">Back to Home</Link></h2>    
                </div>

        </div>
      </div>
    </>
  )
}
