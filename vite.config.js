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
        login: resolve(__dirname, "src/pages/login/login.html"),
        profile: resolve(__dirname, "src/pages/login/profile.html"),
        createEvent: resolve(
          __dirname,
          "src/pages/createEvent/createEvent.html",
        ),
      },
    },
  },
});
