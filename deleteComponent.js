const fs = require('fs');
const reg = /^.*\.md$/;
const _path = './_posts'

let all_files = fs.readdirSync(_path);
let files = all_files.filter(item => reg.test(item));

files.forEach(item => {
  try {
    fs.readFile(`${_path}/${item}`, 'utf-8', (err, data) => {
      if(err) console.log(err);
      fs.writeFile(`${_path}/${item}`, data.replace(/\n\n<comment \/>/g, ''), (err) => {
        if(err) console.log(err)
      })
    })
  } catch(err) {
    console.log(err);
  }
})