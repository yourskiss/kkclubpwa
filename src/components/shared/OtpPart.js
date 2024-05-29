"use client";
import { useState, useEffect } from "react";
import Otpcountdown from "../core/timer";
import OtpInput from 'react-otp-input';

export default function OtpPart() {
  return (
    <form onSubmit={otpSubmit}>
            <div className="registercontainer">
              <div className="registerHead">Verify with OTP</div>
              <div className="registerMsgOtp">
                <span>We have sent an OTP to <b>+91- {mobileValues}</b></span>
                <em className="numberedit" onClick={changeNumber}>Change</em>
              </div>

              <div className="registerOtp">
                <aside>
                    <input className="registerinput" id="otpinputs" type="number" autoComplete="one-time-code" min="0" maxLength={6} value={otpValues} onInput={onInputmaxLength} onChange={(e)=>setOtpValues(e.target.value)} onFocus={(e)=>setOtpValues(e.target.value)} />
                </aside>
                <section>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </section>
              </div>

              <div className="registerOneTimePassword">
                <OtpInput
                  autoComplete="one-time-code"
                  value={otpValues}
                  onChange={setOtpValues}
                  numInputs={6}
                  inputType="number"
                  renderSeparator={<span></span>}
                  renderInput={(props) => <input autoComplete="on" {...props} />}
                />
              </div>
              { otpError && <span className='registerError'>{otpError}</span>  }
              {
                !otpsent ? (<div className="registerOtpText">Resend OTP in  <Otpcountdown expiryTimestamp={otpcountertime} onSuccess={getOtpTimer} /> Seconds </div>) : (<div className="registerOtpText">Not reveived?  <span onClick={sendotp}>Resend OTP</span></div>)
              }
            </div>
            <div className="registerSubmit">
                <button className="register_button">Sign In</button>
            </div>
        </form>
  )
}
