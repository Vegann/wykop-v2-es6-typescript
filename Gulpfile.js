const gulp = require('gulp');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('default', () => tsProject.src()
  .pipe(tsProject())
  .pipe(gulp.dest('dist')));

gulp.task('watch:ts', () => {
  gulp.watch('lib/*.ts', ['default']);
});
