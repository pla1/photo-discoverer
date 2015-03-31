var pdApp = angular
.module('pdModule', [])
.constant("CONSTANTS", {
              FIVEHUNDRED_PIX_CONSUMER_KEY:"WRqL9VhwqzZkGpMESmJUpCSivjsNQTKfzGIAfaVG", 
              FIVEHUNDRED_PIX_API_URL_BASE:"https://api.500px.com"
          }
          );




pdApp.config(function($httpProvider) {
    
    $httpProvider.interceptors.push(function($q, $rootScope) {
        return {
            'request' : function(config) {
                $rootScope.$broadcast('loading-started');
                return config || $q.when(config);
            },
            'response' : function(response) {
                $rootScope.$broadcast('loading-complete');
                return response || $q.when(response);
            }
        };
    });
    
});

pdApp.directive("loadingIndicator", function() {
    return {
        restrict : "A",
        template : "<div>Loading...</div>",
        link : function(scope, element, attrs) {
            scope.$on("loading-started", function(e) {
                element.css({ "display" : "" });
            });
            
            scope.$on("loading-complete", function(e) {
                element.css({ "display" : "none" });
            });
        }
    };
});


pdApp.controller('pdController', [ '$scope', '$http', 'CONSTANTS', function($scope, $http, CONSTANTS) {
    $scope.fiveHundredPixFeatures = [{name:"editors"},{name:"popular"},{name:"upcoming"},{name:"fresh_today"},{name:"fresh_yesterday"},{name:"fresh_week"}];
    $scope.fiveHundredPixCategories = [{name:"Uncategorized"},{name:"Abstract"},{name:"Animals"},{name:"Black and White"},{name:"Celebrities"},{name:"City and Architecture"},{name:"Commercial"},{name:"Concert"},{name:"Family"},{name:"Fashion"},{name:"Film"},{name:"Fine Art"},{name:"Food"},{name:"Journalism"},{name:"Landscapes"},{name:"Macro"},{name:"Nature"},{name:"Nude"},{name:"People"},{name:"Performing Arts"},{name:"Sport"},{name:"Still Life"},{name:"Street"},{name:"Transportation"},{name:"Travel"},{name:"Underwater"},{name:"Urban Exploration"},{name:"Wedding"}];
    $scope.selectedFeature=storageGet("selectedFeature","editors");
    $scope.selectedCategory=storageGet("selectedCategory","Animals");
    $scope.selectedQuantity=storageGet("selectedQuantity",10);
    $scope.selectedSize=storageGet("selectedSize",3);
    $scope.pdPhotos = function() {
        console.log('pdPhotos - Feature: ' + $scope.selectedFeature + " category: " + $scope.selectedCategory + " quantity: " + $scope.quantity);
        if (typeof($scope.selectedFeature)  == "undefined" 
         || typeof($scope.selectedCategory) == "undefined" 
         || typeof($scope.selectedQuantity) == "undefined"
         || typeof($scope.selectedSize)     == "undefined") {
          return;
        }
        $scope.saveSettings();
        var url = CONSTANTS.FIVEHUNDRED_PIX_API_URL_BASE+"/v1/photos";
        var httpConfig = {
            method : "GET",
            params : {
                feature : $scope.selectedFeature,
                only : $scope.selectedCategory,
                consumer_key : CONSTANTS.FIVEHUNDRED_PIX_CONSUMER_KEY,
                rpp : $scope.selectedQuantity,
                image_size : $scope.selectedSize
            }
        }
        console.log("URL:" + url + "HTTP Config: " + JSON.stringify(httpConfig));
        $http.get(url, httpConfig).success(function(data) {
            console.log(JSON.stringify(data));
            $scope.items = data.photos;
          
        });
    }
 $scope.saveSettings = function() {
        console.log("saveSettings");
        storageSet("selectedFeature",  $scope.selectedFeature);
        storageSet("selectedCategory", $scope.selectedCategory);
        storageSet("selectedQuantity", $scope.selectedQuantity);
        storageSet("selectedSize",     $scope.selectedSize);
    }
    $scope.pdPhotos();


}]);




function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
function storageSet(name, value) {
  console.log("Saving " + name + " value is: "+ value);
  localStorage.setItem(name,value);
  return false;
}
function storageGet(name,defaultValue) {
  var value =  localStorage.getItem(name);
  if (isBlank(value)) {
    console.log("Value not found. Returning default value " + defaultValue);
    value = defaultValue;
    storageSet(name,value);
  }
  console.log("storageGet variable: " + name + " default value: " + defaultValue + " value: " + value);
  return value;
}



