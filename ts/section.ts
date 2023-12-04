class Section {
	public bpm: number;
	public noteDuration: number;
	public duration: number;
	public type: SectionType;
	
	private progressions: Progression[];
	private maxSheetLength: number[];

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
					i++;
					if (maxSheetLength < i)
						maxSheetLength = i;
					break;
				}
			}

			totalSheetLength += maxSheetLength;

			this.maxSheetLength[p] = maxSheetLength;
		}

		this.duration = this.noteDuration * totalSheetLength;
	}

	public play(player: Player, startTime: number, onlyPreparePosition: boolean): void {
		const noteDuration = this.noteDuration;
		const progressions = this.progressions;
		const maxSheetLength = this.maxSheetLength;

		let totalSheetLength = 0;

		for (let p = 0; p < progressions.length; p++) {
			//progressions[0] p repetir ou progressions[p] pra nao
			const currentProgression = roll(8) > 5 ? p : 0
			const sequences = progressions[currentProgression].sequences;

			for (let s = 0; s < sequences.length; s++) {
				const sequence = sequences[s];
				const instrumentNamePrefix = sequence.instrumentName;
				const sheet = sequence.sheet;

				for (let i = 0; i < sheet.length; i++) {
					if (sheet[i]) {
						const sampleName = instrumentNamePrefix + "/" + sheet[i];
						let sample = SampleSet.getSample(sampleName);
						if (!sample) {

							const instrument = SampleSet.getInstrumentByName(instrumentNamePrefix)
							if (instrument?.role !== MeasureCategory.Rhythm) {
								let secondChanceSampleName = sampleName
								try { secondChanceSampleName = sampleName.slice(0, -1) + instrument.centerOctave }
								catch { throw new Error('BadInstrumentName: ' + instrument) }
								sample = SampleSet.getSample(secondChanceSampleName)
								if (!sample) throw new Error("Missing sample on second chance: " + secondChanceSampleName)
							}
							if (!sample) throw new Error("Missing sample: " + sampleName)
						}
						player.playSample(sample, startTime + ((totalSheetLength + i) * noteDuration), onlyPreparePosition);
					}
				}
			}

			totalSheetLength += maxSheetLength[p];
		}
	}
}
