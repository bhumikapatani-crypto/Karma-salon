var countdownIntervals = [];

function initializeCountdown(element, countdownIndex) {
	let countdownDate;
	const isMockEnabled =
		element.getAttribute("data-enable-mock-timer") === "true";
	if (isMockEnabled) {
		const mockPickerDay = Number(
			element.getAttribute("data-enable-mock-picker-day")
		);
		const mockPickerHour = Number(
			element.getAttribute("data-enable-mock-picker-hours")
		);

		const nowDate = new Date();
		const mockTargetDate = new Date(
			nowDate.getTime() + (mockPickerDay * 24 + mockPickerHour) * 60 * 60 * 1000
		);
		countdownDate = mockTargetDate;
	} else {
		const userDate = element.getAttribute("data-date");
		const userTime = element.getAttribute("data-time");
		countdownDate = new Date(`${userDate}T${userTime}`);
	}
	const completedCountdown = element.getAttribute("data-completed");

	const countdown = element.querySelector(".countdown__main");
	const countdownHeading = element.querySelector(".countdown__end");
	const countdownTimerBlock = element.querySelector(
		".countdown__timer-wrapper"
	);
	const daysEl = element.querySelector(".countdown__days");
	const hoursEl = element.querySelector(".countdown__hours");
	const minutesEl = element.querySelector(".countdown__minutes");
	const secondsEl = element.querySelector(".countdown__seconds");
	const section = element.closest(".countdown-section");
	const labels = element.querySelectorAll(".countdown__label");

	const container = element.querySelector(".countdown__text-block");
	animateHeading(container);

	//time
	const MS_IN_SEC = 1000;
	const SEC_IN_MIN = 60;
	const MIN_IN_HOUR = 60;
	const HOUR_IN_DAY = 24;

	const SECONDS_IN_HOUR = SEC_IN_MIN * MIN_IN_HOUR;
	const MILLISECONDS_IN_MINUTE = MS_IN_SEC * SEC_IN_MIN;
	const MILLISECONDS_IN_HOUR = MS_IN_SEC * SECONDS_IN_HOUR;
	const MILLISECONDS_IN_DAY = MS_IN_SEC * SECONDS_IN_HOUR * HOUR_IN_DAY;

	const calcDays = (distance) => Math.floor(distance / MILLISECONDS_IN_DAY);

	//animation settings
	const isAnimated = element.dataset.animation === "true";
	const animationSpeed = element.dataset.speed;

	const calcWordsLength = () => {
		if (!labels.length) return 0;

		return [...labels].reduce(
			(sum, label) => sum + label.textContent.trim().length,
			0
		);
	};

	const calcAnimationDuration = (days) =>
		(calcWordsLength() + 6 + `${days}`.length) * animationSpeed;

	const setupCountdownContent = (distance) => {
		const days = calcDays(distance);
		const zeroDays = days == 0;
		const daysBlock = daysEl.closest(".countdown__block");
		const hours = Math.floor(
			(distance % MILLISECONDS_IN_DAY) / MILLISECONDS_IN_HOUR
		);
		const minutes = Math.floor(
			(distance % MILLISECONDS_IN_HOUR) / MILLISECONDS_IN_MINUTE
		);
		const seconds = Math.floor((distance % MILLISECONDS_IN_MINUTE) / MS_IN_SEC);

		if (distance < 0) {
			clearInterval(countdownIntervals[countdownIndex]);
			if (completedCountdown === "hide_section" && section) {
				section.style.display = "none";
			} else if (completedCountdown === "show_text") {
				if (countdown) countdown.style.display = "none";
				if (countdownHeading) countdownHeading.style.display = "flex";
				if (countdownTimerBlock)
					countdownTimerBlock.style.justifyContent = "center";
			}
		} else {
			if (daysEl) {
				if (zeroDays) {
					daysBlock.classList.add("no_days");
				} else {
					daysEl.textContent = String(days).padStart(2, "0");
					daysBlock.classList.remove("no_days");
				}
			}
			if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
			if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
			if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
		}
	};

	function updateCountdown(isFirstTime = false) {
		const now = new Date();
		const distance = countdownDate.getTime() - now.getTime();
		const days = calcDays(distance);

		// Ensure animationDuration is calculated correctly
		const animationDuration =
			isAnimated && isFirstTime ? calcAnimationDuration(days) : 0;

		// Adjust distance based on animation duration
		const adjustedDistance = distance - animationDuration;

		setupCountdownContent(adjustedDistance);
	}

	function startCountdown() {
		countdownIntervals[countdownIndex] = setInterval(updateCountdown, 1000);
	}

	async function animateRevealing() {
		if (!isAnimated) return;
		if (Shopify.designMode) return;

		const animatedElements = element.querySelectorAll(
			".countdown__number, .countdown__label"
		);

		if (!animatedElements.length) return;
		var animCount = 0;
		animatedElements.forEach((item, idx) => {
			item.innerHTML = item.innerHTML
				.trim()
				.split("")
				.map((char, index) => {
					animCount++;
					return `<span class="anim" data-index="${animCount}">${char}</span>`;
				})
				.join("");
		});

		const spans = Array.from(element.querySelectorAll(".anim"));
		const promises = spans.map((anim) => {
			anim.setAttribute("style", `opacity: 0;`);
			let revealDelay = parseInt(anim.dataset.index) * parseInt(animationSpeed);
			return new Promise((resolve) => {
				setTimeout(() => {
					anim.setAttribute("style", `opacity: 1;`);
					resolve();
				}, revealDelay);
			});
		});

		return Promise.all(promises);
	}

	// setup initial numbers
	updateCountdown(true);
	// animate first, then start the countdown
	animateRevealing().then(startCountdown);
}

function initCountdownSections(section) {
	const countdownElements = section.querySelectorAll("countdown-timer");
	countdownElements.forEach((element, idx) =>
		initializeCountdown(element, idx)
	);
}

initCountdownSections(document.currentScript.parentElement);

document.addEventListener("shopify:section:load", (event) => {
	initCountdownSections(event.target);
});
