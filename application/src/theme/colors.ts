import chroma from 'chroma-js'

// Map of single hue ColorBrewer scales, based on the research of Dr. Cynthia Brewer.
// https://colorbrewer2.org
export const colors = {
    red: chroma.scale('Reds').colors(6).reverse(),
    blue: chroma.scale('Blues').colors(6).reverse(),
    green: chroma.scale('Greens').colors(6).reverse(),
    shade: chroma.scale(['white', 'black']).colors(16),
}
