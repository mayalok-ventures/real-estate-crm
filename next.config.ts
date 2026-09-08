import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/inventory",
        destination: "/products",
        permanent: false,
      },
      {
        source: "/leads/add",
        destination: "/leads?add=true",
        permanent: false,
      },
      {
        source: "/leads/edit/:id",
        destination: "/leads/:id?edit=true",
        permanent: false,
      },
      {
        source: "/whatsapp/templates/new",
        destination: "/whatsapp?tab=templates&action=new",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
