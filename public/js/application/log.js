console.log("sanity check log");
var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/
var options = [
		    {selector: '#infoImg', offset: 300, callback: 'Materialize.fadeInImage("#infoImg")'},
		    {selector: '#head', offset: 350, callback: 'Materialize.showStaggeredList("#head")'},
		    {selector: '#head2', offset: 400, callback: 'Materialize.showStaggeredList("#head2")'},
		    {selector: ".iAcceuil1", offset:451, callback: 'Materialize.fadeInImage(".iAcceuil1")'},
		    {selector: ".iAcceuil2", offset:452, callback: 'Materialize.fadeInImage(".iAcceuil2")'},
		    {selector: ".iAcceuil3", offset:500, callback: 'Materialize.fadeInImage(".iAcceuil3")'},
		    {selector: '#head3', offset: 400, callback: 'Materialize.showStaggeredList("#head3")'},
		    {selector: "#Tour", offset:400, callback: 'Materialize.fadeInImage("#Tour")'}

		  ];


$(document).ready(function() {
	//we always check first the session
	Materialize.scrollFire(options);
	$(window).scroll( function() {
 	 	if (($(document).scrollTop() > 50 ) &&( $(document).scrollTop()  <100 )) {
 	 		$(".navbar-fixed").css("opacity","0.8")
 	 	} else if ($(document).scrollTop() < 50) {
 	 		$('.fixed-action-btn').hide("fast");
 	 		$(".navbar-fixed").css("opacity","1");
 	 	} else if ($(document).scrollTop() > 100) {
 	 		$('.fixed-action-btn').show("fast");
 	 	}
 	});
	$('.carousel.carousel-slider').carousel({full_width: true});
	$(".button-collapse").sideNav();
	$('.parallax').parallax();
	$('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 400, // Transition in duration
      out_duration: 200, // Transition out duration
    });
	var user = checkSession(); 
	pageLog(user);
	$('.tooltipped').tooltip({delay: 50});
});

function animation1() {
	
    $('.iAcceuil3').slideDown("slow")

}

function pageLog() {

	//scrolling functions
	$("#scroll").on("click", function () {
		$('html, body').animate({
            scrollTop: $("#info").offset().top
        }, 800);
	})

	$(".tour").on("click", function () {
		$('html, body').animate({
            scrollTop: $("#Tour").offset().top
        }, 800);
	})

	$('#logIn').attr("class", "waves-effect waves-green btn-flat")
	$("#loginForm").on("submit", function (event) {
	event.preventDefault();
	console.log("login clicked")
	$(".errorMsgEmail").remove();
	var data = $(this).serialize();
		$.post('/login', data, function (response){
			console.log("the response login is = ", response)
			if (response.message === "wrong email") {
				$(".error").append("<p class='errorMsgEmail'>This email doen't exist, try again</p>")
			} else if (response.message ==="wrong password") {
				// $('#login').css("display","block")
				
				$(".error").append("<p class='errorMsgEmail'>The password doesn't match, try again</p>")
			} else {
				$('#login').closeModal();
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
					$(".error2").append("<p class='errorMsgEmail'>An error occured, please try again</p>")
				} else if (response ==="email exists") {
					$(".error2").append("<p class='errorMsgEmail'>This email already exists, choose another one and try again</p>")
				} else if (response === "login exists") {
					$(".error2").append("<p class='errorMsgEmail'>This username is already taken, choose another one and try again</p>")
				} else {
					$('#signup').closeModal();
					sweetAlert("Email Check","Check your email or your spam folder for a verification., ","success")
				}
			});
		}  else if (val === 0) {
			sweetAlert("Error", "The password has a wrong format, signup again!", "error");
		} else {
			sweetAlert("Error", "The second password doesn't match, signup again!", "error");
		}
	})
	//when the user click on logout
	$(document).on("click",".Ulog", function (event) {
		event.preventDefault();
		$.get('/logout', function (response) {
			//console.log("the logout response is = ", response)
			if (response.message ==="Error") {
				sweetAlert("Error", "An error occured, try logging out again!", "error");
			} else {
				logout();
				swal("Logged Out!", "Your are now logged out", "success");
				window.location.href="/" 
			}	
		})
	})

	$(document).on("click",'.Uname', function (event) {
		console.log($("#uName").text())
		$.get("/profile/"+$("#uName").text(), function (response) {
			console.log("the response is ", response.user)
		})

	})

	$(document).on("click","#gotoVi", function (event) {
		var name =$("#uName").text().replace("account_circle", "")
		name= name.replace(" ","")
		console.log(name)
		window.location.href="/"+name+"/visualize"
	})

	$(document).on("click","#gotoAn", function (event) {
		var name =$("#uName").text().replace("account_circle", "")
		name= name.replace(" ","")
		console.log(name)
		window.location.href="/"+name+"/analyze"
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
	$(".upLink").attr("href", "/"+ name + '/upload');
	$(".anLink").attr("href", "/"+ name + '/analyze');
	$(".visLink").attr("href", "/"+ name + '/visualize');
	$(".parent").prepend('<li class="Ulog"><a href="/"><i  class="material-icons left ">exit_to_app</i>Logout</a></li>')
	$(".parent").prepend('<li class="Uname"><a href="/profile/'+name +'" id="uName"><i class="material-icons left">account_circle</i>'+name+' </a></li>')
	$(".parentM").prepend('<li class="Ulog"><a href="/"><i class="material-icons left myIcon ">exit_to_app</i>Logout</a></li>')
	$(".parentM").prepend('<li class="Uname"><a href="/profile/'+name +'" id="uNameM"><i class="material-icons left myIcon =">account_circle</i>'+name+'</a></li>')
}

function logout() {
	$('.Ulog').remove();
	$(".Uname").remove();
	$(".upLink").attr("href", "/");
	$(".anLink").attr("href", "/");
	$(".visLink").attr("href", "/");
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
			// getFilesSelect(response.user._id)
			return response.user
		} else if (response.user === null) {
			$.get('/', function (response) {	
			})
		}
	})
}