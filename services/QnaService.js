angular.module("app")
  .factory("QnaService", function($http) {
    //변수 선언
    const BASE_URL = "http://localhost:8080/askList";
    //서비스 객체 리턴
    return {
      list: function(pageNo=1, qa_category) { 
        const promise = $http.get(BASE_URL, {params:{pageNo, qa_category}}); 
        return promise;
      },
      read: function(qa_id) {
        const promise = $http.get(BASE_URL + "/" + qa_id);
        return promise;
      },
      update: function(qna) {
        const promise = $http.put(BASE_URL, qna);
        return promise;
      },
      delete: function(qa_id) {
        const promise = $http.delete(BASE_URL + "/" + qa_id);
        return promise;
      }
    }
  }); 