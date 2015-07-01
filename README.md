# System Setup

1. github.com -> add ssh key
1. heroku.com -> add ssh key
1. Install heroku toolkit
1. sudo npm install --global express-generator
1. sudo npm install --global gulp

# Project Setup

1. express climbonio
1. cd climbonio
1. npm install
1. Create .gitignore
    /**/*shell*
    /**/#*#
    /**/.#*
    /**/*~
    /**/node_modules
    /**/npm-debug.log
    /**/foo*.txt
    /**/foo*.js
    /**/foo*.json
    /**/TAGS
    /**/out*
1. Create Procfile containing: web: node bin/www
1. github.com -> create climbonio repository
1. git init
1. git add .
1. git commit -m "First commit"
1. git remote add origin git@github.com-sclaussen:sclaussen/bhendi.git
1. git push -u origin master
1. heroku login
1. heroku apps:create climbonio
1. heroku domains:add www.climbon.io
1. git push heroku master
1. heroku ps:scale web=1
1. heroku open
1. open http://www.climbon.io
1. foreman start web # starts on :5000
1. open localhost:5000
1. node bin/www # starts on :3000
1. curl localhost:3000

# npm dependencies

1. cd ../utilities
1. sudo npm link
1. cd ../bhendi
1. sudo npm link
1. npm link utilities
1. cd ../climbonio
1. npm link utilities
1. npm link bhendi

# Bluemix

1. cf login -u shaneclaussenbluemix@gmail.com -o "Shanes Bluemix Organization" -s "Climb On REST Dev"
1. cf api https://api.ng.bluemix.net
1. https://github.com/cloudfoundry/cli/releases/tag/v6.11.1
1. cf push "Climb On REST API"

# Mongo Labs

1. Install
  1. http://www.mongodb.org/downloads
  1. Copy unzipped files to /Applications/Mongo
  1. sudo mkdir /data
  1. sudo mkdir /data/db
1. /Applications/Mongo/bin/mongod -> database daemon
1. /Applications/Mong/bin/mongo -> database shell
  1. show dbs – displays a list of available databases on the system.
  1. use databasename – switch to existing databasename (or create it if it doesn’t already exist)
  1. db.things.find() – list all records in the “things” collection of the currently active database (set with ‘use’ earlier)
  1. db.things.insert({ a: 1, b: 2, c: 3}) – insert a new record into the ‘things’ collection with the object provided.
  1. db.things.find({a : 1}) – return a list of all records that has the property a with a value of ’1′
1. npm install mongodb --save
1. heroku addons:add mongolab
1. heroku addons:open mongolab
