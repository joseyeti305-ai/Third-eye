/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // spike: strict double-mount fights three.js resource lifecycles; production app will re-enable with proper disposal
};

export default nextConfig;
