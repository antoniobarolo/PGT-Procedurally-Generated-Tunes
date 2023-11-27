class Forro extends Style {
	readonly sections = [SectionType.Intro, SectionType.Refrao, SectionType.Verso, SectionType.Ponte, SectionType.Verso, SectionType.Ponte, SectionType.Refrao, SectionType.Refrao, SectionType.Ponte, SectionType.Ponte, SectionType.Intro]

	constructor() {
		super(StyleName.Forro, 115, 4 / 16);
	}

	protected generateHarmony(sectionType: SectionType): InstrumentSet[] {
		switch (sectionType) {
			case SectionType.Intro:
				if (roll(2) > 1) {
					return [
						{
							bass: 'a3 - b3 - ',
							accordion: 'd4 - g4 - ',
							xylo: 'f5 - g5 - ',
						},
						{
							bass: 'd3 f4 e3 f4 ',
							accordion: 'd4 - g4 - ',
							xylo: 'd4 d5 d4 d5 ',
						},
						{
							bass: 'd3 f4 e3 f4 ',
							accordion: 'd4 - b4 a4',
							xylo: 'd4 - - -',
						},
						{
							bass: 'd3 d3 a2 d3 ',
							accordion: 'd3 d3 c3 d3',
							xylo: 'd4 - - -',
						},
						{
							bass: 'd3 d3 a2 d3 ',
							accordion: 'f3 f3 e3 d3',
							xylo: 'd4 - - -',
						}
					];
				}
				else {
					return [{
						bass: 'd3 a2',
						accordion: 'a4 a4',
						xylo: 'd5 a4',
					},
					{
						bass: 'd3 a2',
						accordion: 'a3 a3',
						xylo: 'd5 a4',
					},
					{
						bass: 'a2 d3',
						accordion: 'a4 a4',
						xylo: 'a4 d5',
					},
					{
						bass: 'd3 d3',
						accordion: 'a4 d4',
						xylo: 'a4 d5',
					},
					{
						bass: 'd3 d3',
						accordion: 'a4 d4',
						xylo: 'd4 d5',
					}]
				}


			case SectionType.Refrao:
				return [
					{
						bass: 'd3 c4 a4 a4',
						accordion: 'd4 - a4 e5',
					},
					{
						bass: 'd3 f4 d3 f4',
						accordion: 'f4 - g4 -',
					},
					{
						bass: 'a2 - - - ',
						accordion: 'a4 - - -',
					}
				];

			case SectionType.Verso:
				return [
					{
						bass: 'a3 - b3 - ',
						accordion: 'd4 - g4 - ',
						xylo: 'f5 - g5 - ',
					},
					{
						bass: 'd3 f4 e3 f4 ',
						accordion: 'd4 - g4 - ',
					},
					{
						bass: 'd3 f4 e3 f4 ',
						accordion: 'd4 - b4 a4',
					},
					{
						bass: 'a2 d3 c3 d3',
						accordion: 'a4 a4 e4 f4',
						xylo: 'a4 d5 c5 d5',
					},
					{
						bass: 'd3 g3 a3 d3 ',
						accordion: 'd4 g4 a4 a4',
					},
					{
						bass: 'd3 g3 a3 d3 ',
						accordion: 'd4 c4 a3 a4',
					},
				];

			case SectionType.Ponte:
				return [
					{
						bass: 'c3 a2',
						accordion: 'c4 a3',
					},
					{
						bass: 'c3 d3',
						accordion: 'c4 d4',
					},
					{
						bass: 'g3 d3',
						accordion: 'b4 d4',
					},
					{
						bass: 'g3 d3',
						accordion: 'd4 d4',
					},
					{
						bass: 'a2 d3',
						accordion: 'c4 d4',
						xylo: 'a4 d5',
					},
					{
						bass: 'a2 d3',
						accordion: 'c4 a4',
						xylo: 'a4 d5',
					},
					{
						bass: 'a2 d3 ',
						accordion: 'a4 a4',
						xylo: 'a4 d5',
					},

				];


			default:
				return [
					{
						bass: "d3 - - a2"
					},
				];
		}
	}

	protected generateRhythm(sectionType: SectionType): InstrumentSet[] {
		const zabumbaGrooves = [
			"k1 - s k2 - - - k1",
			"k1 - s k2 - - - k1",
			"k1 - s k2 s - - k1",
			"k1 - s k2 s - s k1",
			"k1 - - - - - - k1",
			"k1 - s k2 - - k1 - ",
			"k1 - s k2 - - k1 k2 ",
			"k1 k2 s k2 s s k1 k1",
			"k1 k2 k1 k2 k1 k2 k1 k2",
			"k1 k2 k2 k1 k2 k2 k1 k2",
			"k1 - k1 - k1 - - s"
		]

		switch (sectionType) {
			case SectionType.Intro:
				const zabumbaIntroGrooves = [
					"k1 - s k2 - - - k1",
					"k1 - s k2 s - - k1",
					"k1 - k2 - k1 s k2 s ",
					"k1 - s k2 - - - k1",
					"k1 - - - - - - k1",
					"s - - - - - - s",
					"- - - - - - - - ",
					"k1 - - - - - - - ",
					"s - - - s - - - ",
				]
				const triangleIntroGrooves = [
					"1 2 3 2 1 2 3 2",
					"1 - 2 - 3 - 2 - ",
					"1 - - - 1 2 3 2",
					"1 - - - 1 - 3 -",
					"3 - - - - - 3 -",
					"3 - - - - - - -",
					"- - - - 2 - - -",
					"- - - - - - - - ",
					"3 - - - - - - - ",
					"1 - - 1 - - 2 - ",
				]
				return [
					{
						zabumba: zabumbaIntroGrooves[roll(zabumbaIntroGrooves.length) - 1],
						triangle: triangleIntroGrooves[roll(triangleIntroGrooves.length) - 1]
					},
					{
						zabumba: zabumbaIntroGrooves[roll(zabumbaGrooves.length) - 1],
						triangle: triangleIntroGrooves[roll(triangleIntroGrooves.length) - 1]
					},
					{
						zabumba: zabumbaIntroGrooves[roll(zabumbaGrooves.length) - 1],
					},
					{
						triangle: "1 2 3 2 1 2 3 2"
					},
					{
						triangle: "1 3 3 3 2 3 3 3"
					},
					{
						triangle: "2 3 3 3 2 3 3 3"
					},
					{
						triangle: "- - - - 2 - - -"
					},
					{
						triangle: "- - 2 - - - 2 -"
					},
					{
						triangle: "- - 3 - - - 3 -"
					},
					{
						triangle: "- - 1 - - - 1 -"
					},
					{
						triangle: "3 2 1 2 3 2 1 2"
					},
					{
						triangle: "3 - - 3 - - 2 - "
					},

				];

			case SectionType.Ponte:
				return [{
					triangle: "1 2 3 2",
					zabumba: "k1 - s k2"
				},
				{
					triangle: "1 2 3 2",
					zabumba: "- - - k1"
				},
				{
					triangle: "1 - - -",
					zabumba: "k1 - s k2"
				},
				{
					triangle: "1 - - -",
					zabumba: "- - - k1"
				},
				{
					triangle: "2 - 2 -",
					zabumba: "k1 - s k2"
				},
				{
					triangle: "2 - 2 -",
					zabumba: "k2 - - k1"
				},
				{
					triangle: "1 2 3 2",
					zabumba: "k1 - k1 - "
				},
				{
					triangle: "1 2 3 2",
					zabumba: "k2 s k1 s"
				},

				]


			case SectionType.Verso:
				return [
					{
						zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1]
					},
					{
						zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
						triangle: "1 2 3 2 1 2 3 2"
					},
					{
						zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
						triangle: "1 2 3 2 1 2 3 2",
						xylo: "d4 - - - a4 - - - "
					},
					{
						zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
						triangle: "1 2 3 2 1 2 3 2",
						xylo: "d5 - - - a4 - - - "
					},
					{
						zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
						triangle: "1 - - 3 1 2 3 2"
					},
					{
						zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
						triangle: "1 2 3 2 1 - 1 -"
					},
					{
						zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
						triangle: "1 - - 1 - - 2 - "
					},
					{
						zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
						triangle: "2 1 - 2 2 1 - 2 "
					},
					{
						zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
						triangle: "1 - - - 2 - 2 - "
					},
					{
						triangle: "1 - 2 - 3 - 2 - ",
						zabumba: "k1 - k1 - k1 - - s"
					},
					{
						triangle: "1 - 2 - 3 - 2 - ",
						zabumba: "k2 - - k1 - - - s"
					}
				];

			case SectionType.Refrao:
				const xyloChorusGrooves = [
					"d4 - - - a4 - - -",
					"d5 - - - a4 - - -",
					"d5 - - - a4 - d4 -",
					"d5 - a4 - d5 - a4 -",
				]
				return [
					{
						zabumba: "k1 - s k2 - - - k1",
						triangle: "1 2 3 2 1 2 3 2"
					},
					{
						zabumba: "k1 - s k2 - - - k1",
						triangle: "1 2 3 2 1 2 3 2",
						xylo: xyloChorusGrooves[roll(xyloChorusGrooves.length) - 1]
					},
					{
						zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
						triangle: "1 2 3 2 1 2 3 2",
						xylo: xyloChorusGrooves[roll(xyloChorusGrooves.length) - 1]
					},
					{
						triangle: "1 - 2 - 3 - 2 - ",
						zabumba: "k1 - k1 - k1 - - s"
					},
					{
						triangle: "1 - 2 - 3 - 2 - ",
						zabumba: "k2 - - k1 - - - s"
					}
				]

			default:
				return [
					{
						zabumba: "k1 - s k2 - - - k1",
						triangle: "1 2 3 2 1 2 3 2"
					},
				];
		}
	}

	protected generateMelody(sectionType: SectionType): InstrumentSet[] {
		let chosenScale = Dorian
		const melodies8thNotes = [
			"d5 f5 e5 d5 a5 g5 f5 g5",
			"b4 - a4 - d4 d4 d4 d4",
			"d5 b4 c5 a4 b4 f4 a4 f4",
			"b4 b4 a5 a5",
			"d5 d4 d4 d5 d4 d4 b4 c4",
			"d4 - - - c5 a4 b4 - ",
			"a5 - f5 - a4 - d5 - ",
			"d5 - a4 - d5 - a4 - ",
			"d5 - - a4 d5 - - a4 ",
			"- - d5 d5 d5 d5 d5 e5",
			'f5 f5 f5 f5 e5 d5 d5 d5',
			'd5 - - c5 e5 - c5 - ',
			'f5 - g5 - a5 - - - ',
			'g5 - - - f5 - - - ',
			'c5 b4 - - a4 g4 f4 - ',
			'f4 - a4 - c5 - a4 g4',
			'f4 - a4 - c5 - a4 g4',
			'f4 - g4 - a4 - c5 - ',
			'g5 - - f5 a5 g5 - -',
			'f5 a5 g5 - - f5 e5',
			'g5 f5 e5 d5 c5 e5 d5 -',
			'd5 c5 b4 a4 f4 a4 g4 -',
			'g5 - - a5 g5 -- f5',
			'g5 - - d5 g5 g5 d5 g5',
			'f5 g5 a5 - - - g5 -']

		const melodies4thNotes = [
			"c5 - - f5",
			"d5 - - c5",
			"c5 c5 c5 d5",
			"f5 e5 e5 d5",
			"d5 a5 a5 a5",
			"d5 f5 e5 d5",
			"c5 - b4 - ",
			"d5 - - d5",
			"a5 g5 f5 e5",
			"d5 e5 f5 g5",
			"f5 - g5 - ",
			"g5 - f5 - ",
			"d5 - c5 e5",
			"- - d5 e5",
		]

		const scaleMelodies = [
			[1, 0, 2, 0, 3, 0, 4, 0],
			[1, 0, 0, 2, 0, 0, 3, 0],
			[1, 0, 0, 0, 5, 0, 0, 0],
			[5, 0, 4, 0, 3, 0, 2, 0],
			[1, 0, 0, 1, 2, 0, 1, 0],
			[1, 0, 0, 1, -7, 0, 2, 0],
			[1, 0, 0, 1, -7, 0, -6, 0],
			[1, 0, 2, 0, 3, 0, 3, 0],
			[2, 0, 1, 0, 2, 0, 1, 0],
			[3, 0, 2, 0, 1, 0, 1, 0]
		]

		const syncopations = [
			[1, 1, 0, 1, 1, 0, 1, 0],
			[1, 1, 0, 1, 1, 1, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 1, 0, 0, 1, 0],
			[1, 0, 0, 1, 0, 0, 0, 1],
			[1, 0, 0, 1, 1, 0, 1, 0],
		]

		switch (sectionType) {
			case SectionType.Intro:
				return [
					{
						accordion: parseNumbers(generateLinearPatternMelodySheet(syncopations[roll(syncopations.length) - 1]), accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove([1, 0, 1, 0, 1, 0, 1, 0,])), accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(generateAxialMelodySheet(mutateSheetGroove(syncopations[roll(syncopations.length) - 1])), accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(generateAxialMelodySheet(mutateSheetGroove([1, 0, 1, 0, 1, 0, 1, 0,])), accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(generateGapFillMelodySheet([1, 0, 1, 0, 1, 0, 1, 0,]), accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
					},
					{
						accordion: melodies8thNotes[roll(melodies8thNotes.length) - 1]
					},
					{
						accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1] + ' ' + melodies4thNotes[roll(melodies4thNotes.length) - 1]
					},
				]
			case SectionType.Verso:
				return [
					{
						accordion: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(8)), accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(generateGapFillMelodySheet(generateSheetGroove(8)), accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(generateLinearPatternMelodySheet(syncopations[roll(syncopations.length) - 1]), accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(generateAxialMelodySheet([1, 0, 1, 0, 1, 0, 1, 0]), accordion, chosenScale, 5)
					},
					{
						accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1] + ' ' + parseNumbers(generateAxialMelodySheet([1, 1, 1, 1,]), accordion, chosenScale, 5)
					},
					{
						accordion: parseNumbers(generateAxialMelodySheet(syncopations[roll(syncopations.length) - 1]), accordion, chosenScale, 5)
					},
					{
						accordion: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(4)), accordion, chosenScale, 5) + ' ' + parseNumbers(generateAxialMelodySheet([1, 1, 1, 1]), accordion, chosenScale, 5)
					},
					{
						accordion: melodies8thNotes[roll(melodies8thNotes.length) - 1]
					},
					{
						accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1] + ' ' + melodies4thNotes[roll(melodies4thNotes.length) - 1]
					},
					{
						accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
					}
				];
			case SectionType.Refrao:
				return [{
					accordion: melodies8thNotes[roll(melodies8thNotes.length) - 1]
				},
				{
					accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1] + ' ' + melodies4thNotes[roll(melodies4thNotes.length) - 1]
				},
				{
					accordion: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(8)), accordion, chosenScale, 5),
				},
				{
					accordion: parseNumbers(generateGapFillMelodySheet(generateSheetGroove(8)), accordion, chosenScale, 5),
				},
				{
					accordion: parseNumbers(generateLinearPatternMelodySheet(syncopations[roll(syncopations.length) - 1]), accordion, chosenScale, 5),
				},
				{
					accordion: parseNumbers(generateAxialMelodySheet(mutateSheetGroove(syncopations[roll(syncopations.length) - 1])), accordion, chosenScale, 5),
				},
				{
					accordion: parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(syncopations[roll(syncopations.length) - 1])), accordion, chosenScale, 5),
				},
				{
					accordion: parseNumbers(generateAxialMelodySheet([1, 0, 1, 0, 1, 0, 1, 0]), accordion, chosenScale, 5)
				},
				{
					accordion: parseNumbers(generateAxialMelodySheet([1, 1, 1, 1, 1, 1, 1, 1]), accordion, chosenScale, 5)
				},
				{
					accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
				},
				{
					accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
				},
				{
					accordion: melodies8thNotes[roll(melodies8thNotes.length) - 1]
				},
				{
					accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1] + ' ' + melodies4thNotes[roll(melodies4thNotes.length) - 1]
				},
				{
					accordion: melodies8thNotes[roll(melodies8thNotes.length) - 1]
				},
				{
					accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1] + ' ' + melodies4thNotes[roll(melodies4thNotes.length) - 1]
				},]

			case SectionType.Ponte:
				return [
					{
						accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1]
					},
					{
						accordion: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(4)), accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(generateGapFillMelodySheet(generateSheetGroove(4)), accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(mutateSheetGroove(generateLinearPatternMelodySheet([1, 0, 1, 0])), accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(generateLinearPatternMelodySheet([1, 0, 0, 1]), accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(generateAxialMelodySheet([1, 1, 1, 1]), accordion, chosenScale, 5),
					},
					{
						accordion: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(2)), accordion, chosenScale, 5) + ' ' + parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(2)), accordion, chosenScale, 5)
					},
					{
						accordion: "c4 - c4 - "
					},
					{
						accordion: "c4 d4 e4 f4 "
					},
					{
						accordion: "d4 e4 f4 g4"
					},
					{
						accordion: "c4 - c4 c4"
					},
					{
						accordion: "a3 - a3 a3"
					},
					{
						accordion: "a3 - a3 -"
					},
					{
						accordion: "a4 - c4 - "
					},
					{
						accordion: "d5 - c5 b4"
					},
					{
						accordion: "c5 - b4 - "
					},
					{
						accordion: "d5 - - -"
					},
					{
						accordion: melodies8thNotes[roll(melodies8thNotes.length) - 1]
					},
					{
						accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1]
					}
				];

			default:
				return [
					{
						accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1]
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
