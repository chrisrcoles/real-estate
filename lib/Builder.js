'use strict';
/**
 * This class, a builder, manages the construction and dependency injection of the apps and
 * services. This makes testing easier by encapsulating all of the dependencies
 * within this module, so they can be effectively mocked.
 *
 * @param parameters `Object`
 *  Application wide parameters
 *
 */

class Builder {
  constructor(parameters) {
    this._ApiApp = require('./api/App.js');
    this._Model = require('./model/Model.js');
    this._parameters = parameters;
  }

   /*
   * Private method that builds the model that will be a singleton throughout
   * the application
   *
   * @returns _Model `Object`
   *   Newly instantiated Model
   *
   * */
  _buildModel() {
    var MongoClient = require('mongodb').MongoClient;
    return new this._Model(this._parameters.model, MongoClient);
  }

   /*
   * Public method that builds the Api App that will be a singleton throughout
   * the application
   *
   * @returns _ApiApp `Object`
   *   Newly instantiated ApiApp
   *
   * */
  buildApiApp() {
    var express = require('express');
    var app = express();
    var model = this._buildModel();

    return new this._ApiApp(this._parameters.api_app, app, model);
  }
}

module.exports = Builder;

