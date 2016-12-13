var gulp        = require("gulp"),
    plugins     = require("gulp-load-plugins")(),
    browserSync = require("browser-sync").create(),
    pkg         = require("./package.json"),
    config = {
      autoprefixer: {
        browsers: ["last 2 versions"]
      },
      browserSync: {
        server: {
          baseDir: "./"
        },
        notify: false
      }
    };

gulp.task("browser-sync", function() {
  browserSync.init(config.browserSync);
});

gulp.task("build:css", function() {
  return gulp.src("scss/*.scss")
    .pipe(plugins.plumber())
    .pipe(plugins.sass.sync())
    .pipe(plugins.autoprefixer(config.autoprefixer))
    .pipe(gulp.dest("css/"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("serve", ["browser-sync"], function() {
  gulp.watch("scss/**/*.scss", ["build:css"]);
  gulp.watch("js/**/*.js", browserSync.reload);
  gulp.watch("*.html", browserSync.reload)
});
