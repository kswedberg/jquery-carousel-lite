/*global module:false*/
module.exports = function(grunt) {

  var _ = grunt.util._;

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('jcarousellite.jquery.json'),
    component: './component.json',
    meta: {
      banner: '/*! <%= "\\n" %>' +
          ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd")  + "\\n" %>' +
          '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
          '<%= "\\n" %>' +
          ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>' +
          ' (<%= _.pluck(pkg.licenses, "url").join(", ") %>)' +
          '<%= "\\n" %>' + ' */' +
          '<%= "\\n\\n" %>'
    },
    concat: {
      all: {
        src: ['src/jquery.<%= pkg.name %>.js'],
        dest: '<%= pkg.name %>.js'
      },
      options: {
        stripBanners: true,
        banner: '<%= meta.banner %>'
      }
    },
    uglify: {
      all: {
        files: {
          '<%= pkg.name %>.min.js': ['<%= concat.all.dest %>']
        },
        options: {
          preserveComments: false,
          banner: '<%= meta.banner %>'
        }
      }
    },
    watch: {
      scripts: {
        files: '<%= jshint.all %>',
        tasks: ['jshint']
      }
    },
    shell: {
      rsync: {
        // command gets modified by rsync task.
        command: 'rsync',
        stdout: true
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js'],
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
        browser: true,
        globals: {
          jQuery: true
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('build', ['jshint', 'concat', 'version', 'component', 'uglify']);

  grunt.registerTask( 'component', 'update component.json', function() {
    var comp = grunt.config('component'),
        pkg = grunt.config("pkg"),
        json = {};

    ['name', 'version', 'dependencies'].forEach(function(el) {
      json[el] = pkg[el];
    });

    _.extend(json, {
      main: grunt.config('concat.all.dest'),
      ignore: [
        'demo/',
        'lib/',
        'src/',
        '*.json'
      ]
    });
    json.name = 'jquery.' + json.name;

    grunt.file.write( comp, JSON.stringify(json, null, 2) );
    grunt.log.writeln( "File '" + comp + "' updated." );
  });

	grunt.registerTask( 'version', 'insert version', function() {
		// Concat specified files.
		var name = grunt.config('concat.all.dest'),
        pkg = grunt.config("pkg"),
        compiled = grunt.file.read(name),
        version = "version = '" + pkg.version + "'";

		// Embed Version
    compiled = compiled.replace( /version = '[^']+'/, version );
		// Write concatenated source to file
		grunt.file.write( name, compiled );

		// Fail task if errors were logged.
		if ( this.errorCount ) {
			return false;
		}

		// Otherwise, print a success message.
		grunt.log.writeln( "File '" + name + "' created." );

	});

  grunt.registerTask( 'rsync', 'deploy site', function() {
    var file, cmd,
        path = 'gitignore/settings.json';

    if ( grunt.file.exists(path) ) {
      file = grunt.file.readJSON(path);
      cmd = file.command + grunt.config('pkg.name') + '/';
      grunt.config('shell.rsync.command', cmd);
      grunt.log.writeln(cmd);
    } else {

      grunt.log
      .subhead('Oops!')
      .writeln('no command property found in ' + path);
    }
  });
  grunt.registerTask( 'deploy', ['rsync', 'shell:rsync']);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
};
