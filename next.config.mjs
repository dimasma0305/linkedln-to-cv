const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isProjectPages = repository.length > 0 && !repository.endsWith(".github.io");
const basePath = isGithubActions && isProjectPages ? `/${repository}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined
};

export default nextConfig;
