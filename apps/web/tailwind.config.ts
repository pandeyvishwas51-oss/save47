import type { Config } from 'tailwindcss';

// Tailwind v4 picks up config primarily through @theme in CSS, but a
// minimal TS config keeps editor tooling happy and lets us extend later.
const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
