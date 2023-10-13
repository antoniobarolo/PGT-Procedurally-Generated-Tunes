class SampleSet {
	private readonly instruments: Instrument[] = [bass, piano, sax, ride, kick, snare]
	private samplePaths: string[] = this.instruments.reduce((accumulator, instrument) => {
		return accumulator.concat(instrument.samples);
	}, [] as string[]);
	private static readonly sampleColors = [];

	private static readonly samples = new Map<string, Sample>();

	private static async loadSample(index: number): Promise<void> {
		const path = SampleSet.samplePaths[index];
		const response = await fetch('samples/' + path.replace("#", "%23") + '.wav');
		const arrayBuffer = await response.arrayBuffer();
		const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);
		SampleSet.samples.set(path, {
			index,
			path,
			color: SampleSet.sampleColors[index],
			buffer: decodedAudio
		});
	}

	public static async loadSamples(): Promise<void> {
		const promises: Promise<void>[] = new Array(SampleSet.samplePaths.length);

		for (let i = 0; i < SampleSet.samplePaths.length; i++)
			promises[i] = SampleSet.loadSample(i);

		await Promise.all(promises);
	}

	public static getSample(name: string): Sample | undefined {
		return SampleSet.samples.get(name);
	}
}
