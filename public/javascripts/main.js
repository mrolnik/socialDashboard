jQuery(document).ready(function($) {
	function validateLogIn (argument) {

	}

	$('.register').on('click', function(event) {
		event.preventDefault();
		/* Act on the event */
		$('#register').show();
	});

	$('.logSubmit ').on('click', function(event) {
		//event.preventDefault();
		/* Act on the event */
		document.cookie = "socialId=1234";
		//return true;
	});
	
	$('.regSubmit ').on('click', function(event) {
		//event.preventDefault();
		/* Act on the event */
		document.cookie = "socialId=1234";
		//return true;
	});
});