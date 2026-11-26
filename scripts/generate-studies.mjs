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


const coatings = [
  ['#173176','#9ecaff','#3673ed','#273f9a','#c5dafa','#446aea'],
  ['#352473','#e1c8ff','#9463eb','#543099','#d0bbff','#754ee9'],
  ['#781254','#ffc4e8','#e354aa','#6c2b91','#fcc0e5','#ae439c'],
  ['#7e332c','#ffcdad','#ed7459','#873966','#ffd2b9','#d56954'],
  ['#2c3fd4','#c3c7ff','#8866e8','#422485','#f8a9da','#634be2'],
]
const offsets = [0,.22,.39,.61,.78,1]
for (let phase = 0; phase < 5; phase++) {
  const edition = phase === 4
  const outlines = Array.from({ length: 52 }, (_, layer) =>
    `<path d="${contour(layer, phase, edition)}"/>`).join('')
  const drawing = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350">
    <defs><linearGradient id="metal">${coatings[phase].map((color,i)=>`<stop offset="${offsets[i]}" stop-color="${color}"/>`).join('')}</linearGradient>
    <pattern width="18" height="18" patternUnits="userSpaceOnUse" id="grid"><circle cx="1" cy="1" r=".65" fill="#8e86b5" opacity=".55"/></pattern></defs>
    <rect width="400" height="350" fill="url(#grid)"/>
    <g fill="none" stroke="#8e86b5" stroke-width=".6"><path d="M22 175H378 M200 15V335" stroke-dasharray="2 6"/><path d="M31 30h10m-5 -5v10 M359 30h10m-5 -5v10 M31 320h10m-5 -5v10 M359 320h10m-5 -5v10"/>
    <ellipse cx="200" cy="175" rx="151" ry="65" transform="rotate(-22 200 175)" stroke-dasharray="3 5"/></g>
    <g stroke="url(#metal)" stroke-width="1.1" fill="${edition ? '#252268' : '#101018'}">${outlines}</g></svg>`
  writeFileSync(`public/assets/studies/contour-${phase}.svg`, drawing)
}

const slugs = ['react', 'nodedotjs', 'nextdotjs', 'nestjs', 'typescript', 'docker', 'postgresql', 'mongodb', 'googlegemini']
const symbols = slugs.map(slug => {
  const svg = readFileSync(`node_modules/simple-icons/icons/${slug}.svg`, 'utf8')
  const path = svg.match(/<path[^>]*\/>/)[0]
  return `<symbol id="${slug}" viewBox="0 0 24 24">${path}</symbol>`
})
writeFileSync('public/assets/studies/technology.svg', '<svg xmlns="http://www.w3.org/2000/svg"><!-- Brand paths sourced from Simple Icons under CC0 1.0 -->' + symbols.join('') + '</svg>')
