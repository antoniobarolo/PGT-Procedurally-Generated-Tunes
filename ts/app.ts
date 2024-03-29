const audioContext = new AudioContext();
const player = new Player();

const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement;
const gainNode = audioContext.createGain();
let currentStyle: Style = null;

function updateVolume() {
	const dB = parseInt(volumeSlider.value);
	// dB = 20.log Mag
	// dB/20 = log Mag
	// 10 ^ (dB/20) = Mag
	gainNode.gain.value = (dB <= -40 ? 0 : Math.pow(10, dB / 20));
}

function parseQueryString(): { [key: string]: string } {
	const assoc: { [key: string]: string } = {};
	const keyValues = location.search.substring(1).split("&");

	for (let i in keyValues) {
		const pair = keyValues[i].split("=");
		if (pair.length > 1) {
			assoc[decodeURIComponent(pair[0].replace(/\+/g, " "))] = decodeURIComponent(pair[1].replace(/\+/g, " "));
		}
	}

	return assoc;
};

async function setup(): Promise<void> {
	const queryString = parseQueryString();
	let itemId: string;

	switch (queryString["style"]) {
		case "jazz":
			currentStyle = new Jazz();
			itemId = "itemJazz";
			break;
		case "funk":
			currentStyle = new Funk();
			itemId = "itemFunk";
			break;
		case "samba":
			currentStyle = new Samba();
			itemId = "itemSamba";
			break;
		default:
			currentStyle = new Forro();
			itemId = "itemForro";
			break;
	}

	const item = document.getElementById(itemId);
	item.classList.add("active");
	document.getElementById("headingStyle").textContent = item.textContent;

	updateVolume();

	try {
		await SampleSet.loadSamples();
	} catch (ex: any) {
		console.error("Error loading the samples: " + (ex.message || ex));
		return;
	}

	const divLoading = document.getElementById("divLoading");
	const divControls = document.getElementById("divControls");
	divLoading.parentNode.removeChild(divLoading);
	divControls.style.display = "";
}

setup();

async function playCurrentStyle() {
	const generatedSections = [
		currentStyle.generateSection(SectionType.Intro),
		currentStyle.generateSection(SectionType.Verso),
		currentStyle.generateSection(SectionType.Ponte),
		currentStyle.generateSection(SectionType.Refrao)]

	for (let index = 0; index < generatedSections.length; index++) {
		player.playSection(generatedSections[index], true);
	}

	let remainingDelay = 0;

	for (let index = 0; index < currentStyle.sections.length; index++) {
		const currentSection = generatedSections.find(section => section.type === currentStyle.sections[index]);
		player.playSection(currentSection, false);
		const currentDelay = currentSection.duration * 0.7;
		await delay(currentDelay + remainingDelay);
		remainingDelay = currentSection.duration - currentDelay;
	}

}
