(function () {
	const playVideo = (card) => {
		const video = card.querySelector(".banner__media video");
		if (video) {
			const button = card.querySelector(".js-play-video");

			if (video.parentElement.classList.contains("autoplay")) {
				video.autoplay = true;
				if (button) {
					button.classList.add("active");
				}
			}

			if (video.autoplay && video.paused) {
				video.play();
			}

			if (!video.autoplay && button) {
				button.classList.remove("active");
			}

			if (video.parentElement.dataset.videoLoop === "false") {
				video.addEventListener("ended", () => {
					button.classList.remove("active");
				});
			}
		}
	};

	const stopVideo = (card) => {
		const videoActive = card.querySelector(".banner__media video");
		if (videoActive) {
			videoActive.pause();
		}
	};

	const controlsVideo = (section) => {
		const buttonsPlay = section.querySelector(".js-play-video");
		const buttonsSound = section.querySelector(".js-sound-video");
		const video = section.querySelector(".banner__media__video");

		buttonsPlay?.addEventListener("click", (event) => onClickPlayPause(event));
		function onClickPlayPause(event) {
			const buttonPlay = event.currentTarget;
			if (buttonPlay.classList.contains("js-play-video")) {
				if (video) {
					if (video.paused) {
						video.play();
					} else {
						video.pause();
					}
					buttonPlay.classList.toggle("active");
				}
			}
		}

		buttonsSound?.addEventListener("click", (event) => onClickSound(event));
		function onClickSound(event) {
			const buttonSound = event.currentTarget;
			if (buttonSound.classList.contains("js-sound-video")) {
				if (video) {
					if (video.muted) {
						setTimeout(() => {
							video.muted = false;
						}, 10);
					} else {
						setTimeout(() => {
							video.muted = true;
						}, 10);
					}
					buttonSound.classList.toggle("active");
				}
			}
		}
	};

	const initSection = (section) => {
		if (section && section.classList.contains("video-banner-section")) {
			const sectionObserver = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					let mediaCards = entry.target.querySelectorAll(
						".video-banner__content"
					);

					if (entry.isIntersecting) {
						mediaCards.forEach((card) => playVideo(card));
					} else {
						mediaCards.forEach((card) => stopVideo(card));
					}
				});
			});

			sectionObserver.observe(section);
			controlsVideo(section);
		}

		const video_animation = section?.querySelector(
			".video-banner__scroll_animation"
		);

		if (video_animation) {
			gsap.registerPlugin(ScrollTrigger);

			let secondStarted = false;

			const video_content = section?.querySelector(
				".video-banner__sticky_content"
			);

			const video_controls = section?.querySelector(".video-banner__controls");

			const video_text = section?.querySelector(".video-banner__column");

			gsap.to(video_content, {
				height: "100vh",
				width: "100vw",
				scrollTrigger: {
					trigger: video_animation,
					start: "top top",
					end: "bottom bottom",
					scrub: true,
					onUpdate: (self) => {
						if (self.progress > 0.7 && !secondStarted) {
							secondStarted = true;
							gsap.to(video_text, {
								y: "0",
							});
						}

						if (self.progress < 0.7 && secondStarted) {
							secondStarted = false;
							gsap.to(video_text, {
								y: "100%",
							});
						}

						if (self.progress < 0.9) {
							video_content.classList.remove("remove_border_radius");
						}
					},
				},
				onComplete: () => video_content.classList.add("remove_border_radius"),
			});

			gsap.to(video_controls, {
				opacity: 1,
				scrollTrigger: {
					trigger: video_animation,
					start: "center center",
					end: "bottom bottom",
					scrub: true,
				},
			});
		}
	};

	initSection(document.currentScript.parentElement);

	document.addEventListener("shopify:section:load", function (section) {
		initSection(section.target);
	});
})();
