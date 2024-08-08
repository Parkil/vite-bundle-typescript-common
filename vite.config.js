import {defineConfig} from 'vite'

export default defineConfig({
  build: {
    lib: {
      formats: ['es', 'cjs'],
      entry: [
        "src/main.ts",
      ],
      name: "Recoble Common Module",
      fileName: (format, name) => {
        if (format === "es") {
          return `${name}.js`;
        }
        return `${name}.${format}`;
      },
    },
  }
});
