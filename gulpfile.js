const { src, dest, series, watch, parallel } = require("gulp")
const sass = require("gulp-sass")(require("sass"))
const csso = require("gulp-csso")
const include = require("gulp-file-include")
const htmlmin = require("gulp-htmlmin")
const concat = require("gulp-concat")
const autoprefixer = require("gulp-autoprefixer")
const imagemin = require("gulp-imagemin")
const uglify = require("gulp-uglify-es").default
const babel = require("gulp-babel")
const del = require("del")
const sync = require("browser-sync").create()

const html = async cb => {
  await src("app/**.html")
    .pipe(include({
      prefix: "@@"
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest("dist"))

  cb()
}

const scss = async cb => {
  await src("app/scss/**.scss")
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(concat("style.css"))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 version']
    }))
    .pipe(csso())
    .pipe(dest("dist"))

  cb()
}

const js = async cb => {
  await src("app/**.js")
    .pipe(concat('main.js'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(dest("dist"))

  cb()
}

const image = async cb => {
  await src("app/img/*.*")
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
      }),
    ]))
    .pipe(dest("dist/img"))

  cb()
}

const files = async cb => {
  await src("app/fonts/*.*")
    .pipe(dest("dist/fonts"))

  await src("app/img/*.*")
    .pipe(dest("dist/img"))
}

const clear = async (cb) => {
  await del('dist')

  cb()
}

const serve = (cb) => {
  sync.init({
    server: {
      baseDir: "./dist"
    },
    tunnel: true
  })

  watch('app/**.html', series(html)).on("change", sync.reload)
  watch('app/parts/**.html', series(html)).on("change", sync.reload)
  watch('app/scss/**.scss', series(scss)).on('change', sync.reload)
  watch('app/**.js', series(js)).on('change', sync.reload)

  cb()
}

exports.build = series(clear, html, scss, js, files)
// exports.serve = series(clear, html, scss, js, files, serve)
exports.serve = series(clear, html, scss, js, files, image, serve)
exports.clear = clear