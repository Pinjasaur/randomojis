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
        notify: false,
        // Create a tunnel (if using `--tunnel`) with a subdomain of:
        // 1. the first "chunk" of the package.json `name`
        // 2. a random 6-character string appended to it
        // Note: needs to be lowercased alphanumerics
        tunnel: plugins.util.env.tunnel ?
                (pkg.name.trim().toLowerCase().split(/[^a-zA-Z0-9]/g)[0] + // [1]
                Math.random().toString(36).substr(2, 6)) :                 // [2]
                false,
      }
    };

// Build the SCSS (Autoprefixer, Sourcemaps)
gulp.task("build:css", function() {
  return gulp.src("scss/*.scss")
    .pipe(plugins.plumber())
    .pipe(plugins.sass.sync())
    .pipe(plugins.autoprefixer(config.autoprefixer))
    .pipe(gulp.dest("css/"))
    .pipe(browserSync.reload({ stream: true }));
});

// Build the JS (lint)
gulp.task("build:js", function() {
  // Ignore JS in the js/vendor directory since we didn't author it
  return gulp.src([paths.src + "/js/**/*.js", "!" + paths.src + "/js/{vendor,vendor/**}"])
    .pipe(plugins.jshint(config.jshint))
    .pipe(plugins.jshint.reporter("jshint-stylish"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("serve", function() {
  browserSync.init(config.browserSync);
  gulp.watch("scss/**/*.scss", ["build:css"]);
  gulp.watch("js/**/*.js", ["build:js"]);
  gulp.watch("*.html", browserSync.reload)
});
