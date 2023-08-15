const audioContext = new AudioContext();
const player = new Player();

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
