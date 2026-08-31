import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Emit /de/index.html rather than /de.html. Static hosts differ on whether
  // they resolve an extensionless path to a sibling .html file; a real
  // directory with an index is unambiguous everywhere.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
