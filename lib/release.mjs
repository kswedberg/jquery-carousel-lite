import ump from 'ump';
import 'dotenv/config'

const releaseType = process.argv[2];

ump({
  releaseType,
  release: true,
  debug: true,
  files: [
    'package.json',
  ],
  extras: [
    // Default prefix
    {file: 'src/jquery.jcarousellite.js'},
    {file: 'jcarousellite.js'},
    {file: 'jcarousellite.min.js'},
    // Custom prefix
    {file: 'jcarousellite.js', prefix: 'Lite - v'},
    {file: 'jcarousellite.min.js', prefix: 'Lite - v'},
  ],
});
