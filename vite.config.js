import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        events: resolve(__dirname, "src/pages/events/events.html"),
        singleEvent: resolve(
          __dirname,
          "src/pages/singleEvent/singleEvent.html",
        ),
      },
    },
  },
});
