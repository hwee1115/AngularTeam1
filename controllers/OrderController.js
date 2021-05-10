angular.module("app")
  .controller("OrderController", function ($scope,OrdersService,$rootScope,$route) {
    $scope.show = true;
    $scope.pageShow=true;
    $scope.dstatusList = ['전체','배송준비중','배송완료','취소 중','취소완료'];
    $scope.dstatus='전체';
    $scope.toggle=()=>{
      $scope.show=!$scope.show;
    };
     $scope.$on("$routeChangeSuccess", () => {
        $scope.getList(1);
    });

    $scope.view="list";
    $scope.getView = () => {
      switch($scope.view){
          case "list": return "views/http_order/list.html";
          case "read": return "views/http_order/read.html";
          case "nosearch": return "views/http_order/nosearch.html";
      }
  };

  $scope.getList = (pageNo) => {
    OrdersService.list(pageNo,$scope.searchword,$scope.dstatus)
        .then((response) => {
            $scope.pager = response.data.pager;
            $scope.orders = response.data.orders;
            $scope.count = response.data.count;
            $scope.pageRange = [];
            for(var i=$scope.pager.startPageNo; i<=$scope.pager.endPageNo; i++){
                $scope.pageRange.push(i)
            }
            if($scope.orders.length===0){
              $scope.pageShow=false;
              $scope.view = "list";
            }else if($scope.orders.length>=1){
              $scope.pageShow=true;
              $scope.view = "list";
            }
          
        });
};



    $scope.deleteOrders = (order) => {
      if (order) {
        order.delivery_status = "취소완료";
        OrdersService.update(order)
          .then((response) => {
            $scope.getList($scope.pager.pageNo);
          })
      }
    };

    $scope.completeOrders = (order) => {
      if (order) {
        order.delivery_status = "배송완료";
        OrdersService.update(order)
          .then((response) => {
            $scope.getList($scope.pager.pageNo);
          })
      }
    };

    $scope.changeStatus = (order, status) => {
      if (status === undefined) {
        alert("저장할 값을 선택해주세요.")
      }
      if (status !== undefined) {
        order.delivery_status = status;
        OrdersService.update(order)
          .then((response) => {
            $scope.toggle();
            $scope.read(order.order_id);
          })
      }
    };

    $scope.read = (order_id) => {
      $scope.show = true;
      OrdersService.read(order_id)
        .then((response) => {
          $scope.order = response.data.order;
          $scope.orderProducts = response.data.orderProduct;
          $scope.view = "read";
        });
    };

    $scope.GetPhoto = (photoCategory, photo_sname, photo_type) => {
      return OrdersService.GetPhoto(photoCategory, photo_sname, photo_type);
    };

    $scope.searchList = (searchword, dstatus) => {
      $scope.searchword = searchword;
      $scope.dstatus = dstatus;
      $scope.getList(1);
    }

    $scope.delete = (order_id) => {
      console.log(order_id);
      OrdersService.delete(order_id)
        .then((response) => {
          $scope.getList($scope.pager.pageNo);
        });
    }

});