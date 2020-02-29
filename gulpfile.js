const gulp = require('gulp');
const postcss = require('gulp-postcss')
const sass = require('gulp-sass');

gulp.task('sass', function() {
    return gulp.src('src/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            require('tailwindcss'),
            require('autoprefixer')
        ]))
        .pipe(gulp.dest('public/css/'))
});

gulp.task('sass:watch', function() {
    gulp.watch("./src/**/*.scss", gulp.series('sass'));
});