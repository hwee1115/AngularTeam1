angular.module("app")
    .factory("ProductsService",function($http){
        //변수 선언
        const BASE_URL = "http://localhost:8080/products";
        //서비스 객체를 리턴
        return {
            list: function(pageNo=1, optionVal="등록순"){
                const promise=$http.get(BASE_URL,{params:{pageNo:pageNo,optionVal:optionVal}});
                return promise;
            },
            read:function(pid){
                const promise = $http.get(BASE_URL + "/" + pid);
                return promise;
            },

            create:function(formData){
                const promise = $http.post(BASE_URL,formData,{headers:{"Content-Type":undefined}});
                return promise;
            },
            update:function(formData){
                const promise = $http.put(BASE_URL,formData,{headers:{"Content-Type":undefined}});
                return promise;
            },
            delete:function(pid){
                const promise = $http.delete(BASE_URL + "/" + pid);
                return promise;
            },
            GetPhoto:function(photoCategory,photo_sname, photo_type){
                return "http://localhost:8080/resource/GetPhoto/"+photoCategory+"/"+photo_sname+"/"+photo_type;
            },
            GetCountSort:function(countSort){
                const promise = $http.Get(BASE_URL + "/"+"CountSort"+"/"+ countSort);
                return promise;
            },

        }
    });