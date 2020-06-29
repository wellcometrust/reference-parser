const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const concat = require('gulp-concat');

const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const browserify = require("browserify");
const babel = require("babelify");

const postcss = require('gulp-postcss');
const url = require('postcss-url');

const plugins = [
      require('precss'),
      require('autoprefixer'),
      require('postcss-import'),
      url({url: "inline"}), // Inline font URLs in our CSS
      require('cssnano')
];

const paths = {
  css: {
    source: [
      "/opt/reach/build/web/src/**/*.css",
    ],
  },
  js: {
    source: [
      "/opt/reach/build/web/src/js/app.js"
    ],
  },
  images: {
    source: [
      "/opt/reach/build/web/src/images/*"
    ]
  },
  favicons: {
    source: [
      "/opt/reach/build/web/src/favicon/*"
    ]
  },
  build: {
    destBuildFolder: "/opt/reach/build/web/static",
    destMinCSSFileName: "styles.css",
    destMinJSFileName: "js/main.js",
    destImages: "/opt/reach/build/web/static/images",
    destFavicons: "/opt/reach/build/web/static/favicon"
  }
}

gulp.task("css", (done) => {
  gulp.src(paths.css.source)
    .pipe(buffer())
    .pipe(postcss(plugins))
    .pipe(gulp.dest(paths.build.destBuildFolder));

  done();
});

gulp.task("js", (done) => {
    const bundler = browserify({ entries: paths.js.source }, { debug: true })
        .transform(babel.configure({
            presets: [[
                "@babel/preset-env",
                {
                    forceAllTransforms: true,
                    debug: false,
                    useBuiltIns: "entry",
                    modules: "commonjs",
                    targets: "> 0.25%, ie 11, not dead",
                    corejs: { version: 3, proposals: true}
                }
            ]],
            plugins: [
                "@babel/plugin-transform-arrow-functions",
                "@babel/plugin-transform-for-of",
                "@babel/plugin-transform-typeof-symbol"
            ]

        }));

  bundler.bundle()
    .on("error", function (err) { console.error(err); this.emit("end"); })
    .pipe(source(paths.build.destMinJSFileName))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write(paths.js.destMapFolder))
    .pipe(gulp.dest(paths.build.destBuildFolder));

  done();
});

gulp.task("images", (done) => {
    gulp.src(paths.images.source)
      .pipe(gulp.dest(paths.build.destImages));

    done();
});

gulp.task("favicons", (done) => {
    gulp.src(paths.favicons.source)
      .pipe(gulp.dest(paths.build.destFavicons));

    done();
});

gulp.task("default", gulp.series("css", "js", "images", "favicons"), (done) => done());
