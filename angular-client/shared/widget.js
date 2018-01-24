"use strict";
var head = document.getElementsByTagName('head')[0];
var clientUrl = "http://localhost/angular-client/";
var appElement = document.createElement('div');
appElement.id = "app-root";
appElement.setAttribute('ng-app','myApp');
appElement.setAttribute('class','ng-scope'); 
var scripts = ['https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js', 
'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-sanitize.js',
clientUrl + 'lib/ngStorage.min.js', 
clientUrl + 'lib/ngRoute.js',
clientUrl + 'app.js',
clientUrl + 'services.js',
clientUrl + 'directives.js',
clientUrl + 'controllers/embedController.js',
];
loadScripts(0,scripts);

// if(typeof angular == 'undefined') {
//     document.write(unescape("%3Cscript type='text/javascript'  src='https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js'%3E%3C/script%3E"));
// }
loadJs(clientUrl+'config/settings.js');
//loadCSS(clientUrl+'public/css/bootstrap.css');
loadCSS(clientUrl+'public/css/style.css');

var rootEl = document.getElementById('angular-root');
rootEl.prepend(appElement);
var appRoot = document.getElementById("app-root");
var directive = document.createElement('div');
directive.setAttribute('custom-directive','');
directive.setAttribute('custom-template',''); 
// if(rootEl.dataset.view){ 
// }

appRoot.append(directive);

function loadJs(link){
	var script = document.createElement('script');
	script.src = link;
	script.type = "text/javascript";
	document.getElementById("angular-root").appendChild(script);
}
function loadCSS(link){
	var css = document.createElement('link');
	css.type = "text/css";
	css.rel = "stylesheet";
	css.href = link;
	document.getElementById("angular-root").appendChild(css);
}
function loadScripts(i, scripts){
    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;

	                loadScripts(i, scripts);
            }
        };
    } else {  //Others
        script.onload = function(){
            	loadScripts(i,scripts);
        };
    }
    if(i<scripts.length){
	    
	     script.src = scripts[i];
    	document.getElementById("angular-root").appendChild(script);
	}
	i++;
}