import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Paleta extraída de la imagen de referencia (Salesforce dark theme)
                background: {
                    DEFAULT: '#0D0F12',
                    secondary: '#161B22',
                },
                card: {
                    DEFAULT: '#161B22',
                    light: '#FFFFFF',
                    hover: '#1C2128',
                },
                accent: {
                    DEFAULT: '#39FF14',
                    hover: '#32E612',
                    muted: '#39FF1420',
                },
                border: {
                    DEFAULT: '#2D3748',
                    light: '#E5E7EB',
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: '#9CA3AF',
                    muted: '#6B7280',
                },
                success: {
                    DEFAULT: '#22C55E',
                    muted: '#22C55E20',
                },
                warning: {
                    DEFAULT: '#F59E0B',
                    muted: '#F59E0B20',
                },
                error: {
                    DEFAULT: '#EF4444',
                    muted: '#EF444420',
                },
                info: {
                    DEFAULT: '#3B82F6',
                    muted: '#3B82F620',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                lg: '0.75rem',
                md: '0.5rem',
                sm: '0.25rem',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(57, 255, 20, 0.3)',
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(57, 255, 20, 0.3)' },
                    '50%': { boxShadow: '0 0 20px rgba(57, 255, 20, 0.6)' },
                },
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
}

export default config
