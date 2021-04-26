angular.module("app")
.config(function($routeProvider) {
     console.log("app-config callback(ROUTE)");
     
 $routeProvider
 .when("/", {templateUrl: "views/main/home.html"})
.when("/http_order", {templateUrl: "views/http_order/index.html",controller:"OrderController"})
.when("/http_reviews", {templateUrl: "views/http_reviews/index.html", controller:"ReviewController"})
.when("/http_user", {templateUrl: "views/http_user/index.html", controller: "UserController"})
.when("/http_qna",{templateUrl: "views/http_qna/index.html", controller: "QnaController"})
.when("/product", {templateUrl:"views/Product/index.html", controller:"ProductController"})
.otherwise({redirectTo: "/"}) 
});
