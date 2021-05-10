angular.module("app")
  .controller("OrderController", function ($scope, OrdersService) {
    $scope.show = true;
    $scope.pageShow = true;
    $scope.dstatusList = ['전체', '배송준비중', '배송완료', '취소 중', '취소완료'];
    $scope.dstatus = '전체';

    $scope.toggle = () => {
      $scope.show = !$scope.show;
    };
    
    $scope.$on("$routeChangeSuccess", () => {
      $scope.getList(1);
    });

    $scope.view = "list";
    $scope.getView = () => {
      switch ($scope.view) {
        case "list": return "views/http_order/list.html";
        case "read": return "views/http_order/read.html";
      }
    };

    //리스트 
    $scope.getList = (pageNo) => {
      OrdersService.list(pageNo, $scope.searchword, $scope.dstatus)
        .then((response) => {
          $scope.pager = response.data.pager;
          $scope.orders = response.data.orders;
          $scope.count = response.data.count;
          $scope.pageRange = [];
          for (var i = $scope.pager.startPageNo; i <= $scope.pager.endPageNo; i++) {
            $scope.pageRange.push(i)
          }
          if ($scope.orders.length === 0) {
            $scope.pageShow = false;
            $scope.view = "list";
          } else if ($scope.orders.length >= 1) {
            $scope.pageShow = true;
            $scope.view = "list";
          }

        });
    };

     //검색리스트
     $scope.searchList = (searchword, dstatus) => {
      $scope.searchword = searchword;
      $scope.dstatus = dstatus;
      $scope.getList(1);
    }


    //주문 취소버튼
    $scope.deleteOrders = (order) => {
      if (order) {
        order.delivery_status = "취소완료";
        OrdersService.update(order)
          .then((response) => {
            $scope.getList($scope.pager.pageNo);
          })
      }
    };

    //배송완료 버튼
    $scope.completeOrders = (order) => {
      if (order) {
        order.delivery_status = "배송완료";
        OrdersService.update(order)
          .then((response) => {
            $scope.getList($scope.pager.pageNo);
          })
      }
    };

    //배송상태 수정
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

    //주문읽기
    $scope.read = (order_id) => {
      $scope.show = true;
      OrdersService.read(order_id)
        .then((response) => {
          $scope.order = response.data.order;
          $scope.orderProducts = response.data.orderProduct;
          $scope.view = "read";
        });
    };

    //사진 가져오기
    $scope.GetPhoto = (photoCategory, photo_sname, photo_type) => {
      return OrdersService.GetPhoto(photoCategory, photo_sname, photo_type);
    };

   

    //주문삭제
    $scope.delete = (order_id) => {
      console.log(order_id);
      OrdersService.delete(order_id)
        .then((response) => {
          $scope.getList($scope.pager.pageNo);
        });
    }

  });