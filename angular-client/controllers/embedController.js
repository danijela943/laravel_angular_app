 app.controller('EmbedController', function($rootScope, $scope, $http, $window, $location, TokenService, StorageService, BaseService, NotificationService, QueryService){
	$scope.root = $rootScope;
	$rootScope.errors =[]; 
	$rootScope.errors.splice(0, $rootScope.errors.length);
	$rootScope.success =[]; 
	$rootScope.success.splice(0, $rootScope.success.length);
	$scope.errors = [];
	$scope.errors.splice(0, $scope.errors.length);
	$scope.success = [];
	$scope.success.splice(0, $scope.success.length);

	$scope.isAuth = TokenService.isAuthentificated($scope);
	/* show menu */

	QueryService.getMenus().then(function(response){
		$scope.menus = response.data.data;
	},NotificationService.printApiError)

	/* embed views renderers */
	
	function showOffers(){
		QueryService.getActiveOffers().then(function(response){
			$scope.offers = response.data.data;
			QueryService.getCategories().then(function(responseData){
				$scope.categories = responseData.data.data;
				$scope.userOffer = false;
			},NotificationService.printApiError);
			BaseService.showView('offers', $scope);
		},
		NotificationService.printApiError);
        
	}

	function showCreateForm(){
		QueryService.getTypes().then(function(response){
	        $scope.types = response.data.data;
	    },  NotificationService.printApiError
	    );
		$scope.elements = [
	       {
	            "placeholderLabel" : "Type label name",
	            "allowedValues" : []
	        }
	    ];
	    $scope.savedForm = false;
	    $scope.showFormElements = false;
	    BaseService.showView('forms', $scope);
	}

	function showCreateOffer(){
		getCurrencyCategories();
		$scope.change = false;
		$scope.offer = [];
		$scope.offer.category = {};
		$scope.offer.currency = {};
		BaseService.showView('form_create_offer', $scope);
	}

	function getCurrencyCategories(){
		QueryService.getCurrency().then(function(response){
			$scope.currency = response.data.data;
		});
		QueryService.getCategories().then(function(response){
			$scope.categories = response.data.data;
		}, NotificationService.printApiError);

	}
	function showLoginForm(){
		BaseService.showView('login', $scope);
	}
	$scope.showLogin = function(){
		BaseService.showView('login', $scope);
	};

	/* login */
	$scope.login = function(){
		var email = $scope.email;
		var password = $scope.password;
		if(email!='' && password!=''){
			var data = {
				username: email,
				password : password,
			};
			TokenService.getAccessToken($scope, data).then(function(response){
					StorageService.setStorage(response.data);
					StorageService.setValueOf('created_at', BaseService.currentTimestamp());
					NotificationService.setNotification('success','Uspesno ste se ulogovali!');
					showOffers();
				},
				NotificationService.printApiError
			);
		}
		else{
			NotificationService.setNotification('error','Morate popuniti sva polja');
		}
		NotificationService.getNotifications($scope);
	};

	$scope.logout = function(){
		StorageService.clearStorage();
		BaseService.showView('login',$scope);
	};

	$scope.showRegisterPage = function(){
		BaseService.showView('register',$scope);
	};
	$scope.registerUser = function(form){
		QueryService.putUser(form).then(function(response){
			console.log(response);
		}, NotificationService.printApiError);
	};
	/* offers page - show form for specific offer */

	$scope.showOrderForm = function(idOffer){
		QueryService.getOfferActiveForm(idOffer).then(function(response){
			var forms = response.data.data;
			var ids = BaseService.findAllInArray('id_form', response.data.data);
			if(ids.length>0){
				QueryService.getFormElements(ids).then(function(response){
					$scope.forms = forms;
					$scope.formElements = response.data.data;
					$scope.hdnId = idOffer;
					$scope.offerId = idOffer;
					BaseService.showView('form_insert_task',$scope);
				},function(error){
					console.log(error);
				});
			}else{
				if(forms.length >0){
					$scope.forms = forms;
					BaseService.showView('form_insert_task',$scope);
				}
				else{
					$rootScope.errors.push("This offer doesn't have form which can be use to order. Contact author via email.")
				}
			}
		}, NotificationService.printApiError);
	};


	$scope.showCreateOfferPage = function(){
		showCreateOffer();
	}

	$scope.showCreateFormPage = function(id){
		$scope.hdnIdOffer = id;
		QueryService.getOfferForms(id).then(function(response){
			$scope.forms = response.data.data;
			$scope.showOperations = false;
		}, NotificationService.printApiError);
		showCreateForm();
	}
	$scope.priceBetween = function(prop,less = 0, greater = 0, category = 0){
		return function(item){
			if(category == 0){
				if(less!=0 && greater!=0){
					return item[prop] <= greater && item[prop] >= less;
				}
				else if(less!=0){
					return item[prop] >= less;
				}
				else if(greater!=0){
					return item[prop] <= greater;
				}
			} else{
				if(category!=0 && less!=0 && greater!=0){
					return item[prop] <= greater && item[prop] >= less && item['id_category'] == category;
				}
				else if(less!=0 && category!=0){
					return item[prop] >= less && item['id_category'] == category;
				}
				else if(greater!=0 && category!=0){
					return item[prop] <= greater && item['id_category'] == category;
				} else{
					return item['id_category'] == category;
				}
			}

			return true;
		}
	}

	// offer active form is submitted
	$scope.insertTask = function(form){
		console.log(form);
		QueryService.putTask(form, $scope.offerId).then(function(response){
			console.log(response);
			
		},
		function(error){
			console.log(error);
		});
	};

	/* show offers of logged user */
	$scope.showOffersOfUser = function(){
		QueryService.getUserOffers().then(function(response){
			$scope.offers = response.data.data;
			$scope.userOffer = true;
			BaseService.showView('offers', $scope);
		}, NotificationService.printApiError);
	};

	/* forms - add form and form elements */
	
    $scope.createFormular = function(form){
        QueryService.putForm(form, $scope.hdnIdOffer).then(function(response){
            $scope.showFormElements = true;
            var id = BaseService.findInArray('id_form', response.data.data);
            if(id != null){
                $scope.hdnId = id;
                $scope.savedForm = true;
                $rootScope.success.push('You successfully added form.');
            }
            else{
                $rootScope.errors = [];
                $rootScope.errors.push("Something went wrong. Contact administrator.");
            }
            
        }, NotificationService.printApiError
        );
    };

    $scope.showForm = function(id){
    	QueryService.getForm(id).then(function(response){
    		$scope.element = response.data.data[0];
    		$scope.id_offer = response.data.data[0]['id_offer'];
    		QueryService.getFormElements(response.data.data[0]['id_form']).then(function(response){
    			$scope.formElements = response.data.data;
    			$scope.change = false;
    			BaseService.showView('offer_form', $scope);
    		},NotificationService.printApiError);
    		
    	},NotificationService.printApiError);
    };
    $scope.editForm = function(id){
    	QueryService.getForm(id).then(function(response){
    		$scope.form = response.data.data[0];
    		$scope.hdnIdForm = id;
    		$scope.id_offer = response.data.data[0]['id_offer'];
    		$scope.change = true;
    		BaseService.showView('offer_form', $scope);
    	}, NotificationService.printApiError);
    };
    $scope.deleteForm = function(id){;
	    		QueryService.deleteForm(id).then(function(response){
	    		if(BaseService.findInArray('message',response.data)!=null){
				$rootScope.success.push(BaseService.findInArray('message',response.data));
			}
	    	},NotificationService.printApiError);
    };
    $scope.saveEditForm = function(form){
    	console.log(form);
    	QueryService.updateForm(form, $scope.hdnIdForm).then(function(response){
    		if(BaseService.findInArray('message',response.data)!=null){
				$rootScope.success.push(BaseService.findInArray('message',response.data));
			}
    	},NotificationService.printApiError);
    };
    $scope.addForm = function(index, form){
        $scope.elements.push({"placeholderLabel": "Type label name" });
        $scope.elements[index]["saved"] = true;
        $scope.elements[index]["change"] = true;
        QueryService.putFormElement(form,index, $scope.hdnId).then(function(response){
            if(BaseService.findInArray('message',response.data)!=null){
				$rootScope.success.push(BaseService.findInArray('message',response.data));
			}
        }, NotificationService.printApiError
        );
    };
    $scope.onchangeType = function(obj, $index){
        
        if(obj.outerForm.type[$index]){
            var type = obj.outerForm.type[$index];
            if(type.has_values && type.has_values == 1){
                 obj.elements[$index]["allowedValues"] = [];
                var o = obj.elements[$index]["allowedValues"];
                o.push({"placeholderLabel": "Type allowed value"});
                obj.elements[$index]["allowedValues"] = o;
            }
            else{
                obj.elements[$index]["allowedValues"] = [];
                delete obj.outerForm.allowed;
            }
        }
    };
    $scope.removeAllowedValue = function(obj, index, form){
        delete form.outerForm.allowed[obj.length - 1]; // delete cached values for ngModel allowed from scope
        obj.splice(index,1);
    };
    $scope.addAllowedValue = function(obj){
        obj.push({"placeholderLabel": "Type allowed value"});
    };


    /* create offer */

    $scope.showOffersPage = function(){
    	showOffers();
    };

	$scope.addOffer = function(offer){
		QueryService.putOffer(offer).then(function(response){
			$rootScope.success =[];
			if(response.data.message){ // from server
				$rootScope.success.push(response.data.message);
			}
			else{
				$rootScope.success.push("Your offer is successfully added.");
			}
		},
		NotificationService.printApiError);
	};

	$scope.showChangeOfferForm = function(id){
		QueryService.getUserOffers(id).then(function(response){
			$scope.offer = response.data.data[0];
			getCurrencyCategories();
			$scope.offer.currency = { id_currency: response.data.data[0].id_currency, name: response.data.data[0].name};
			$scope.offer.category = { id_category: response.data.data[0].id_category, category_name : response.data.data[0].category_name};
			$scope.change = true;
			BaseService.showView('form_create_offer',$scope);
		}, NotificationService.printApiError);
	};

	$scope.changeOffer = function(offer){
		QueryService.updateOffer(offer).then(function(response){
			if(BaseService.findInArray('message',response.data)!=null){
				$rootScope.success.push(BaseService.findInArray('message',response.data));
			}
		}, NotificationService.printApiError);
	};

	$scope.deleteOffer = function(id){
		QueryService.deleteOffer(id).then(function(response){
			if(BaseService.findInArray('message',response.data)!=null){
				$rootScope.success.push(BaseService.findInArray('message',response.data));
			}
		}, NotificationService.printApiError);
	};

	/* show tasks */
	$scope.showTasks = function(){
		QueryService.getTasks().then(function(response){
			var bodyEL = new Array();
			var datas = response.data.data;
			for(var i=0; i<datas.length; i++){
				response.data.data[i]['body_task'] = angular.fromJson(datas[i]['body_task']);
			}
			$scope.tasks = response.data.data;
			var listFormElementIds = new Array();
			for(var i=0;i<response.data.data.length; i++){ // getting all distinct 'id_form_element'
				var tmpArrayFormElements = response.data.data[i]['body_task'];
				for(var j=0;j<tmpArrayFormElements.length; j++){
					var tmpId = tmpArrayFormElements[j]['id_form_element'];
					if(listFormElementIds.indexOf(tmpId) === -1) {
						listFormElementIds.push(tmpId);
					}
				}
			}
			QueryService.getAllFormElements(listFormElementIds).then(function(response){
				$scope.formElements = response.data.data;
			},NotificationService.printApiError);
			QueryService.getStatusies().then(function(response){
				$scope.status = response.data.data;
			},NotificationService.printApiError);
			BaseService.showView('tasks', $scope);
		}, NotificationService.printApiError);
	};

	$scope.updateStatus = function(idTask, ddlObj, index){
			QueryService.updateTask(idTask, ddlObj.ddlStatus.id_status).then(function(response){
				if(BaseService.findInArray('message',response.data)!=null){
					$rootScope.success.push(BaseService.findInArray('message',response.data));
				}
			}, NotificationService.printApiError);
		
	};

	$scope.saveTaskComment = function(idTask, form){
		QueryService.updateTask(idTask, null, form.comment).then(function(response){
				if(BaseService.findInArray('message',response.data)!=null){
					$rootScope.success.push(BaseService.findInArray('message',response.data));
				}
			}, NotificationService.printApiError);
	};

	/* create price formula */

	$scope.setPriceFormula = function(idOffer){ // id - id offer
		//console.log('stiglo '+id);
		QueryService.getOfferForms(idOffer).then(function(response){
			console.log(response);
		},function(error){
			console.log(error);
		});
	};
});