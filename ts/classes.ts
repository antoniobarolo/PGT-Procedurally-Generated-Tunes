//Diagrama de classes


enum StyleName {
	Forro = 0,
	Pop = 1,
	Rock = 2
}

enum MeasureCategory {
	Harmony = 0,
	Rhythm = 1,
	Melody = 2
}

enum SessionType {
	Intro = 0,
	Refrao = 1,
	Ponte = 2,
	Verso = 3
}

interface SheetGenerator {
	generate(styleName: StyleName, measureCategory: MeasureCategory, progressionIndex: number, progressionCount: number, measureIndex: number, measureCount: number): string;
}

type Sheet = string | SheetGenerator;

interface InstrumentSet { [instrumentName: string]: Sheet }

interface Measure {
	harmony: InstrumentSet;
	rhythm: InstrumentSet;
	melody: InstrumentSet;
}

interface Sequence {
	instrumentName: string;
	sheet: (string | null)[];
}

interface Progression {
	sequences: Sequence[];
}

interface Session {
	type: SessionType;
	progressions: Progression[];
}

abstract class Style {
	public readonly name: StyleName;
	protected readonly harmony: Map<SessionType, InstrumentSet[]>;
	protected readonly rhythm: Map<SessionType, InstrumentSet[]>;
	protected readonly melody: Map<SessionType, InstrumentSet[]>;

	constructor(name: StyleName) {
		this.name = name;

		this.harmony = new Map<SessionType, InstrumentSet[]>();
		this.rhythm = new Map<SessionType, InstrumentSet[]>();
		this.melody = new Map<SessionType, InstrumentSet[]>();

		this.harmony.set(SessionType.Intro, this.generateHarmony(SessionType.Intro));
		this.harmony.set(SessionType.Ponte, this.generateHarmony(SessionType.Ponte));
		this.harmony.set(SessionType.Refrao, this.generateHarmony(SessionType.Refrao));
		this.harmony.set(SessionType.Verso, this.generateHarmony(SessionType.Verso));

		this.rhythm.set(SessionType.Intro, this.generateRhythm(SessionType.Intro));
		this.rhythm.set(SessionType.Ponte, this.generateRhythm(SessionType.Ponte));
		this.rhythm.set(SessionType.Refrao, this.generateRhythm(SessionType.Refrao));
		this.rhythm.set(SessionType.Verso, this.generateRhythm(SessionType.Verso));

		this.melody.set(SessionType.Intro, this.generateMelody(SessionType.Intro));
		this.melody.set(SessionType.Ponte, this.generateMelody(SessionType.Ponte));
		this.melody.set(SessionType.Refrao, this.generateMelody(SessionType.Refrao));
		this.melody.set(SessionType.Verso, this.generateMelody(SessionType.Verso));
	}

	protected abstract generateHarmony(sessionType: SessionType): InstrumentSet[];
	protected abstract generateRhythm(sessionType: SessionType): InstrumentSet[];
	protected abstract generateMelody(sessionType: SessionType): InstrumentSet[];
	protected abstract getNextProgressionCount(sessionType: SessionType): number;
	protected abstract getNextMeasureCount(sessionType: SessionType, progressionIndex: number, progressionCount: number): number;

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

	private static parseSheet(sheet: string, sheetPadding: number): (string | null)[] {
		// "dm7 xyz8 a1 b3 c2c4c5"
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

				if (char === ' ' || char === '\t')
					break;

				note += char;
			}

			notes.push(note.toLowerCase());
		}

		return notes;
	}

	public generateSession(sessionType: SessionType): Session {
		const progressions: Progression[] = [];

		const progressionCount = this.getNextProgressionCount(sessionType);

		for (let progression = 0; progression < progressionCount; progression++) {
			const sequences: Sequence[] = [];

			const instrumentSetArray = this.harmony.get(sessionType);
			if (!instrumentSetArray)
				throw new Error("instrumentSetArray is null");

			const harmonyInstrumentSet = Style.pickInstrumentSet(instrumentSetArray);

			let maxHarmonySheet = 0;

			for (let instrumentName in harmonyInstrumentSet) {
				let sheet = harmonyInstrumentSet[instrumentName];
				if (typeof sheet !== "string")
					sheet = sheet.generate(this.name, MeasureCategory.Harmony, progression, progressionCount, 0, 1);

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

				let instrumentSetArray = this.rhythm.get(sessionType);
				if (!instrumentSetArray)
					throw new Error("instrumentSetArray is null");

				const rhythmInstrumentSet = Style.pickInstrumentSet(instrumentSetArray);

				for (let instrumentName in rhythmInstrumentSet) {
					let sheet = rhythmInstrumentSet[instrumentName];
					if (typeof sheet !== "string")
						sheet = sheet.generate(this.name, MeasureCategory.Rhythm, progression, progressionCount, measure, measureCount);

					const parsedSheet = Style.parseSheet(sheet as string, sheetPadding);
					if (maxMeasureSheet < parsedSheet.length)
						maxMeasureSheet = parsedSheet.length;

					sequences.push({
						instrumentName,
						sheet: parsedSheet
					});
				}

				instrumentSetArray = this.melody.get(sessionType);
				if (!instrumentSetArray)
					throw new Error("instrumentSetArray is null");

				const melodyInstrumentSet = Style.pickInstrumentSet(instrumentSetArray);

				for (let instrumentName in melodyInstrumentSet) {
					let sheet = melodyInstrumentSet[instrumentName];
					if (typeof sheet !== "string")
						sheet = sheet.generate(this.name, MeasureCategory.Melody, progression, progressionCount, measure, measureCount);

					const parsedSheet = Style.parseSheet(sheet as string, sheetPadding);
					if (maxMeasureSheet < parsedSheet.length)
						maxMeasureSheet = parsedSheet.length;

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

		return {
			type: sessionType,
			progressions
		};
	}
}

class Forro extends Style {
	constructor() {
		super(StyleName.Forro);
	}

	protected generateHarmony(sessionType: SessionType): InstrumentSet[] {
		switch (sessionType) {
			case SessionType.Intro:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];

			case SessionType.Ponte:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];

			case SessionType.Verso:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];

			default:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
		}
	}

	protected generateRhythm(sessionType: SessionType): InstrumentSet[] {
		switch (sessionType) {
			case SessionType.Intro:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];

			case SessionType.Ponte:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];

			case SessionType.Verso:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];

			default:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
		}
	}

	protected generateMelody(sessionType: SessionType): InstrumentSet[] {
		switch (sessionType) {
			case SessionType.Intro:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];

			case SessionType.Ponte:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];

			case SessionType.Verso:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];

			default:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
		}
	}

	protected getNextProgressionCount(sessionType: SessionType): number {
		return 4;
	}

	protected getNextMeasureCount(sessionType: SessionType, progressionIndex: number, progressionCount: number): number {
		return 4;
	}
}
