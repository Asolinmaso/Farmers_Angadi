import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'farmerbg': "url('/assets/farmerbg.jpg')",
        'carrotbg': "url('/assets/carrotbg.jpg')",
        'buyersbg': "url('/assets/buyersbg.jpg')",
        'sellersbg': "url('/assets/sellersbg.jpg')",
      },
      colors: {
        primary: "#12602e",
        secondary: "#f4a61e",
        tertiary: "#ffffff",
      },
    },
  },
  plugins: [],
}
export default config
