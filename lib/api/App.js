'use strict';
/**
 * This class manages the REST API for reading an array of listings
 *
 * @param options `Object`
 *   Options, injected in the Builder class for the API App
 *
 * @param expressApp `Object`
 *   Express node package
 *
 * @param model `Object`
 *   Connected MongoDb Client
 *
 */
class App {
  constructor(options, expressApp, model) {
    this._app = expressApp;
    this._model = model;
    this._options = options || {};
    /**
     * * `port` - the port the web server should listen on
     */
    const defaultOptions = {
      port: 8181
    };
    // Loop through the default options and merge them with the specified options
    for (var i in defaultOptions) {
      this._options[i] = this._options[i] || defaultOptions[i];
    }
  }

  /**
   * Public method that registers routes for the API and initializes the model
   *
   * This method will be called in the bin/run script
   */
  start() {
    var _this = this;

    var serverPort = process.env.PORT || this._options.port;
    var serverHost = process.env.HOST || '0.0.0.0';

    this._model.init()
      .then(() => {
        this._app.get('/listings?', this._handleListings.bind(_this));
        this._app.listen(serverPort, serverHost);
        console.log('Application listening on port: ' + serverPort);
      });
  }

  /**
   * Private method that uses the Express route handler that will query
   * the model layer for the appropriate data, based on optional parameters,
   * and send the response.
   *
   * @param req `Object`
   *   Express Request
   *   `req.query` query parameters from the request
   *
   * @param res `Object`
   *   Express Response
   *   `res.send` used to send the API response or an error in case of failure
   *
   */
  _handleListings(req, res) {
    var queryParams = this._constructParams(req.query);

    this._model.handleListings(queryParams)
      .then((docs) => {
        var response = this._constructGeoJsonResponse(docs);
        res.send(response)
      })
      .catch((reason) => {
        res.status(500).send({msg: reason.toString()})
      })
  }

  /**
   * Private method that constructs the GeoJSON formatted response for the API endpoint
   *
   * @param features `Array`
   *   Set of queried MongoDb documents that match based on parameters
   *
   * @returns response `Object`
   *   Response that will be sent as the API response
   *
   */
  _constructGeoJsonResponse(features) {
    var featureSet = features.map(this._constructGeoJson);

    var response = {
      type: 'FeatureCollection',
      features: featureSet
    };

    return response;
  }

   /*
   * Private method returns the formatted data for each feature that adheres
   * to the GeoJSON specification based on the data in the MongoDb collection
   *
   * @param feature `Object`
   *   Each feature in the set
   *
   * @returns `Object`
   *   An object that is apart of the featureSet, that will be used in the API
   *   response
   *
   */
  _constructGeoJson(feature) {
    var coordinates = [];

    var lat = Math.round(feature.lat * 10) / 10;
    var lng = Math.round(feature.lng * 10) / 10;

    coordinates.push(lng);
    coordinates.push(lat);

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coordinates
      },
      properties: {
        id: feature.id,
        price: feature.price,
        street: feature.street,
        bedrooms: feature.bedrooms,
        bathrooms: feature.bathrooms,
        sq_ft: feature.sq_ft
      }
    };
  }

   /*
   * Private method that constructs an object based on the parameters
   * sent in the API request. This method checks to see what relevant parameters
   * are passed in the API request. This object will later be used to construct
   * a query for MongoDb.
   *
   * @param query `Object`
   *   Query parameters that comes from the API request.
   *
   * @returns queryParams `Object`
   *   Constructed object that maintains what parameters need to be queried
   *   for in MongoDb collection.
   *
   */
  _constructParams(query) {
    var queryParams = {};

    // handle query params for price
    query.min_price ? queryParams.minPrice = parseInt(query.min_price) : '';
    query.max_price ? queryParams.maxPrice = parseInt(query.max_price) : '';
    // handle query params for bedrooms
    query.min_bed ? queryParams.minBed = parseInt(query.min_bed) : '';
    query.max_bed ? queryParams.maxBed = parseInt(query.max_bed) : '';
    // handle query params for bathrooms
    query.min_bath ? queryParams.minBath = parseInt(query.min_bath) : '';
    query.max_bath ? queryParams.maxBath = parseInt(query.max_bath) : '';

    return queryParams;
  }

}

module.exports = App;