
const withPWA = require("@ducanh2912/next-pwa").default({
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    dest: "public",
    fallbacks: {
      document: "/offline", 
    },
    workboxOptions: {
      disableDevLogs: false,
    },
  });
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
  };
  module.exports = withPWA(nextConfig);
 