import Head from "next/head";
import Link from "next/link";
export default function offline() {
  return (
    <>
      <Head>
        <title>KK Club PWA</title>
      </Head>
      <h1>No Internet Connection</h1>
      <p>Make sure Wi-Fi is on, Airplane Mode is off and try again.</p>
      <aside>
        <Link href="/">Retry</Link>
      </aside>
    </>
  );
}
 


