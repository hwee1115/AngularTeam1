angular.module("app")
    .factory("ReviewsService",function($http){
        //변수 선언
        const BASE_URL = "http://localhost:8080/reviews";
        //서비스 객체를 리턴
        return {
            list: function(pageNo=1){
                const promise=$http.get(BASE_URL,{params:{pageNo}});
                return promise;
            },

            listByFilter: function(pageNo=1, review_score){
                const promise=$http.get(BASE_URL + "/filter" ,{params:{pageNo, review_score}});
                console.log("review_score:" + review_score)
                console.log("promise:" + promise)
                return promise;
            },

            read: function(review_id) {
                const promise = $http.get(BASE_URL + "/" + review_id); //** 
                return promise;
            },
            

            update: function(review) {
                const promise = $http.put(BASE_URL, review); 
                return promise;
            },

            delete: function(review_id) {
                const promise = $http.delete(BASE_URL + "/" + review_id);
                return promise;
            }
        }

    });