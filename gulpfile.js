const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs')
const fonter = require('gulp-fonter');

// конвертер шрифтов при надобности
gulp.task('fonts', () => {
  return gulp
    .src('./src/fonts/*')
    .pipe(fonter({
      subset: [66, 67, 68, 69, 70, 71],
      formats: ['woff', 'ttf']
    }))
    .pipe(gulp.dest('./dist'));
});

// таск очистки
gulp.task('clean', (done) => {

  if (fs.existsSync('./dist/')) {
    return gulp.src('./dist/', { read: false })
      .pipe(clean({ force: true }))
  }

  done()
})

const fileIncludeSettings = {
  prefix: '@@',

  basepath: '@file'
};

const serverOptions = {
  livereload: true,

  open: true,
}

// таск сборки html
gulp.task('html', () => {
  return gulp.src('./src/*.html')
    .pipe(fileInclude(fileIncludeSettings))

    .pipe(gulp.dest('./dist/'))
});

// таск сборки шрифтов
gulp.task('fonts', () => {
  return gulp.src('./src/fonts/*')
    .pipe(fileInclude(fileIncludeSettings))

    .pipe(gulp.dest('./dist/fonts/'))
});

// таск сборки javascript
gulp.task('script', () => {
  return gulp.src('./src/script/**/*.*')
    .pipe(fileInclude(fileIncludeSettings))

    .pipe(gulp.dest('./dist/script/'))
});

// таск сборки scss
gulp.task('sass', () => {
  return gulp.src('./src/scss/*.scss')
    .pipe(sass())

    .pipe(gulp.dest('./dist/css/'))
  ;

})

// таск сборки изображений
gulp.task('images', () => {
  return gulp.src('./src/img/**/*')
    .pipe(gulp.dest('./dist/img/'))
})

gulp.task('server', () => {
  return gulp.src('./dist/')
    .pipe(server(serverOptions))
})

// watcher
gulp.task('watch', () => {
  gulp.watch('./src/scss/**/*.scss', 
    gulp.parallel('sass')
  );
  gulp.watch('./src/**/*.html', 
    gulp.parallel('html')
  );
  gulp.watch('./src/img/**/*', 
    gulp.parallel('images')
  );
  gulp.watch('./src/script/**/*', 
    gulp.parallel('script')
  );
})

gulp.task('default', gulp.series(
  'clean', 
  gulp.parallel('html', 'sass', 'images', 'script', 'fonts'),
  gulp.parallel('server', 'watch')
))

