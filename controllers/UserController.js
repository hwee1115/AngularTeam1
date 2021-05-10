angular.module("app")
  .controller("UserController",function($scope, UsersService, $window, $rootScope, $location)  {    
    $scope.login = (user) => {
      UsersService.login(user)
        .then((response) => { // 아이디없음 이런 alert 줄려고하려면 여기서 처리해줘야하마.
          $rootScope.uid = response.data.uid;
          $rootScope.authToken = response.data.authToken; // 이 두개가 날라오는데 그것들을 여기다 저장 
          
          sessionStorage.setItem("uid", response.data.uid);
          sessionStorage.setItem("authToken", response.data.authToken);
          //리프레쉬를 할때도 데이터가 안날라감 어플리케이션 세션 스토리지
          
          //url을 자바스크립트를 이용해서 이동시킬때
          $location.url("/index.html"); 
          //console.log($rootScope.uid);
          //console.log($rootScope.authToken); // 날라오는지 확인을 위해 로깅으로 찍어보기  
          // $http.defaults.headers.common.authToken = newValue; app.js에 안하고 여기에 넣어도 ok

        })
        .catch((response) => {
          $window.alert("로그인 실패: " + response.data.message);
        });
    };
    $scope.$on("$routeChangeSuccess", () => {
      $scope.getList(1); // 무조건 1페이지가 보여지도록
    });

    $scope.view = "list";
    $scope.getView = () => {
      switch($scope.view) {
        case "list": return "views/http_user/list.html";
        case "create": return "views/http_user/create.html";
        case "read": return "views/http_user/read.html";
        case "update": return "views/http_user/update.html";
      }
    };
    
    $scope.createProductForm = () => {
      $scope.product = null; // **
      $scope.view = "create"; // 얘만 바꿔주면  끝
    };

    //한번은 자동적으로 나와야합니다.

    $scope.getList = (pageNo, keyword) => {    
      UsersService.list(pageNo, keyword)
      // promise를 리턴하므로 then 사용가능
        .then((response) => {          
          console.log(response);          
          $scope.pager = response.data.pager;
          $scope.userlist = response.data.users;
       
          $scope.pageRange = []; //배열(page의 번호들을 배열하는 과정)
          for(var i=$scope.pager.startPageNo; i<=$scope.pager.endPageNo; i++) {
            $scope.pageRange.push(i);
          }
          $scope.view = "list";
        });
    };

    $scope.read = (user_id) => {
      UsersService.read(user_id)
      .then((response) => {
        $scope.user = response.data;
        console.log(response.data);
        $scope.view = "read";
      });
    };

    //화면 이동에 대해 생각해보자
    //방법1: 젤 처음에 리스트에서 생성버튼을 누르면 입력할 수 있는 form이 나와야. 
    //list.html -> write.html
    //그러면 넘어가는거잖아요 그거를 어떤 방식으로 넘어가게할거냐? 라우터에 2개를(하지만 이미 한개한상태) when으로 등록해여
    //방법2: ng-include() : 외부에 있는 html을 넣을 수 있다.
    //라우터에서 index.html 하나만 라우터에 하나 만들면 ok
    //방법2으로도 한번해봐야합니다. 그래서 방법2로 고고

    $scope.createUser = (user) => {
      if(user && user.user_id && user.user_name && user.user_phone && user.dog_size) { // 이들이 다 존재한다면
      
  
        UsersService.create(user)
          .then((response) => {
            $scope.getList(1);
            $scope.view = "list";
          });
          
      } 
    };

    $scope.cancel = () => {
      $scope.getList($scope.pager.pageNo);
      $scope.view = "list";
    };

    $scope.updateUserForm = () => {
      $scope.view = "update";
    };

    $scope.updateUser = (user) => {
      if(user.user_id && user.user_name && user.user_phone && user.dog_size) { // product, bwriter는 이미 있으므로
        UsersService.update(user)
          .then((response) => {
            //$scope.getList($scope.pager.pageNo);
            $scope.read(user.user_id);
          })
      } 
    };

    $scope.searchList = (searchword) => {
      $scope.keyword = searchword;
      $scope.searchword=searchword;
      $scope.getList(1,searchword);
    }
    
  });