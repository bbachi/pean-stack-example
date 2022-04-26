const { src, dest, series, parallel } = require('gulp');
const del = require('del');
const fs   = require('fs');
const zip = require('gulp-zip');
const log = require('fancy-log');
const webpack_stream = require('webpack-stream');
const webpack_config = require('./webpack.config.js');
var exec = require('child_process').exec;

const paths = {
  prod_build: '../prod-build',
  server_file_name: 'api.bundle.js',
  angular_src: '../ui/dist/ui/**/*',
  angular_dist: '../prod-build/ui/build',
  zipped_file_name: 'pean-prod.zip'
};

function clean()  {
  log('removing the old files in the directory')
  return del('../prod-build/**', {force:true});
}

function createProdBuildFolder() {

  const dir = paths.prod_build;
  log(`Creating the folder if not exist  ${dir}`)
  if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    log('📁  folder created:', dir);
  }

  return Promise.resolve('the value is ignored');
}

function buildAngularCodeTask(cb) {
  log('building Angular code into the directory')
  return exec('cd ../ui && npm run build', function (err, stdout, stderr) {
    log(stdout);
    log(stderr);
    cb(err);
  })
}

function copyAngularCodeTask() {
  log('copying Angular code into the directory')
  return src(`${paths.angular_src}`)
        .pipe(dest(`${paths.angular_dist}`));
}

function copyNodeJSCodeTask() {
  log('building and copying server code into the directory')
  return webpack_stream(webpack_config)
        .pipe(dest(`${paths.prod_build}/api/`))
}

function zippingTask() {
  log('zipping the code ')
  return src(`${paths.prod_build}/**`)
      .pipe(zip(`${paths.zipped_file_name}`))
      .pipe(dest(`${paths.prod_build}`))
}

function installPG(cb) {
    log('zipping the code ')
    return exec('cd ../prod-build && npm install pg', function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    })
}



exports.default = series(
  clean,
  createProdBuildFolder,
  buildAngularCodeTask,
  parallel(copyAngularCodeTask, copyNodeJSCodeTask),
  installPG,
  zippingTask
);