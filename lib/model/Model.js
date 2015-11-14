'use strict';
/**
 * This class creates a mongo connection as well as managing querying
 * for necessary data
 *
 * @param options `Object`
 *   Options, injected in the Builder class for the Model
 *
 * @param MongoClient `Object`
 *   MongoDb's node package MongoClient interface used to connect to MongoDb
 *
 */
class Model {
  constructor(options, MongoClient) {
    this._MongoClient = MongoClient;
    this._db = null;
    this._options = options || {};
    this._collectionName = 'features';
    /**
     * `connection_url` - the url that we are using to connect to MongoDb
     */
    const defaultOptions = {
      heroku_connection_url: 'mongodb://root:root@ds053784.mongolab.com:53784/heroku_8nwm2lht',
      local_connection_url: 'mongodb://localhost:27017/open-door'
    };

    // Loop through the default options and merge them with the specified options
    for (var i in defaultOptions) {
      this._options[i] = this._options[i] || defaultOptions[i];
    }
  }

  /**
   * Public method that opens the database connection
   *
   * @returns Promise `Object`
   *   Initializes a connection to MongoDb, resolved in the App
   *   resolve `null`
   *   reject `err` Error, encountered when connecting to MongoDb
   *
   */
  init() {
    //console.log('connecting on connection_url=', this._options.connection_url)
    return new Promise(
      (resolve, reject) => {
        this._MongoClient.connect(this._options.heroku_connection_url, (err, db) => {
          if (err) {
            console.log('Could not connect to mongo with error:', err);
            reject(err)
          }

          this._db = db;
          resolve()
        })
      }
    );
  }

  /**
   * Private method that construct the query for MongoDb that will handle
   * optional parameters.
   *
   * @param queryParams `Object`
   *   Constructed object that maintains what parameters need to be queried
   *   for in MongoDb collection
   *
   * @returns query `Object`
   *   Query object that handles all minimum and maximum fields for
   *   price, bedrooms, and bathrooms. The queries will handle returning
   *   data,inclusive, based on the minimum and maximum fields.
   *
   */
  _constructQueryForListings(queryParams) {
    var query = {};
    // construct query for price
    queryParams.minPrice ? query.price = {$gte: queryParams.minPrice} : '';
    queryParams.maxPrice ? query.price = {$lte: queryParams.minPrice} : '';
    queryParams.minPrice && queryParams.maxPrice ?
      query.price = {$gte: queryParams.minPrice, $lte: queryParams.maxPrice} : '';

    // construct query for bedrooms
    queryParams.minBed ? query.bedrooms = {$gte: queryParams.minBed} : '';
    queryParams.maxBed ? query.bedrooms = {$lte: queryParams.maxBed} : '';
    queryParams.minBed && queryParams.maxBed ?
      query.bedrooms = {$gte: queryParams.minBed, $lte: queryParams.maxBed} : '';

    //construct query for bathrooms
    queryParams.minBath ? query.bathrooms = {$gte: queryParams.minBath} : '';
    queryParams.maxBath ? query.bathrooms = {$lte: queryParams.maxBath} : '';
    queryParams.minBath && queryParams.maxBath ?
      query.bathrooms = {$gte: queryParams.minBath, $lte: queryParams.maxBath} : '';

    return query;
  }

   /*
   * Public method that queries MongoDb with the correct parameters, as
   * defined in the API request
   *
   * @param queryParams `Object`
   *   Constructed object that maintains what parameters need to be
   *   queried for in MongoDb collection.
   *
   * @returns Promise `Object`
   *   Queries MongoDb, resolved in the App
   *   resolve `docs` MongoDb queried documents
   *   reject  `err` Error, encountered when querying Mongo
   *
   * */
  handleListings(queryParams) {
    var collection = this._db.collection(this._collectionName);
    var query = this._constructQueryForListings(queryParams);

    return new Promise(
      (resolve, reject) => {
        collection.find(query).toArray(function (err, docs) {
          if (err) {
            reject(err)
          }
          resolve(docs)
        })
      }
    );
  }

}

module.exports = Model;
