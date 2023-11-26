class SampleSet {
	private static readonly instruments: Instrument[] = [
		accordion,
		bass,
		brassStab,
		caixa,
		cuica,
		drop,
		funkBrass,
		funkHighPercussion,
		funkKick,
		funkLoop,
		funkVoice,
		ganza,
		hihat,
		kick,
		piano,
		ride,
		sax,
		shaker,
		snare,
		stab,
		surdo1,
		surdo2,
		surdo3,
		tamborim,
		triangle,
		vibraslap,
		xylo,
		zabumba,
		flute,
		harpsichord,
		dulcimer]
	private static readonly samples = new Map<string, Sample>();

	private static async loadSample(instrument: Instrument, sample: string): Promise<void> {
		const path = instrument.path + '/' + sample;
		const response = await fetch('samples/' + path.replace("#", "%23") + '.wav');
		const arrayBuffer = await response.arrayBuffer();
		const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);
		SampleSet.samples.set(path, {
			index: SampleSet.samples.size,
			path,
			color: instrument.color,
			buffer: decodedAudio
		});
	}

	public static async loadSamples(): Promise<void> {
		await Promise.all(SampleSet.instruments.map((instrument) => {
			instrument.samples.map((sample) => SampleSet.loadSample(instrument, sample))
		}))
	}

	public static getSample(name: string): Sample | undefined {
		return SampleSet.samples.get(name);
	}

	public static getInstrumentByName(name: string): Instrument {
		return SampleSet.instruments.find((instrument) => instrument.path === name)
	}
}