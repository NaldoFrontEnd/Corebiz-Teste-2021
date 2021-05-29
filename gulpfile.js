var gulp = require('gulp');
var connect = require('gulp-connect');
var middlewares = require('./speed-middleware');
var proxy = require('proxy-middleware');
var serveStatic = require('serve-static');
var httpPlease = require('connect-http-please');
var url = require('url');
var fs = require('fs');

var packageSettings = JSON.parse(fs.readFileSync('./package.json'));

var accountName = process.env.VTEX_ACCOUNT || packageSettings.accountName || "noaccount";
var filePrefix = packageSettings.filePrefix || ''
var env = process.env.VTEX_ENV || 'vtexcommercestable';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

var proxyOptions, portalProxyOptions;

var proxyOptions = url.parse("https://" + accountName + ".vteximg.com.br");
proxyOptions.route = "/arquivos/*";

var portalHost = accountName + "." + env + ".com.br";
var portalProxyOptions = url.parse("https://" + portalHost + "/");
portalProxyOptions.preserveHost = true;

gulp.task('connect', function () {
  connect.server({
    hostname: '*',
    port: 80,
    livereload: true,
    middleware: function (connect, opt) {
      return [middlewares.disableCompression, middlewares.replaceHtmlBody(env, portalHost), httpPlease({
        host: portalHost
      }), serveStatic('./build'), proxy(proxyOptions), proxy(portalProxyOptions), middlewares.errorHandler];
    }
  });
});

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var wait = require('gulp-wait');
var svgmin = require('gulp-svgmin')

//es6
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var babelify = require("babelify");
var gulpif = require("gulp-if");
var babel = require('gulp-babel');
var buffer = require("vinyl-buffer");
var babelifyConfig = {
  presets: ["es2015", "es2015-ie"],
  sourceMaps: false,
  plugins: ["syntax-async-functions", "transform-regenerator"]
};

gulp.task('sass', function () {
    return gulp.src(['assets/styles/**/*.css', 'assets/styles/**/*.scss'])
        .pipe(wait(1000))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass().on('error', sass.logError))
        //.pipe(concat('main.css'))
        .pipe(cssmin())
        //.pipe(rename({prefix: filePrefix, suffix: '-min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/arquivos/'))
        .pipe(connect.reload());
});

gulp.task('principalScripts', function() {
      return browserify({ debug: true})
        .transform(babelify.configure(babelifyConfig))
        .require("assets/scripts/App.js", { entry: true })
        .bundle()
        .on('error', swallowError)
        .pipe(source('00-Corebiz-2021-Scripts.js'))
        .pipe(buffer())
        .pipe(uglify().on("error", swallowError))
        
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        //.pipe(rename({prefix: filePrefix, suffix: '.min' }))
        .pipe(gulp.dest('build/arquivos/'))
        .pipe(connect.reload());
});

gulp.task('svg', function () {
  return gulp.src('assets/svgs/*.svg')
  .pipe(svgmin())
  .pipe(gulp.dest('build/arquivos/svgs/'))
})

gulp.task('images', function(){
  gulp.src('assets/images/**/*')
  .pipe(newer('build/arquivos/'))
  .pipe(imagemin({ progressive: true }))
  .pipe(gulp.dest('build/arquivos/'))
  .pipe(connect.reload());
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('assets/images/sprite/**/*')
  .pipe(spritesmith({
      imgName: 'spritesheet-01.png',
      cssName: '_sprite.scss',
      padding: 10
  }))

  spriteData.img.pipe(gulp.dest('build/arquivos/'))
  spriteData.css.pipe(gulp.dest('assets/styles/settings/'))
});

gulp.task("watch", function() {
  gulp.watch(
    [
      "assets/scripts/**/*.js",
    ],
    ["principalScripts"]
  );
  gulp.watch("assets/styles/**/*.scss", ["sass"]);
  gulp.watch("assets/images/**/*", ["images"]);
  gulp.watch('assets/svgs/*.svg', ["svg"]);
  gulp.watch("assets/images/sprite/**/*", ["sprite"]);
});

gulp.task("scripts", ["principalScripts"]);

gulp.task("default", [
  "connect",
  "images",
  "svg",
  "watch",
  "sass",
  "sprite",
  "scripts"
]);

gulp.task('server', ['connect', 'watch', 'sprite']);
gulp.task('build',  ['images', 'sass', 'scripts','sprite' ]);
gulp.task('js', ['scripts']);

function swallowError (error) {
  console.log(error.toString());
  this.emit('end');
}
