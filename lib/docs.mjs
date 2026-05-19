import { readFileSync, writeFileSync } from 'fs';
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import pkg from '../package.json' with { type: 'json' };

const marked = new Marked(
  markedHighlight({
  emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

const readme = readFileSync('readme.md', 'utf8');
const foot = readFileSync('lib/tpl/footer.tpl', 'utf8');

const rawHead = readFileSync('lib/tpl/header.tpl', 'utf8');
const head = rawHead.replace(/\{\{\s([\w]+)\s*\}\}/g, (match, group) => {
  return pkg[group] ?? '';
});

const html = marked.parse(readme);

writeFileSync('index.html', head + html + foot);
