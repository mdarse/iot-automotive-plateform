$(function() {

	$('.mob').click(function () {
		//if($('.mob.selectione').size() < 1) {
		$(this).toggleClass('selectione');
		//}
	});

	$('.sms').click(function () {
		$(this).toggleClass('selectione');
	});

	$('#alertes')[0].addEventListener('click', changeSettings, false);
	function changeSettings() {
		/*
		var phoneNumber = $('#phone-number').value;
		if(phoneNumber == '') {
			phoneNumber = 'non précisé';
		}
		alert('Changements appliqués ! Nouveau numéro de téléphone : ' + phoneNumber);
		*/
		alert('Changements appliqués !');
	}

});