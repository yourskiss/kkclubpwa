"use client";
import { useState, useEffect } from "react";

export default function LoginPart() {
  return (
    <form onSubmit={mobileSubmit}>
              <div className="registercontainer">
                <div className="registerHead">Welcome!</div>
                <div className="registerField">
                  <div className="registertext">Enter mobile number *</div>
                  <div className="registerinputformobile">
                    <span>+91-</span>
                    <input className="registerinput" type="number" name="mobile" autoComplete="off" min="0" maxLength={10} minLength={10} value={mobileValues} onChange={mobileChange} onInput={onInputmaxLength} />
                  </div>
                  { mobileError && <span className='registerError'>{mobileError}</span> } 
                </div>
 
              </div>
              <div className="registerSubmit">
                <button className="register_button">SEND OTP</button>
              </div>
    </form>
  )
}
