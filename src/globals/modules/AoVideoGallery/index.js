import { formatString } from '../../js/utils/general-utils';

// Data Templates
const THUMBNAIL_TEMPLATE = '<li><div class="thumbnail{isFirst}" style="background-image: url({thumbnail})" data-target-index="{index}"></div><p>{title}</p><p class="video-length">{length}</p></li>'; //eslint-disable-line max-len

// Video Player
const galleryPlayer = bc('playlist-test');

function convertTime(ms) {
	var minutes = Math.floor(ms / 60000);
	var seconds = (ms % 60000 / 1000).toFixed(0);
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function closest(el, selector) {
	let node = el;
	let closestEl = null;
	while (node !== document.body) {
		closestEl = node.querySelector(selector);
		if (closestEl) {
			break;
		}
		node = node.parentNode;
	}
	return closestEl;
}

function changeVid(thumbnailList, evt) {
	const target = evt.target;
	const videoIndex = parseInt(target.getAttribute('data-target-index'), 10);
	if (typeof videoIndex === 'number' && !isNaN(videoIndex)) {
		const currentActive = thumbnailList.querySelector('.active');
		currentActive.classList.remove('active');
		this.playlist.currentItem(videoIndex);
		target.classList.add('active');
	}
}

let hasInitialised = false;

galleryPlayer.on('loadedmetadata', function(){
	const thumbnailList = closest(this.el(), '.video-gallery-thumbnails');

	if (!hasInitialised) {
		hasInitialised = true;

		const playlistItems = this.playlist().map(function(video, i){
			let videoData = {
				index: i.toString(),
				title: video.name,
				thumbnail: video.thumbnail,
				length: convertTime(video.sources[0].duration),
				isFirst: i === 0 ? ' active' : ''
			};
			return formatString(THUMBNAIL_TEMPLATE, videoData);
		});

		this.playlist.autoadvance(5);
		this.playlist.repeat(true);

		thumbnailList.innerHTML = playlistItems.join('');
		thumbnailList.addEventListener('click', changeVid.bind(this, thumbnailList));
	}

	if (hasInitialised) {
		const playlistIndex = this.playlist.currentItem();

		const currentActive = thumbnailList.querySelector('.active');
		currentActive.classList.remove('active');

		const newActive = thumbnailList.querySelector(`[data-target-index="${playlistIndex}"]`);
		newActive.classList.add('active');
	}
});
