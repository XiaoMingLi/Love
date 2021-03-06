// by dribehance <dribehance.kksdapp.com>
angular.module("Love").controller("signupController", function($scope, $rootScope, $routeParams, $location, $timeout, $location, userServices, loveServices, errorServices, toastServices, localStorageService, config) {

    $scope.step = 1;
    $scope.input = {};
    $scope.show_step = function(step) {
        $scope.step = step;
    }
    $scope.modal = {
        status: 0
    };
    $scope.open_modal = function() {
        $scope.modal.status = 1;
    }
    $scope.cancel_modal = function() {
        $scope.modal.status = 0;
    };
    // 验证码
    $scope.countdown = {
        // count: "5",
        message: "获取验证码",
    }
    $scope.countdown.callback = function() {
        toastServices.show();
        userServices.get_smscode({
            telephone: $scope.input.telephone
        }).then(function(data) {
            toastServices.hide()
            if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
                errorServices.autoHide(data.message)
            } else {
                $scope.countdown.reset = true;
                // $scope.modal.status = 3;
                errorServices.autoHide(data.message);
            }
        })
    }

    // upload success;
    $scope.$on("upload_success", function(event, args) {
        $scope.input.filename = args.message;
    });

    // gender
    $scope.input.gender = 1;
    $scope.select_gender = function(gender) {
        $scope.input.gender = gender;
    };
    loveServices.query_province().then(function(data) {
        $scope.provinces = data.province;
        $scope.input.province = $scope.provinces[0];
    });
    $scope.$watch('input.province', function(n, o) {
        if (n === undefined) {
            return;
        }
        $scope.query_city(n);
    })
    $scope.query_city = function(province) {
        loveServices.query_city().then(function(data) {
            $scope.cities = data[province];
            $scope.input.city = $scope.cities[0];
        });
    };
    // 第三步骤
    // 年龄
    var age = 18,
        ages = [];
    for (var i = 0; i < 83; i++) {
        ages.push(age + "岁");
        age++;
    }
    $scope.ages = ages;
    $scope.input.age = $scope.ages[0];
    // 身高
    var height = 100,
        heights = [];
    for (var i = 0; i < 150; i++) {
        heights.push(height + "cm")
        height++
    }
    $scope.heights = heights;
    $scope.input.height = $scope.heights[0];
    // 学历
    $scope.degrees = ["初中", "高中", "中专", "大专", "本科", "硕士", "博士"];
    $scope.input.degree = $scope.degrees[0];
    // 婚姻状况
    $scope.marrys = ["未婚", "已婚", "离异", "丧偶"];
    $scope.input.marry = $scope.marrys[0];
    // 收入
    $scope.incomes = ["5000元以下", "5000-10000元", "10000-20000元", "20000-30000元", "30000以上"];
    $scope.input.income = "5000元以下";
    $scope.ajaxForm = function() {
        toastServices.show();
        userServices.rsa_key().then(function(data) {
            var crypt = new JSEncrypt(),
                private_key = data;
            crypt.setPrivateKey(private_key);
            var crypted_str = crypt.encrypt($scope.input.password);
            $scope.input.password = crypted_str;
        }).then(function(data) {
            userServices.signup({
                fileName: $scope.input.filename,
                telephone: $scope.input.telephone,
                password: $scope.input.password,
                tel_code: $scope.input.sms_code,
                sex: $scope.input.gender,
                nickname: $scope.input.nickname,
                province: $scope.input.province,
                city: $scope.input.city,
                height: $scope.input.height,
                edu: $scope.input.degree,
                marry: $scope.input.marry,
                income: $scope.input.income,
                recommend_code: $scope.input.referee,
                uid: $routeParams.uid
            }).then(function(data) {
                toastServices.hide();
                if (data.code == config.request.SUCCESS && data.status == config.response.SUCCESS) {
                    errorServices.autoHide(data.message);
                    $scope.input.password = "";
                    localStorageService.set("token", data.token);
                    $timeout(function() {
                        $location.path('ta').search("uid", null).replace()
                    }, 2000)
                } else {
                    errorServices.autoHide(data.message)
                }
            })
        })
    }
});
// by dribehance <dribehance.kksdapp.com>
//上传头像
angular.module("Love").controller("uploadController", function($scope, userServices, errorServices, toastServices, localStorageService, config) {
    var filename, extension;
    $scope.$on("flow::filesSubmitted", function(event, flow) {
        flow.files[0].name.replace(/.png|.jpg|.jpeg|.gif/g, function(ext) {
            extension = ext;
            return ext;
        })
        filename = new Date().getTime() + extension;
        flow.opts.target = config.url + "/app/UserCenter/updatePic";
        flow.opts.testChunks = false;
        flow.opts.fileParameterName = "image_01";
        flow.opts.query = {
            "invoke": "h5",
            "filename": filename
        };
        toastServices.show();
        flow.upload();
    });
    $scope.$on('flow::fileAdded', function(file, message, chunk) {
        // $scope.cover.url = "";
    });
    $scope.$on('flow::fileSuccess', function(file, message, chunk) {
        $scope.$flow.files = [];
        $scope.$emit("upload_success", {
            message: filename
        });
        toastServices.hide();
    });

})