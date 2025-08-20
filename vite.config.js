import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
	base: "/",
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			process: "process/browser",
			util: "util",
			buffer: "buffer",
			stream: "stream-browserify",
		},
	},
	define: {
		"process.env": {},
		global: "globalThis",
	},
	optimizeDeps: {
		include: ["simple-peer"],
		esbuildOptions: {
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true,
					process: true,
				}),
				NodeModulesPolyfillPlugin(),
			],
		},
	},
	server: {
		host: true,
		port: 5173,
		proxy: {
			"/api": {
				target: "http://localhost:5000", // This is only used in development
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path,
			},
		},
	},

	// Production-specific settings
	build: {
		// Generate source maps for production
		sourcemap: true,

		// Output directory (default is 'dist')
		outDir: "dist",

		// Clean the output directory before build
		emptyOutDir: true,

		// Optimize chunk size for production
		rollupOptions: {
			plugins: [rollupNodePolyFill()],
			output: {
				manualChunks: {
					vendor: ["react", "react-dom", "framer-motion"],
					// You can add more manual chunks as needed
				},
			},
		},
	},
}));
