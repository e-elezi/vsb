'use strict';

angular.module('GSB.config', [])
    .constant('globalConfig', {
        propertyTypeURIs: {
            'OBJECT_PROPERTY': [
                /http:\/\/dbpedia.org\/ontology\//
            ],
            'NUMBER_PROPERTY': [
                'http://www.w3.org/2001/XMLSchema#(integer|float|double|decimal|positiveInteger|nonNegativeInteger)'
            ],
            'STRING_PROPERTY': [
                'http://www.w3.org/2001/XMLSchema#(string|literal)'
            ],
            'DATE_PROPERTY': [
                'http://www.w3.org/2001/XMLSchema#date'
            ]
        },
        prefixes: {
            'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
            'foaf': 'http://xmlns.com/foaf/0.1/',
            'owl': 'http://www.w3.org/2002/07/owl#',
            'category': 'http://dbpedia.org/resource/Category:',
            'dbpedia': 'http://dbpedia.org/resource/',
            'dbpedia-owl': 'http://dbpedia.org/ontology/',
            'dbpprop': 'http://dbpedia.org/property/',
            'units': 'http://dbpedia.org/units/',
            'yago': 'http://dbpedia.org/class/yago/'
        },
        defaultGraphURIs: ['http://dbpedia.org'],
        baseURL: 'http://dbpedia.org/sparql',
        resultURL: 'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&format=text%2Fhtml&timeout=5000&debug=on&query=',
        allowedLanguages: ['*', 'de', 'en', 'pl'],
        standardLang: 'en',
        aggregateFunctions: [
            {
                alias: 'cnt',
                operator: 'COUNT(%alias%)',
                restrictTo: null
            },
            {
                alias: 'sum',
                operator: 'SUM(%alias%)',
                restrictTo: 'NUMBER_PROPERTY'
            },
            {
                alias: 'min',
                operator: 'MIN(%alias%)',
                restrictTo: 'NUMBER_PROPERTY'
            },
            {
                alias: 'max',
                operator: 'MAX(%alias%)',
                restrictTo: 'NUMBER_PROPERTY'
            },
            {
                alias: 'avg',
                operator: 'AVG(%alias%)',
                restrictTo: 'NUMBER_PROPERTY'
            },
            {
                alias: 'gct',
                operator: 'GROUP_CONCAT(%alias%,",")',
                restrictTo: 'STRING_PROPERTY'
            }
        ],
        endPointQueries: {
            getDirectProperties: '<%uri%> (rdfs:subClassOf|(owl:equivalentClass|^owl:equivalentClass))* ?class .' +
            '?uri rdfs:domain ?class .' +
            'OPTIONAL { ?uri rdfs:range ?range }  .' +
            'OPTIONAL { ?uri rdfs:label ?label . BIND(LANG(?label) AS ?label_loc) } .' +
            'OPTIONAL { ?uri rdfs:comment ?comment . BIND(LANG(?comment) AS ?comment_loc) } .' +
            'FILTER ( !isBlank(?class) && !isBlank(?uri) && !isBlank(?range) ) ',
            getInverseProperties: '<%uri%> (rdfs:subClassOf|(owl:equivalentClass|^owl:equivalentClass))* ?class .' +
            '?uri rdfs:range ?class .' +
            'OPTIONAL { ?uri rdfs:domain ?range }  .' +
            'OPTIONAL { ?uri rdfs:label ?label . BIND(LANG(?label) AS ?label_loc) } .' +
            'OPTIONAL { ?uri rdfs:comment ?comment . BIND(LANG(?comment) AS ?comment_loc) } .' +
            'FILTER ( !isBlank(?class) && !isBlank(?uri) && !isBlank(?range) ) ',
            getSuperAndEqClasses: '<%uri%> (rdfs:subClassOf|(owl:equivalentClass|^owl:equivalentClass))* ?uri ' +
            'FILTER ( !isBlank(?uri) )',
            getSubAndEqClasses: '<%uri%> (^rdfs:subClassOf|(owl:equivalentClass|^owl:equivalentClass))* ?uri ' +
            'FILTER ( !isBlank(?uri) )',
            getAvailableClasses: '{?uri a rdfs:Class .} UNION {?uri a owl:Class .} .' +
            'FILTER ( !isBlank(?uri) )' +
            'OPTIONAL { ?uri rdfs:label ?label . BIND(LANG(?label) AS ?label_loc) } .' +
            'OPTIONAL { ?uri rdfs:comment ?comment . BIND(LANG(?comment) AS ?comment_loc)} '
        }
    });