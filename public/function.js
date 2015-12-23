/**
 *  core function
 */

var app = angular.module('fastGroupChat', ['ngRoute'])
.config(function ($routeProvider){
	$routeProvider
	//$routeProvider의 when 메소드를 이용하면 특정 URL에 해당하는 라우트를 설정한다. 이때 라우트 설정객체를 전달하는데 <ng-view>태그에 삽입할 탬플릿에 해당하는 url을 설정객체의 templateUrl 속성으로 정의한다.
	.when('/chat/:room', {templateUrl: 'chattingRoom.html',controller: 'chattingRoomCtrl'})
	//라우트 설정객체에 controller 속성을 통하여 해당 화면에 연결되는 컨트롤러 이름을 설정할 수 있다.\
	.otherwise({templateUrl : 'entrance.html', controller: 'mainController'})
}).
controller('chattingRoomCtrl',function($scope, $http, $routeParams) {
	//사용자 관리화면의 컨트롤러를 정의한다. 이 컨트롤러는 URL이 ‘/userList’일 경우에만 적용이 된다. 이전의 템플릿 코드에서 별도로 ng-controller 지시자를 사용하지 않고 $routeProvider에서 라우트를 정의할 때 해당 컨트롤러와 연결되는 화면을 정의하였다.
	
	$http.get('/checkRoomStatus' + $routeParams.room)
		.success(function(data){
			
			console.log(data);
			
			if(!data){
				window.location = "/";
			}
		})
		.error(function(data){
			console.log('error' + data);
		});
	
	$scope.room.name = $routeParams.room;
		
	//Message Sending Func
	$scope.chat = function(){
		
		var sendingData = { room : $routeParams.room , chat : $scope.room.chat }
		
		$http({
		       withCredentials: false,
		       method: 'post',
		       url: '/doChat',
		       data: sendingData
		 })
		 .success(function(data){
			$scope.room.chat = data; 
		 });
	};
	
});

app.controller("mainController",function($scope, $http){
	
	$scope.room = { name :'' , chat : ''};
	
	//생성되어 있는 Room 조회
	$http.get('/getRoomLists')
		.success(function(data){
			console.log(data);
			$scope.rooms = data;
		})
		.error(function(data){
			console.log('error' + data);
		});
	
	//생성되어 있는 Room에 사용자 참여
	$scope.joinRoom = function(){
		
		var selectedRoom = $('.roomNames:checked').val();
		
		$http.get('/joinRoom' + selectedRoom)
			.success(function(data){
				//선택된 방에 입장
				location.href = window.location+"#chat/"+data;
			})
			.error(function(data){
				console.log('error' + data)
			});
	};
	
	//새로운 Room 생성
	$scope.makeRoom = function(){
		
		$http.get('/makingRoom' + $scope.room.name)
			.success(function(data){
				$http.get('/getRoomLists')
					.success(function(data){
						$scope.rooms = data;
					})
					.error(function(data){
						console.log('error' + data);
					});
			})
			.error(function(data){
				console.log('error' + data)
			});
	};
});


