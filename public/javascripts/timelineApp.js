var app = angular.module('timelineApp', ['ngRoute', 'ngResource']);

app.config(function ($routeProvider) {
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

app.factory('postService', function ($resource) {
	//Service to return posts of corresponding type, year and month
	return $resource('/data/posts/:type/:selectedYear/:selectedMonth');
});

app.factory('countService', function ($resource) {
	//Service to return count of posts of specified year and month
	return $resource('/data/count/:selectedYear/:selectedMonth');
});

app.controller('timelineController', function (postService, countService, $scope, $rootScope) {
	$scope.years = [2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009];
	$scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	$scope.displayTypes = ['All', 'Twitter POTUS', 'Twitter FLOTUS', 'Twitter White House', 'Vine', 'Facebook'];

	$scope.selectedYear = 2016;
	$scope.selectedMonth = 'Jan';
	$scope.postsType = 'All';
	types = ['all', 'twp', 'twf', 'tww', 'v', 'fb'];
	selectedPost = types[$scope.displayTypes.indexOf($scope.postsType)];

	monthData = [];
	for(month in $scope.months){
		//creating month data for page load
		monthData.push(countService.get({selectedYear:$scope.selectedYear, selectedMonth:month+1}));
	}

	$scope.posts = postService.query({ type: selectedPost, selectedYear: $scope.selectedYear, selectedMonth: $scope.months.indexOf($scope.selectedMonth) + 1 });
	drawPi($scope);

	monthData = [];
	count = 0;
	for(month in $scope.months){
		countService.get({selectedYear: $scope.selectedYear, selectedMonth: month}).$promise.then(function (data) {
			//Create the data variable to be sent to drawBar() function once the data is ready
			value = 0;
			count+=1;
			if (data[2])
				value+= +data[2]
			if (data[1]){
				if(data[2])
					value = +value + +10*data[1] 
				else
					value+= +data[1]
			}
			if (data[0]){
				if(data[2])
					value = +100*data[0] + +value
				else
					value+= +10*data[0]
			}
			monthData.push(value);
			if(count == 12){
				drawBar(monthData, $scope);
			}
		});
		
	}

	$scope.data = {
		getResultsForYear: function (year) {
			selectedPost = types[$scope.displayTypes.indexOf($scope.postsType)];
			$scope.selectedYear = year;
			$scope.posts = postService.query({ type: selectedPost, selectedYear: year, selectedMonth: $scope.months.indexOf($scope.selectedMonth) + 1 });
			monthData = [];
			count = 0;
			for(month in $scope.months){
				countService.get({selectedYear:year, selectedMonth:month}).$promise.then(function (data) {
					//create the data for the drawbar function
					value = 0;
					count+=1;
					if (data[2])
						value+= +data[2]
					if (data[1]){
						if(data[2])
							value = +value + +10*data[1] 
						else
							value+= +data[1]
					}
					if (data[0]){
						if(data[2])
							value = +100*data[0] + +value
						else
							value+= +10*data[0]
					}
					monthData.push(value);
					if(count == 12){
						drawBar(monthData, $scope);
					}
				});
				
			}
			drawPi($scope);
		},
		getResultsForMonth: function (month) {
			selectedPost = types[$scope.displayTypes.indexOf($scope.postsType)];
			$scope.selectedMonth = month;
			$scope.posts = postService.query({ type: selectedPost, selectedYear: $scope.selectedYear, selectedMonth: $scope.months.indexOf(month) + 1 });
			drawPi($scope);
		},
		getResultsForType: function (post) {
			$scope.postsType = post;
			selectedPost = types[$scope.displayTypes.indexOf($scope.postsType)];
			$scope.posts = postService.query({ type: selectedPost, selectedYear: $scope.selectedYear, selectedMonth: $scope.months.indexOf($scope.selectedMonth) + 1 });
			drawPi($scope);
		}
	}

});

//Function using d3 js to draw bar chart
function drawBar(values, $scope) {
	var data = [];
	for(i=0;i<$scope.months.length;i++){
		//creating the dataset
		data.push({name:$scope.months[i],value:values[i]});
	}
	
	//set up svg using margin conventions - we'll need plenty of room on the left for labels
	var margin = {
		top: 0,
		right: 25,
		bottom: 2,
		left: 60
	};
	var width = 300 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;
	var svg = d3.select("#bar");
	svg.selectAll("*").remove();

	var svg = d3.select("#bar").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("class", "shadow")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var x = d3.scale.linear()
		.range([0, width])
		.domain([0, d3.max(data, function (d) {
			return d.value;
		})]);
	var y = d3.scale.ordinal()
		.rangeRoundBands([height, 0], .1)
		.domain(data.map(function (d) {
			return d.name;
		}));

	var bars = svg.selectAll(".bar")
		.data(data)
		.enter()
		.append("g")
	//append rects
	bars.append("rect")
		.attr("class", "bar")
		.attr("y", function (d) {
			return y(d.name);
		})
		.attr("height", y.rangeBand())
		.attr("x", 0)
		.attr("width", function (d) {
			return x(d.value);
		});
	//add a value label to the right of each bar
	bars.append("text")
		.attr("class", "label")
		//y position of the label is halfway down the bar
		.attr("y", function (d) {
			return y(d.name) + y.rangeBand() / 2 + 4;
		})
		//x position is 3 pixels to the right of the bar
		.attr("x", function (d) {
			return x(d.value) + 3;
		})
		.text(function (d) {
			return d.value;
		});
	//make y axis to show bar names
	var yAxis = d3.svg.axis()
		.scale(y)
		.tickSize(0)
		.orient("left");
	var gy = svg.append("g")
		.attr("class", "axis")
		.call(yAxis)

}

//Function to draw pi chart using d3 js
function drawPi($scope) {
	$scope.posts.$promise.then(function (posts) {
		$scope.types = ["twp", "tww", "twf", "v"];
		$scope.typesCount = [0, 0, 0, 0];

		var count = 0;
		for (post in posts) {
			$scope.typesCount[$scope.types.indexOf($scope.posts[post].type)] += 1;
			count += 1;
		}

		var dataset = [];
		for (var i = 0; i < $scope.typesCount.length; i++) {
			//creating the data set 
			if ($scope.typesCount[i] == 0)
				continue;
			var name;
			switch ($scope.types[i]) {
				case "twp":
					name = "POTUS twitter";
					break;
				case "twf":
					name = "FLOTUS twitter";
					break;
				case "tww":
					name = "White House twitter";
					break;
				case "v":
					name = "Vine";
					break;
			}
			data = { 'name': name, 'percent':  Math.round(($scope.typesCount[i]/count)*100) };
			dataset.push(data);
		}

		var pie = d3.layout.pie()
			.value(function (d) { return d.percent })
			.sort(null)
			.padAngle(.03);

		var w = 300, h = 300;

		var outerRadius = w / 2;
		var innerRadius = 100;

		var color = d3.scale.category10();

		var arc = d3.svg.arc()
			.outerRadius(outerRadius)
			.innerRadius(innerRadius);

		var svg = d3.select("#chart");
		svg.selectAll("*").remove();

		svg = d3.select("#chart")
			.append("svg")
			.attr({
				width: w,
				height: h,
				class: 'shadow'
			}).append('g')
			.attr({
				transform: 'translate(' + w / 2 + ',' + h / 2 + ')'
			});
		var path = svg.selectAll('path')
			.data(pie(dataset))
			.enter()
			.append('path')
			.attr({
				d: arc,
				fill: function (d, i) {
					return color(d.data.name);
				}
			});

		path.transition()
			.duration(1000)
			.attrTween('d', function (d) {
				var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
				return function (t) {
					return arc(interpolate(t));
				};
			});


		var restOfTheData = function () {
			var text = svg.selectAll('text')
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
				.text(function (d) {
					return d.data.percent + "%";
				})
				.style({
					fill: '#fff',
					'font-size': '10px'
				});

			var legendRectSize = 20;
			var legendSpacing = 7;
			var legendHeight = legendRectSize + legendSpacing;


			var legend = svg.selectAll('.legend')
				.data(color.domain())
				.enter()
				.append('g')
				.attr({
					class: 'legend',
					transform: function (d, i) {
						//Just a calculation for x & y position
						return 'translate(-65,' + ((i * legendHeight) - 65) + ')';
					}
				});
			legend.append('rect')
				.attr({
					width: legendRectSize,
					height: legendRectSize,
					rx: 20,
					ry: 20
				})
				.style({
					fill: color,
					stroke: color
				});

			legend.append('text')
				.attr({
					x: 30,
					y: 15
				})
				.text(function (d) {
					return d;
				}).style({
					fill: 'black',
					'font-size': '14px'
				});
		};

		setTimeout(restOfTheData, 1000);

	});
}