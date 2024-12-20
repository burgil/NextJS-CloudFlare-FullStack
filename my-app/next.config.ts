import type { NextConfig } from "next";

// Since we want the development server to redirect traffic to /api/ from the frontend at http://localhost:3000 to the backend at http://localhost:8788
// We need to set up "rewrites", NextJS warns you that these rewrites will not work in production after you build
// But we don't care because wrangler automatically binds the "functions" directory to the frontend on production
// We just need it to work in development too
const warn = console.warn;
console.warn = (...args) => {
  if (args[0].trim().includes('Specified "rewrites" will not automatically work with "output: export". See more info here: https://nextjs.org/docs/messages/export-no-custom-routes')) return;
  if (args[0].trim().includes('rewrites, redirects, and headers are not applied when exporting your application, detected (rewrites). See more info here: https://nextjs.org/docs/messages/export-no-custom-routes')) return;
  warn(...args);
}

const nextConfig: NextConfig = {
  output: 'export',

  // https://stackoverflow.com/questions/60925133/proxy-to-backend-with-default-next-js-dev-server
  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:8788'}/api/:path*/`,
      },
    ];
  },

  // Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
};

export default nextConfig;
