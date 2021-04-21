const fs = require('fs');
const reg = /^.*\.md$/;
const _path = './_posts'

let all_files = fs.readdirSync(_path);
let files = all_files.filter(item => reg.test(item));

files.forEach(item => {
  try {
    fs.appendFileSync(`${_path}/${item}`, '\n\n<comment />');
  } catch(err) {
    console.log(err);
  }
})