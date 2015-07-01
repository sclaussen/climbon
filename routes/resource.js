/*jslint node:true */
'use strict';

var _ = require('lodash');
var d = require('debug')('D');

function Resource()
{
}

function post(req, res)
{
    d('resource::post');
}

function list(req, res)
{
    d('resource::list');
}

function get(req, res)
{
    d('resource::get');
}

function put(req, res)
{
    d('resource::put');
}

function del(req, res)
{
    d('resource::delete');
}

Resource.prototype.post = post;
Resource.prototype.list = list;
Resource.prototype.get = get;
Resource.prototype.put = put;
Resource.prototype.del = del;

module.exports = Resource;
