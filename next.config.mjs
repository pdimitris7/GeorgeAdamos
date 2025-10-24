/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    // Μην κάνεις proxy/resize στον server του Heroku
    unoptimized: true,
    // Επιτρέπει fallback SVG (π.χ. /placeholder.svg)
    dangerouslyAllowSVG: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["nodemailer"],
  },
  // Κάνει πιο «καθαρό» slug για Heroku
  output: "standalone",
};

export default nextConfig;
