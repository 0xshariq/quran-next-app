/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.islamic.network',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'ik.imagekit.io',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };

export default nextConfig;
