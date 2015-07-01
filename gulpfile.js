var gulp = require('gulp');
var jshint = require('gulp-jshint');
var exec = require('child_process').exec;
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var gutil = require('gulp-util');

var paths = {
    tests: 'tests/**/*.js',
    sources: [ '**/*.js', '!node_modules/**', '!definitions/**/*.js', '!bin/**/*.js' ],
    yamls: ['**/*.yaml', '**/*.yml', '!node_modules/**' ]
};

gulp.task('lint', function() {
    return gulp.src(paths.sources)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test', function () {
    return gulp.src(paths.tests, { read: false })
        .pipe(mocha({ reporter: 'spec' })) // list, nyan
        .on('error', gutil.log);
});

gulp.task('gen', function(cb) {
    exec('node ../utilities/yaml2json.js definitions/climbonio.yml definitions', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('watch', function() {
    gulp.watch(paths.sources, ['lint', 'test']);
    gulp.watch('definitions/climbonio.yml', ['gen']);
});

gulp.task('express', function () {
    nodemon({
        script: 'bin/www',
    })
        .on('start', ['test', 'watch'])
        .on('change', ['watch'])
        .on('restart', function () {
            console.log('restarted!');
        });
});

gulp.task('default', ['lint', 'express']);
