'use strict';

var myApp = angular.module('myApp.controllers', ['fhcloud']);

myApp.controller('MainCtrl', function($scope, $q, fhcloud) {
    // add function to pass userInput to cloud via
    // $fh.cloud call to controller scope
    $scope.getNumberOfCharacters = function() {
      var userInput = $scope.userInput;

      //Notifying the user that the cloud endpoint is being called.
      $scope.noticeMessage = "Calling Cloud Endpoint";
      $scope.textClassName = "text-info";
      
      $scope.customerList = undefined;

      //Creating an AngularJS promise as the $fh.cloud function is asynchronous.
      var defer = $q.defer();

      var promise = defer.promise;

      //When the promise has completed, then the notice message can be updated to include result of the $fh.cloud call.
      promise.then(function(response){
        // If successful, display the length  of the string.
        if (response && typeof response.CUSTOMER_LIST != 'undefined') {
          $scope.customerList = response.CUSTOMER_LIST;
          $scope.noticeMessage = undefined;
          $scope.textClassName = "text-success";
        } else {
          $scope.noticeMessage  = "Error: Expected a message from $fh.cloud.";
          $scope.textClassName = "text-danger";
        }
      }, function(err){
        //If the function
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
      });

      // check if userInput is defined
      if (userInput) {
        /**
         * Pass the userInput to the module containing the $fh.cloud call.
         *
         * Notice that the defer.resolve and defer.reject functions are passed to the module.
         * One of these functions will be called when the $fh.cloud function has completed successully or encountered
         * an error.
         */
        fhcloud.cloud('hello', userInput, defer.resolve, defer.reject);
      }
    };
    
    
    $scope.createCustomer = function() {
      var custName = $scope.custName;
      $scope.noticeMessage = "Calling Cloud Endpoint";
      $scope.textClassName = "text-info";
      var defer = $q.defer();
      var promise = defer.promise;

      //When the promise has completed, then the notice message can be updated to include result of the $fh.cloud call.
      promise.then(function(response){
        // If successful, display the length  of the string.
        if (response && typeof response['@CUSTOMERNUMBER'] != 'undefined') {
          if (response['@CUSTOMERNUMBER'] > 0) {
            $scope.noticeMessage = "Created: " +  response['@CUSTOMERNUMBER'];
            $scope.textClassName = "text-success";
          } else {
            scope.noticeMessage  = "Error: Customer not created. SAP returned:" +  JSON.stringify(response);
            $scope.textClassName = "text-danger";
          }
        } else {
          $scope.noticeMessage  = "Error: Expected a message from $fh.cloud.";
          $scope.textClassName = "text-danger";
        }
      }, function(err){
        //If the function
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
      });

      // check if userInput is defined
      if (custName) {
        /**
         * Pass the userInput to the module containing the $fh.cloud call.
         *
         * Notice that the defer.resolve and defer.reject functions are passed to the module.
         * One of these functions will be called when the $fh.cloud function has completed successully or encountered
         * an error.
         */
        fhcloud.cloudCreate('create', custName, defer.resolve, defer.reject);
      }
      
      
    }
});