import { cloudflare } from "@cloudflare/vite-plugin";
import { createHash } from "node:crypto";
import path from "node:path";
import { defineConfig } from "vite";
import { patchCssModules } from "vite-css-modules";
import vinext from "vinext";

// Local evaluation only: no remote bindings, caches, or image service.
export default defineConfig({
  plugins: [
    patchCssModules({ exportMode: "default" }),
    vinext(),
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
