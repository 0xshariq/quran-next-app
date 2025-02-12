/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['cdn.islamic.network','ik.imagekit.io'], // Add this line to allow images from the specified domain
    },
  };

export default nextConfig;
