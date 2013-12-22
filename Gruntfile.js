module.exports = function(grunt) {

  // Project configuration.
 grunt.initConfig({
  sass: {                              // Task
    dist: {                            // Target
      options: {                       // Target options
        style: 'compressed'
      },
      files: {                         // Dictionary of files
        'public/css/style.min.css': 'public/sass/style.scss'       // 'destination': 'source'
      }
    }
  }
});
grunt.loadNpmTasks('grunt-contrib-sass');

grunt.registerTask('default', ['sass']);

};