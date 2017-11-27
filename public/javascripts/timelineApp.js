var app = angular.module('timelineApp', ['ngRoute', 'ngResource']);

app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'timeline.html',
			controller: 'timelineController'
		})
		//the inspiration display
		.when('/inspiration', {
			templateUrl: 'inspiration.html'
		})
		//the technologies display
		.when('/technologies', {
			templateUrl: 'technologies.html'
		});
});

app.factory('postService', function($resource){
	return $resource('/data/posts/twp/:selectedYear');
});

app.controller('timelineController', function(postService, $scope, $rootScope){
    $scope.years = [2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008];
    $scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $scope.selectedYear = 2016;
    $scope.selectedMonth =  'Jan';

    $scope.posts = postService.query({selectedYear: $scope.selectedYear});
});