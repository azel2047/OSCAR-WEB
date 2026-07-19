/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/js/src/**/*.{js,jsx,ts,tsx}',
    './resources/views/**/*.blade.php',
  ],
  theme: {
    extend: {
      colors: {
        /* ── Backgrounds ── */
        bg: {
          void:    '#112C1E',
          deep:    '#112C1E',
          base:    '#153427',
          surface: '#18412E',
          forest:  '#18412E',
          card:    'rgba(24,65,46,0.5)',
        },
        /* ── OSCAR Brand Accents ── */
        lime:   '#70C492',
        forest: '#1E5C40',
        rainforest: '#112C1E',
        /* ── Text ── */
        primary:   '#FFFFFF',
        secondary: 'rgba(255,255,255,0.55)',
        muted:     'rgba(255,255,255,0.3)',
        dim:       'rgba(255,255,255,0.12)',
      },
      fontFamily: {
        /* Outfit: 900w Lusion-style display */
        display: ['"Outfit"', 'sans-serif'],
        /* Inter: clean, modern body */
        body:    ['"Inter"', 'sans-serif'],
        /* JetBrains Mono: labels, numbers */
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        /* Lusion-scale typography */
        'hero-xl': ['clamp(5rem,17vw,17rem)', { lineHeight: '0.88', letterSpacing: '-0.05em' }],
        'hero-lg': ['clamp(4rem,13vw,13rem)', { lineHeight: '0.9',  letterSpacing: '-0.04em' }],
        'hero-md': ['clamp(3rem,9vw,9rem)',   { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        'section': ['clamp(2.5rem,7vw,7rem)', { lineHeight: '0.94', letterSpacing: '-0.03em' }],
        '10xl':    ['10rem',  { lineHeight: '0.85', letterSpacing: '-0.05em' }],
        '9xl':     ['8rem',   { lineHeight: '0.88', letterSpacing: '-0.04em' }],
        '8xl':     ['6rem',   { lineHeight: '0.9',  letterSpacing: '-0.04em' }],
      },
      borderColor: {
        DEFAULT:  'rgba(255,255,255,0.07)',
        subtle:   'rgba(255,255,255,0.04)',
        accent:   'rgba(112, 196, 146, 0.2)',
        forest:   'rgba(30, 92, 64, 0.35)',
      },
      boxShadow: {
        'lime':      '0 0 30px rgba(112, 196, 146, 0.35), 0 0 80px rgba(112, 196, 146, 0.12)',
        'lime-sm':   '0 0 16px rgba(112, 196, 146, 0.25)',
        'card':      '0 24px 60px rgba(0,0,0,0.6)',
        'forest':    '0 0 40px rgba(30, 92, 64, 0.2)',
      },
      backgroundImage: {
        'grid-subtle': "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        'lime-glow':   'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(112, 196, 146, 0.08) 0%, transparent 70%)',
        'forest-glow': 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(30, 92, 64, 0.15) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid-80': '80px 80px',
      },
      animation: {
        'float':      'floatUp 6s ease-in-out infinite',
        'pulse-lime': 'pulse-lime 2s ease-in-out infinite',
      },
      keyframes: {
        floatUp: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'pulse-lime': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
