"use client";
import React from 'react';
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
// import PWAPrompt from 'react-ios-pwa-prompt';

export default function PwaIOS() {
  return (<ErrorBoundary>
  {/* <PWAPrompt  promptOnVisit={1} timesToShow={3} copyClosePrompt="Close" permanentlyHideOnDismiss={false} debug={true} copyTitle="" copyBody="" copyShareButtonLabel="" copyAddHomeButtonLabel="" />   */}
  </ErrorBoundary>)
}
