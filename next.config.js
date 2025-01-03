/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'magiclogror2024.s3.us-east-2.amazonaws.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

module.exports = nextConfig;
