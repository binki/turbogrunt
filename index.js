module.exports = function (grunt, initConfigOptions) {
  var packageJSON = grunt.file.readJSON('package.json');
  grunt.initConfig(
    Object.assign(
      {
        pkg: packageJSON
      },
      initConfigOptions));

  var devDep;
  var defaultTasks = [];
  for (devDep in (packageJSON.devDependencies || {}))
    if (/grunt/.test(devDep)) {
      /*
       *  Don’t ask grunt to load itself as a module. It doesn’t like
       *  that.
       */
      if (!/^grunt$/.test(devDep)) {
        defaultTasks = defaultTasks.concat(require(devDep).defaultTasks).filter(x => !!x);
        grunt.loadNpmTasks(devDep);
      }
    }
  if (!defaultTasks.length)
    console.warn('No default tasks specified. Have your grunt module export a property “defaultTasks” as an array of the task names which default should depend on.');
  grunt.registerTask('default', defaultTasks);
};
