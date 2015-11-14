# Local Environment Setup

This document is meant to provide instructions on running the application
locally. The application is hosted on [Heroku](https://sheltered-plateau-5767.herokuapp.com/listings)

For this project there are two types of servers to setup:

1. Node.js application server
1. MongoDb server
1. Seeding database

The Node.js application server runs the API and is responsible for 
retrieving all of the data to be stored in Mongo. MongoDb servers host
the Mongo application and serve as the persistent storage for this app.


# Installing Node.js on Mac OSX

For more information on downloading Node.js on other operating systems, 
see the [link](https://nodejs.org/en/download/package-manager/)

1. `curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"`


# Installing MongoDB on Mac OSX

For more information on downloading MongoDb on other operating systems, 
see the [link](https://docs.mongodb.org/manual/installation/)

1. `curl -O https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-3.0.7.tgz`
1. `tar -zxvf mongodb-osx-x86_64-3.0.7.tgz`
1. `mkdir -p mongodb` 
1. `cp -R -n mongodb-osx-x86_64-3.0.7/ mongodb`
1. `export PATH=<mongodb-install-directory>/bin:$PATH`
   * Replace <mongodb-install-directory> with the path to the extracted MongoDB archive.     
1. `mkdir -p /data/db`   
1. `chmod 0600 /data/db`
1. `mongod`
1. `mongo`
1. `rs.initiate();`
1. `use admin`
1. `db.createUser({user: 'admin', pwd: 'admin', roles: ['root']});`
1. logout of mongo
1. `mongo admin -u admin -p`
1. `use open-door`

# Seeding the Database MongoDB

1. `wget https://s3.amazonaws.com/opendoor-problems/listings.csv` 
1.` mongoimport -d open-door -c features --type csv --file listings.csv --headerline`

