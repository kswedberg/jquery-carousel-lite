import { readFileSync, writeFileSync } from 'fs';
import { minify } from 'terser';

const packageFile = readFileSync('package.json', 'utf8');
const pkg = JSON.parse(packageFile);
const date = new Date();
const currentYear = date.getFullYear();
const currentMonth = date.getMonth() + 1;
const currentDay = date.getDate();
const versionPattern = /version: '(\d+\.\d+\.\d+)'/;
const srcPath = 'src/jquery.jcarousellite.js';

const banner = `/*!
 * ${pkg.title} - v${pkg.version} - ${currentYear}-${currentMonth}-${currentDay}
 * ${pkg.homepage}
 * Copyright (c) ${currentYear} ${pkg.author.name}
 * based on the original by Ganeshji Marwaha (gmarwaha.com)
 * Licensed ${pkg.licenses[0].type} (${pkg.licenses[0].url})
 */
`;

const srcFile = readFileSync(srcPath, 'utf8');
const updatedFile = srcFile.replace(versionPattern, `version: '${pkg.version}'`);
const js = banner + updatedFile;
writeFileSync(srcPath, updatedFile);
writeFileSync('jcarousellite.js', js);

const compressFile = async(js) => {
  const result = await minify(js);
  return result.code;
};

compressFile(js)
.then((compressed) => {
  writeFileSync('jcarousellite.min.js', compressed);
})
