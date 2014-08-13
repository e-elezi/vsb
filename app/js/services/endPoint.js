'use strict';
/**
 * EndPointService
 * A Service, which gets the available SPARQL classes from the Server.
 *
 * @namespace data.results.bindings
 *
 */

angular.module('GSB.services.endPoint', ['GSB.config'])
    .factory('EndPointService', function ($http, $q, $log, globalConfig) {
        _.mixin(_.str.exports());
        var factory = {};

        var service = Jassa.service;
        var sponate = Jassa.sponate;

        var sparqlService = new service.SparqlServiceHttp(globalConfig.baseURL, globalConfig.defaultGraphURIs);
        sparqlService = new service.SparqlServiceCache(sparqlService);
        var store = new sponate.StoreFacade(sparqlService, globalConfig.prefixes);

        var cleanURI = function (str) {
            if (str === null) {
                return null;
            }
            return str.replace(/^</, '').replace(/>$/, '');
        };

        /**
         * Returns the type of a Property
         * @param $propertyRange
         * @returns string
         */
        var getPropertyType = function ($propertyRange) {
            if ($propertyRange !== null) {
                var conf = globalConfig.propertyTypeURIs;
                for (var key in conf) {
                    if (conf.hasOwnProperty(key)) {
                        for (var i = 0, j = conf[key].length; i < j; i++) {
                            if ($propertyRange.search(conf[key][i]) > -1) {
                                return key;
                            }
                        }
                    }
                }
            }
            return 'STANDARD_PROPERTY';
        };

        var makeLabel = function($label, uri){
            if ($label !== null) {
                return $label;
            } else {
                uri = cleanURI(uri);
                var hashPos = uri.lastIndexOf('#'),
                    slashPos = uri.lastIndexOf('/');
                if (hashPos > slashPos) {
                    $label = uri.substr(hashPos + 1);
                } else {
                    $label = uri.substr(slashPos + 1);
                }
                return $label;
            }

        };

        var createAvailablePropertyObject = function (data, inverse, filterURI) {
            var ret = [], retMap = {};
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var property = data[key],
                        uri = cleanURI(property.uri),
                        type = 'STANDARD_PROPERTY';

                    if(filterURI === uri || filterURI === undefined || filterURI === null) {

                        property.$label = makeLabel(property.$label, uri);

                        /* Check whether a property.range is given.*/
                        if (inverse) {
                            type = 'INVERSE_PROPERTY';
                            property.$label = 'is ' + property.$label + ' of';
                        } else {
                            type = getPropertyType(property.range);
                        }

                        /* If we already have a property with the same URI,
                         then we just add the property.range to the corresponding URI. */
                        if (!ret.hasOwnProperty(uri)) {
                            ret.push({
                                alias: property.$label,
                                $label: property.$label,
                                $comment: property.$comment,
                                uri: uri,
                                type: type,
                                $propertyRange: []
                            });
                            retMap[uri] = ret.length - 1;
                        }

                        if (property.range !== null) {
                            ret[retMap[uri]].$propertyRange.push(property.range);
                        }

                    }

                }
            }
            return ret;
        };

        factory.getAvailableClasses = function (uri) {
            var criteria = {id: {$regex: ''}};
            if(uri !== undefined){
                criteria = {id:{$regex: cleanURI(uri)}};
            }
            if (!store.hasOwnProperty('classes')) {

                store.addMap({
                    name: 'classes',
                    template: [
                        {
                            id: '?s',
                            uri: '?s',
                            $label: '?l',
                            $comment: '?c'
                        }
                    ],
                    from: globalConfig.endPointQueries.getAvailableClasses
                });
            }
            return store.classes.find(criteria).asList()
                .then(function (docs) {
                    docs.forEach(function (doc) {
                        doc.id = cleanURI(doc.id);
                        doc.uri = doc.id;
                        doc.$label = makeLabel(doc.$label,doc.id);
                    });
                    return docs;
                })
                .fail(function (error) {
                    $log.error('Getting Classes:', error);
                });
        };

        var getOtherClasses = function (uri, query, key) {
            if (!store.hasOwnProperty(key + uri)) {
                store.addMap({
                    name: key + uri,
                    template: [
                        {
                            id: '?uri'
                        }
                    ],
                    from: query
                });
            }
            var flow = store[key + uri].find();

            return flow.asList()
                .then(function (docs) {
                    var ret = [];
                    docs.forEach(function (doc) {
                        ret.push(doc.id);
                    });
                    return ret;
                })
                .fail(function (err) {
                    $log.error('An error occurred: ', err);
                });

        };

        factory.getSuperAndEqClasses = function (uri) {
            return getOtherClasses(cleanURI(uri),globalConfig.endPointQueries.getSuperAndEqClasses.replace('%uri%',cleanURI(uri)),'SuperAndEqClasses');
        };

        factory.getSubAndEqClasses = function (uri) {
            return getOtherClasses(cleanURI(uri),globalConfig.endPointQueries.getSubAndEqClasses.replace('%uri%',cleanURI(uri)),'SubAndEqClasses');
        };

        var getProperties = function (uri, query, inverse, filterURI) {
            var storeKey = (inverse)? 'InverseProperties' : 'DirectProperties';
            if (!store.hasOwnProperty(storeKey + uri)) {
                store.addMap({
                    name: storeKey + uri,
                    template: [
                        {
                            id: '?uri',
                            uri: '?uri',
                            $comment: '?comment',
                            $label: '?label',
                            test: [{
                                id: '?label'}],
                            range: '?range'
                        }
                    ],
                    from: query
                });
            }
            var flow = store[storeKey + uri].find();

            return flow.asList()
                .then(function (docs) {
                    return (createAvailablePropertyObject(docs, inverse, filterURI));
                })
                .fail(function (err) {
                    $log.error('An error occurred: ', err);
                });
        };



        factory.getDirectProperties = function (uri, filterURI){
            return getProperties(cleanURI(uri), globalConfig.endPointQueries.getDirectProperties.replace('%uri%',uri), false, filterURI);
        };

        factory.getInverseProperties = function (uri, filterURI){
            return getProperties(cleanURI(uri), globalConfig.endPointQueries.getInverseProperties.replace('%uri%',uri), true, filterURI);
        };

        factory.getPropertyDetails = function (uri, property){
            if(property.type === 'INVERSE_PROPERTY'){
                return factory.getInverseProperties(cleanURI(uri), property.uri);
            }else{
                return factory.getDirectProperties(cleanURI(uri), property.uri);
            }
        };

        return factory;

    });
