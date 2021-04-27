angular.module("app") 
  .factory("UsersService", function($http) { // function($scope) : 생성자
    //변수 선언
    const BASE_URL = "http://localhost:8080/auth";
    //서비스 객체 리턴
    return {
      login: function(user) {
        const promise = $http.post(BASE_URL + "/login", user) // auth컨트롤러에서 postmapping 방식이였으므로
        return promise;
      },
      list: function(pageNo=1,keyword) { 
        console.log("serpageno : ",pageNo)
        console.log("serkeyword", keyword)       
        const promise = $http.get(BASE_URL + "/keywordlist", {params:{pageNo,keyword}}); // 비동기처리해야하므로 promise를 리턴해야
        return promise;
      },
      read: function(user_id) {
        const promise = $http.get(BASE_URL + "/" + user_id); //** 
        return promise;
      },      


      update: function(user) {
        const promise = $http.put(BASE_URL, user); 
        return promise;
      }
    }
  });