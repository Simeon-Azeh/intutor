/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      { hostname: "via.placeholder.com" }, // Add this line
    ],
  },
};

export default nextConfig;