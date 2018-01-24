app.controller('MenuCtrl',function($rootScope, $scope, $http, MenuService){
	MenuService.getMenus().then(function(response){
		$scope.menus = response.data.data;
	},
	function(error){
		console.log(error);
		$rootScope.errors = error;
	});
});
app.service('MenuService',function($http, TokenService, QueryService){
	this.getMenus = function(){
		return QueryService.get('/api/get/menu', TokenService.authTokenHeader());
	};	
});