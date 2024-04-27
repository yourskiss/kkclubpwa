import Image from 'next/image'
 
export default function Pageloading() {
 
  return (
    <div className="pageloading"> 
        <section></section>
        <div>
            <Image src="/assets/images/logo.png" width={384} height={69} alt="Logo" quality={99} />
        </div>
    </div>
  )
}
 