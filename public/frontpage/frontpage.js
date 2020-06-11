
$.get('videos', (response) => {
	console.log(response.response)
	response.response.map((video) => {
		console.log(video.filename)
		$('#video-gallery').append(
			`<a href="/player/${video.filename}">` +
			`<img src="/images/thumbnails/${video.thumbnail}" width="300" height="200"><br>${video.title}</a><br><br>`);
	});
});

