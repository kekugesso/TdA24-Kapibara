/** @type {import('next').NextConfig} */
const API_PORT = process.env.API_PORT;
const IP = process.env.IP;
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://${IP}:${API_PORT}/api/:path*`,
      },
      {
        source: "/lecturer/:uuid",
        destination: "/lecturer/[uuid]",
      },
      {
        source: "/lecturer/:uuid/event/:event_uuid",
        destination: "/lecturer/[uuid]/event/[event_uuid]",
      },
      {
        source: "/login",
        destination: "/admin",
      },
      {
        source: "/calendar",
        destination: "/admin/calendar",
      },
      {
        source: "/edit-profile",
        destination: "/admin/edit-profile",
      },
      {
        source: "/logout",
        destination: "/admin?logout=true",
      },
    ];
  },
};

export default nextConfig;
