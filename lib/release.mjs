import ump from 'ump';
const releaseType = process.argv[2];


ump({
  releaseType,
  // debug: true,
  files: [
    'package.json',
  ],
  extras: [
    // Default prefix
    {file: 'jcarousellite.js'},
    {file: 'jcarousellite.min.js'},
    // Custom prefix
    {file: 'jcarousellite.js', prefix: 'Lite - v'},
    {file: 'jcarousellite.min.js', prefix: 'Lite - v'},
  ],
  // publish: true
});
