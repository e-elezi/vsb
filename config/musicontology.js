'use strict';

angular.module('GSB.config', [])
    .constant('globalConfig', {
        propertyTypeURIs: {
            'OBJECT_PROPERTY': [
                'http://purl.org/ontology/mo/',
                'http://purl.org/NET/c4dm/keys.owl#Key',
                'http://purl.org/dc/terms/MediaType',
                'http://web.resource.org/cc/License',
                'http://xmlns.com/foaf/0.1/'
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
            'mo': 'http://purl.org/ontology/mo/'
        },
        defaultGraphURIs: ['http://purl.org/ontology/mo/'],
        baseURL: 'https://ssl.leipert.io/sparql',
        resultURL: 'https://ssl.leipert.io/sparql?default-graph-uri=http%3A%2F%2Fpurl.org%2Fontology%2Fmo%2F&format=text%2Fhtml&timeout=5000&debug=on&query=',
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