angular.module("app")
  .controller("ProductController", function ($scope,ProductsService,$rootScope) {
     $scope.$on("$routeChangeSuccess", () => {
        $scope.getList(1,$scope.optionValue);
    });
   
    $scope.view="list";
    $scope.getView = () => {
      switch($scope.view){
          case "list": return "views/Product/list.html";
          case "create": return "views/Product/create.html";
          case "read": return "views/Product/read.html";
          case "update": return "views/Product/update.html";
      }
  };

  $scope.optionList = ["번호순","재고순"];
  $scope.optionVal = "번호순";
  $scope.search = (optionVal) =>{
      $scope.optionValue = optionVal;
        $scope.getList($scope.pager.pageNo,optionVal);    
  }

  $scope.size = {
    S:false,
    M:false,
    L:false,
    XL:false,
    doubleXL:false
};
    $scope.createProductForm = () => {
    $scope.product=null;
    $scope.size.S=false;
    $scope.size.M=false;
    $scope.size.L=false;
    $scope.size.XL=false;
    $scope.size.doubleXL=false;
      $scope.view = "create";
  };

  $scope.getList = (pageNo,optionVal) => {
    ProductsService.list(pageNo,optionVal)
        .then((response) => {
            $scope.pager = response.data.pager;
            $scope.products = response.data.products;
            $scope.pageRange = [];
            for(var i=$scope.pager.startPageNo; i<=$scope.pager.endPageNo; i++){
                $scope.pageRange.push(i)
            }
            $scope.view = "list";
        });
};

$scope.cancel = () => {
  $scope.getList($scope.pager.pageNo,$scope.optionValue);
  $scope.view = "list";
};

$scope.read = (pid) =>{
    console.log(pid);
  ProductsService.read(pid)
      .then((response) => {


           //$scope.photo변수 초기화
        $scope.mainphoto = null;
        $scope.subphotos = null;
        $scope.detailphoto = null;
          $scope.product = response.data; 
          $scope.sizelist = response.data.sizelist;
          var subPhotos = [];
          for(var i=0; i< $scope.product.photolist.length; i++){
            if($scope.product.photolist[i].photo_role === "main"){
                $scope.mainphoto = $scope.product.photolist[i];
                console.log("mainphoto "+$scope.product.photolist[i].photo_oname);
            }
            else if($scope.product.photolist[i].photo_role === "sub"){
                subPhotos.push($scope.product.photolist[i]);
                console.log("subphoto "+$scope.product.photolist[i].photo_oname);
            }else if($scope.product.photolist[i].photo_role === "detail"){
                $scope.detailphoto = $scope.product.photolist[i];
                console.log("detailphoto"+$scope.product.photolist[i].photo_oname);
            }      
          }
          $scope.subphotos = subPhotos;
          $scope.view = "read";
      });
};

$scope.updateProductForm = (pid) =>{
    ProductsService.read(pid)
      .then((response) => {
       
            //$scope.photo변수 초기화
            $scope.mainphoto = null;
            $scope.subphotos = null;
            $scope.detailphoto = null;
          $scope.product = response.data;
          $scope.sizelist = response.data.sizelist;
          $scope.size.S=false;
          $scope.size.M=false;
          $scope.size.L=false;
          $scope.size.XL=false;
          $scope.size.doubleXL=false;

          var subPhotos = [];
          for(var i=0; i< $scope.product.photolist.length; i++){
            if($scope.product.photolist[i].photo_role === "main"){
                $scope.mainphoto = $scope.product.photolist[i];
                console.log("mainphoto "+$scope.product.photolist[i].photo_oname);
            }
            else if($scope.product.photolist[i].photo_role === "sub"){
                subPhotos.push($scope.product.photolist[i]);
                console.log("subphoto "+$scope.product.photolist[i].photo_oname);
            }else if($scope.product.photolist[i].photo_role === "detail"){
                $scope.detailphoto = $scope.product.photolist[i];
                console.log("detailphoto"+$scope.product.photolist[i].photo_oname);
            }      
          }
          $scope.subphotos = subPhotos;
        $scope.view = "update";
      });
};


$scope.updateProduct = (product) =>{
    console.log(product);
    if(product && product.p_name && product.p_category_name, product.p_description, product.p_price){
        
        var formData = new FormData();
        formData.append("p_id", product.p_id);
        formData.append("p_name", product.p_name);
        
        formData.append("p_category_name", product.p_category_name);
        
        formData.append("p_description", product.p_description);
        
        formData.append("p_price", product.p_price);
        
        formData.append("p_stock", product.p_stock);

        formData.append("p_size", $scope.size.S);
        formData.append("p_size", $scope.size.M);
        formData.append("p_size", $scope.size.L);
        formData.append("p_size", $scope.size.XL);
        formData.append("p_size", $scope.size.doubleXL);
        
        var mainphoto = $("#pmainphoto")[0].files[0];
        console.log("mainphto!!");
        console.log(mainphoto);
        if(mainphoto){
             console.log("mainphto!! start");
            formData.append("p_mainphoto", mainphoto);

            for(var i=0; i<$scope.product.photolist.length; i++ ){

                if($scope.product.photolist[i].photo_role=="main"){
                 //이전에 저장했던 사진의 데이터를 지우기 위해 이저 사진들의 id값 보냄
                formData.append("photo_ids",$scope.product.photolist[i].photo_id);
                formData.append("photo_names",$scope.product.photolist[i].photo_oname);
                }
            }
        }
       
        var subphotos = $("#psubphotos")[0].files;
        if(subphotos.length>0){
            for(var i=0; i< subphotos.length; i++){
                formData.append("p_subphotos", subphotos[i]);
            }
            
            for(var i=0; i<$scope.product.photolist.length; i++ ){

                if($scope.product.photolist[i].photo_role=="sub"){
                 //이전에 저장했던 사진의 데이터를 지우기 위해 이저 사진들의 id값 보냄
                formData.append("photo_ids",$scope.product.photolist[i].photo_id);
                formData.append("photo_names",$scope.product.photolist[i].photo_oname);
                }
            }
        }
       
        var detailphoto = $("#pdetailphoto")[0].files[0];
        if(detailphoto){
            formData.append("p_detailphoto", detailphoto);
            
            for(var i=0; i<$scope.product.photolist.length; i++ ){

                if($scope.product.photolist[i].photo_role=="detail"){
                 //이전에 저장했던 사진의 데이터를 지우기 위해 이저 사진들의 id값 보냄
                formData.append("photo_ids",$scope.product.photolist[i].photo_id);
                formData.append("photo_names",$scope.product.photolist[i].photo_oname);
                }
            }
        }
       
    ProductsService.update(formData)
    .then((response)=>{
        $scope.read(product.p_id);
      $scope.view="read";
     
    })
  }  
};

$scope.GetPhoto = (photoCategory,photo_sname, photo_type) => {
    return ProductsService.GetPhoto(photoCategory,photo_sname, photo_type);
};
$scope.createProduct = (product) => {
    console.log($scope.size.S);
    if(product && product.p_name && product.p_category_name, product.p_description, product.p_price, product.p_stock){
        
        var formData = new FormData();
        formData.append("p_name", product.p_name);
        
        formData.append("p_category_name", product.p_category_name);
        
        formData.append("p_description", product.p_description);
        
        formData.append("p_price", product.p_price);
        
        formData.append("p_stock", product.p_stock);


        formData.append("p_size", $scope.size.doubleXL);
        formData.append("p_size", $scope.size.XL);
        formData.append("p_size", $scope.size.L);
        formData.append("p_size", $scope.size.M);
        formData.append("p_size", $scope.size.S);

        var mainphoto = $("#pmainphoto")[0].files[0];
        console.log(mainphoto);
        if(mainphoto){
            formData.append("p_mainphoto", mainphoto);
        }
        var subphotos = $("#psubphotos")[0].files;
        if(subphotos.length>0){
            for(var i=0; i< subphotos.length; i++){
                formData.append("p_subphotos", subphotos[i]);
            }
        }
        var detailphoto = $("#pdetailphoto")[0].files[0];
        console.log(detailphoto);
        if(detailphoto){
            formData.append("p_detailphoto", detailphoto);
        }
        ProductsService.create(formData)
            .then((response) => {
                $scope.getList(1,$scope.optionValue);
                $scope.view = "list";
            });
    }
};
$scope.deleteProduct = (pid) =>{
  ProductsService.delete(pid)
  .then((response)=>{
    $scope.getList($scope.pager.pageNo, $scope.optionValue);
    $scope.view = "list";
  })
}
});