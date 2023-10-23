class SampleSet {
	private static readonly instruments: Instrument[] = [
		bass,
		piano,
		sax,
		ride,
		kick,
		snare,
		accordion,
		shaker,
		triangle,
		xylo,
		zabumba,
		tamborim,
		caixa,
		surdo1,
		surdo2,
		surdo3,
		ganza,
		stab,
		darkKick]
	private static readonly samples = new Map<string, Sample>();

	private static async loadSample(instrument: Instrument, sample: string): Promise<void> {
		const path = sample;
		const response = await fetch('samples/' + path.replace("#", "%23") + '.wav');
		const arrayBuffer = await response.arrayBuffer();
		const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);
		SampleSet.samples.set(path, {
			index: 1,
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
}