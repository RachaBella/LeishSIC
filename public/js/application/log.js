console.log("sanity check log");
var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/

$(document).ready(function() {
	//we always check first the session
	var user = checkSession(); 
	pageLog(user);
	$('.tooltipped').tooltip({delay: 50});
});

function pageLog() {

	$('#logIn').attr("class", "modal-action modal-close waves-effect waves-green btn-flat")
	$("#loginForm").on("submit", function (event) {
	event.preventDefault();
	console.log("login clicked")
	$(".errorMsgEmail").remove();
	var data = $(this).serialize();
		$.post('/login', data, function (response){
			console.log("the response login is = ", response)
				if (response === "wrong email") {
					$('#login').css("display", "block")
					$('#login').openModal();
					$(".error").append("<p class='errorMsgEmail'>This email doen't exist, try again</p>")
				} else if (response ==="wrong password") {
					$('#login').css("display","block")
					$('#login').openModal();
					$(".error").append("<p class='errorMsgEmail'>The password doesn't match, try again</p>")
				} else {
					changeName(response.user.userName)
					user = response.user;
				} 
		});
	})
	
	$("#signForm").on("submit", function (event) {
		event.preventDefault();
		var data = $(this).serialize();
		var pass = $("#password").val();
		var pass2 = $("#password2").val();
		var val = check(pass, pass2);
		if (val === 1) {
		 	$.post('/signup', data, function (response){
				if (response ==="error") {
					sweetAlert("Error", "An error occured, please try again", "error");
				} else if (response ==="email exists") {
					sweetAlert("Error", "This email already exists, choose another one", "error");
				} else if (response === "login exist") {
					sweetAlert("Error", "This username is already taken, choose another one", "error");
				} else {
					changeName(response.userName);
					user = response.user;
				}
			});
		}  else if (val === 0) {
			sweetAlert("Error", "The password has a wrong format, signup again!", "error");
		} else {
			sweetAlert("Error", "The second password doesn't match, signup again!", "error");
		}

		console.log("the data is : ", data)
		

	})

	//when the user click on logout
	$(document).on("click",".Ulog", function (event) {
		event.preventDefault();
		$.get('/logout', function (response) {
			//console.log("the logout response is = ", response)
			logout();
			swal("Logged Out!", "Your are now logged out", "success");
			window.location.href="/" 
			
			
		})
	})

	$(document).on("click",'.Uname', function (event) {
		console.log($("#uName").text())
		$.get("/profile/"+$("#uName").text(), function (response) {
			console.log("the response is ", response.user)
		})

	})

	$('#start').on("click", function (event) {
		console.log($("#uName").text())
		$.get("/" + "upload"+$("#uName").text(), function (response) {

		})
	})
}

//function to check password lenght and userName lenght
function check(pass, pass2) {
	if (pass.match(regex) === null) {
		return 0;
	} else {
		if (pass === pass2) {
			return 1;
		} else {
			return 2;
		}
	}
}

function changeName(name) {
	$('.log').remove();
	$(".sig").remove();
	$("#starta").prop("href", "/"+ name + "/upload" )
	$(".parent").prepend('<li class="Ulog"><a href="/"><i  class="material-icons left ">exit_to_app</i>Logout</a></li>')
	$(".parent").prepend('<li class="Uname"><a href="/profile/'+name +'" id="uName"><i  class="material-icons left ">account_circle</i>'+name+'</a></li>')
	$(".parentM").prepend('<li class="Ulog"><a href="/"><i class="material-icons left myIcon ">exit_to_app</i>Logout</a></li>')
	$(".parentM").prepend('<li class="Uname"><a href="/profile/"'+name +'" id="uNameM"><i class="material-icons left myIcon ">account_circle</i>'+name+'</a></li>')
}

function logout() {
	$('.Ulog').remove();
	$(".Uname").remove();
	$(".parent").prepend('<li class="sig"><a href="#signup"  class="modal-trigger"><i class="material-icons left ">person_add</i>Signup</a></li>')
	$(".parent").prepend('<li class="log"><a href="#login" class="modal-trigger" ><i class="material-icons left">account_circle</i>Login</a></li>')
	$(".parentM").prepend('<li class="sig"><a  data-target="#signup" class="modal-trigger"><i class="material-icons left myIcon ">person_add</i>Signup</a></li>')
	$(".parentM").prepend('<li class="log"><a  data-target="#login"  class="modal-trigger"><i class="material-icons left myIcon ">account_circle</i>Login</a></li>')
	$('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
    });
}

function checkSession() {
	$.get('/current_user', function (response) {
		if (response.user) {
			changeName(response.user.userName);
			return response.user
		} else if (response.user === null) {
			$.get('/', function (response) {	
			})
		}
	})
}