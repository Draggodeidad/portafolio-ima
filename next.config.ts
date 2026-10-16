import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";
import createNextIntlPlugin from "next-intl/plugin";

const localNetworkOrigins = Object.values(networkInterfaces())
  .flatMap((interfaces) => interfaces ?? [])
  .filter((network) => !network.internal && network.family === "IPv4")
  .map((network) => network.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: [...new Set(["127.0.0.1", ...localNetworkOrigins])],
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
