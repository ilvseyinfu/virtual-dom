#!/usr/bin/env node

'use strict';

/**
 * 这个脚本用来从 index.html 生成 template.html.ejs
 * @author 五柳
 */

const path        = require('path');
const fs          = require('fs');
const webpackCfg  = require('../webpack.config');
const cheerio     = require('cheerio');
const hash        = require('hash-file');
const { Promise } = require('es6-promise');
const mkdirp      = require('mkdirp');

const OUTPUT_PATH = webpackCfg.output.path;
const REMOTE_PATH = webpackCfg.output.publicPath;

function makeTemplate() {
  fs.readFile('src/index.html', function(err, data) {
    if (err) throw err;

    dealWithImages(data)
      .then(dealWithScripts)
      .then(generateHtml);
  });
}

let $;

/**
 * 图片文件进行哈希化文件名后，更改在 html 内的引用
 */
function dealWithImages(data) {
  $ = cheerio.load(data);

  let workers = [];

  $('img').each(function(i, elem) {
    const $this = $(this);
    const src   = $this.attr('src');
    if (!src || /^https?:\/\//i.test(src)) {
      return;
    }
    const imgsrc   = path.join(__dirname, '../src/', src);
    const basename = path.basename(src);

    workers.push(hash(imgsrc).then( hash => {
        const distName  = basename.replace(/\.(.*)$|$/, "-" + hash + ".$1");
    const distPath  = path.join(OUTPUT_PATH, distName);
    const remoteSrc = REMOTE_PATH + distName;

    $this.attr('src', remoteSrc);

    mkdirp(path.dirname(distPath), () => {
      fs.createReadStream(imgsrc)
      .pipe(fs.createWriteStream(distPath));
  });
  }));

  });

  return Promise.all(workers);
}

/**
 * 本地 script 统一去掉
 */
function dealWithScripts() {
  $('script').each(function(_, elm) {
    const $this = $(this);
    const src = $(this).attr('src');
    if (!src || /^https?:\/\//i.test(src)) {
      return;
    }
    $this.remove();
  });
}

function generateHtml() {
  fs.writeFile('src/template.html.ejs', $.html({decodeEntities: false}));
}

makeTemplate();
