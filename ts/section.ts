class Section {
	public readonly bpm: number;
	public readonly noteDuration: number;
	public readonly duration: number;

	private readonly type: SectionType;
	private readonly progressions: Progression[];
	private readonly maxSheetLength: number[];

	public constructor(type: SectionType, progressions: Progression[], bpm: number, noteDuration: number) {
		this.bpm = bpm;
		this.noteDuration = noteDuration / bpm * 60;

		this.type = type;
		this.progressions = progressions;

		this.maxSheetLength = new Array(progressions.length);

		let totalSheetLength = 0;

		for (let p = progressions.length - 1; p >= 0; p--) {
			let maxSheetLength = 0;

			const sequences = progressions[p].sequences;

			for (let s = sequences.length - 1; s >= 0; s--) {
				const sheet = sequences[s].sheet;

				for (let i = sheet.length - 1; i >= 0; i--) {
					// Procura pela última entrada não-nula
					if (sheet[i]) {
						i++;
						if (maxSheetLength < i)
							maxSheetLength = i;
						break;
					}
				}
			}

			totalSheetLength += maxSheetLength;

			this.maxSheetLength[p] = maxSheetLength;
		}

		this.duration = this.noteDuration * totalSheetLength;
	}

	public play(player: Player, startTime: number): void {
		const noteDuration = this.noteDuration;
		const progressions = this.progressions;
		const maxSheetLength = this.maxSheetLength;

		let totalSheetLength = 0;

		for (let p = 0; p < progressions.length; p++) {
			//progressions[0] p repetir ou progressions[p] pra nao
			const sequences = progressions[0].sequences;

			for (let s = 0; s < sequences.length; s++) {
				const sequence = sequences[s];
				const instrumentNamePrefix = sequence.instrumentName;
				const sheet = sequence.sheet;

				for (let i = 0; i < sheet.length; i++) {
					if (sheet[i]) {
						//const sampleName = instrumentNamePrefix + "_" + sheet[i];
						const sampleName = instrumentNamePrefix + "/" + sheet[i];
						const sample = SampleSet.getSample(sampleName);
						if (!sample)
							throw new Error("Missing sample: " + sampleName);

						player.playSample(sample, startTime + ((totalSheetLength + i) * noteDuration));
					}
				}
			}

			totalSheetLength += maxSheetLength[p];
		}
	}
}
