// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

import localFont from 'next/font/local';
const lneue = localFont({ weight: 'normal', variable: '--font-lneue', src: './LarishNeueSemiboldRegular.woff2' });
const arialmt = localFont({ weight: 'normal', variable: '--font-arialmt', src: './arialmt.woff2' });

import Script from "next/script";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Starfield from 'react-starfield';
 
export const metadata = {
  title: "KerakollClub",
  description: "KerakollClub",
  manifest:'./manifest.json',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/assets/images/icons/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/assets/images/icons/favicon-16x16.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/assets/images/icons/apple-touch-icon.png',
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="background_color" content="#AFCDAF"/>
      <meta name="theme-color" content="#414141"/>
      <body className={`${lneue.variable} ${arialmt.variable}`}>
        <main className="main">
          <Starfield starCount={1000} starColor={[255, 255, 255]} speedFactor={0.05} />
          <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"  />
          {children}
        </main>
        <Script src="/service-worker.js" />
      </body>
    </html>
  );
}

