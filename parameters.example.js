/**
 * An example of the parameters.js file, which lives outside of version control
 * and contains environment-specific parameters.
 */
module.exports = {
  api_app: {
    port: 8181
  },

  model: {
    heroku_connection_url: 'mongodb://root:root@ds053784.mongolab.com:53784/heroku_8nwm2lht',
    local_connection_url: 'mongodb://localhost:27017/open-door'
  }
};