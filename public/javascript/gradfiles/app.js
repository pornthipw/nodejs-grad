var app = angular.module('gradfile', ['file_service']);

app.config(function($routeProvider) {
    $routeProvider.
	//when('/', {controller:LoginController, templateUrl:'/static/index.html'});
	//when('/upload', {controller:UploadController, templateUrl:'/static/upload.html'}).
    when('/', {controller:FileController, templateUrl:'static/gradfiles/index.html'});
});



function FileController($scope, FileDB, User) {            
  User.get(function(userInfo) {
    if(userInfo.username) {      
      $scope.user = userInfo;
      $scope.file_list = FileDB.query(function(result) {        
        console.log(result);
      });    
    } else {
    }
  });
    
        
    
  

};

app.filter('startFrom', function() {
    return function(input, start) {        
        start = +start; //parse to int
        if(input) {
            return input.slice(start);
        } 
        return [];
    }
});









