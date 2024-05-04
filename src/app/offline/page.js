import Link from "next/link";
export default function offline() {
  const container =  { 'background-color':'#fff', 'width':'100%', 'height':'100vh', 'max-width':'1024px', 'margin':'0 auto', 'float':'none','display':'flex','align-items':'center', 'flex-direction':'column', 'justify-content':'center','padding':'1rem', 'box-sizing':'border-box' }
  const heading =  { 'width':'100%', 'margin':'0', 'float':'left','text-align':'center','color': '#000','font-size': '24px','font-weight': 'bold','line-height': '1'  }
  const text =  { 'width':'100%', 'margin':'1rem 0 0 0', 'float':'left','text-align':'center','color': '#999','font-size': '18px','font-weight': 'normal','line-height': '1'   }
  const holder =  { 'width':'100%', 'margin':'1.5rem 0 0 0', 'float':'left','text-align':'center' }
  const button =  { 'display':'inline-block', 'width':'auto', 'margin':'0 auto', 'float':'none', 'padding':'1rem 2rem 0.7rem 2rem', 'background': '#191919','border-radius': '25px','text-decoration': 'none','color': '#fff','cursor': 'pointer','text-transform': 'uppercase','font-size': '18px','font-weight': 'normal','line-height': '1'  }
  return (
    <>
      <div style={container}>
        <h2 style={heading}>No Internet Connection</h2>
        <p style={text}>Make sure Wi-Fi is on, Airplane Mode is off and try again.</p>
        <aside style={holder}>
          <Link href="/" style={button}>Retry</Link>
        </aside>
      </div>
    </>
  );
}
 


