import {defineConfig} from "vite"
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    lib: {
      formats: ['es', 'cjs'],
      entry: [
        "src/main.ts",
      ],
      name: "Demo",
      fileName: (format, name) => {
        if (format === "es") {
          return `${name}.js`;
        }
        return `${name}.${format}`;
      },
    },
    plugins: [react()],
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: 'React',
        }
      }
    },
  }
});
