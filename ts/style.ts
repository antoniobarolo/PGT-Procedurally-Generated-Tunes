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

	public generateSong(): Section[] { return }

	private static pickInstrumentSet(instrumentSet: InstrumentSet[]): InstrumentSet {
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

				const parsedSheet = Style.parseSheet(sheet as string, 0);
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

					const parsedSheet = Style.parseSheet(sheet as string, sheetPadding);
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

				///Adaptar nota para encaixar com acorde
				const bassSheet = findInstrumentWithLowestOctave(harmonyInstrumentSet) as string
				const bassSheetNotes = Style.parseSheet(bassSheet, 0)
				melodyInstrumentSet = adjustMelodyToChordNote(melodyInstrumentSet, bassSheetNotes[measure])

				for (let instrumentName in melodyInstrumentSet) {
					let sheet = melodyInstrumentSet[instrumentName];

					const parsedSheet = Style.parseSheet(sheet as string, sheetPadding);
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

	public static parseSheet(sheet: string, sheetPadding: number): (string | null)[] {
		if (!sheet) return null
		const count = sheet.length;
		const notes: (string | null)[] = new Array(sheetPadding);

		for (let i = notes.length - 1; i >= 0; i--)
			notes[i] = null;

		for (let i = 0; i < count; i++) {
			let char = sheet.charAt(i);
			if (char === ' ' || char === '\t')
				continue;

			if (char === '-') {
				notes.push(null);
				continue;
			}

			let note = char;
			i++;

			while (i < count) {
				char = sheet.charAt(i);
				i++;

				if (char === ' ' || char === '\t') {
					i--;
					break;
				}

				note += char;
			}

			notes.push(note.toLowerCase());
		}
		return notes;
	}

	public static parseNumbers(sheet: number[], instrument: Instrument, scale: number[], rootNote: number): string {
		sheet = sheet.map((note) => {
			if (note == 0)
				return undefined
			if (note < 0) {
				note = Math.abs(note)
				note = scale[note - 1]
				return note - 12 + rootNote
			}
			if (note > scale.length) {
				note = scale[note - scale.length - 1]
				return note + 12 + rootNote
			}
			return scale[note - 1] + rootNote
		})
		const parsedSheet = sheet.map((noteNumber) => {
			if (noteNumber === undefined)
				return "-"
			let octaveShift = 0
			while (noteNumber < 0) {
				noteNumber = noteNumber + noteNames.length
				octaveShift--;
			}
			while (noteNumber >= noteNames.length) {
				noteNumber = noteNumber - noteNames.length
				octaveShift++;
			}
			return noteNames[noteNumber] + (instrument.centerOctave + octaveShift)
		})
		return parsedSheet.join(" ")
	}

}
