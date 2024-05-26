"use client";
import Cookies from 'js-cookie';
import { useState } from 'react';
const domainname = process.env.NEXT_PUBLIC_DOMAIN_COOKIES;


export default function TestComponent() {
    const[text,setText] = useState('');
    console.log(domainname);

    const handalSet = (e) => {
        e.preventDefault();
        Cookies.set('tstCks', "TestCookies", { expires: 1, secure: true, sameSite: 'Strict', path: '/', domain:domainname  });
        window.location.reload();
    }
    const handalGet = (e) => {
        e.preventDefault();
        const gettesk = Cookies.get('tstCks', { domain:domainname  });
        console.log(gettesk)
        setText(gettesk)
    }
    const handalRemove = (e) => {
        e.preventDefault();
        Cookies.remove('tstCks', { domain:domainname  });
        setText('')
        window.location.reload();
    }
  return (<div>
        <h1 style={{'color': '#fff'}}>{text}</h1>
     <h1> 
        <span onClick={handalSet} style={{'color': '#fcc'}}>set</span>
         &nbsp; 
        <span onClick={handalGet} style={{'color': '#fff'}}>get</span>
         &nbsp; 
        <span onClick={handalRemove} style={{'color': '#f30'}}>remove</span>
     </h1>
    </div>)
}
