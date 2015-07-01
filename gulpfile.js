var gulp = require('gulp'),
	clean = require('gulp-clean'),
	jade = require('gulp-jade'),
	sass = require('gulp-sass'),
	inlineimage = require('gulp-inline-image'),
	prefix = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect'),
	open = require('gulp-open'),
	uncss = require('gulp-uncss'),
	csso = require('gulp-csso');

var assetsDir = 'assets/';
var outputDir = 'dist/';

gulp.task('jade', function() {
	gulp.src([assetsDir+'jade/*.jade', '!'+assetsDir+'jade/_*.jade'])
		.pipe(plumber())
		.pipe(jade({pretty:true}))
		.pipe(gulp.dest('./dist/'))
		.pipe(connect.reload());
});

gulp.task('sass', function() {
	gulp.src([assetsDir+'sass/**/*.scss', '!'+assetsDir+'sass/_*.scss'])
		.pipe(plumber())
		.pipe(sass())
		.pipe(inlineimage())
		.pipe(prefix('last 3 versions'))
		.pipe(csso())
		.pipe(gulp.dest('./dist/styles'))
		.pipe(connect.reload());
});

gulp.task('js', function () {
	return gulp.src(assetsDir+'js/*.js')
		.pipe(gulp.dest(outputDir + '/js'))
		.pipe(connect.reload());
});

gulp.task('image', function () {
	return gulp.src([assetsDir+'i/**/*','!'+assetsDir+'i/icons/*.svg'])
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(outputDir + '/i'));
});

gulp.task('fonts', function() {
	return gulp.src(assetsDir+'fonts/**/*')
		.pipe(gulp.dest(outputDir + '/fonts'));
});

gulp.task('watch', function () {
	gulp.watch(assetsDir+'jade/*.jade', ['jade']);
	gulp.watch(assetsDir+'jade/templates/*.jade', ['jade']);
	gulp.watch(assetsDir+'sass/includes/*.scss', ['sass']);
	gulp.watch(assetsDir+'sass/**/*.scss', ['sass']);
	gulp.watch(assetsDir+'js/*.js', ['js']);
	gulp.watch(assetsDir+'i/*',['image']);
	gulp.watch(assetsDir+'fonts/*',['fonts']);
});

gulp.task('connect', function() {
	connect.server({
		port:1337,
		root: 'dist',
		livereload: true
	});
});

gulp.task('url', function(){
	var options = {
		url: 'http://localhost:1337',
		app: 'chrome'
	};
	gulp.src(outputDir+'index.html')
		.pipe(open('', options));
});

//--------------------------------------------If you need iconfont
//var iconfont = require('gulp-iconfont'),
//	iconfontCss = require('gulp-iconfont-css'),
//	fontName = 'iconsmoon';
//gulp.task('iconfont', function(){
//	gulp.src(['assets/i/icons/*.svg'])
//		.pipe(iconfontCss({
//			path: 'assets/sass/_icons_template.scss',
//			fontName: fontName,
//			targetPath: '../../sass/_icons.scss',
//			fontPath: '../fonts/icons/'
//		}))
//		.pipe(iconfont({
//			fontName: fontName
//		}))
//		.pipe(gulp.dest('assets/fonts/icons'));
//});

gulp.task('default',['jade','sass','js','watch','connect','url','fonts']);
