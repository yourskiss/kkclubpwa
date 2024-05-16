 

export default function Homevideo() {
  return (
    <>
      <div className="videoloader">
          <section>
            <video autoPlay muted playsInline style={{ width: '308px', height: '58px' }} poster="/assets/images/logo.png">
              <source src="/assets/videos/homevideo-unit.mp4"  />
            </video>
          </section>
      </div>
    </>
  );
}