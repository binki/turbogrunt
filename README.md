A basic conventional minimal way to write Gruntfiles that allows tasks
to be added for you by the integration packages you depend on in
`package.json` `devDependencies`. Unfortunately, using requires the
following boilerplate in your `Gruntfile.js`, though even so the
Gruntfile is probably a legitimate place to put project-specific
configuration.

```JavaScript
module.exports = require('turbogrunt');
```

As you may want to customize things, you may implement the callback as
follows:

```JavaScript
module.exports = function (grunt) {
  /*
   * Second argument is merged into the grunt.initConfig()
   * call. package.json is already passed to initConfig
   * for you.
   */
  require('turbogrunt')(
    grunt,
    {
      uglify: {
        options: {
          banner: '/* hi from Gruntfile */'
        }
      }
    });
  grunt.registerTask('eat', function () { console.log('eating food'); });
};
```

# Rationale

When a project buys into a framework, that shouldn’t mean copying and
pasting boilerplate code around. Instead you should write only that
which is specific to your project. Everything else is just noise. If
the arrangement of files in your project follows a convention that
some framework recognizes, then let’s try to avoid copy/pasting around
boilerplate glue code. `$ frameworkname init` begone!
