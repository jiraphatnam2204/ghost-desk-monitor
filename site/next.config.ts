import type { NextConfig } from "next";

// Static site for GitHub Pages. The deploy workflow sets PAGES_BASE_PATH to "/<repo-name>";
// locally it is empty, so the site runs at the root.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  devIndicators: false,
};

export default nextConfig;
