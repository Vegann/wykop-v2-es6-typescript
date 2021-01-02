// // eslint-disable-next-line import/no-extraneous-dependencies
// const UglifyJS = require('uglify-js');
// const fs = require('fs');

// const indexJS = fs.readFileSync('dist/index.js', 'utf8');
// const utilsJS = fs.readFileSync('dist/utils.js', 'utf8');

// const result = UglifyJS.minify([indexJS, utilsJS], {
//   mangle: true,
//   compress: {
//     sequences: true,
//     dead_code: true,
//     conditionals: true,
//     booleans: true,
//     unused: true,
//     if_return: true,
//     join_vars: true,
//     drop_console: true,
//   },
// });

// fs.writeFileSync('dist/index.min.js', result.code);
const gulp = require('gulp');
const uglify = require('gulp-uglify');

const concatAndMinify = (cb) => {
  gulp
    .src(['dist/*.js'])
    .pipe(
      uglify({
        mangle: true,
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true,
        },
      }),
    )
    .pipe(gulp.dest('./dist'));
  cb();
};
exports.default = concatAndMinify;
