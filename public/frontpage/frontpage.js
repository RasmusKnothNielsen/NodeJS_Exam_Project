
$.get('videos', (response) => {
	response.response.map((video) => {
		$('#video-gallery').append(
			`<a href="/player/${video.filename}">` +
			`<img src="/images/thumbnails/${video.thumbnail}" width="300" height="200"><br>${video.title}</a><br><br>`);
	});
});

// If we can do the next line, there is at least one pathvariable
const pathVariable = window.location.href.split("?")[1]

switch(pathVariable) {

	case 'status=loggedin':
		sweetAlert({
			title: 'You are now logged in',
			showConfirmButton: false,
			timer: 1000
		});
		break;

	case 'status=loggedout':
		sweetAlert({
			title: 'You are now logged out',
			showConfirmButton: false,
			timer: 1000
		});
	
	default:
		break;
}