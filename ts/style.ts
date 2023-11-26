abstract class Style {
	public readonly name: StyleName;
	public readonly defaultBpm: number;
	public readonly defaultNoteDuration: number;
	public readonly sections: SectionType[];
	protected readonly harmony: Map<SectionType, InstrumentSet[]>;
	protected readonly rhythm: Map<SectionType, InstrumentSet[]>;
	protected readonly melody: Map<SectionType, InstrumentSet[]>;

	constructor(name: StyleName, defaultBpm: number, defaultNoteDuration: number) {
		this.name = name;
		this.defaultBpm = defaultBpm;
		this.defaultNoteDuration = defaultNoteDuration;

		this.harmony = new Map<SectionType, InstrumentSet[]>();
		this.rhythm = new Map<SectionType, InstrumentSet[]>();
		this.melody = new Map<SectionType, InstrumentSet[]>();

		this.harmony.set(SectionType.Intro, this.generateHarmony(SectionType.Intro));
		this.harmony.set(SectionType.Ponte, this.generateHarmony(SectionType.Ponte));
		this.harmony.set(SectionType.Refrao, this.generateHarmony(SectionType.Refrao));
		this.harmony.set(SectionType.Verso, this.generateHarmony(SectionType.Verso));

		this.rhythm.set(SectionType.Intro, this.generateRhythm(SectionType.Intro));
		this.rhythm.set(SectionType.Ponte, this.generateRhythm(SectionType.Ponte));
		this.rhythm.set(SectionType.Refrao, this.generateRhythm(SectionType.Refrao));
		this.rhythm.set(SectionType.Verso, this.generateRhythm(SectionType.Verso));

		this.melody.set(SectionType.Intro, this.generateMelody(SectionType.Intro));
		this.melody.set(SectionType.Ponte, this.generateMelody(SectionType.Ponte));
		this.melody.set(SectionType.Refrao, this.generateMelody(SectionType.Refrao));
		this.melody.set(SectionType.Verso, this.generateMelody(SectionType.Verso));
	}

	protected abstract generateHarmony(sectionType: SectionType, song?: Section[]): InstrumentSet[];
	protected abstract generateRhythm(sectionType: SectionType, song?: Section[]): InstrumentSet[];
	protected abstract generateMelody(sectionType: SectionType, song?: Section[]): InstrumentSet[];
	protected abstract getNextProgressionCount(sectionType: SectionType): number;
	protected abstract getNextMeasureCount(sectionType: SectionType, progressionIndex: number, progressionCount: number): number;

	public generateSong(): Section[] { return }

	private static pickInstrumentSet(instrumentSet: InstrumentSet[]): InstrumentSet {
		// Math.trunc(Math.random() * 4)
		// Saída 0 - Entrada 0 ... 0.99999999... (25%)
		// Saída 1 - Entrada 1 ... 1.99999999... (25%)
		// Saída 2 - Entrada 2 ... 2.99999999... (25%)
		// Saída 3 - Entrada 3 ... 3.99999999... (25%)
		//
		// Math.trunc(Math.random() * 4000) % 4
		// Saída 0 - 0, 4, 8, 12, 16 ... 3996
		// Saída 1 - 1, 5, 9, 13, 17 ... 3997
		// Saída 2 - 2, 6, 10, 14, 18 ... 3998
		// Saída 3 - 3, 7, 11, 15, 19 ... 3999
		const i = Math.trunc(Math.random() * instrumentSet.length * 1000) % instrumentSet.length;
		return instrumentSet[i];
	}

	public generateSection(sectionType: SectionType, song?: Section[], bpm?: number | null, noteDuration?: number | null): Section {
		const progressions: Progression[] = [];

		const progressionCount = this.getNextProgressionCount(sectionType);

		for (let progression = 0; progression < progressionCount; progression++) {
			const sequences: Sequence[] = [];

			const instrumentSetArray = this.harmony.get(sectionType);
			if (!instrumentSetArray)
				throw new Error("instrumentSetArray is null");

			const harmonyInstrumentSet = Style.pickInstrumentSet(instrumentSetArray);
			let maxHarmonySheet = 0;

			for (let instrumentName in harmonyInstrumentSet) {
				let sheet = harmonyInstrumentSet[instrumentName];
				// if (typeof sheet !== "string")
				// 	sheet = sheet.generate(this.name, MeasureCategory.Harmony, progression, progressionCount, 0, 1);

				const parsedSheet = parseSheet(sheet as string, 0);
				if (maxHarmonySheet < parsedSheet.length)
					maxHarmonySheet = parsedSheet.length;

				sequences.push({
					instrumentName,
					sheet: parsedSheet
				});
			}

			for (let i = 0; i < sequences.length; i++) {
				const sequenceSheet = sequences[i].sheet;
				while (sequenceSheet.length < maxHarmonySheet)
					sequenceSheet.push(null);
			}

			// A partir daqui, todos os sheets de harmonia têm a mesma quantidade de notas

			const measureCount = maxHarmonySheet;
			const harmonySequenceCount = sequences.length;

			let sheetPadding = 0;

			for (let measure = 0; measure < measureCount; measure++) {
				let maxMeasureSheet = 0;

				let instrumentSetArray = this.rhythm.get(sectionType);
				if (!instrumentSetArray)
					throw new Error("instrumentSetArray is null");

				const rhythmInstrumentSet = Style.pickInstrumentSet(instrumentSetArray);

				for (let instrumentName in rhythmInstrumentSet) {
					let sheet = rhythmInstrumentSet[instrumentName];
					// if (typeof sheet !== "string")
					// 	sheet = sheet.generate(this.name, MeasureCategory.Rhythm, progression, progressionCount, measure, measureCount);

					const parsedSheet = parseSheet(sheet as string, sheetPadding);
					if (maxMeasureSheet < parsedSheet?.length - sheetPadding)
						maxMeasureSheet = parsedSheet?.length - sheetPadding;

					sequences.push({
						instrumentName,
						sheet: parsedSheet
					});
				}

				instrumentSetArray = this.melody.get(sectionType);
				if (!instrumentSetArray)
					throw new Error("instrumentSetArray is null");

				let melodyInstrumentSet = Style.pickInstrumentSet(instrumentSetArray);

				///adaptar nota para encaixar com acorde
				const bassSheet = findInstrumentWithLowestOctave(harmonyInstrumentSet) as string
				const bassSheetNotes = parseSheet(bassSheet, 0)
				melodyInstrumentSet = adjustMelodyToChordNote(melodyInstrumentSet, bassSheetNotes[measure])

				for (let instrumentName in melodyInstrumentSet) {
					let sheet = melodyInstrumentSet[instrumentName];
					// if (typeof sheet !== "string")
					// 	sheet = sheet.generate(this.name, MeasureCategory.Melody, progression, progressionCount, measure, measureCount);

					const parsedSheet = parseSheet(sheet as string, sheetPadding);
					if (maxMeasureSheet < parsedSheet.length - sheetPadding)
						maxMeasureSheet = parsedSheet.length - sheetPadding;

					sequences.push({
						instrumentName,
						sheet: parsedSheet
					});
				}

				if (measure < (measureCount - 1) && maxMeasureSheet > 1) {
					const paddingArray: (string | null)[] = new Array(maxMeasureSheet - 1);
					for (let i = paddingArray.length - 1; i >= 0; i--)
						paddingArray[i] = null;

					// Insere elementos dentro do array da harmonia

					for (let i = 0; i < harmonySequenceCount; i++)
						sequences[i].sheet.splice(sheetPadding + 1, 0, ...paddingArray);

					sheetPadding += maxMeasureSheet;
				}
			}
			progressions.push({
				sequences
			});
		}

		return new Section(sectionType, progressions, bpm || this.defaultBpm, noteDuration || this.defaultNoteDuration);
	}
}
