A basic conventional minimal way to write Gruntfiles that allows tasks
to be added for you by the integration packages you depend on in
`package.json` `devDependencies`. Unfortunately, using requires the
following boilerplate in your `Gruntfile.js`, though even so the
Gruntfile is probably a legitimate place to put project-specific
configuration.

# Usage

There are two scenarios of turbogrunt usage. Your package can consume
turbogrunt to simplify its Gruntfile. Your package may be a grunt
integration package which provides information that turbogrunt
consumes.

## Consumer

The point of consuming turbogrunt is to simplify your Gruntfile. In
some cases, you may be able to reduce your Gruntfile to a one-liner:

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

## Provider

A package which needs to inject itself into Gruntfile configuration is
a provider. turbogrunt uses a very crude means of identifying
providers. Every project listed under `devDependencies` with `grunt`
other than the exact string `grunt` is considered a provider.

1. All providers must be compatible with `grunt.loadNpmTasks()`.  If
   your package does not actually provide any grunt tasks, that means
   it must ship with a `tasks` directory (otherwise grunt will throw
   an error “Local Npm module "mygruntintegration" not found. Is it
   installed?”. To accomplish this, create a file named `tasks/.keep`
   and commit it to your VCS.

2. Providers should be `require()`able. turbogrunt will look for a
   `defaultTasks` property of exports which should be an array of
   tasks that the `default` task should be made to depend on. All
   providers’ listed `defaultTasks` will be set as the dependency of
   the turbogrunt-created `default` task without regard for ordering.

   For example, if your grunt integration provider is for a framework
   that relies on uglify, you might have the following in main:

   ```JavaScript
   module.exports = {
     defaultTasks: ['uglify']
   };
   ```

   There is no requirement that your integration package provide the
   task itself. However, note that if your integration provider
   package intends to reference tasks provided by another package, it
   must list that package in `dependencies` (not merely in
   `devDependencies`) because to be available. And, for now, you must
   solve the [problem of indirect tasks
   inclusion](https://github.com/gruntjs/grunt/issues/696) by using
   gruntcollections. To do so, in your `package.json`’s `keywords`
   key, append `gruntcollection`. This will make grunt try to load all
   of your package’s dependencies as grunt modules. Thus, if you need
   to actually depend on any packages which do not have a “tasks”
   directory, you must create a proxy package with a `tasks/.keep`
   file which depends on your dependencies and re-exports them to your
   package. Simple, eh?

# Rationale

When a project buys into a framework, that shouldn’t mean copying and
pasting boilerplate code around. Instead you should write only that
which is specific to your project. Everything else is just noise. If
the arrangement of files in your project follows a convention that
some framework recognizes, then let’s try to avoid copy/pasting around
boilerplate glue code. `$ frameworkname init` begone!
