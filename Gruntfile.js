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
  },
  uglify: {
    my_target: {
      files: {
        'public/js/libs.min.js': ['public/js/libs/*.js']
      }
    }
  }


});
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-uglify');

grunt.registerTask('default', ['sass']);

};