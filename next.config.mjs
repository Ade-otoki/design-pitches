/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hide the dev-mode indicator so local mockup captures stay clean.
  devIndicators: false,
  // Prototypes are embedded in their own Product Log via iframe, so allow same-origin framing.
  async headers() {
    return [
      {
        source: "/prototypes/:path*",
        headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }],
      },
    ];
  },
};

export default nextConfig;
