console.log("sanity check profile");
var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/


$(document).ready(function() {

	profileLoad();
	$('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
    });
    $(".button-collapse").sideNav();
})

function profileLoad() {
var user = {};
	$.get("/current_user", function (response) {
		if (response.user) {
			$('#firstName').val(''+response.user.firstName);
			$("#lastName").val(''+response.user.lastName);
			$("#userName").val(''+response.user.userName);
			$("#email").val(''+response.user.email);
			user = response.user;
		}
	})

	$(".edit").on("click", function (event) {
		event.preventDefault();
		$("input").prop('disabled', false);
		$('.edit').text("Cancel");
		$(".update").prop("disabled", false)
		$('.edit').attr("class", "waves-effect waves-light cyan btn cancel");
		$('.cancel').attr("data-tooltip", "Cancel your edit");

	})

	$(document).on('click',".update", function (event) {
		event.preventDefault();
		if (( $("#firstName").val() !=="") && ($("#lastName").val() !=="") && ($("#userName").val() !=="") && ($("#email").val() !=="")) {
			$.post("/"+ user.userName +"/update", $(".updateForm").serialize(), function (response) {
				if (response ==="error") {
					alert("an error occured, please try again")
				} else if (response ==="login exists") {
					alert("choose another userName")
				} else if (response ==="email exists") {
					alert("choose another email")
				} else {
					$('#firstName').val(''+response.user.firstName);
					$("#lastName").val(''+response.user.lastName);
					$("#userName").val(''+response.user.userName);
					$("#email").val(''+response.user.email);
					$(".Uname").remove();
					$(".parent").prepend('<li class="Uname"><a href="/profile/'+response.user.userName +'" id="uName"><i  class="material-icons left ">account_circle</i>'+response.user.userName+'</a></li>')
					$(".parentM").prepend('<li class="Uname"><a href="/profile/"'+response.user.userName +'" id="uNameM"><i class="material-icons left myIcon ">account_circle</i>'+response.user.userName+'</a></li>')
					user = response.user;
					window.location.href="/profile/"+ response.user.userName
				}
			})
		} else {
			alert("fuck u")
		}
	})

	$('.cancel').on("click", function (event) {
		event.preventDefault();
		$("input").prop('disabled', true);
		$(".update").prop("disabled", true)
		$('.cancel').text("Edit");
		$('.cancel').attr("class", "waves-effect waves-light cyan btn edit");
		$('.edit').attr("data-tooltip", "Click here to edit your personnal information")
	})
}