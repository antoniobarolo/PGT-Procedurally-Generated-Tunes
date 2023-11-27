class Jazz extends Style {
	readonly sections = [SectionType.Intro, SectionType.Refrao, SectionType.Verso, SectionType.Refrao, SectionType.Ponte, SectionType.Refrao, SectionType.Intro, SectionType.Intro]

	constructor() {
		super(StyleName.Jazz, 115, 8 / 12);
	}

	protected generateHarmony(sectionType: SectionType): InstrumentSet[] {
		switch (sectionType) {
			case SectionType.Intro:
				return [{
					bass: 'a2'
				}]
			case SectionType.Verso:
				const progressionSize = roll(3)
				switch (progressionSize) {
					case 1:
						return [
							{
								piano: 'c4 b3',
								bass: 'a3 e3',
							},
							{
								piano: 'e4 e4',
								bass: 'a3 e3',
							},
							{
								piano: 'g4 g4',
								bass: 'a3 e3',
							},
						]

					case 2:
						return [
							{
								piano: 'd4 e4 a4 g4',
								bass: 'b3 e3 a3 a3',
							},
							{
								piano: 'g4 g4 g4 g4',
								bass: 'a3 g3 f3 e3',
							},
							{
								piano: 'g4 f4 e4 g4',
								bass: 'e3 g3 a3 a3',
							},
						]

					case 3:
						return [
							{
								piano: 'd4 e4 d4 d4 c4 b3 c4 e4',
								bass: 'b3 e3 g3 b3 a3 e3 f3 e3',
							},
							{
								piano: 'd4 e4 d4 d4 c4 c4 b3 c4',
								bass: 'b3 e3 g3 b3 a3 f3 g3 a3',
							},
							{
								piano: 'd4 e4 d4 d4 c4 b3 e4 g#4',
								bass: 'b3 e3 g3 b3 a3 e3 e3 e3',
							},
						];
				}
			case SectionType.Refrao:
				if (roll(2) > 1) {
					return [{
						piano: 'f5 e5 d5 d5 c5 b4 a4 g#4',
						bass: 'g3 d3 g3 d3 a3 e3 a3 e4',
					},
					{
						piano: 'd5 e5 e5 f5 g5 g5 a5 b5',
						bass: 'b3 e4 a3 d4 g3 c4 f3 g3',
					},
					{
						piano:'c4 b3 c4 d4 e4 f#4 g4 g#4',
						bass: 'a3 e3 a3 e3 a3 e3 a3 e3'
					}]
				}
				return [
					{
						piano: 'b4 c5 d5 e5',
						bass: 'g3 a3 g3 a3',
					},
					{
						piano: '- - a5 b5',
						bass: 'e3 e3 a3 e3',
					},
					{
						piano: 'e5 - a5 b5',
						bass: 'e3 e3 a3 e3',
					},
					{
						piano: 'e5 - c5 b5',
						bass: 'e3 e3 a3 e3',
					},
					{
						piano: 'd5 g5 a5 g#5',
						bass: 'd4 g3 a3 e3',
					},
				];

			case SectionType.Ponte:
				return [
					{
						piano: 'a4 b4 c5 b4',
						bass: 'a3 g3 f3 e3',
					},
					{
						piano: 'a4 b4 c5 e5',
						bass: 'f3 e3 a3 a3',
					},
					{
						piano: 'c5 b4 a4 e4',
						bass: 'f3 e3 a3 a3',
					},
					{
						piano: 'b4 b4 a4 e4',
						bass: 'b3 e3 a3 a3',
					},
				];
		}
	}

	protected generateRhythm(sectionType: SectionType): InstrumentSet[] {
		switch (sectionType) {
			case SectionType.Intro:
				return [
					{
						ride: '- 1 1 1 - -',
						kick: '3 - - 3 - -'
					},
					{
						ride: '- 2 2 2 - -',
						kick: '3 - - 3 - -'
					},
					{
						ride: '- 3 3 3 - -',
						kick: '3 - - 3 - -'
					},
					{
						ride: '- 4 4 4 - -',
						kick: '3 - - 3 - -'
					},
					{
						ride: '- 5 5 5 - -',
						kick: '3 - - 3 - -'
					},
					{
						ride: '- 3 3 3 - -'
					},
					{
						ride: '- 4 4 4 - -'
					},
					{
						ride: '- 5 5 5 - -'
					},
					{
						ride: '1 - 2 - 3 -'
					},
					{
						ride: '5 - - - - -'
					},
					{
						ride: '- - - 5 - -'
					},
					{
						ride: '3 - - - - -'
					},
					{
						ride: '- - - 3 - -'
					},
					{
						ride: '1 2 3 - 2 3'
					},
					{
						ride: '5 5 5 5 5 5'
					},
					{
						ride: '1 4 3 4 5 5'
					},
					{
						shaker: '1 2 3 4 3 2'
					},
					{
						shaker: '1 - 2 1 - 2'
					},
					{
						shaker: '1 - - 1 - -'
					},
					{
						ride: '2 - - 4 - -',
						shaker: '1 2 3 4 3 2'
					},
					{
						ride: '- - - - - - '
					}
				]
			case SectionType.Verso:
				return [
					{
						ride: '- 3 3 - 3 3',
						kick: '1 - - - - -',
						snare: '- - - 3 - 2'
					},
					{
						ride: '- 3 4 - 5 6',
						kick: '1 - - - - -',
						snare: '3 - 3 1 - 2'
					},
					{
						ride: '- 3 5 3 - -',
						kick: '1 - - 3 - -',
						snare: '- - -  4 3 2'
					},
					{
						ride: '- 3 2 - 3',
						kick: '2 - - 3 1',
						snare: '- 3 2 - -'
					},
					{
						ride: '3 - 3 - 3 -',
						kick: '1 - - 2 - ',
						snare: '- 3 - 4 - 5'
					},
				];
			case SectionType.Refrao:
				return [
					{
						ride: '- 3 2 - 2 4',
						kick: '1 - - - - -',
						snare: '- - - 4 - 4',
						shaker: '1 2 3 4 3 2'
					},
					{
						ride: '- 3 5 - 5 4',
						kick: '1 - - - - -',
						snare: '3 - 1 3 - 3',
						shaker: '1 2 3 4 3 2'
					},
					{
						ride: '- 3 5 4 - -',
						kick: '1 - - 2 - -',
						snare: '- - - 5 4 3',
						shaker: '1 2 3 4 3 2'
					},
					{
						ride: '- 3 3 - 5',
						kick: '1 - - 2 3',
						snare: '- 2 1 - -',
						shaker: '1 2 3 4 3 2'
					},
					{
						ride: '3 - 5 - 4 -',
						kick: '1 - - 2 - ',
						snare: '- 2 - 1 - 4',
						shaker: '1 2 3 4 3 2'
					},
				];

			case SectionType.Ponte:
				return [
					{
						ride: '- 1 2 - 3 3 - 4 4 - 4 5',
						kick: '1 - - - - - 2 - - - - -',
						snare: '- - - 1 - 2 - - - 3 - 2',
					},
				];


			default:
				return [
					{
						ride: '- 3 3 - - 3',
						kick: '1 - - - - -',
						snare: '- - - 1 - 1'
					},
				];
		}
	}

	protected generateMelody(sectionType: SectionType): InstrumentSet[] {
		const jazzMelodies = [
			'a4 b4 c5 e5 d5 -',
			'e5 d5 - g4 a4 -',
			'g4 a4 b4 g4 e4 -',
			'a4 - - - - -',
			'a5 - - - - -',
			'a4 - - - - -',
			'c5 a4 - - - -',
			'e5 d#5 c5 a4 - -',
			'e5 - d#5 - - -',
			'e4 - g4 - a4 -',
			'e4 - b4 - a4',
			'a5 c6 b5 a5 g5 a5',
			'g5 e5 d#5 d5 c5 b5',
			'a4 e5 d#5 - - -',
			'- a4 e5 d#5 - - e5',
			'- - - e4 g4 c5',
			'- - - - a4 b4',
			'd5 c5 e5 d5 g5 e5',
			'a4 c5 e5 g5 b5 -',
			'b5 c6 b5 - - -',
			'b5 c6 b5 a5 g5 a5',
			'g5 - - g5 g5 g5',
			'e5 - - - - -',
			'- e5 g5 e5 d#5 d5',
			'- - - - e4 g4',
			'- - - - e5 g5',
			'a4 c5 e5 d#5 - -',
			'e5 d#5 c5 a4 - -',
			'g5 b5 g5 b5 g5 -',
			'- - e4 g4 d4 -',
			'a4 - - - e4 a4',
			'a4 c5 d5 c5 e5 -',
			'a4 c5 d5 c5 a5 -',
			'- - e5 d#5 e5 c5',
			'e5 f5 e5 - e5 f5',
			'a4 g4 a4 c5 d5 c5',
			'g4 a4 c5 g4 a4 -',
			'a4 b4 c5 d5 b4 -',
			'g4 a4 - - g4 a4',
			'g5 - - - f5 e5',
			'g5 - - - - -',
			' - f5 e5 g5 f5 e5',
			'e5 - - - - -',
			'a5 g5 e5 d5 c5 a4',
			'a5 g5 e5 d#5 - -',
			'c5 - - - - -',
			'b5 - - - - -',
			'd5 - - - - -',
			'd#5 - - - g5 e5',
			'g4 - - - b4 g4',
			'd5 e5 f5 e5 f5 g5',
			'- - - - c5 b4',
			'- - - - - g4',
			'a4 - - a5 - -'
		]
		switch (sectionType) {
			case SectionType.Ponte:
				return [
					{
						piano: parseNumbers(generateRandomNotes(12), piano, Minor, 0)
					},
					{
						piano: jazzMelodies[roll(jazzMelodies.length - 1)] + ` ` + parseNumbers(generateRandomNotes(6), piano, Minor, 0)
					},
					{
						piano: parseNumbers(generateRandomNotes(6), piano, Minor, 0) + ` ` + jazzMelodies[roll(jazzMelodies.length - 1)]
					},
					{
						piano: jazzMelodies[roll(jazzMelodies.length - 1)] + ' ' + parseNumbers(generateAxialMelodySheet(generateSheetGroove(6)), piano, Minor, 0),
					},
					{
						piano: parseNumbers(generateGapFillMelodySheet(generateSheetGroove(6)), piano, Minor, 0) + ' ' + jazzMelodies[roll(jazzMelodies.length - 1)]
					},
					{
						piano: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(12)), piano, Minor, 0),
					},
					{
						piano: parseNumbers(generateGapFillMelodySheet(generateSheetGroove(6)), piano, Minor, 0) + ' ' + parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(6)), piano, Minor, 0),
					},
					{
						piano: parseNumbers(generateGapFillMelodySheet(generateSheetGroove(6)), piano, Minor, 0) + ' ' + parseNumbers(generateAxialMelodySheet(generateSheetGroove(6)), piano, Minor, 0),
					},
					{
						piano: 'a5 b5 c6 d6 b5 - g5 a5 - - - -'
					},
					{
						piano: '- - a5 b5 c6 d6 b5 - g5 a5 - -'
					}
				];
			default:
				return [
					{
						sax: parseNumbers(generateRandomNotes(6), sax, Minor, 0)
					},
					{
						sax: jazzMelodies[roll(jazzMelodies.length - 1)]
					},
					{
						sax: (jazzMelodies[roll(jazzMelodies.length - 1)])
					},
					{
						sax: jazzMelodies[roll(jazzMelodies.length - 1)]
					},
					{
						sax: jazzMelodies[roll(jazzMelodies.length - 1)]
					},
					{
						sax: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(6)), sax, Minor, 0),
					},
					{
						sax: parseNumbers(generateGapFillMelodySheet(generateSheetGroove(6)), sax, Minor, 0),
					},
					{
						sax: parseNumbers(generateAxialMelodySheet(generateSheetGroove(6)), sax, Minor, 0),
					},
				];
		}
	}

	protected getNextProgressionCount(sectionType: SectionType): number {
		return 4;
	}

	protected getNextMeasureCount(sectionType: SectionType, progressionIndex: number, progressionCount: number): number {
		return 4;
	}
}
