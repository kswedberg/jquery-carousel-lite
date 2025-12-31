import { readFileSync, writeFileSync } from 'fs';
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';

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
const head = readFileSync('lib/tpl/header.tpl', 'utf8');
const foot = readFileSync('lib/tpl/footer.tpl', 'utf8');
const html = marked.parse(readme);
writeFileSync('index.html', head + html + foot);

export default marked;
