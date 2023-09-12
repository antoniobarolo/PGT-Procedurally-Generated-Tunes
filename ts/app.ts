const audioContext = new AudioContext();
const player = new Player();

const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement;
const gainNode = audioContext.createGain();

volumeSlider.addEventListener('input', () => {
    const volume = parseFloat(volumeSlider.value);
    gainNode.gain.value = volume;
});
volumeSlider.value = '0.5';


async function setup(): Promise<void> {
	try {
		await SampleSet.loadSamples();
	} catch (ex: any) {
		console.error("Error loading the samples: " + (ex.message || ex));
		return;
	}
}

setup();

function test(section : SectionType) {
	const forr = new Forro();
	const teste = forr.generateSection(section);
	player.playSection(teste);
}

function playStyle(style: Style, section: SectionType) {
    const generatedSection = style.generateSection(section);
    player.playSection(generatedSection);
}
