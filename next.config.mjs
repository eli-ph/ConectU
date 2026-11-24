/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< Updated upstream
  //output: "export",
=======
  // Con sesiones, Route Handlers y SQLite no se puede usar output: "export".
>>>>>>> Stashed changes
  images: { unoptimized: true },
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
