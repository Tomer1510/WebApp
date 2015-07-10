angular.module('WebApp').service('$localStorage', function(){
    this.get = function(id){
        return localStorage.getItem(id)||{};
    }

    this.set = function(id){
        return localStorage.getItem(id)||{};
    }
});