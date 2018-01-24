var app = angular.module('myApp',['ngStorage','ngRoute']);
// app.config(function($routeProvider) { // is not used for this purpose
//     $routeProvider
//     .when("/", {
//         templateUrl : "http://localhost/angular-client/views/partials/index.html",
//         resolve : {
//                 'auth' : function(TokenService){
//                     return TokenService.isAuthentificated();
//                 }
//             }
//     })
//     .when("/login", {
//         templateUrl : "http://localhost/angular-client/views/partials/view.html",
//         resolve : {
//                 'auth' : function(TokenService){
//                     return TokenService.isAuthentificated();
//                 }
//             }
//     })
//     .when("/dashboard", {
//         templateUrl : "http://localhost/angular-client/views/layouts/form.html",
//         resolve : {
//                 'auth' : function(TokenService){
//                     return TokenService.isAuthentificated();
//                 }
//             }
//     })
//     .when("/blue", {
//         templateUrl : "blue.htm"
//     });
// });
// app.run(function($rootScope, $location, $window){ // is not used for this purpose
//     //If the route change failed due to authentication error, redirect them out
//     $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
//         if(rejection === 'Not Authenticated'){
//             $window.location.href = settings.clientUrl+"/views/layouts/login.html";
//         }
//     })
// });



app.filter('showAsHTML', function($sce){
    return function(string){
        return $sce.trustAsHtml(string);
    }
});

app.filter('toTimestamp',function(){
    return function(date){
        // var dateSplitted = date.split('-'); // date must be in DD-MM-YYYY format
        // var formattedDate = dateSplitted[1]+'/'+dateSplitted[0]+'/'+dateSplitted[2];
        // return new Date(formattedDate).getTime();
        var t = date.split(/[- :]/);
        var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5])).getTime();
        return d;
    }
});

