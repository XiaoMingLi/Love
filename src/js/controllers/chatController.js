// by dribehance <dribehance.kksdapp.com>
angular.module("Love").controller("chatController", function($scope, $routeParams, $timeout, $rootScope, $location, userServices, errorServices, toastServices, localStorageService, config) {
    $scope.input = {};
    $scope.chats = [];

    $scope.page = {
        pn: 1,
        page_size: 500,
        message: "点击加载更多",
        receive_user_id: $routeParams.id
    }

    $scope.loadMore = function() {
        if ($scope.no_more) {
            return;
        }
        toastServices.show();
        $scope.page.message = "正在加载...";
        userServices.query_message_by_id($scope.page).then(function(data) {
            toastServices.hide();
            $scope.page.message = "点击加载更多";
            if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
                $scope.chats = $scope.chats.concat(data.Result.ChatMessages.list);
                $scope.no_more = $scope.chats.length == data.Result.ChatMessages.totalRow ? true : false;
            } else {
                errorServices.autoHide("服务器错误");
            }
            if ($scope.no_more) {
                $scope.page.message = "没有了";
            }
            $scope.page.pn++;
        })

    }
    $scope.loadMore();
    //消息
    $scope.send = function() {
        toastServices.show();
        userServices.send({
            receive_user_id: $scope.chats[0].receive_user_id,
            content: $scope.input.content,
        }).then(function(data) {
            toastServices.hide()
            if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
                $scope.chats.push({
                    "is_read": "",
                    "receive_nickname": "",
                    "current_image_01": "4131734_110157044032_22.jpg",
                    "receive_image_01": "4131734_110157044032_22.jpg",
                    "user_id": 1,
                    "send_receive_time": "2016-02-29 13:51:00.0",
                    "chat_message_id": $scope.chats[0].user_id,
                    "receive_user_id": $scope.chats[0].receive_user_id,
                    "content": $scope.input.content,
                    "post_time": "2016-02-29 13:51:00",
                    "current_nickname": "小明"
                })
                $scope.input.content = "";
            } else {
                errorServices.autoHide(data.message);
            }
        })
    }

    //屏蔽
    $scope.block = {

    };

    $scope.go = function() {
        $scope.block.status = 1

    };



    $scope.block_model = function(t) {
        toastServices.show();
        userServices.block({
            ta_user_id: $routeParams.id,
            black_type: t,

        }).then(function(data) {
            toastServices.hide()
            if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
                errorServices.autoHide(data.message);
                $rootScope.back();

            } else {
                errorServices.autoHide(data.message);
                $location.path("chat").search();
            }


        })

    }



})