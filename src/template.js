const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const crypto = require('crypto')
const glob = require('glob');
const pupa = require('pupa');

module.exports = async params => {
  const {context} = params.compilation.options;
  const htmlFilename = path.resolve(context, 'src/template.html');
  const html = await promisify(fs.readFile)(htmlFilename, 'utf-8');

  const [cssFilename] = await promisify(glob)(path.resolve(context, 'dist/foo.css'));
  const css = await promisify(fs.readFile)(cssFilename, 'utf-8');
  const cssBasename = path.basename(cssFilename);
  const md5hash = crypto.createHash('md5');
  md5hash.update(css);

  return pupa(html, {
    href: '/' + cssBasename + '?' + md5hash.digest('hex').slice(0, 20)
  });
}
