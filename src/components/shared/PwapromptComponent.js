 
export default function Pwaprompt() {
    return (<>
   
      <div className="pwaPromptPopup" id="pwaPromptPopup">
          <section>
            <div>
                <img src="/assets/images/icons/pwa-prompt.png" alt="pwa" />
                <h2>
                    Kerakoll Club
                    <span>Get our app. It won't tak up space on your phone</span>
                </h2>
            </div>

              <p>
                  <span id="pwaInstall" className="pwaPromptButton">Install</span>
                  <span id="pwaCancel" className="pwaPromptButton pwacancelBtn">Not now</span>
              </p>
          </section>
      </div>

      <div className="loader" id="pwaLoader" style={{'display':'none'}}>
          <div>
            <aside></aside>
            <p>Please wait...</p>
          </div>
      </div>

    </>)
  }
  