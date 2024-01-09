/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ddjyblexwvp07diz.public.blob.vercel-storage.com",
      },
    ],
  },
};

module.exports = nextConfig;
