import { cloudflare } from "@cloudflare/vite-plugin";
import { staticAssetsAdapter } from "@vinext/cloudflare/cache/static-assets-adapter";
import { createHash } from "node:crypto";
import path from "node:path";
import { defineConfig } from "vite";
import { patchCssModules } from "vite-css-modules";
import vinext from "vinext";

// Build-time snapshots: no runtime cache service or remote bindings required.
export default defineConfig({
  plugins: [
    patchCssModules({ exportMode: "default" }),
    vinext({
      prerender: { routes: "*" },
      cache: { cdn: staticAssetsAdapter() },
    }),
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
      remoteBindings: false,
      persistState: false,
      inspectorPort: false,
    }),
  ],
  css: {
    modules: {
      generateScopedName(name, filename) {
        const relativePath = path
          .relative(import.meta.dirname, filename.replace(/\?.*$/, ""))
          .replaceAll("\\", "/");
        const hash = createHash("sha256")
          .update(relativePath)
          .digest("hex")
          .slice(0, 7);
        return `_${name}_${hash}`;
      },
    },
  },
});
