import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const verification = env.VITE_GOOGLE_SITE_VERIFICATION?.trim();

  return {
    plugins: [
      {
        name: "optional-google-site-verification",
        transformIndexHtml() {
          if (!verification) return [];
          return [{ tag: "meta", attrs: { name: "google-site-verification", content: verification }, injectTo: "head" }];
        },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          main: resolve(process.cwd(), "index.html"),
          privacidad: resolve(process.cwd(), "privacidad.html"),
          terminos: resolve(process.cwd(), "terminos.html"),
          "envios-cambios": resolve(process.cwd(), "envios-cambios.html"),
          "404": resolve(process.cwd(), "404.html"),
        },
      },
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
    },
  };
});
