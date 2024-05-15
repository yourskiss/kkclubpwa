"use client";
import React from 'react';
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
// import PWAPrompt from 'react-ios-pwa-prompt';
// import { PwaPrompt } from 'react-ios-pwa-prompt-ts'

export default function PwaIOS() {
  return (<ErrorBoundary>
  {/* <PWAPrompt  promptOnVisit={1} timesToShow={3} copyClosePrompt="Close" permanentlyHideOnDismiss={false} debug={true} copyClosePrompt="Close" copyTitle="Add to Home Screen" copyBody="This website has app functionality. Add it to your home screen to use it in fullscreen and while offline." copyShareButtonLabel="1) Press the 'Share' button" copyAddHomeButtonLabel="2) Press 'Add to Home Screen'" />   */}
  
  {/* <PwaPrompt promptOnVisit={1} timesToShow={3} transitionDuration={600} permanentlyHideOnDismiss={false} debug={true}  copyClosePrompt="Close" copyTitle="Add to Home Screen" copyBody="This website has app functionality. Add it to your home screen to use it in fullscreen and while offline." copyShareButtonLabel="1) Press the 'Share' button" copyAddHomeButtonLabel="2) Press 'Add to Home Screen'" /> */}

  </ErrorBoundary>)
}
