angular.module("app")
  .controller("OrderController", function ($scope,OrdersService,$rootScope,$route) {
    $scope.show = true;
    $scope.keyword="";
    $scope.toggle=()=>{
      $scope.show=!$scope.show;
    };
     $scope.$on("$routeChangeSuccess", () => {
        $scope.getList(1,"");
    });

    $scope.view="list";
    $scope.getView = () => {
      switch($scope.view){
          case "list": return "views/http_order/list.html";
          case "read": return "views/http_order/read.html";
          case "nosearch": return "views/http_order/nosearch.html";
      }
  };

  $scope.getList = (pageNo,keyword) => {
    OrdersService.list(pageNo,keyword)
        .then((response) => {
            $scope.pager = response.data.pager;
            $scope.orders = response.data.orders;
            $scope.pageRange = [];
            for(var i=$scope.pager.startPageNo; i<=$scope.pager.endPageNo; i++){
                $scope.pageRange.push(i)
            }
            if($scope.orders.length===0){
              
              $scope.view="nosearch";
            }else if($scope.orders.length>=1){
              $scope.view = "list";
            }
          
        });
};



$scope.deleteOrders = (order,keyword) =>{
    $scope.keyword = keyword;
    if(order){
      order.delivery_status="취소완료";
      OrdersService.update(order)
      .then((response)=>{
        $scope.getList($scope.pager.pageNo,keyword);
      })
    }  
  };

  $scope.completeOrders = (order,keyword) =>{
    $scope.keyword = keyword;
    if(order){
      order.delivery_status="배송완료";
      OrdersService.update(order)
      .then((response)=>{
        $scope.getList($scope.pager.pageNo,keyword);
      })
    }  
  };

   $scope.changeStatus = (order,status,keyword) =>{
    if(order){
      order.delivery_status=status;
      $scope.keyword = keyword;
      OrdersService.update(order)
      .then((response)=>{
        $scope.toggle();
        $scope.read(order.order_id,keyword);
      })
    }  
  }; 

  $scope.read = (order_id,keyword) =>{
    $scope.keyword = keyword;
    $scope.show = true;
    OrdersService.read(order_id)
        .then((response) => {
          $scope.order = response.data.order;
          $scope.orderProducts = response.data.orderProduct;
          $scope.view = "read";
        });
    };

  $scope.searchList = (searchword) =>{
    $scope.keyword = searchword;
    $scope.getList(1,searchword);
  }

 
   
});