/* factory */
app.factory('BaseService', function($compile){
    var methods = {};
    var count = 0;
    var data = new Array();
    methods.currentTimestamp = function(){
        return Math.floor(new Date().getTime()/1000);
    }
    methods.showView = function(template, $scope){
        var myEl = angular.element(document.querySelector("[custom-directive]"));
        myEl.attr('custom-template',template);
        $compile(myEl)($scope);
    };
    methods.parseArray = function(array, values){ // is not generated!
        for(var prop in values){
            array.push({'id_form_element' : parseInt(prop), 'value':  values[prop]});
        }
        return array;
    };
    methods.findInArray = function(key, array){
        $value = null;
        for(var prop in array){
            if(prop == key){
                $value = array[prop];
                break;
            }
            if(typeof(array[prop]) == 'object'){
                this.findInArray(key, array[prop]);
            }
        }
        return $value;
    };
    methods.findAllInArray = function(key, array){
        for(var prop in array){
            if(prop == key){
                data.push(array[prop]);
            }
            if(typeof(array[prop]) == 'object'){
                this.findAllInArray(key, array[prop]);
            }
        }
        return data;
    };

    methods.countInArray = function(key, array){
        for(var prop in array){
            if(prop == key){
                count++;
            }
            if(typeof(array[prop]) == 'object'){
                this.countInArray(key, array[prop]);
            }
        }
        return count;
    };
    methods.dateToTimestamp = function(convertDate){
        var date = new Date(convertDate);
        return date.getTime()/1000;
    };
    return methods;
});

app.factory('TokenService', function($http, $q, StorageService, BaseService){
    var methods = {};
    methods.getAccessToken = function($scope, data){
        var params = {
            client_id : settings.client_id,
            client_secret: settings.client_secret,
            grant_type: 'password',
            username: data.username,
            password: data.password,
            scope : ''
        };
        return $http.post(settings.authUrl+'/oauth/token',params);
    };
    methods.getRefreshToken = function(){
        var params = {
            client_id : settings.client_id,
            client_secret: settings.client_secret,
            grant_type: 'refresh_token',
            refresh_token : StorageService.getValueOf('refresh_token'),
            scope : ''
        };
        return $http.post(settings.authUrl+'/oauth/token',params);
    };
    methods.refreshAccessToken = function(){
        var expire = parseInt(StorageService.getValueOf('created_at')) + parseInt(StorageService.getValueOf('expires_in'));
        var now = BaseService.currentTimestamp();
        if
            (now >= expire){
            methods.getRefreshToken();
        }
    };
    methods.authTokenHeader = function() {
        methods.refreshAccessToken();
        return {
                'Accept': 'application/json; charset=utf-8',
                'Authorization': StorageService.getValueOf('token_type') + ' ' + StorageService.getValueOf('access_token')
        };
    };
    methods.isAuthentificated = function($scope){
        var isAuthenticated = StorageService.getValueOf('access_token') == null ? false : true;
        if(!isAuthenticated){
            return false;
        }
        else{
            return true;
        }
    };
    return methods;

});

/* services */
app.service('ApiService', function($http, StorageService){
    var serverUrl = settings.serverUrl;
    this.get = function(url, header = null, params = null){
        return $http({
            method: 'GET',
            dataType : 'jsonp',
            url: serverUrl + url,
            params: params,
            headers: header
        });
    }
    this.put = function(url, data, header = null){
       // return $http.put(serverUrl+url, data, header);
       return $http({
        method: 'PUT',
         dataType : 'jsonp',
        url: serverUrl + url,
        data: data,
        headers: header
    });
    };
    this.delete = function(url, data, header = null){
        return $http({
            method: 'DELETE',
             dataType : 'jsonp',
            url: serverUrl + url,
            data: data,
            headers: header
        });
    };
    this.post = function(url, data, header = null){
        return $http({
            method: 'POST',
             dataType : 'jsonp',
            url: serverUrl + url,
            data: data,
            headers: header
        });
    };
});

app.service('NotificationService', function($rootScope) {
    var success = new Array();
    var errors = new Array();
    this.setNotification = function(type, notification){
        switch(type){
            case 'error':
                errors.push(notification);
                break;
            case 'success':
                success.push(notification);
                break;
            case 'apiError':
                var statusError = notification.status;
                switch(statusError){
                    case 400:
                        errors.push("Morate popuniti sva polja. ");
                        break;
                    case 401:
                        errors.push("Niste registrovani.");
                        break;
                }
                break;
        }
    };
    this.getNotifications = function($scope){
        $rootScope.errors = errors;
        $rootScope.success = success;
    };

     this.printApiError = function(error){
            $rootScope.errors =[]; 
            if(error.data.errors){ // from server
                var erorArray = error.data.errors;
                for(var error in erorArray)
                    $rootScope.errors.push(erorArray[error]);
            }
            else if(error.data.message){
                $rootScope.errors.push(error.data.message);
            }
            else if(error.data.error){
                $rootScope.errors.push(error.data.error);
            }
            else{
                $rootScope.errors.push("Something went wrong. Try again.");
            }
    };
});

app.service('StorageService', function($window){
    this.setStorage = function(data){
        for (var key in data) {
            $window.localStorage.setItem(key, data[key]);
        }
    };
    this.getValueOf = function(key){
        return $window.localStorage.getItem(key);
    };
    this.setValueOf = function(key, value){
        $window.localStorage.setItem(key, value);
    };
    this.clearStorage = function(){
        $window.localStorage.clear();
    };
});

// all API QUERIES
app.service('QueryService',function(ApiService, TokenService, BaseService, StorageService){
    /* GET queries */
    this.getTypes = function(){
        return ApiService.get('/api/pub/type');
    };
    this.getMenus = function(){
        return ApiService.get('/api/pub/menu', TokenService.authTokenHeader());
    };
    this.getCurrency = function(){
        return ApiService.get('/api/pub/currency');
    };
    this.getCategories = function(){
        return ApiService.get('/api/pub/category');
    };
    this.getStatusies = function(){
        return ApiService.get('/api/pub/status');
    };
    this.getActiveOffers = function(){
        var data = {
            active: 1
        };
        return ApiService.get('/api/get/offer-user-currency-category/', TokenService.authTokenHeader(), data);
    };

    this.getUserOffers = function(id = null){
        var data = {
            user: true
        }
        if(id!=null){
            data['id_offer'] = id;
        }
        return ApiService.get('/api/get/offer-user-currency-category/', TokenService.authTokenHeader(), data);
    };
    this.getOfferActiveForm = function(id){
        var data = {
            id_offer: id, 
            active: 1
        };
        return ApiService.get('/api/get/form', TokenService.authTokenHeader(), data); // -formElement
    };
    this.getForm = function(id){
        var data = {
            id_form : id
        };
        return ApiService.get('/api/get/form',TokenService.authTokenHeader(),data);
    }
    this.getFormElements = function(ids){
        var data = {
            id_form: ids.toString()
        };
        return ApiService.get('/api/get/formElement-allowed-type', TokenService.authTokenHeader(), data);
    };
    this.getAllFormElements = function(ids){
        var data = {
            id_form_element: ids.toString()
        };
        return ApiService.get('/api/get/formElement-allowed', TokenService.authTokenHeader(),data);
    };
    this.getOfferForms = function(id){
        var data = {
            id_offer: id
        };
        return ApiService.get('/api/get/form', TokenService.authTokenHeader(), data);
    };
    this.getTasks = function(){ // --- CHANGE ---
        return ApiService.get('/api/get/task-status-user-offers',TokenService.authTokenHeader());
    };
    this.unserialize = function(obj){
        var data = {
            object : obj
        };
        return ApiService.get('/api/unserialize', null, data);
    }
    /* PUT queries */
    this.putForm = function(form, id){
        var data = {
            title: form.title,
            id_offer: id
        };
        console.log(data);
        return ApiService.put('/api/put/save/form', data, TokenService.authTokenHeader());
    };
    this.putFormElement = function(form,index, id){
        var data = {
            id_form: id,
            label: form.label[index],
            id_type: form.type[index].id_type,
            required: form.required ? 1 : 0,
            allowed_values: form.allowed
        };
        return ApiService.put('/api/put/save/formElement', data, TokenService.authTokenHeader());
    };
    this.putOffer = function(offer){
        var data = {
            title: offer.title,
            body: offer.body,
            price: offer.price,
            id_currency: offer.currency.id_currency,
            id_category: offer.category.id_category
        };
        if(offer.bgColor){
            data['bgcolor'] = offer.bgColor;
        }
        if(offer.textColor){
            data['txtcolor'] = offer.textColor;
        }
        return ApiService.put('/api/put/save/offer', data, TokenService.authTokenHeader());
    };

    this.putTask = function(form,id){
        var arrayValues = new Array();
        var get = new Array(form.fieldText,form.fieldTextBox, form.fieldRadio,form.fieldCheck,form.fieldSelect);
        for(var i in get){
            BaseService.parseArray(arrayValues, get[i]);
        }
        var data = {
            title_task: 'Proba',
            body_task: arrayValues,
            id_status: 1,
            id_offer: id,
            deadline: BaseService.dateToTimestamp(form.deadline)
        };
       return ApiService.put('/api/put/save/task', data, TokenService.authTokenHeader());
    };
    this.putUser = function(form){
        var data ={
            name: form.name,
            email: form.email,
            password: form.password
        }
        return ApiService.put('/api/registerUser', data, TokenService.authTokenHeader());
    };

    /* update API calls*/
    this.updateOffer = function(offer){
        var data = {
            id_offer: offer.id_offer,
            title: offer.title,
            body: offer.body,
            price: offer.price,
            id_currency: offer.currency.id_currency,
            id_category: offer.category.id_category,
            active: (offer.actived==true) ? 1 : 0
        };
        if(offer.bgColor){
            data['bgcolor'] = offer.bgColor;
        }
        if(offer.textColor){
            data['txtcolor'] = offer.textColor;
        }
        return ApiService.put('/api/put/update/offer', data, TokenService.authTokenHeader());
    };
    this.updateForm = function(form, id){
        var data = {
            id_form : id,
            title: form.title,
            active: (form.active==true)? 1 : 0
        };
        console.log(data);
        return ApiService.put('/api/put/update/form',data, TokenService.authTokenHeader());
    }; 
    this.updateTask = function(id, status, comment = null){
        var data = {
            id_task: id,
            id_status: status
        };
        if(comment!=null){
            data['comment'] = comment;
        }
        console.log(data);
        return ApiService.put('/api/put/update/task', data, TokenService.authTokenHeader());
    };

    /* delete API calls*/
    this.deleteOffer = function(id){
        var data = {
            id_offer: id
        };
        return ApiService.post('/api/delete/offer', data, TokenService.authTokenHeader());
    };
    this.deleteForm = function(id){
        var data = {
            id_form : id
        };
        return ApiService.post('/api/delete/form', data, TokenService.authTokenHeader());
    };
    this.deleteAllowedValues = function(ids){
        var data = {
             id_form : ids.toString()
        };
        console.log(ids);
        return ApiService.post('/api/delete/allowedValues', data, TokenService.authTokenHeader());
        
    };

});