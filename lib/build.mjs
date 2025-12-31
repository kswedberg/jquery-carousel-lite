import { readFileSync, writeFileSync } from 'fs';
const packageFile = readFileSync('package.json', 'utf8');
const pkg = JSON.parse(packageFile);
const currentYear = new Date().getFullYear();
import { minify } from "terser";
const banner = `/*!
 * ${pkg.title} - v${pkg.version} - ${pkg.homepage}
 * Copyright (c) ${currentYear} ${pkg.author.name}
 * based on the original by Ganeshji Marwaha (gmarwaha.com)
 * Licensed ${pkg.licenses[0].type} (${pkg.licenses[0].url})
 */
`;
const srcFile = readFileSync('src/jquery.jcarousellite.js', 'utf8');
const js = banner + srcFile;
writeFileSync('jcarousellite.js', js);

const compressFile = async(js) => {
  const result = await minify(js);
  return result.code;
};

compressFile(js)
.then((compressed) => {
  writeFileSync('jcarousellite.min.js', compressed);
})
