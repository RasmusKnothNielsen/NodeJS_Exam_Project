
$.get('videos', (response) => {
	response.response.map((video) => {
		$('#video-gallery').append(
			`<a href="/player/${video.fileName}">` +
			`<img src="/images/thumbnails/${video.thumbnail}" width="300" height="200"><br>${video.title}</a><br><br>`);
	});
});

