/*global module:false*/
module.exports = function(grunt) {

  var _ = grunt.util._;
  var marked = require('marked');
  // var hl = require('highlight').Highlight;
  var hl = require('node-syntaxhighlighter');
  marked.setOptions({
    highlight: function(code, lang) {

      lang = hl.getLanguage(lang);
      return hl.highlight(code, lang);
    },
    gfm: true
  });

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('jcarousellite.jquery.json'),
    bowerjson: './bower.json',
    meta: {
      banner: '/*!<%= "\\n" %>' +
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
      },
      docs: {
        files: ['readme.md', 'lib/tpl/**/*.tpl', 'Gruntfile.js'],
        tasks: ['docs']
      }
    },
    shell: {
      rsync: {
        // command gets modified by rsync task.
        command: 'rsync',
        stdout: true
      }
    },
    setshell: {
      rsync: {
        file: 'gitignore/settings.json',
        cmdAppend: '<%= pkg.name %>/'
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
          jQuery: true,
          require: false
        }
      }
    },
    version: {
      same: {
        src: ['src/*.js', '*.json']
      },
      patch: {
        src: [
          '<%= pkg.name %>.jquery.json',
          'package.json',
          'src/jquery.<%= pkg.name %>.js',
          '<%= pkg.name %>.js'
        ],
        options: {
          release: 'patch'
        }
      },
      bannerPatch: {
        src: ['<%= pkg.name %>.js'],
        options: {
          prefix: 'Lite - v',
          release: 'patch'
        }
      }
    }
  });

  grunt.registerMultiTask( 'setshell', 'Set grunt shell commands', function() {
    var settings, cmd,
        tgt = this.target,
        cmdLabel = 'shell.' + tgt + '.command',
        file = this.data.file,
        append = this.data.cmdAppend || '';

    if ( !grunt.file.exists(file) ) {
      grunt.warn('File does not exist: ' + file);
    }

    settings = grunt.file.readJSON(file);
    if (!settings[tgt]) {
      grunt.warn('No ' + tgt + ' property found in ' + file);
    }

    cmd = settings[tgt] + append;
    grunt.config(cmdLabel, cmd);
    grunt.log.writeln( ('Setting ' + cmdLabel + ' to:').cyan );

    grunt.log.writeln(cmd);

  });

  grunt.registerTask( 'bower', 'update bower.json', function() {
    var comp = grunt.config('bowerjson'),
        pkg = grunt.file.readJSON('jcarousellite.jquery.json'),
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

  grunt.registerTask('docs', function() {
    var doc,
        readme = grunt.file.read('readme.md'),
        head = grunt.template.process(grunt.file.read('lib/tpl/header.tpl')),
        foot = grunt.file.read('lib/tpl/footer.tpl');

    // Stupid hack putting function foo() {} into each js code block
    // because otherwise the highlight.js script isn't highlighting them.
    // readme = readme.replace(/(```javascript\s*)/g, '$1function foo() {}');
    // Convert to markdown (with the highlight.js processing in setOptions.highlight)
    doc = marked(readme);
    // Remove function foo() {} after processing
    // doc = doc.replace(/<span class="keyword">function<\/span> foo\(\) \{\}(\n)?/g, '');

    grunt.file.write('index.html', head + doc + foot);

  });

  grunt.registerTask( 'deploy', ['setshell:rsync', 'shell:rsync']);

  grunt.registerTask('build', ['jshint', 'concat', 'version:same', 'bower', 'uglify', 'docs']);
  grunt.registerTask('patch', ['jshint', 'concat', 'version:bannerPatch', 'version:patch', 'bower', 'uglify']);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-shell');
};
