var app = angular.module('app', []);

app.controller('appController', function($scope, $http, $filter, $rootScope) {

	var data = new Date();
	$scope.data = new Date();
	$scope.hora = $filter('date')(data, "H");

	$scope.getLocation = function(){

		if (navigator.geolocation) {

			navigator.geolocation.getCurrentPosition(function(position){
				$scope.position = position.coords;
				console.log(position.coords);
				$scope.getData();
			}, function(error){
				switch(error.code) {
					case error.PERMISSION_DENIED:
					console.log("User denied the request for Geolocation.");
					$scope.loadingMsg = "You denied the request for Geolocation.";
					break;
					case error.POSITION_UNAVAILABLE:
					console.log("I could not get his location. Is GPS connected?");
					$scope.loadingMsg = "I could not get his location. Is GPS connected?";
					break;
					case error.TIMEOUT:
					console.log("The request to get location timed out.");
					$scope.loadingMsg = "The request to get location timed out.";
					break;
					case error.UNKNOWN_ERROR:
					console.log("An unknown error occurred.");
					break;
				}
				$scope.$apply();
			});

		} else {

			alert("Geolocation is not supported by this browser.");

		}

	}

	$scope.initial = function(){
		
		$scope.loadingMsg = "Loading...";
		$scope.getLocation();
		tryn = 1;

	}
	
	$scope.getData = function(){

		if(tryn <= 2){
			$scope.loadingMsg = "Loading...";
		}
		if(tryn > 2 && tryn <= 4){
			$scope.loadingMsg = "One more moment...";
		}

		$http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D%22(' + $scope.position.latitude + '%2C' + $scope.position.longitude + ')%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
		.then(function(response) {

			if(!response.data.query.results){
				console.log(response.data.query.results);
				tryn = tryn++;
				console.log(tryn + " attempts.");
				$scope.getData();
			}else{
				$scope.datas = response.data.query.results.channel;
				console.log(response.data.query.results.channel);
			}

		}, function errorCallback(response) {

			console.log(response);
			$scope.getData();

		});

	}

	$scope.hero = function(){

		if($scope.hora >= 0 && $scope.hora < 5){
			return 'noite';
		}
		if($scope.hora >= 5 && $scope.hora < 18){
			return 'dia';
		}
		else{
			return 'anoitecendo';
		}

	}

});


app.filter('miniaturas', function() {

	return function(y){

		var x = Number(y);

		if(x === 20 || x === 21 || x === 22 || x === 26){
			return "cloudy";
		}
		if(x === 27 || x === 28 || x === 44){
			return "cloudy_s_sunny";
		}
		if(x === 43){
			return "snow_s_rain";
		}
		if(x === 31 || x === 32 || x === 33 || x === 34 || x === 36){
			return "sunny";
		}
		if(x === 29 || x === 30){
			return "sunny_s_cloudy";
		}
		if(x === 3 || x === 4 || x === 37 || x === 38 || x === 39 || x === 45 || x === 47){
			return "thunderstorms";
		}
		if(x === 43){
			return "windy";
		}
		if(x === 11 || x === 12){
			return "rain";
		}

	}
});

app.filter('convertCelsius', function(){

	return function(x){

		return Math.round((x - 32) / (9 / 5));

	}

});

app.filter('convertKmh', function(){

	return function(x){

		return x / 1.609344;

	}

});