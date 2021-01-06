initialMessage = 'hello there';

$(document).ready(function () {
	console.log('Hello world!');
});

$('#welcome').click(function () {
	window.alert(initialMessage);
	console.log('Hello!');
});
