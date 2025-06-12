import React from 'react'

/**
 * GradientSpine
 * Renders a vertical, blurred, low-opacity gradient spine (Neon Mint to Slate Blue) behind the main content.
 *
 * @param {object} props - Component props
 * @param {string} [props.className] - Optional Tailwind classes for custom styling
 * @returns {JSX.Element}
 */
export const GradientSpine: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    aria-hidden="true"
    className={`
      pointer-events-none
      fixed md:absolute top-0 left-1/2 -translate-x-1/2
      h-full w-24 md:w-40 lg:w-56
      bg-gradient-to-b from-[#00FFC2] via-[#00D5FF] to-[#B388F9]
      opacity-30 md:opacity-25
      blur-2xl md:blur-3xl
      z-0
      ${className}
    `}
    style={{
      minHeight: '100vh',
      maxWidth: '100vw',
    }}
  />
)

export default GradientSpine 