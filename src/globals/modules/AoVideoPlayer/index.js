export const brandPagePlayer = new AoBrightcovePlayer();
let bgVideos = [];
let touchStartListener = null;

/**
 * setupVideos
 * Separates videos into the various display types and initialises them accordingly.
 * @param {NodeList} videos - List of nodes with videos attached.
 */
function setupVideos(videos) {
	let videoTypes = {
		modal: [],
		inline: [],
		background: []
	};

	// For each video, push to videoTypes array
	Array.prototype.forEach.call(videos, (video) => {
		const displayType = video.getAttribute('data-videodisplaytype');
		if (displayType && videoTypes[displayType]) {
			videoTypes[displayType].push(video);
		}
	});

	// Switch and check the type of video player
	for (let type in videoTypes) {
		if (videoTypes[type].length) {
			switch (type) {
				case 'modal':
					setupModalVideos(videoTypes[type]);
					break;
				case 'inline':
					setupInlineVideos(videoTypes[type]);
					break;
				case 'background':
					setupBackgroundVideos(videoTypes[type]);
					break;
				default:
					console.warn('There has been an error setting up videos of type: ' + type); //eslint-disable-line no-console
			}
		}
	}

	brandPagePlayer.init();

	window.addEventListener('brightcoveScriptsLoaded', () => {
		let players = videojs.getPlayers();

		for (var player in players) {
			players[player].on('play', pauseOtherVideos);
		}
	});
}

function addPlayer(el, options) {
	brandPagePlayer.addPlayer(el, options);
}

function pauseOtherVideos(evt) {
	let targetPlayerId = evt.target.id;
	brandPagePlayer.pauseAllVideos(targetPlayerId);
}

/**
 *
 * @param videos
 */
function setupModalVideos(videos) {
	let modalElement = document.createElement('div');
	modalElement.className = 'AoVideoPlayer_modalElement';

	let modalElementX = document.createElement('div');
	modalElementX.className = 'AoVideoPlayer_modalClose';

	let videoHolder = document.createElement('div');
	videoHolder.className = 'AoVideoPlayer_modalVideoHolder';

	let modalId = 'AoVideoPlayer_modal';
	let initalVideoId = videos[0].getAttribute('data-videoid');
	let videoOptions = {
		playerId: modalId,
		videoId: initalVideoId,
		classNames: 'video-js AoVideoPlayer-modal'
	};

	addPlayer(videoHolder, videoOptions);

	for (var video in videos) {
		videos[video].addEventListener('click', function(evt) {
			let videoId = this.getAttribute('data-videoid');
			showModal(videoId);
		});
	}

	videoHolder.appendChild(modalElementX);
	modalElement.appendChild(videoHolder);
	document.body.appendChild(modalElement);

}

function showModal(videoId) {
	brandPagePlayer.loadVideo('AoVideoPlayer_modal', videoId);

	let modalVideo = brandPagePlayer.getPlayer('AoVideoPlayer_modal');
	modalVideo.controls(true);

	let players = videojs.getPlayers();

	if (bgVideos.length) {
		bgVideos.forEach(videoPlayerId => {
			players[videoPlayerId].pause();
		});
	}

	let modalElement = document.querySelector('div.AoVideoPlayer_modalElement');
	modalElement.classList.add('open');

	modalElement.addEventListener('click', closeModal);

	document.addEventListener('keyup', closeModal);
}

function closeModal(evt) {
	let evtTarget = evt.target;
	if (evtTarget.className.indexOf('vjs') > -1) return;

	// Close modal if Esc key is pressed
	if (typeof evt.keyCode !== 'undefined' && evt.keyCode && evt.keyCode !== 27) return;

	playBackgroundVideos();

	let modalVideo = brandPagePlayer.getPlayer('AoVideoPlayer_modal');
	modalVideo.controls(false);
	modalVideo.pause();

	let modalElement = document.querySelector('div.AoVideoPlayer_modalElement');
	modalElement.classList.remove('open');
	modalElement.removeEventListener('click', closeModal);
	document.removeEventListener('keyup', closeModal);
}

function setupBackgroundVideos(videos) {
	if (window.breakpoint.value !== 'mobile' && !bgVideos.length) {
		let bgVideoCount = 0;

		for (var video in videos) {
			bgVideoCount++;

			let containerEl = videos[video];
			let videoPlayerId = 'AoVideoPlayer_background-' + bgVideoCount;
			let videoId = containerEl.getAttribute('data-videoid');
			let videoOptions = {
				playerId: videoPlayerId,
				videoId: videoId,
				classNames: 'video-js AoVideoPlayer-background'
			};

			addPlayer(containerEl, videoOptions);

			bgVideos.push(videoPlayerId);
		}

		let vCurrent = 0;
   		let maxFrameTime = 0;

		window.addEventListener('brightcoveScriptsLoaded', () => {
			bgVideos.forEach(videoPlayerId => {
				let player = brandPagePlayer.getPlayer(videoPlayerId);
				let playerElement = player.el_;

				player.controls(false);
				player.loop(true);
				player.muted(true);

				player.on('timeupdate', () => {
					let tCurrent = vCurrent;
					vCurrent = player.currentTime();
					maxFrameTime = Math.max(maxFrameTime, vCurrent - tCurrent);
					if (player.remainingTime() < maxFrameTime * 1.1) {
						player.currentTime(0);
					}

				});

				player.on('seeked', function () {
					player.play();
				});

				playerElement.setAttribute('data-nopause', 'true');
			});

			playBackgroundVideos();
		});
	}
}

function playBackgroundVideos(evt) {
	if (touchStartListener && evt) {
		window.removeEventListener('touchstart', touchStartListener);
		touchStartListener = null;
	}
	bgVideos.forEach(videoPlayerId => {
		let player = videojs.getPlayers()[videoPlayerId];

		if (player.readyState() > 0) {
			player.play();
		} else {
			player.on('loadedmetadata', () => {
				player.off('loadedmetadata');
				player.play();
				if (player.paused() && !touchStartListener) {
					touchStartListener = playBackgroundVideos;
					window.addEventListener('touchstart', touchStartListener);
				}
			});
		}
	});
}

function setupInlineVideos(videos) {
	let inlineVideoCount = 0;

	for (var video in videos) {
		inlineVideoCount++;

		let containerEl = videos[video];
		let videoPlayerId = 'AoVideoPlayer_inline-' + inlineVideoCount;
		let videoId = containerEl.getAttribute('data-videoid');
		let videoOptions = {
			playerId: videoPlayerId,
			videoId: videoId,
			classNames: 'video-js AoVideoPlayer-inline'
		};

		addPlayer(containerEl, videoOptions);
	}
}

export function initialiseVideos(el = document) {
	let pageVideos = el.querySelectorAll('[data-videoid]');
	if (pageVideos) {
		setupVideos(pageVideos);
	}
}

initialiseVideos();
