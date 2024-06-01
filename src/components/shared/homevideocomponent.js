"use client";
export default function HomeVideoComponent({showhide}) {
  return (<>
   { !showhide && <video autoPlay muted playsInline style={{ width: '308px', height: '58px' }} poster="/assets/images/logo.png">
        <source src="/assets/videos/homevideo-unit.mp4" type="video/mp4" />
    </video> 
}
    </>)
}
