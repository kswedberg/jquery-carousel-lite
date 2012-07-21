/*global module:false*/

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:jcarousellite.jquery.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */',
      version: '\n\nvar version = <%= pkg.version %>;\n'
    },
    build: {
      built: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/jquery.<%= pkg.name %>.js>'],
        dest: './<%= pkg.name %>.js'
      }
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
        dest: '<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: '<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/tests.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        // eqeqeq: true,
        // immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });
  grunt.loadNpmTasks('grunt-shell');
  // // Default task.
  // grunt.registerTask('default', 'lint qunit concat min');
  grunt.registerTask('default', 'lint build min');

  // Special build task to concat files and insert version number
  grunt.registerMultiTask( 'build', 'Concatenate source, insert version', function() {
    // Concat specified files.
    var name = this.file.dest,
        files = grunt.file.expandFiles( this.file.src ),
        compiled = grunt.helper('concat', files, {separator: this.data.separator}),
        version = grunt.config("pkg.version");

    // compiled = '/* concatenated files:\n' + this.file.src.join(', ') + '\n*/\n\n' + compiled;

    // Embed Version
    compiled = compiled.replace( /@VERSION/, version );
    // Write concatenated source to file
    grunt.file.write( name, compiled );

    // Fail task if errors were logged.
    if ( this.errorCount ) {
      return false;
    }

    // Otherwise, print a success message.
    grunt.log.writeln( "File '" + name + "' created." );
  });

};
