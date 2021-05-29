import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export const generateSVG: (
  icon: IconDefinition,
  colour?: string,
  dark?: string
) => string = (icon, colour = '#000', dark = '#fff') => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [width, height, _, __, path] = icon.icon
  if (typeof path !== 'string') throw new Error('oh no')

  const lines: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
    '<style>',
    `path { fill: ${colour}; } `,
    `@media (prefers-color-scheme: dark) { path { fill: ${dark}; } }`,
    '</style>',
    `<path d="${path}" />`,
    '</svg>',
  ]

  return `data:image/svg+xml,${encodeURIComponent(lines.join(''))}`
}
