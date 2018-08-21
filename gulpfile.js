const gulp         = require('gulp'), // need it to run gulp and everything else
      browserSync  = require('browser-sync').create(), // for syncing the browser
      sass         = require('gulp-sass'), // for compiling SCSS
      postcss      = require('gulp-postcss'), // for autofixing CSS
      sourcemaps   = require('gulp-sourcemaps'), // for autofixing CSS
      autoprefixer = require('autoprefixer'), // for autofixing CSS
      cssmin       = require('gulp-cssmin'), // for minifying CSS
      rename       = require('gulp-rename') // for minifying CSS

// Static server + watching scss/html files
gulp.task('serve', () => { 
    browserSync.init({
        server: "./public"
    })
    gulp.watch("scss/**/*.scss", ['sass', 'minify'])
    gulp.watch("public/*.html").on('change', browserSync.reload)
    gulp.watch('public/scripts/*.js').on('change', browserSync.reload)
})

// Compile sass into CSS & run autoprefixer & minify & auto-injects into browsers
gulp.task('sass', () => {
    return gulp.src("scss/bootstrap.scss")
        // compiler
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest("public/css"))
        // auto fixer
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("public/css"))
        // browser sync
        .pipe(browserSync.stream())
})

// Minifying the CSS - this will only run AFTER the sass task has completed
gulp.task('minify', ['sass'], () => {
    gulp.src("public/css/bootstrap.css")
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest("public/css"))
        .pipe(browserSync.stream())
})

// Run all the tasks
gulp.task('default', ['sass', 'minify', 'serve'])