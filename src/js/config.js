angular.module("Love").constant("config", {
	url: "http://",
	imageUrl: "http://",
	request: {
		"SUCCESS": "200",
		"TOKEN_INVALID": "405"
	},
	response: {
		"SUCCESS": 1
	},
	common_params: {
		invoke: "h5"
	},
	interceptor: [
		"account",
		"appointment",
		"appointment1",
		"appointment2",
		"authen",
		"basic",
		"chat",
		"create_appointment",
		"index",
		"lovers",
		"manual_authen",
		"mating",
		"member",
		"member1",
		"member2",
		"messages",
		"message",
		"mylove",
		"phone_authen",
		"realname_authen",
		"search",
		"services",
		"signin",
		"signup",
		"single",
		"search_conditional",
		"send_messages",
		"appointment1_refuse",
		"appointment1_sure",
		"appointment2_refuse",
		"appointment2_sure",
		"detail",
		"charge",
		"me",
		"ta",
		
		"visitors"
	]
});