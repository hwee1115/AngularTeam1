angular.module("app")
.controller("QnaController", function($scope, QnaService, $rootScope) { 
  $scope.show = true;
  $scope.categoryList = ["전체", "배송 문의", "주문/결제 문의", "상품 문의", "답변 대기", "답변 완료"];
  $scope.searchCategory = "전체";

  $scope.$on("$routeChangeSuccess", () => {
    $scope.getList(1, "");
  });

  $scope.getView = () => {
    switch($scope.view) {
      case "list": return "views/http_qna/list.html"
      case "read": return "views/http_qna/read.html"
      case "update": return "views/http_qna/update.html"
    }
  };
  
  $scope.getList = (pageNo, qa_category) => {
    QnaService.list(pageNo, qa_category)
    .then((response) => { //데이터가 성공적으로 오게 되면 response 객체 얻음
      $scope.pager = response.data.pager; //상태변수에 담음. 왜? 상태변수에 담지 않으면 바인딩을 할 수가 없음. 상태 변수에 반드시 저장!!!!
      $scope.qnas = response.data.qnas;
      $scope.count = response.data.count;
      $scope.pageRange = []; //배열 선언
      for(var i=$scope.pager.startPageNo; i<=$scope.pager.endPageNo; i++){
        $scope.pageRange.push(i);
      }

      if($scope.qnas.length===0){
       $scope.show=false;
      }else if($scope.qnas.length>=1){
        $scope.show=true;
        $scope.view = "list";
      }
    });
  };

  $scope.read = (qa_id, categoryVal) => {
    QnaService.read(qa_id)
      .then((response) => {
        $scope.qna = response.data;
        $scope.view = "read";
        $scope.categoryVal = categoryVal;
      });
  };

  $scope.cancel = () => {
    $scope.getList($scope.pager.pageNo);
    $scope.view = "list";
  };

  $scope.updateQnaForm = () => {
    $scope.view = "update";
  };

  $scope.updateQna = (qna) => {
    
    if(qna && qna.qa_answer){
      qna.qa_admin = $rootScope.uid;
      qna.qa_status = "답변 완료";
      QnaService.update(qna)
        .then((response) => {
          $scope.read(qna.qa_id);
          $scope.view = "read";
        });
    }
  };

  $scope.deleteQna = (qa_id) => {
    QnaService.delete(qa_id)
        .then((response) => {
          $scope.getList($scope.pager.pageNo, $scope.categoryVal); 
          $scope.view = "list";
        });
    };

  $scope.search = (searchCategory) => {
    $scope.categoryVal =searchCategory;
    $scope.searchCategory = searchCategory;
    $scope.getList(1, searchCategory);
  }
});