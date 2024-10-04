/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*", // Sesuaikan dengan URL backend Anda
      },
    ];
  },
};

export default nextConfig;
