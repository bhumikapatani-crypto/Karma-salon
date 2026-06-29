const initAnnouncement = (section) => {
	const announcementBar = section.querySelector(".announcement-bar.swiper");
	if (announcementBar == null) return;

	const speed = announcementBar.dataset.speed * 1000;
	const delay = announcementBar.dataset.delay * 1000;

	new Swiper(announcementBar, {
		direction: "vertical",
		loop: true,
		autoplay: {
			delay: delay,
			disableOnInteraction: false,
		},
		slidesPerView: 1,
		spaceBetween: 0,
		speed: speed,
	});
};

initAnnouncement(document);

document.addEventListener("shopify:section:load", (event) => {
	initAnnouncement(event.target);
});
