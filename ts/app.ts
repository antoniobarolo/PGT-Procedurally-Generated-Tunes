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
}

setup();

function playStyle(style: Style, section: SectionType) {
    const generatedSection = style.generateSection(section);
    player.playSection(generatedSection);
}

function playCurrentStyle() {
	playStyle(currentStyle, SectionType.Intro);
}
