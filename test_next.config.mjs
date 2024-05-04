import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD} from "next/constants.js";
/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
const nextConfigFunction = async (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withPWA = (await import("@ducanh2912/next-pwa")).default({
      cacheOnFrontEndNav: true,
      aggressiveFrontEndNavCaching: true,
      reloadOnOnline: true,
      swcMinify: true,
      dest: "public",
      fallbacks: {
        // image: "/assets/images/fallback.png",
        document: "/offline", // if you want to fallback to a custom page rather than /_offline
        // font: '/static/font/fallback.woff2',
        // audio: ...,
        // video: ...,
      },
      workboxOptions: {
        disableDevLogs: true,
      },
    });
    return withPWA(nextConfig);
  }
  return nextConfig;
};

export default nextConfigFunction;