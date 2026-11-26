import { readFileSync, writeFileSync } from 'node:fs'

// Each contour is projected independently so a planar study can develop into a volume.
function contour(layer, phase, edition = false) {
  const depth = layer / 51
  const vertices = Array.from({ length: 100 }, (_, index) => {
    const theta = index / 100 * Math.PI * 2
    const angle = theta + depth * (0.22 + phase * 0.54)
    const corner = edition ? 0.42 : 0.6 + 0.35 * Math.cos(depth * Math.PI)
    const sin = Math.sin(theta)
    const cos = Math.cos(theta)
    const x = Math.sign(cos) * Math.abs(cos) ** corner
    const z = Math.sign(sin) * Math.abs(sin) ** corner
    const twist = angle - theta
    const radius = edition ? 72 + 24 * Math.cos(depth * Math.PI * 2) : 77 + 22 * Math.sin(depth * Math.PI * 2 + phase * 0.9)
    const rotateX = (x * Math.cos(twist) - z * Math.sin(twist)) * radius
    const rotateZ = (z * Math.cos(twist) + x * Math.sin(twist)) * radius
    const height = (depth - 0.5) * (80 + 36 * phase)
    return [200 + rotateX + height * 0.27, 175 + rotateZ * 0.41 - height].map(value => value.toFixed(2)).join(',')
  })
  return 'M' + vertices.join('L') + 'Z'
}


for (let phase = 0; phase < 5; phase++) {
  const edition = phase === 4
  const outlines = Array.from({ length: 52 }, (_, layer) =>
    `<path d="${contour(layer, phase, edition)}"/>`).join('')
  const drawing = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350">
    <defs><linearGradient id="metal"><stop stop-color="#315658"/><stop offset=".22" stop-color="#d0e8df"/><stop offset=".39" stop-color="#6c9591"/><stop offset=".61" stop-color="#1c474b"/><stop offset=".78" stop-color="#b8d1ca"/><stop offset="1" stop-color="#416568"/></linearGradient>
    <pattern width="18" height="18" patternUnits="userSpaceOnUse" id="grid"><circle cx="1" cy="1" r=".65" fill="#72938b" opacity=".55"/></pattern></defs>
    <rect width="400" height="350" fill="url(#grid)"/>
    <g fill="none" stroke="#72938b" stroke-width=".6"><path d="M22 175H378 M200 15V335" stroke-dasharray="2 6"/><path d="M31 30h10m-5 -5v10 M359 30h10m-5 -5v10 M31 320h10m-5 -5v10 M359 320h10m-5 -5v10"/>
    <ellipse cx="200" cy="175" rx="151" ry="65" transform="rotate(-22 200 175)" stroke-dasharray="3 5"/></g>
    <g stroke="url(#metal)" stroke-width="1.1" fill="${edition ? '#20383b' : '#0e2024'}">${outlines}</g></svg>`
  writeFileSync(`public/assets/studies/contour-${phase}.svg`, drawing)
}

const slugs = ['react', 'nodedotjs', 'nextdotjs', 'nestjs', 'typescript', 'docker', 'postgresql', 'mongodb', 'googlegemini']
const symbols = slugs.map(slug => {
  const svg = readFileSync(`node_modules/simple-icons/icons/${slug}.svg`, 'utf8')
  const path = svg.match(/<path[^>]*\/>/)[0]
  return `<symbol id="${slug}" viewBox="0 0 24 24">${path}</symbol>`
})
writeFileSync('public/assets/studies/technology.svg', '<svg xmlns="http://www.w3.org/2000/svg"><!-- Brand paths sourced from Simple Icons under CC0 1.0 -->' + symbols.join('') + '</svg>')
