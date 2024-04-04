/** @type {import('next').NextConfig} */
const API_PORT = process.env.API_PORT
const IP = process.env.IP
const nextConfig = {	
    async rewrites() {
    return [
        {
            source: '/api/:path*',
            destination: `http://${IP}:${API_PORT}/api/:path*`,
        },
    ]
},};

export default nextConfig;
