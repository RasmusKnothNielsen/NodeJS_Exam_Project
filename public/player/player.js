// Retrieve the full URL and split it into an array
const fullUrl = window.location.href;
const videoId = fullUrl.substr(fullUrl.lastIndexOf('/') + 1);

// Call the backend and retrieve the json about this specific video
$.get(`/videos/${videoId}`)
	.done((response) => {
		console.log(response);
		$('.title').text(response.response.title);

		// Add the video to the player
		const player = `<video id="player" width="480" height="360" controls>
                    <source src="/${videoId}">
                    Your browser does not support the video tag.
                </video>`;

		$('#player-wrapper').append(player);

		$('.description').text(response.response.description);

		$('.added').text('Added: ' + response.response.createdAt.substring(0, 10));

		// Add tags to the page
		const arrayOfTags = response.response.tags;
		arrayOfTags.forEach(tag => {
			$('.tags').append(tag.tag + ' ');
		});

		// Add views to the page
		$('.views').append(`${response.response.views}`);

		// Add videoId to add comment field
		document.getElementById('hiddenvideoId').value = `${videoId}`;

		// Add comments
		const comments = response.response.comments;
		comments.forEach(comment => {
			commentDate = comment.createdAt
			$('.comments').prepend('<div class="col-md-6 col-sm-6 col-xs-12">' + comment.userName + " - " + commentDate.substring(0,10) + ' - ' + commentDate.substring(11,20) +'<br>' + '-  ' + comment.comment + '<br><br></div>');
		});
	})
	.catch((error) => {
		console.log(error);
		$('.title').text('Could not find video');
	});


