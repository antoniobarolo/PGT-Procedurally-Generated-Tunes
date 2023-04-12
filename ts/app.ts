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

function test(session : SessionType) {
	const forr = new Forro();
	const teste = forr.generateSession(session);
	player.playSession(teste);
}
