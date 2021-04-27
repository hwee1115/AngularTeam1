angular.module("app",["ngRoute"])
    .config(function($logProvider) {
        console.log("app - config callback");
        $logProvider.debugEnabled(true); // 개발중일때는 true로 바꾸고 개발이 완료되면 false로 바꿔라 
    })

    .run(function($rootScope, $http) {
        //세션 저장소에 있는 uid,authToken을 읽기
        console.log("app - run callback");
        //전역 데이터
        $rootScope.rootUid = "user100";
        //전역 함수
        $rootScope.rootGetGreet = () => {
            return "Hello! AngularJS";
        };

        $rootScope.uid = sessionStorage.getItem("uid");
        $rootScope.authToken = sessionStorage.getItem("authToken");
        //$rootScope.authToken의 값의 변화를 감시
        $rootScope.$watch("authToken",(newValue)=>{
            if(newValue){
                console.log(newValue);

                $http.defaults.headers.common.authToken = newValue;
            }else{
            delete $http.defaults.headers.common.authToken
            }
        });

    })

    //중첩된 컨트롤러 범위에서 사용할 수 있는 상태 데이터 및 함수
    .controller("mainController", function($rootScope,$scope,$location,$route,ProductsService,OrdersService,QnaService){
        console.log("Ddd")
        $scope.logout = () =>{
            $rootScope.uid="";
            $rootScope.authToken = "";
            sessionStorage.removeItem("uid");
            sessionStorage.removeItem("authToken");
        };

        $scope.$on("loginSuccess", (event,message)=>{
            console.log("MainController가 loginSuccess 방송 수신함");
            console.log(message);
            $rootScope.uid= message.uid;
        })
        $scope.$on("$routeChangeSuccess", () => {
            ProductsService.GetCountSort("재고부족")
            .then((response)=>{
            $scope.pcount = response.data;
            });

            OrdersService.getcount()
            .then((response)=>{
                $scope.rcount = response.data;
                console.log(response.data);
            });

            QnaService.readwait()
            .then((response) => {
                $scope.waitcount = response.data;
                console.log(response.data);
            });

            UsersService.getcount()
            .then((response)=>{
                $rootScope.ucount = response.data;
                console.log(response.data);
            });

          });

        $scope.$on("logout",(event, message)=>{
            console.log("mainController가 logout 방송 수신함");
            $rootScope.uid="";
            $location.url("/index.html"); 

        })

        //이전 url과 동일한 url일 경우 리프레쉬함
        $scope.reloadable = (path) =>{
            if($location.url().includes(path)){
                $route.reload();
            }
        };
    });
// });