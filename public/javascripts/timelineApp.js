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
	return $resource('/data/posts/:type/:selectedYear/:selectedMonth');
});

app.controller('timelineController', function(postService, $scope, $rootScope){
    $scope.years = [2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008];
    $scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $scope.selectedYear = 2016;
	$scope.selectedMonth =  'Jan';
	$scope.postsType = 'all';
	
	$scope.posts = postService.query({type: $scope.postsType, selectedYear: $scope.selectedYear, selectedMonth:$scope.months.indexOf($scope.selectedMonth) + 1});
	
	$scope.data = {
		getResultsForYear : function(year) {
			$scope.selectedYear = year;
			$scope.posts = postService.query({type: $scope.postsType, selectedYear: year})
		},
		getResultsForMonth : function(month) {
			$scope.selectedMonth = month;
			$scope.posts = postService.query({type: $scope.postsType, selectedYear: $scope.selectedYear, selectedMonth:$scope.months.indexOf(month) + 1})
		}
	}
});