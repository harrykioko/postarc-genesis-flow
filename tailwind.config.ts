
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#0B1C34', // Midnight Blue
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#65758C', // Slate Gray
					foreground: '#FFFFFF'
				},
				accent: {
					DEFAULT: '#00FFC2', // Neon Mint
					foreground: '#0B1C34'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// PostArc brand colors
				midnight: '#0B1C34',
				neon: '#00FFC2',
				mint: '#00FFC2',
				slate: '#65758C',
				glass: 'rgba(255, 255, 255, 0.1)',
			},
			fontFamily: {
				'heading': ['Poppins', 'sans-serif'],
				'body': ['Inter', 'sans-serif'],
			},
			backgroundImage: {
				'gradient-brand': 'linear-gradient(135deg, #F5FAFF 0%, #E8F4FF 100%)',
				'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
				'gradient-animated': 'linear-gradient(0deg, #F5FAFF 0%, #ECF6FF 50%, #FFFFFF 100%)',
			},
			backdropBlur: {
				'glass': '20px',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'bgMove': {
					'0%': { backgroundPosition: '0% 0%' },
					'100%': { backgroundPosition: '0% 100%' }
				},
				'spark-float': {
					'0%': { opacity: '0', transform: 'translateY(0px)' },
					'50%': { opacity: '1', transform: 'translateY(-12px)' },
					'100%': { opacity: '0', transform: 'translateY(-24px)' }
				},
				'pulse-ring': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'100%': { transform: 'scale(1.4)', opacity: '0' }
				},
				'slide-in-item': {
					'0%': { opacity: '0', transform: 'translateY(-10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-up': 'slide-up 0.6s ease-out',
				'bgMove': 'bgMove 15s linear infinite',
				'spark-float': 'spark-float 0.8s ease-out',
				'pulse-ring': 'pulse-ring 1s ease-out',
				'slide-in-item': 'slide-in-item 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
