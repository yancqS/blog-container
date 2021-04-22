const fs = require('fs');
const path = require('path');
const reg = /^.*\.md$/;
const _path = './_posts'
const base = 'https://yancqs.github.io/blog';
const readme_path = '.vuepress/public/README.md';

let all_files = fs.readdirSync(_path);
let files = all_files.filter(item => reg.test(item)).reverse();

let file_name = files.map(item => path.parse(item).name);
let URL = file_name.map(item => {
  let date = item.split('-').slice(0, 3).join('/');
  let paper_name = item.split('-')
    .slice(3)
    .map(subitem => (subitem + '').toLowerCase())
    .map(lowerString => lowerString.replace(/[^a-z0-9\)]/g, '-'))
    .map(string => string.replace(/\)([^-]).*/, "-$1"))
    .map(string => string.replace(/\)/, ""))
    .join('-');
  return `${base}/${date}/${paper_name}/`;
})

if(fs.existsSync(readme_path)) {
  fs.unlinkSync(readme_path);
}

fs.writeFileSync(readme_path, `# <center>目录</center>\n\n![](https://img.shields.io/badge/Yoha's%20Blog-Count%20${files.length}-green)\n\n`)

//异步去写文件会导致顺序发生变化。这个应该有解法。我要再想一下。先用同步读写操作。

// files.forEach(async (item, index) => {
//   let data = await fs.promises.readFile(`${_path}/${item}`, 'utf-8');
//   let _title = data.split('---')[1].split('\n')[1].split(':');
//   _title.shift()
//   let title = _title.join(':').trim();
//   fs.promises.appendFile(readme_path, `- [${title}](${URL[index]})\n`);
// })

files.forEach((item, index) => {
  let data = fs.readFileSync(`${_path}/${item}`, 'utf-8');
  let _title = data.split('---')[1].split('\n')[1].split(':');
  _title.shift()
  let title = _title.join(':').trim();
  fs.appendFileSync(readme_path, `- [${title}](${URL[index]})\n`, 'utf-8');
})
