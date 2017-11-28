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
	$scope.displayTypes = ['All','Twitter POTUS','Twitter FLOTUS', 'Twitter White House', 'Vine', 'Facebook'];

    $scope.selectedYear = 2016;
	$scope.selectedMonth =  'Jan';
	$scope.postsType = 'All';
	types = ['all','twp','twf','tww','v','fb'];
	selectedPost = types[$scope.displayTypes.indexOf($scope.postsType)];

	$scope.posts = postService.query({type: selectedPost, selectedYear: $scope.selectedYear, selectedMonth:$scope.months.indexOf($scope.selectedMonth) + 1});
	drawPi($scope);
	drawBar();

	$scope.data = {
		getResultsForYear : function(year) {
			selectedPost = types[$scope.displayTypes.indexOf($scope.postsType)];
			$scope.selectedYear = year;
			$scope.posts = postService.query({type: selectedPost, selectedYear: year, selectedMonth:$scope.months.indexOf($scope.selectedMonth) + 1});
			drawPi($scope);
		},
		getResultsForMonth : function(month) {
			selectedPost = types[$scope.displayTypes.indexOf($scope.postsType)];
			$scope.selectedMonth = month;
			$scope.posts = postService.query({type: selectedPost, selectedYear: $scope.selectedYear, selectedMonth:$scope.months.indexOf(month) + 1});
			drawPi($scope);
		},
		getResultsForType : function(post) {
			$scope.postsType = post;
			selectedPost = types[$scope.displayTypes.indexOf($scope.postsType)];
			$scope.posts = postService.query({type: selectedPost, selectedYear: $scope.selectedYear, selectedMonth:$scope.months.indexOf($scope.selectedMonth) + 1});
			drawPi($scope);
		}
	}

});


function drawBar(){
	// var data = [4, 8, 15, 16, 23, 42];
	
	// var x = d3.scale.linear()
	// 	.domain([0, d3.max(data)])
	// 	.range([0, 420]);
	
	// d3.select("#bar")
	//   .selectAll("div")
	// 	.data(data)
	//   .enter().append("div")
	// 	.style("width", function(d) { return x(d) + "px"; })
	// 	.text(function(d) { return d; });
}


function drawPi($scope){
	$scope.posts.$promise.then(function(posts){
		$scope.types = ["twp","twf"];
		$scope.typesCount = [0,0];
		
		for(post in posts){
			$scope.typesCount[$scope.types.indexOf($scope.posts[post].type)] += 1;
		}
		console.log($scope.typesCount);


		// var chart = d3.select('.pi');
		// chart.selectAll("*").remove();

		// chart.append("div").attr("class", "chart")
		//   .selectAll('div')
		//   .data($scope.typesCount).enter().append("div")
		//   .transition().ease("elastic")
		//   .style("width", function(d) { return d + "%"; })
		//   .text(function(d) { return d + "%"; });
		//var sum = $scope.typesCount.reduce(function(pv, cv) { return pv + cv; }, 0);
		var dataset = [];
		for (var i = 0; i < $scope.typesCount.length; i++){
			if ($scope.typesCount[i] == 0)
				continue;
			var name;
			switch ($scope.types[i]) {
				case "twp":
					name = "POTUS twitter";
					break;
				case "twf":
					name = "FOTUS twitter";
					break;
				case "tww":
					name = "White House twitter";
					break;
			}
			data = {'name':name, 'percent':$scope.typesCount[i]};
			dataset.push(data);
		}
		console.log(dataset);
		 
		var pie=d3.layout.pie()
		  .value(function(d){return d.percent})
		  .sort(null)
		  .padAngle(.03);
		 
		var w=300,h=300;
		 
		var outerRadius=w/2;
		var innerRadius=100;
		 
		var color = d3.scale.category10();
		 
		var arc=d3.svg.arc()
		  .outerRadius(outerRadius)
		  .innerRadius(innerRadius);

		var svg=d3.select("#chart");
		svg.selectAll("*").remove(); 

		svg=d3.select("#chart")
		  .append("svg")
		  .attr({
			  width:w,
			  height:h,
			  class:'shadow'
		  }).append('g')
		  .attr({
			  transform:'translate('+w/2+','+h/2+')'
		  });
		var path=svg.selectAll('path')
		  .data(pie(dataset))
		  .enter()
		  .append('path')
		  .attr({
			  d:arc,
			  fill:function(d,i){
				  return color(d.data.name);
			  }
		  });
		 
		path.transition()
		  .duration(1000)
		  .attrTween('d', function(d) {
			  var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
			  return function(t) {
				  return arc(interpolate(t));
			  };
		  });
		 
		 
		var restOfTheData=function(){
			var text=svg.selectAll('text')
				.data(pie(dataset))
				.enter()
				.append("text")
				.transition()
				.duration(200)
				.attr("transform", function (d) {
					return "translate(" + arc.centroid(d) + ")";
				})
				.attr("dy", ".4em")
				.attr("text-anchor", "middle")
				.text(function(d){
					return d.data.percent;
				})
				.style({
					fill:'#fff',
					'font-size':'10px'
				});
		 
			var legendRectSize=20;
			var legendSpacing=7;
			var legendHeight=legendRectSize+legendSpacing;
		 
		 
			var legend=svg.selectAll('.legend')
				.data(color.domain())
				.enter()
				.append('g')
				.attr({
					class:'legend',
					transform:function(d,i){
						//Just a calculation for x & y position
						return 'translate(-55,' + ((i*legendHeight)-65) + ')';
					}
				});
			legend.append('rect')
				.attr({
					width:legendRectSize,
					height:legendRectSize,
					rx:20,
					ry:20
				})
				.style({
					fill:color,
					stroke:color
				});
		 
			legend.append('text')
				.attr({
					x:30,
					y:15
				})
				.text(function(d){
					return d;
				}).style({
					fill:'black',
					'font-size':'14px'
				});
		};
		 
		setTimeout(restOfTheData,1000);


	});
}