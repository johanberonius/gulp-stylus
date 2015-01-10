'use strict';

var should = require('should');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var stylus = require('../');
var fs = require('fs');

require('mocha');

describe('gulp-stylus', function() {
	it('should render stylus .styl to CSS .css', function(done) {
		var stream = stylus();

		var fakeFile = new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/normal.styl',
			contents: fs.readFileSync('test/fixtures/normal.styl')
		});

		stream.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);
			String(newFile.contents).should.equal(fs.readFileSync('test/expected/normal.css', 'utf8'));
			done();
		});
		stream.write(fakeFile);
		stream.end();

	});

	it ('should compress when called', function(done) {
		var stream = stylus({compress: true});
		var fakeFile = new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/normal.styl',
			contents: fs.readFileSync('test/fixtures/normal.styl')
		});

		stream.on('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);

			var fixture = fs.readFileSync('test/expected/compressed.css', 'utf8');
			String(newFile.contents).should.equal(fixture);
			done();
		});

		stream.write(fakeFile);
		stream.end();
	});

	it ('should import other .styl files', function(done) {
		var stream = stylus({import: __dirname + '/fixtures/one.styl'});
		var fakeFile = new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/normal.styl',
			contents: fs.readFileSync('test/fixtures/normal.styl')
		});

		stream.on('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);

			String(newFile.contents).should.equal(fs.readFileSync('test/expected/imported.css', 'utf8'));
			done();
		});

		stream.write(fakeFile);
		stream.end();
	});

	it ('should define variables in .styl files', function(done) {
		var stream = stylus({define: {'white': '#fff'}});
		var fakeFile = new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/define.styl',
			contents: fs.readFileSync('test/fixtures/define.styl')
		});

		stream.on('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);

			String(newFile.contents).should.equal(fs.readFileSync('test/expected/define.css', 'utf8'));
			done();
		});

		stream.write(fakeFile);
		stream.end();
	});

	it('should skip css files', function(done) {
		var stream = stylus();

		var fakeFile = new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/ie8.css',
			contents: fs.readFileSync('test/fixtures/ie8.css')
		});

		stream.once('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);
			String(newFile.contents).should.equal(fs.readFileSync('test/fixtures/ie8.css', 'utf8'));
			done();
		});
		stream.write(fakeFile);
		stream.end();

	});


	it('should throw on parse error', function(done) {
		var stream = stylus();

		var file = 'test/fixtures/error.styl';

		var fakeFile = new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: file,
			contents: fs.readFileSync(file)
		});

		stream.on('error', function(err) {
			should.exist(err);
			err.name.toString().should.match(/ParseError/);
			done();
		});
    stream.write(fakeFile);
    stream.end();

  });

	it ('should import nested and reverse recursive files', function(done) {
		var stream = stylus();
		var fakeFile = new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/import.styl',
			contents: fs.readFileSync('test/fixtures/import.styl')
		});

		stream.on('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);
			String(newFile.contents).should.equal(fs.readFileSync('test/expected/import.css', 'utf8'));
			done();
		});
		stream.write(fakeFile);
		stream.end();
	});

	it ('should generate sourcemaps', function(done) {
		var stream = stylus({sourcemap: true});

		var fakeFile = new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/normal.styl',
			contents: fs.readFileSync('test/fixtures/normal.styl')
		});

		stream.on('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);
			String(newFile.contents).should.equal(fs.readFileSync('test/expected/normal.css', 'utf8'));
			should.exist(newFile.sourceMap);
			newFile.sourceMap.version.should.equal(3);
			newFile.sourceMap.mappings.length.should.be.above(1);
			done();
		});

		stream.write(fakeFile);
		stream.end();

	});

	it ('should generate sourcemaps with gulp-sourcemaps', function(done) {
		var stream = sourcemaps.init();

		var fakeFile = new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/normal.styl',
			contents: fs.readFileSync('test/fixtures/normal.styl')
		});

		stream.write(fakeFile);
		stream.pipe(stylus())
		  .on('error', done)
		  .on('data', function(newFile) {
				should.exist(newFile);
				should.exist(newFile.contents);
				String(newFile.contents).should.equal(fs.readFileSync('test/expected/normal.css', 'utf8'));
				should.exist(newFile.sourceMap);
				newFile.sourceMap.version.should.equal(3);
				newFile.sourceMap.mappings.length.should.be.above(1);
				done();
			});

		stream.end();

	});

});
