'use strict';
/**
 * Translator Manager Factory
 * A factory to manage translation of GSBL -> JSON and JSON -> SPARQL
 *
 */

angular.module('GSB.services.translatorManager', ['GSB.config'])
    .factory('TranslatorManager',
    function ($log, globalConfig, $rootScope, TranslatorToJSON, TranslatorToGSBL, TranslatorToSPARQL) {
        var factory = {};


        /**
         *  Function initiates JSON-saving
         *  @param mainSubjectSelected
         *  @param subjects
         */
        factory.prepareSaveLink = function (mainSubjectSelected, subjects) {

            var json = TranslatorToJSON.translateGSBLToJSON(mainSubjectSelected, subjects);
            var blob = new Blob([json], {type: 'application/json'});
            document.getElementById('saveLink').href = URL.createObjectURL(blob);

        };


        /**
         *  Function will load JSON-file as query
         *  @param mainSubjectSelected
         *  @param subjects
         */
        factory.loadJSON = function () {

            var selectedFile = document.getElementById('uploadJSON').files[0];
            // Only process JSON-files.
//        if (!selectedFile.type.match('json.*')) {
//            alert('Please choose a JSON File.');
//            return;
//        }

            var json;
            var reader = new FileReader();
            var bfile;
            reader.onloadend = function (e) {
                bfile = e.target.result;
                bfile.trim();
                json = JSON.parse(bfile);


                if (json === null) {
                    $log.error('JSON is not valid / empty');
                    return;
                }

                /* newWorkspaceContent[0]  all subject-objects
                 *  newWorkspaceContent[1]  from startpoint selected subject
                 *
                 * */
                var newWorkspaceContent = TranslatorToGSBL.translateJSONToGSBL(json);
                $rootScope.$broadcast('WorkspaceUpdateFromJSONEvent', newWorkspaceContent);
            };
            reader.readAsBinaryString(selectedFile);
        };


        /**
         *  Function first calls the factory to translate GSBL to JSON, then the one to translate JSON to SPARQL
         *  @param mainSubjectSelected
         *  @param subjects
         *  @param language
         */
        factory.translateGSBLToSPARQL = function (mainSubjectSelected, subjects, language) {

            var newJSON = TranslatorToJSON.translateGSBLToJSON(mainSubjectSelected, subjects);
            $rootScope.$broadcast('JSONUpdateEvent', newJSON);


            if (newJSON === null) {
                $log.error('JSON is not valid / empty');
                return;
            }


            var newSPARQL = TranslatorToSPARQL.translateJSONToSPARQL(JSON.parse(newJSON), language);
            $rootScope.$broadcast('SPARQLUpdateEvent', newSPARQL);
        };

        return factory;
    });
