/*jslint node:true */
'use strict';

var util = require('util');
var d = require('debug')('D');
var _ = require('lodash');
var Resource = require('./resource.js');

function Location()
{
    if (!(this instanceof Location)) {
        return new Location();
    }
}

function get(req, res)
{
    d('location::get');
}

util.inherits(Location, Resource);

Location.prototype.get = get;
module.exports = Location;
