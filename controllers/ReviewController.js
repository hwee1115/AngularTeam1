angular.module("app")
    .controller("ReviewController", function ($scope,ReviewsService,$rootScope) {
        $scope.$on("$routeChangeSuccess", () => {
        $scope.getList(1);
        }
    );

    $scope.view="list";
    $scope.getView = () => {
        switch($scope.view){
            case "list": return "views/http_reviews/list.html";
            case "listByFilter": return "views/http_reviews/listByFilter.html";
            case "listBySearch": return "views/http_reviews/listBySearch.html";
            case "read": return "views/http_reviews/read.html";
            case "update": return "views/http_reviews/update.html";
        }
    };

    $scope.getList = (pageNo) => {
    ReviewsService.list(pageNo)
        .then((response) => {
            $scope.pager = response.data.pager;

            $scope.reviews = response.data.reviews;
            $scope.pageRange = [];

            for(var i=$scope.pager.startPageNo; i<=$scope.pager.endPageNo; i++){
                $scope.pageRange.push(i)
            }
            $scope.view = "list";
        });
    };

    $scope.getListByFilter = (pageNo, review_scoreVal) => {

      ReviewsService.listByFilter(pageNo, review_scoreVal)
          .then((response) => {
              console.log("체크1:" + review_scoreVal)
              $scope.pager = response.data.pager;

              $scope.reviews = response.data.reviews;
              
              $scope.pageRange = [];
              for(var i=$scope.pager.startPageNo; i<=$scope.pager.endPageNo; i++){
                  $scope.pageRange.push(i)
              }
              console.log("체크2:" + $scope.reviews)
              $scope.view = "listByFilter";
          });
    };

    $scope.getListBySearch = (pageNo, searchVal, searchContent) => {
      ReviewsService.listBySearch(pageNo, searchVal, searchContent)
          .then((response) => {
              
              console.log("체크1:" + searchVal)
              console.log("체크1:" + searchContent)
              $scope.pager = response.data.pager;

              $scope.reviews = response.data.reviews;
              $scope.pageRange = [];
              for(var i=$scope.pager.startPageNo; i<=$scope.pager.endPageNo; i++){
                  $scope.pageRange.push(i)
              }

              console.log("체크2:" + $scope.reviews)
              $scope.view = "listBySearch";
          });
    };
    $scope.read = (review_id) => {
      ReviewsService.read(review_id)
      .then((response) => {
        $scope.review = response.data;
        $scope.view = "read";
      });
    };

    $scope.cancel = () => {
      $scope.getList($scope.pager.pageNo);
      $scope.view = "list";
    };
    $scope.updateReviewForm = () => {
      $scope.view = "update";
    };
    $scope.updateReviewLock = (review) => {
      if(review.review_title && review.review_content) { 
        ReviewsService.update(review)
          .then((response) => {
            //$scope.getList($scope.pager.pageNo);
            $scope.read(review.review_id);
            $scope.view = "list";
          })
      } 
    };
    $scope.review_scoreList = ["5", "4", "3", "2", "1"];
    $scope.review_scoreVal = 
    $scope.getReviewScoreVal = () => {
      //console.log("scope.review_scoreVal:" + $scope.review_scoreVal)
      return $scope.review_scoreVal === "5"? "" : $scope.review_scoreVal;


      // 그렇지 않으면 $scope.categoryVal return
      // 상태함수 정의는 컨트롤러에서 해줘야
    };



    $scope.searchList = ["리뷰내용", "리뷰제목", "작성자아이디"];
    $scope.searchVal = "리뷰내용"
    $scope.getSearchVal = () => {
      //console.log("scope.searchVal:" + $scope.searchVal)
      return $scope.searchVal === "리뷰내용"? "" : $scope.searchVal;
    };


    // $scope.categoryList = ["전체", "과일", "해산물", "음료"];
    // $scope.categoryVal = "전체" 
    // $scope.getCategoryVal = () => {
    //   return $scope.categoryVal === "전체"? "" : $scope.categoryVal;
    //   // 그렇지 않으면 $scope.categoryVal return
    //   // 상태함수 정의는 컨트롤러에서 해줘야
    // };

});