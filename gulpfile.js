import gulp from "gulp";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import browserSync from "browser-sync";
import nunjucksRender from "gulp-nunjucks-render";
import sass from "gulp-sass";
import * as dartSass from "sass";
import sourcemaps from "gulp-sourcemaps";
import gulpif from "gulp-if";
import autoprefixer from "gulp-autoprefixer";
import postcss from "gulp-postcss";
import sortMediaQueries from "postcss-sort-media-queries";
import webpackStream from "webpack-stream";
import webpack from "webpack";
import plumber from "gulp-plumber";
import terser from "gulp-terser";
import newer from "gulp-newer";
import webp from "gulp-webp";
import { deleteAsync } from "del";
import { readFileSync } from "fs";
import data from "gulp-data";
import concat from "gulp-concat";
import merge from "merge-stream";
import fs from "fs";

const sassCompiler = sass(dartSass);
const server = browserSync.create();
const argv = yargs(hideBin(process.argv)).argv;

const isProd = () => !!argv.prod;
const isDev = () => !argv.prod;

const path = {
  src: {
    html: "src/*.html",
    data: "src/data/**/*.{json,js}",
    scss: ["src/assets/styles/main.sass", "src/assets/styles/libs/**/*.{sass,scss,css}"],
    js: "src/assets/js/**/*.{js,ts}",
    libs: "src/assets/libs/**/*.js",
    image: "src/assets/img/**/*.{jpg,jpeg,png,gif,svg}",
    fonts: "src/assets/fonts/**/*.{woff,woff2,ttf}",
  },
  dist: {
    base: "dist/",
    html: "dist/",
    css: "dist/assets/css/",
    cssLibs: "dist/assets/css/libs/",
    js: "dist/assets/js/",
    jsLibs: "dist/assets/js/libs/",
    image: "dist/assets/img/",
    fonts: "dist/assets/fonts/",
  },
  watch: {
    html: "src/**/*.html",
    data: "src/data/**/*.{json,js}",
    scss: "src/assets/styles/**/*.{sass,scss,css}",
    js: "src/assets/js/**/*.{js,ts}",
    libs: "src/assets/libs/**/*.js",
    image: "src/assets/img/**/*.{jpg,jpeg,png,gif,svg}",
    fonts: "src/assets/fonts/**/*.{woff,woff2,ttf}",
    video: "src/assets/video/**/*.{mp4,webm,mov,ogg}",
  },
};

let projectConfig;
try {
  projectConfig = JSON.parse(readFileSync("./projectConfig.json", "utf8"));
} catch (err) {
  console.error("Error reading projectConfig.json:", err.message);
  projectConfig = {};
}

function serverStart(done) {
  server.init({
    server: {
      baseDir: path.dist.base,
      mimeTypes: {
        woff: "font/woff",
        woff2: "font/woff2",
        ttf: "font/ttf",
        css: "text/css",
      },
    },
    notify: false,
    online: true,
    snippetOptions: {
      rule: {
        fn: function (snippet, match) {
          return `<script async src="/browser-sync/browser-sync-client.js?v=3.0.4"></script>${match}`;
        },
      },
    },
  });
  done();
}

async function clean() {
  return await deleteAsync(path.dist.base);
}

function html(done) {
  return gulp
    .src(path.src.html, { allowEmpty: true })
    .pipe(
      plumber({
        errorHandler: function (err) {
          console.log("HTML processing error:", err.message);
          this.emit("end");
        },
      })
    )
    .pipe(
      data(() => {
        try {
          return JSON.parse(fs.readFileSync("src/data/data.json", "utf8"));
        } catch (err) {
          console.error("Error reading data.json:", err.message);
          return {};
        }
      })
    )
    .pipe(
      nunjucksRender({
        path: ["src/html"],
      }).on("error", function (err) {
        console.log("Nunjucks error:", err.message);
        this.emit("end");
      })
    )
    .pipe(gulp.dest(path.dist.html))
    .pipe(server.reload({ stream: true }))
    .on("end", done);
}


function copyVideos() {
  return gulp
    .src("src/assets/video/**/*.{mp4,webm,mov,ogg}")
    .pipe(newer("dist/assets/video"))
    .pipe(gulp.dest("dist/assets/video"));
}

function copyCssLibs() {
  return gulp
    .src("src/assets/styles/libs/**/*.css")
    .pipe(newer("dist/assets/css/libs"))
    .pipe(gulp.dest("dist/assets/css/libs"));
}


function scss(done) {
  const mainStream = gulp
    .src("src/assets/styles/main.sass", { allowEmpty: true })
    .pipe(
      plumber({
        errorHandler: function (err) {
          console.log("SCSS main processing error:", err.message);
          this.emit("end");
        },
      })
    )
    .pipe(gulpif(isDev(), sourcemaps.init()))
    .pipe(sassCompiler().on("error", sassCompiler.logError))
    .pipe(gulpif(isProd(), autoprefixer({ grid: true })))
    .pipe(gulpif(isProd(), postcss([sortMediaQueries()])))
    .pipe(concat("main.css"))
    .pipe(gulpif(isDev(), sourcemaps.write()))
    .pipe(gulp.dest(path.dist.css));

  return merge(mainStream)
    .pipe(server.reload({ stream: true }))
    .on("end", done);
}

function js(done) {
  return gulp
    .src(path.src.js, { allowEmpty: true })
    .pipe(
      plumber({
        errorHandler: function (err) {
          console.log("JS processing error:", err.message);
          this.emit("end");
        },
      })
    )
    .pipe(
      webpackStream(
        {
          mode: isProd() ? "production" : "development",
          output: { filename: "app.js" },
        },
        webpack
      ).on("error", function (err) {
        console.log("Webpack error:", err.message);
        this.emit("end");
      })
    )
    .pipe(gulpif(isProd(), terser()))
    .pipe(gulp.dest(path.dist.js))
    .pipe(server.reload({ stream: true }))
    .on("end", done);
}

function libs(done) {
  return gulp
    .src(path.src.libs, { encoding: false, allowEmpty: true })
    .pipe(
      plumber({
        errorHandler: function (err) {
          console.log("Libs processing error:", err.message);
          this.emit("end");
        },
      })
    )
    .pipe(gulp.dest(path.dist.jsLibs))
    .pipe(server.reload({ stream: true }))
    .on("end", done);
}

function image(done) {
  return gulp
    .src(path.src.image, { encoding: false, allowEmpty: true })
    .pipe(
      plumber({
        errorHandler: function (err) {
          console.log("Image processing error:", err.message);
          this.emit("end");
        },
      })
    )
    .pipe(newer(path.dist.image))
    .pipe(gulp.dest(path.dist.image))
    .pipe(gulp.src("src/assets/img/**/*.{jpg,jpeg,png}", { encoding: false, allowEmpty: true }))
    .pipe(
      plumber({
        errorHandler: function (err) {
          console.log("WebP conversion error:", err.message);
          this.emit("end");
        },
      })
    )
    .pipe(webp({ quality: 80 }))
    .pipe(gulp.dest(path.dist.image))
    .pipe(server.reload({ stream: true }))
    .on("end", done);
}

function fonts(done) {
  return gulp
    .src(path.src.fonts, { encoding: false, allowEmpty: true })
    .pipe(
      plumber({
        errorHandler: function (err) {
          console.log("Font processing error:", err.message);
          this.emit("end");
        },
      })
    )
    .pipe(newer(path.dist.fonts))
    .pipe(gulp.dest(path.dist.fonts))
    .pipe(server.reload({ stream: true }))
    .on("end", done);
}

function watch() {
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.data, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.libs, libs);
  gulp.watch(path.watch.image, image);
  gulp.watch(path.watch.fonts, fonts);
  gulp.watch(path.watch.video, copyVideos);
}

const build = gulp.series(clean, gulp.parallel(html, scss, js, libs, image, fonts, copyCssLibs, copyVideos));
const dev = gulp.series(build, gulp.parallel(watch, serverStart));

export { build, dev };
export default dev;