# Real Estate Challenge

To visit the hosted application on Heroku, visit this [link](https://sheltered-plateau-5767.herokuapp.com/listings)

# Solution Outline

In summary, the problem we are trying to solve:

1. Create an API with a single endpoint that returns all of the listings
   that match all optional query parameters.

2. API endpoint should response with valid GeoJSON. 
   To verify the ouput, visit this [link](http://geojson.io)

3. API filters any combination of the optional API parameters

4. Use a datastore
   

The API response format should look like:

```javascript
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {"type": "Point", "coordinates": [-112.1,33.4]},
      "properties": {
  "id": "123ABC", # CSV id
  "price": 200000, # Price in Dollars
  "street": "123 Walnut St",
        "bedrooms": 3, # Bedrooms
        "bathrooms": 2, # Bathrooms
        "sq_ft": 1500 # Square Footage
    },
    ...
  ]
}

```


# Application Architecture

Node.js application. The API, an independent application, uses the 
model layer. The model layer is responsible for managing the connection
to the database and for interacting with it in a standardized way.

Directory structure:

* `bin/` - Contains the `run` executable to start the application
* `docs/` - Additional documentation about setting up the app
* `lib/` - Contains all of the code for the application
* `lib/api/` - REST API code (express.js app)
* `lib/model/` - Database connection and data management classes
* `parameters.js` - Contains the environment-specific parameters (outside of
  version control) for connecting to the database

Within MongoDb all of the relevant information is stored in the `features` DB.
There is one collection:

```javascript
{
  "_id": ObjectId("564524f6fb43514a0a3e467c"),
  "id": 19,
  "street": "389 2nd Dv",
  "status": "sold",
  "price": 181554,
  "bedrooms": 2,
  "bathrooms": 2,
  "sq_ft": 2279,
  "lat": 33.451704473518041993,
  "lng": -112.20395000768927218
}
```

The project is separated for one application, the API portion which serves the 
data via HTTP.

The application can be started from the `bin/run` executable see [below](#running-the-application).


# Setting up the Application

See the [doc](docs/environment-setup.md)


# Configuring the Application

The MongoDb connection information (including hosts, usernames, passwords) are
managed outside of version control.  They should be manually created into a
`parameters.js` file in the root of the project. 

Take a look at the `parameters.example.js` for all of the parameters that you
need.

# Future Iteration Plans

*Due to the need to return the challenge as soon as possible, this was not able to be included. 

1. The application should be properly tested with a testing framework, such as
 [Mocha.js](https://mochajs.org/). 

2. Pagination via [web linking](http://tools.ietf.org/html/rfc5988)  

3. Including more optional parameters, along with price, bedroom, bathrooms, 
  possibly square feet, longitude, and latitude.

4. Improved speed performance. Currently, the API endpoint is returning around
  200-250ms on average. An improved API response could be attainable with proper 
  refactoring and possibly including the node.js cluster.

5. CLI tool that would allow you to hit the API endpoint based on the parameters
  that are passed. 


# Running the Application

See the [doc](docs/environment-setup.md) for more information on running the
application locally. 

From the project root, run:

```
$> node bin/run api
```

