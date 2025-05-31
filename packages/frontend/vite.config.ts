import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), checker({ typescript: true })],
    server: {
        proxy: {
            // Forward all requests from localhost:5173/api/* to localhost:3000/api/*
            "/api": "http://localhost:3000"
        }
    }
});
