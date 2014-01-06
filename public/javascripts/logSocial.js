// $(document).on('click', '.login', function(event) {
// 	event.preventDefault();
// 	$('.popupLogin').show();
// });

$(document).on('click', '.closePopUp', function(event) {
	event.preventDefault();
	$(this).closest('.popup').hide();
});

$(document).on('click', '.fb.login', function(e) {
	e.preventDefault();
	FB.login(function(response) {
		if (response.authResponse) {
			console.log('Welcome!  Fetching your information.... ');
			document.cookie = "fb-log=true";
			FB.api('/me', function(response) {
				console.log('Good to see you, ' + response.name + '.');
			});
		}
	}, {scope: 'read_stream, publish_stream'});
});
