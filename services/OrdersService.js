angular.module("app")
    .factory("OrdersService",function($http){
        //변수 선언
        const BASE_URL = "http://localhost:8080/orders";
        //서비스 객체를 리턴
        return {
            list: function(pageNo=1,keyword,searchStatus){
                const promise=$http.get(BASE_URL,{params:{pageNo,keyword,searchStatus}});
                return promise;
            },
            read:function(order_id){
                const promise =$http.get(BASE_URL + "/" + order_id);
                return promise;
            },
            update:function(order){
                const promise = $http.put(BASE_URL,order);
                return promise;
            },
            getcount:function(){
                const promise = $http.get(BASE_URL + "/" + "ordercount");
                return promise;
            }
        }
    });