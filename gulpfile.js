const gulp = require('gulp')
const babel = require('gulp-babel')

const transpile = targets =>
  babel({ presets: [['env', { targets }]] })

gulp.task('server', () => gulp
  .src('src/server.js')
  .pipe(transpile({ node: true }))
  .pipe(gulp.dest('dist')))

gulp.task('parser', () => gulp
  .src('src/parse.js')
  .pipe(transpile({ chrome: 59 }))
  .pipe(gulp.dest('dist')))

gulp.task('default', ['server', 'parser'])
