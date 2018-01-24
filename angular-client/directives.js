app.directive("customDirective", function($http, $templateCache, $compile, $parse, $sce) {
    var setTemplate = function(attributes){
         var url = '';
          if (attributes.customTemplate) {
            url = 'views/partials/'+attributes.customTemplate+'.html';
          } else {
            url = 'views/partials/login.html';
            
          }
          return $sce.trustAsResourceUrl(settings.clientUrl + url); 
    };
    return {
        link: function(scope , element, attributes) {  
            return setTemplate(attributes);
        } ,
        templateUrl : function (element, attributes) {
        return setTemplate(attributes);
     }
    }
});
app.directive("otherDirective", function($http, $templateCache, $compile, $parse, $sce) {
    var setTemplate = function(attributes){
         var url = '';
          if (attributes.customTemplate) {
            url = 'views/partials/'+attributes.customTemplate+'.html';
          } else {
            url = 'views/partials/menu.html';
          }
          return $sce.trustAsResourceUrl(settings.clientUrl + url); 
    };
    return {
        link: function(scope , element, attributes) {  
            return setTemplate(attributes);
        } ,
        templateUrl : function (element, attributes) {
        return setTemplate(attributes);
     }
    }
});

app.directive('customCheck', function() {
    return {
        require: 'ngModel',

        link: function(scope, element, attr, mCtrl) {
        	var regex = null;
        	if(attr.check){
        		switch(attr.check){
        			case 'price':
        				regex = /^\d{1,30}((\,|\.)\d{2})?$/;
        				break;
        		}
        	}
        	else
        	{
        		return true;
        	}
            function validate(value) {
                if (value.match(regex)) {
                    mCtrl.$setValidity('regexCheck', true);
                } else {
                    mCtrl.$setValidity('regexCheck', false);
                }
                return value;
            }
            mCtrl.$parsers.push(validate);
        }
    };
});