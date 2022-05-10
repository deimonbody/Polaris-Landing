const { default: imagemin } = require('imagemin');

let projectFolder = "dist"; //folder for result
let fs = require("fs");
let sourceFolder = "src";//folder with source folders

let path = {
    build:{
        html:projectFolder+"/",
        css:projectFolder+"/css/",
        js:projectFolder+"/js/",
        img:projectFolder+"/img/",
        fonts:projectFolder+"/fonts/"
    },
    src: {
        html:[sourceFolder+"/*.html","!" + sourceFolder + "/_*.html"],
        css:sourceFolder+"/scss/style.scss",
        js:sourceFolder+"/js/script.js",
        img:sourceFolder+"/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts:sourceFolder+"/fonts/*.ttf"    
    },
    watch: {
        html:sourceFolder+"/**/*.html",
        css:sourceFolder+"/scss/**/*.scss",
        js:sourceFolder+"/js/**/*.js",
        img:sourceFolder+"/img/**/*.{jpg,png,svg,gif,ico,webp}" 
    },
    clean:"./"+projectFolder+"/"
}

let {src,dest} = require('gulp'),
gulp = require("gulp"),
browsersync = require("browser-sync").create(),
fileInclude = require("gulp-file-include"),
del = require("del"),
scss = require("gulp-sass")(require("sass")),
autoprefixer = require("gulp-autoprefixer"),
group_media = require("gulp-group-css-media-queries"),
clean_css = require('gulp-clean-css'),
uglify = require("gulp-uglify-es").default,
rename = require('gulp-rename'),
webp = require("gulp-webp"),
imageMin = require("gulp-imagemin"),
webpHtml = require("gulp-webp-html"),
ttf2woff = require('gulp-ttf2woff'),
ttf2woff2 = require('gulp-ttf2woff2');






function html(){
    return src(path.src.html)
    .pipe(fileInclude())
    .pipe(webpHtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css(){
    return src(path.src.css) 
    .pipe(
        scss({
            outputStyle:"expanded"
        })
    )
    .pipe(dest(path.build.css))
    .pipe(group_media())
    .pipe(clean_css())
    .pipe(rename({
        extname:".min.css"
    }))
    .pipe(
        autoprefixer({
            overrideBrowserslist:["last 5 versions"],
            cascade:true,
        })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js(){
    return src(path.src.js)
    .pipe(fileInclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({
        extname:".min.js"
    }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images(){
    return src(path.src.img)
    .pipe(
        webp({
          quality:70  
        })
    )
    .pipe(dest(path.build.img)) 
    .pipe(src(path.src.img))
    .pipe(
        imageMin({
            progressive:true,
            interlaced:true,
            optimizationLevel:3
        })
    )
    
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}


function fonts(){
    src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
}





function browserSync(){
    browsersync.init({
        server:{
            baseDir:"./"+projectFolder+"/"
        },
        port:3000,
    })
}


function clean(params){
    return del(path.clean);
}

function watchFiles(){
    gulp.watch([path.watch.css],css);
    gulp.watch([path.watch.html],html);
    gulp.watch([path.watch.js],js);
    gulp.watch([path.watch.img],images);
}

function fontsStyle(params) {

    let file_content = fs.readFileSync(sourceFolder+ '/scss/fonts.scss');
        if (file_content == '') {
        fs.writeFile(sourceFolder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
            let fontname = items[i].split('.');
            fontname = fontname[0];
            if (c_fontname != fontname) {
                console.log(fontname);
                fs.appendFile(sourceFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                }
                    c_fontname = fontname;
            }
          }
        })
    }
}

function cb(){

}



let build = gulp.series(clean,gulp.parallel(js,css,html,images,fonts),gulp.parallel(fontsStyle, browserSync));
let watch = gulp.parallel(build,watchFiles);


exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build =  build;
exports.watch = watch;
exports.default = watch;
