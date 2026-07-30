/**
 * Pre-compute dot positions for the world map.
 * Run: node src/data/generateMapDots.mjs
 * 
 * North America is centered. Scale is large so NA fills the center,
 * other continents extend outward filling space.
 */

import { readFileSync, writeFileSync } from 'fs';
import { feature } from 'topojson-client';
import { geoNaturalEarth1, geoContains } from 'd3-geo';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load local TopoJSON
const topoData = JSON.parse(readFileSync(join(__dirname, 'CountriesPoints.json'), 'utf-8'));
const world = feature(topoData, topoData.objects.countries);

// Projection: Natural Earth, rotated so North America is centered
// Scale is large so NA dominates the center; other continents extend beyond viewport
const projection = geoNaturalEarth1()
  .center([10, 40])       // Shift center slightly north so NA is vertically centered
  .rotate([100, 0])      // Rotate so ~100°W (center of NA) is at center
  .scale(350)            // Large scale - NA fills center, others extend out
  .translate([0, 0]);    // Origin at 0,0 for Three.js

const pts = [];
const spacing = 9;
const xRange = 1100;  // Wide range so continents on edges are covered
const yRange = 600;

console.log('Generating dot grid...');
let count = 0;

for (let x = -xRange; x <= xRange; x += spacing) {
  for (let y = -yRange; y <= yRange; y += spacing) {
    const coords = projection.invert([x, y]);
    if (!coords) continue;
    
    for (const feat of world.features) {
      if (geoContains(feat, coords)) {
        // Store as [x, -y] (invert y for Three.js)
        pts.push(x, -y);
        count++;
        break;
      }
    }
  }
}

console.log(`Generated ${count} dots`);

// Save as compact JSON - just a flat array of [x,y,x,y,...] pairs
writeFileSync(join(__dirname, 'mapDots.json'), JSON.stringify(pts));
console.log('Saved to mapDots.json');
