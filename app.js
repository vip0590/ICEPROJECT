var myApp = angular.module('myApp', [ 'ngRoute','angular.filter','angular-loading-bar' ] )
.directive('onFinishRender', function ($timeout) {
return {
    restrict: 'A',
    link: function (scope, element, attr) {
        if (scope.$last === true) {
            $timeout(function () {
                scope.$emit('ngRepeatFinished');
            });
        }
    }
}
});

myApp.service('myService', function(){
    var myjsonObj={};//the object to hold our data
	var myTeam={};//the object to hold our data
   this.setJson=function(data1){
	   myjsonObj=data1;
	   //console.log("Json Data set:"+myjsonObj);
   };
	
	this.getJson=function(){
	return myjsonObj;	
	};
	
	
   this.setmyTeam=function(data1){
	   myTeam=data1;
	   //console.log("Team Data set:"+myTeam);
   };
	
	this.getmyTeam=function(){
	return myTeam;	
	};
});

myApp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner"><img src="images/loading1.gif" ></div>';
  }]);



myApp.config(function ($routeProvider,$httpProvider) {
             
    $routeProvider
    
     .when('/', {
        templateUrl:'pages/Home_New.html',   
        controller: 'defaultController'
    })
    
    .when('/table', {
        templateUrl:'pages/LeagueTable.html',   
        controller: 'leagueController'
    })
	
	.when('/team/:ID', {
        templateUrl:'pages/TeamData.html',   
        controller: 'teamController'
    })
	
	.when('/players/:ID', {
        templateUrl:'pages/TeamPlayers.html',   
        controller: 'playerController'
    })
	
	.when('/results/', {
        templateUrl:'pages/Results.html',   
        controller: 'resultController'
    })
	
	.when('/fixtures/', {
        templateUrl:'pages/Fixtures.html',   
        controller: 'fixtureController'
    })
	
	.when('/teamResult/:ID', {
        templateUrl:'pages/TeamResult.html',   
        controller: 'teamFixtureController'
    })
	
	.when('/teamFixture/:ID', {
        templateUrl:'pages/TeamFixture.html',   
        controller: 'teamFixtureController'
    })
	
	.when('/head2head/:ID', {
        templateUrl:'pages/Head2Head.html',   
        controller: 'head2headController'
    });
  
		
} );

myApp.controller('defaultController',[ '$scope','$log','$http','myService',function($scope,$log,$http,myService) {
	
	var url="http://api.football-data.org/v1/competitions/426/teams";
	$http({
		headers: {'X-Auth-Token': '2626ddaf2f4a47afb15678d826f2ad39'},
		method: 'GET',
		url: url
		//params : {callback : 'JSON_CALLBACK'}
	}).
	success(function(data){
		$scope.success="Data received";
		fixture=data.teams;
		
		$scope.data_test=fixture;
		$scope.teams=data.teams;
		
		myService.setJson($scope.teams);
	}).
	error(function(data){
		$scope.errorMessage="Some Error";
	});
	
	
//	var url1="http://api.football-data.org/v1/competitions/";
//	$http({
//		headers: {'X-Auth-Token': '2626ddaf2f4a47afb15678d826f2ad39'},
//		method: 'GET',
//		url: url1
//		//params : {callback : 'JSON_CALLBACK'}
//	}).
//	success(function(data){
//		
//		console.log(data);
//		$scope.competition=data;
//		
//		
//			}).
//	error(function(data){
//		$scope.errorMessage="Some Error";
//	});
}]);


//myApp.controller('mainController',[ '$scope','$log','$http',function($scope,$log,$http) {
//	var url="http://api.football-data.org/v1/competitions/426/teams";
//	$http({
//		headers: {'X-Auth-Token': '2626ddaf2f4a47afb15678d826f2ad39'},
//		method: 'GET',
//		url: url
//		//params : {callback : 'JSON_CALLBACK'}
//	}).
//	success(function(data){
//		$scope.success="Data received";
//		fixture=data.teams;
//		$scope.data_test=fixture;
//		$scope.teams=data.teams;
//	}).
//	error(function(data){
//		$scope.errorMessage="Some Error";
//	});
//	
//}]);

myApp.controller('leagueController',[ '$scope','$log','$http',function($scope,$log,$http) {
   var url="http://api.football-data.org/v1/competitions/426/leagueTable";
	$http({
		headers: {'X-Auth-Token': '2626ddaf2f4a47afb15678d826f2ad39'},
		method: 'GET',
		url: url
		//params : {callback : 'JSON_CALLBACK'}
	}).
	success(function(data){
		$scope.competition=data.leagueCaption;
		$scope.success="Data received";
		$scope.standings=data.standing;
	}).
	error(function(data){
		$scope.errorMessage="Some Error";
	});
	
}]);

myApp.controller('teamController',[ '$scope','$log','$http','$routeParams','myService',function($scope,$log,$http,$routeParams,myService) {
	var id=$routeParams.ID;
	$scope.serviceData=myService.getJson();
	var url="http://api.football-data.org/v1/teams/"+id;
		$http({
		headers: {'X-Auth-Token': '2626ddaf2f4a47afb15678d826f2ad39'},
		method: 'GET',
		url: url
		//params : {callback : 'JSON_CALLBACK'}
	}).
	success(function(data){
		myService.setmyTeam(data);
		$scope.success="Data received";
		$scope.teamName=data.name;
		$scope.value=data.squadMarketValue;
		$scope.img=data.crestUrl;
		$scope.id=id;
	}).
	error(function(data){
		$scope.errorMessage="Some Error";
	});	
	
	var url1="http://api.football-data.org/v1/teams/"+id+"/fixtures";
	$http({
		headers: {'X-Auth-Token': '2626ddaf2f4a47afb15678d826f2ad39'},
		method: 'GET',
		url: url1
		//params : {callback : 'JSON_CALLBACK'}
	}).
	success(function(data){
		$scope.fixture=data.fixtures;
		
	}).
	error(function(data){
		$scope.errorMessage="Some Error";
		
	});
	
	$scope.checkLast5 = function(x){
        return x.status == 'FINISHED' && x._links.competition.href.split('/').pop().trim()=='426';
	 };
	
	
}]);

myApp.controller('playerController',[ '$scope','$log','$http','$routeParams','myService',function($scope,$log,$http,$routeParams,myService) {
	
	var id=$routeParams.ID;
	$scope.teamData=myService.getmyTeam();
	$scope.serviceData=myService.getJson();
	//console.log($scope.serviceData);
	var url="http://api.football-data.org/v1/teams/"+id+"/players";	
	$http({
		headers: {'X-Auth-Token': '2626ddaf2f4a47afb15678d826f2ad39'},
		method: 'GET',
		url: url
		//params : {callback : 'JSON_CALLBACK'}
	}).
	success(function(data){
		$scope.success="Data received";
		$scope.players=data.players;
		$scope.id=id;
		var test=data._links.team.href;
		//console.log(test);
		
		$http({
		headers: {'X-Auth-Token': '2626ddaf2f4a47afb15678d826f2ad39'},
		method: 'GET',
		url: test
		//params : {callback : 'JSON_CALLBACK'}
	}).
	success(function(data){
		
		$scope.teamName=data.name;
		$scope.imgURL=data.crestUrl;	
	}).
	error(function(data){
		$scope.errorMessage="Some Error";
	});	
	}).
	error(function(data){
		$scope.errorMessage="Some Error";
	});
	
	$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
    //you also get the actual event object
    //do stuff, execute functions -- whatever...
		 $('.material-card > .mc-btn-action').on('click',function () {
            var card = $(this).parent('.material-card');
            var icon = $(this).children('i');
            icon.addClass('fa-spin-fast');

            if (card.hasClass('mc-active')) {
                card.removeClass('mc-active');

                window.setTimeout(function() {
                    icon
                        .removeClass('fa-arrow-left')
                        .removeClass('fa-spin-fast')
                        .addClass('fa-bars');

                }, 800);
            } else {
                card.addClass('mc-active');

                window.setTimeout(function() {
                    icon
                        .removeClass('fa-bars')
                        .removeClass('fa-spin-fast')
                        .addClass('fa-arrow-left');

                }, 800);
            }
        });
    //alert("ng-repeat finished");
});
	
	
}]);

myApp.controller('resultController',[ '$scope','$log','$http','myService',function($scope,$log,$http,myService) {	
	
	$scope.teamData=myService.getJson();
	$scope.serviceData=myService.getJson();
	//console.log($scope.teamData);
   var url="http://api.football-data.org//v1/competitions/426/fixtures";
	var teamURL;
	$http({
		headers: {'X-Auth-Token': '2626ddaf2f4a47afb15678d826f2ad39'},
		method: 'GET',
		url: url
		//params : {callback : 'JSON_CALLBACK'}
	}).
	success(function(data){
		$scope.results=data.fixtures;
	}).
	error(function(data){
		$scope.errorMessage="Some Error";
	});
	
	

	
	
}]);


myApp.controller('fixtureController',[ '$scope','$log','$filter','$http',function($scope,$log,$filter,$http) {
	
	var url="http://api.football-data.org/v1/competitions/426/fixtures";
	$http({
		headers: {'X-Auth-Token': '2626ddaf2f4a47afb15678d826f2ad39'},
		method: 'GET',
		url: url
		//params : {callback : 'JSON_CALLBACK'}
	}).
	success(function(data){
		$scope.fixture=data.fixtures;
		
	}).
	error(function(data){
		$scope.errorMessage="Some Error";
		
	});
	
}]);

myApp.controller('teamFixtureController',[ '$scope','$log','$http','$routeParams','myService',function($scope,$log,$http,$routeParams,myService) {
	
	
	//console.log("hello");
	$scope.serviceData=myService.getJson();
	$scope.teamData=myService.getmyTeam();
	var id=$routeParams.ID;
	$scope.id=id;
	var x={};
	var url1="http://api.football-data.org/v1/teams/"+id+"/fixtures";
	$http({
		headers: {'X-Auth-Token': '2626ddaf2f4a47afb15678d826f2ad39'},
		method: 'GET',
		url: url1
		//params : {callback : 'JSON_CALLBACK'}
	}).
	success(function(data){
		$scope.fixture=data.fixtures;
		x=data.fixtures;
	}).
	error(function(data){
		$scope.errorMessage="Some Error";
		
	});
	
	 $scope.stat = function(x){
        return x.status == 'SCHEDULED' || x.status == 'TIMED'  || x.status == 'POSTPONED' ;
	 };
	
	
	
	
	
	
}]);



myApp.controller('head2headController',[ '$scope','$log','$http','$routeParams','myService',function($scope,$log,$http,$routeParams,myService) {
	
	
	$scope.serviceData=myService.getJson();
	$scope.teamData=myService.getmyTeam();
	$scope.currentTeamID=$scope.teamData._links.self.href.split('/').pop().trim();
	$scope.rivalTeamID=$routeParams.ID;
	
	var url1="http://api.football-data.org/v1/teams/"+$scope.currentTeamID+"/fixtures";
	$http({
		headers: {'X-Auth-Token': '2626ddaf2f4a47afb15678d826f2ad39'},
		method: 'GET',
		url: url1
		//params : {callback : 'JSON_CALLBACK'}
	}).
	success(function(data){
		$scope.fixture=data.fixtures;
		
	}).
	error(function(data){
		$scope.errorMessage="Some Error";
		
	});
	
	
	var url="http://api.football-data.org/v1/teams/"+$scope.rivalTeamID;
		$http({
		headers: {'X-Auth-Token': '2626ddaf2f4a47afb15678d826f2ad39'},
		method: 'GET',
		url: url
		//params : {callback : 'JSON_CALLBACK'}
	}).
	success(function(data){
		
		$scope.rivalteamName=data.name;
		
	}).
	error(function(data){
		$scope.errorMessage="Some Error";
	});	
	
	
		
	
	
}]);









