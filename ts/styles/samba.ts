class Samba extends Style {
	readonly sections = [SectionType.Intro, SectionType.Verso, SectionType.Refrao, SectionType.Ponte, SectionType.Refrao]
	constructor() {
		super(StyleName.Samba, 144, 4 / 16);
	}

	protected generateHarmony(sectionType: SectionType): InstrumentSet[] {
		switch (sectionType) {
			case SectionType.Intro:
				return [
					{
						bass: 'g3 g3',
						piano: 'c5 b4'
					},
					{
						bass: 'g3 g3',
						piano: 'd5 b4'
					},
					{
						bass: 'g3 d3',
						piano: 'd4 d4'
					},
					{
						bass: 'g3 f3',
						piano: 'b4 c5'
					},
				];
			case SectionType.Verso:
				return [
					{
						bass: 'g3 f3 g3 f3',
						dulcimer: 'g4 a4 b4 d5',
						piano: 'b4 c5 b4 c5'
					},
					{
						bass: 'g3 c4 d4 g3',
						dulcimer: 'b4 b4 c5 d5',
						piano: 'd5 d5 d5 g5'
					},
					{
						bass: 'g3 f3 c3 g3',
						dulcimer: 'd5 c5 c5 b4',
						piano: 'b5 c6 e6 d6'
					},
					{
						bass: 'g3 f3 c3 g3',
						dulcimer: 'd5 c5 b5 b4',
						piano: 'b5 c6 e6 d6'
					},
					{
						bass: 'g3 f3 c3 g3',
						dulcimer: 'd5 c5 e5 d5',
						piano: 'b5 c6 b5 b5'
					},
					{
						bass: 'g3 c4 d4 g3',
						dulcimer: 'b4 c5 a4 g4',
						piano: 'd5 e5 f5 g5'
					},
					{
						bass: 'g3 c4 d4 g3',
						dulcimer: 'd4 g5 a4 d4',
						piano: 'b6 e6 f6 b6'
					},
					{
						bass: 'g3 g4 g3 g4',
						dulcimer: 'g5 d5 b4 g4',
						piano: 'd6 g5 d6 f6'
					},
					{
						bass: 'g3 g4 d4 g4',
						dulcimer: 'g5 d5 a4 g4',
						piano: 'd6 g5 f6 f6'
					},
				];
			case SectionType.Refrao:
				return [
					{
						bass: 'g3 c4 d4 g3',
						dulcimer: 'b4 b4 c5 d5',
						piano: 'd5 d5 d5 g5'
					},
					{
						bass: 'g3 f3 c3 g3',
						dulcimer: 'd5 c5 e5 d5',
						piano: 'b5 c6 b5 b5'
					},
					{
						bass: 'g3 c4 d4 g3',
						dulcimer: 'b4 c5 a4 g4',
						piano: 'd5 e5 f5 g5'
					},
					{
						bass: 'g3 c4 d4 g3',
						dulcimer: 'd4 g5 a4 d4',
						piano: 'b6 e6 f6 b6'
					},
				];
			case SectionType.Ponte:
				return [
					{
						bass: '- - - - '
					},
				];
		}
	}

	protected generateRhythm(sectionType: SectionType): InstrumentSet[] {
		switch (sectionType) {
			case SectionType.Intro:
				const introGrooves = [
					{
						surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
						surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
						surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3)
					},
					{
						surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3),
					},
					{
						shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
						surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3),
					},
					{
						shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4'
					},
					{
						ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4'
					},
					{
						shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
						surdo1: '1 - - - - - - - 2 - - - - - - -',
					},
					{
						ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
						surdo1: '1 - - - - - - - 2 - - - - - - -',
					},
					{
						shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
						surdo1: '1 - - - - - - - 2 - - - - - - -',
						surdo3: '- - 2 - 2 - 2 - 3 - 2 - 2 - 2 -',
					},
					{
						ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
						surdo1: '1 - - - - - - - 2 - - - - - - -',
						surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3)
					},
					{
						caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
					},
					{
						shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
						tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim)
					},
					{
						caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
						tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim)
					},
					{
						shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
						ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4'
					},
					{
						caixa: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
						shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
					}
				]
				return [introGrooves[roll(introGrooves.length - 1)]]

			case SectionType.Verso:
				return [
					{
						surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
						surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
						surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3),
						shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
						tamborim: '- 1 - 1 - - 1 - 1 - 1 - 1 - - 1'
					},
					{
						surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
						surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
						surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3),
						ganza: generateRhythmSheet(generateSheetGroove(16), surdo3),
						tamborim: '- 1 - 1 - - 1 - 1 - 1 - 1 - - 1'
					},
					{
						surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
						surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
						surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3),
						ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
						tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim),
					},
					{
						surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
						surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
						shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
						tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim),
					},
					{
						surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
						surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
						surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3),
						ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
						tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim)
					}
				]

			case SectionType.Refrao:
				return [{
					tamborim: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
					ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
					caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
					surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
					surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
					surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3)
				},
				{
					tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim),
					ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
					caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
					surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
					surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
					surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3)
				},
				{
					tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim),
					ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
					caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
					surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
					surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
					surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3),
				},
				]

			case SectionType.Ponte:
				const groove = generateSheetGroove(16)
				return [
					{
						tamborim: generateRhythmSheet(mutateSheetGroove(groove), tamborim),
						ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
						caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
						surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
						surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
						surdo3: generateRhythmSheet(mutateSheetGroove(groove), surdo3),
					},
					{
						tamborim: generateRhythmSheet(mutateSheetGroove(groove), tamborim),
						ganza: generateRhythmSheet(mutateSheetGroove(groove), ganza),
						caixa: generateRhythmSheet(mutateSheetGroove(groove), caixa),
						surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
						surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
						surdo3: generateRhythmSheet(mutateSheetGroove(groove), surdo3),
					},
					{
						tamborim: generateRhythmSheet(mutateSheetGroove(groove), tamborim),
						ganza: generateRhythmSheet(mutateSheetGroove(groove), ganza),
						caixa: generateRhythmSheet(mutateSheetGroove(groove), caixa),
						surdo1: generateRhythmSheet(mutateSheetGroove(groove), surdo1),
						surdo2: generateRhythmSheet(mutateSheetGroove(groove), surdo2),
						surdo3: generateRhythmSheet(mutateSheetGroove(groove), surdo3),
					},
					{
						tamborim: generateRhythmSheet(mutateSheetGroove(groove), tamborim),
						ganza: generateRhythmSheet(mutateSheetGroove(groove), ganza),
						caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
						surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
						surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
						surdo3: generateRhythmSheet(mutateSheetGroove(groove), surdo3),
					},
					{
						tamborim: generateRhythmSheet(mutateSheetGroove(groove), tamborim),
						ganza: generateRhythmSheet(mutateSheetGroove(groove), ganza),
						caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
						surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
						surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
						surdo3: generateRhythmSheet(mutateSheetGroove(groove), surdo3),
					},
					{
						tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim),
						ganza: generateRhythmSheet(generateSheetGroove(16), ganza),
						caixa: generateRhythmSheet(generateSheetGroove(16), caixa),
						surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
						surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
						surdo3: generateRhythmSheet(mutateSheetGroove(groove), surdo3),
					},
					{
						tamborim: '1 - 1 - 1 2 3 4 1 - - - - 1 2 3',
						ganza: '1 - 1 -  1 2 3 4 1 2 3 4 1 2 3 4',
						caixa: '1 - 1 - 1 2 3 4 - 1 - 2 3 - 3 - ',
						surdo1: '1 - 1 - - - - - 3 - - - 2 - - -',
						surdo2: '1 - 1 - - - - - - - 3 - - - 2 -',
						surdo3: '- - - - - - - - 4 4 3 3 2 2 1 1',
					},
					{

						tamborim: generateRhythmSheet(mutateSheetGroove(groove), tamborim),
						ganza: '- - - - - - 1 2 3 4 1 - - - - -',
						caixa: generateRhythmSheet(generateSheetGroove(16), caixa),
						surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
						surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
						surdo3: '- 2 - 1 - 3 3 2 1 - - 4 4 3 3 -',
					},
					{

						tamborim: '- 1 - 1 - - 1 - 1 - 1 - 1 - - -',
						ganza: '- - - - - - - - - - - - 1 2 3 4',
						caixa: '- - 16 - - - 16 - - - 16 - - - 16 - ',
						surdo1: generateRhythmSheet(mutateSheetGroove(groove), surdo1),
						surdo2: generateRhythmSheet(mutateSheetGroove(groove), surdo2),
						surdo3: '4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4',
					},
					{
						tamborim: '1 2 3 4 1 - 1 - 1 - - - - -',
						ganza: '1 2 3 4 1 - 1 - 1 - 1 2 1 - 1 -',
						caixa: '1 2 3 4 1 - 5 - 9 - - - - - - -',
						surdo1: '1 - - 2 - - - - - - - - - - - -',
						surdo2: '2 - - 1 - - - - - - - - - - - -',
						surdo3: '- - - - - - - - - - 3 - 3 - 3 -',
					},
					{
						tamborim: '1 - - 1 - - 1 - - - 1 - 1 - - -',
						ganza: '1 - - 1 - - 1 - 1 2 3 4 1 2 3 4',
						caixa: generateRhythmSheet(mutateSheetGroove(groove), caixa),
						surdo1: '1 - - 1 - - 1 - - - 1 - 1 - - -',
						surdo2: '1 - - 1 - - 1 - - - 1 - 1 - - -',
						surdo3: '1 - - 1 - - 1 - - - 1 - 1 3 2 1',
					},
					{
						tamborim: '1 2 3 4 1 - 1 - 1 - - -',
						ganza: '1 2 3 4 1 - 1 - 1 - - - - - - -',
						caixa: '1 2 3 4 1 - 1 - 1 - - - - - - -',
						surdo1: '1 - - - - - - - 3 - - - 2 - - -',
						surdo2: '- - - - - - 2 - - - 3 - - - 2 -',
						surdo3: '- - - - - - - - - - 4 3 3 2 2 1',
					},
				]
		}
	}

	protected generateMelody(sectionType: SectionType): InstrumentSet[] {
		const syncopations = [
			[1, 1, 0, 1, 1, 0, 1, 0],
			[1, 1, 0, 1, 1, 1, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 1, 0, 0, 1, 0],
			[1, 0, 0, 1, 0, 0, 0, 1],
			[1, 0, 0, 1, 1, 0, 1, 0],
		]

		const sambaMelodies = [
			[0, 0, 0, 0, 0, 8, 8, 8],
			[0, 0, 0, 0, 0, 5, 5, 5],
			[8, 1, 1, 3, 5, 7, 6, 0],
			[8, 8, 7, 6, 8, 8, 7, 6],
			[1, 2, 3, 5, 7, 6, 5, 0],
			[5, 4, 3, 2, 1, -7, 1, 2],
			[5, 5, 0, 5, 4, 4, 0, 4],
			[4, 4, 0, 4, 3, 3, 0, 3],
			[1, 1, 0, 1, 1, -7, 0, 2],
			[1, 1, 0, 1, -7, 0, 2, 0],
			[1, 1, 0, 1, -7, 0, 2, 0],
			[8, 3, 5, 8, 3, 5, 8, 0],
			[8, 8, 7, 6, 5, 5, 4, 3],
			[8, 8, 7, 6, 8, 8, 7, 6],
			[1, 0, 2, 0, 3, 0, 4, 0],
			[4, 3, 2, 1, 4, 3, 2, 1],
			[5, 4, 3, 2, 5, 4, 3, 2],
			[8, 7, 6, 5, 8, 7, 6, 5],
			[5, 0, 0, 0, 0, 5, 5, 5],
			[5, 5, 0, 5, 0, 5, 5, 5],
			[4, 0, 0, 0, 0, 4, 4, 4],
			[4, 4, 0, 4, 0, 4, 4, 4],
			[3, 0, 0, 0, 0, 3, 3, 3],
			[3, 3, 0, 3, 0, 3, 3, 3],
			[8, 0, 0, 0, 0, 8, 8, 8],
			[8, 8, 0, 8, 0, 8, 8, 8],
			[5, 5, 0, 5, 0, 4, 4, 4],
			[4, 4, 0, 4, 0, 5, 5, 5],
			[1, 1, 0, 1, 0, 1, 2, 3],
			[1, 1, 0, 1, 0, 1, 3, 5],
			[7, 6, 5, 7, 6, 5, 7, 0],
		]

		switch (sectionType) {
			case SectionType.Ponte:
				return [{
					flute: '-'
				}]
			default:
				return [
					{
						flute: parseNumbers(generateAxialMelodySheet(generateSheetGroove(16)), flute, Mixolydian, 10),
					},
					{
						flute: parseNumbers(generateAxialMelodySheet(syncopations[roll(syncopations.length) - 1]), flute, Mixolydian, 10) + ' ' + parseNumbers(generateAxialMelodySheet(syncopations[roll(syncopations.length) - 1]), flute, Mixolydian, 10)
					},
					{
						flute: parseNumbers(generateAxialMelodySheet(syncopations[roll(syncopations.length) - 1]), flute, Mixolydian, 10) + ' ' + parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(8)), flute, Mixolydian, 10)
					},
					{
						flute: parseNumbers(generateGapFillMelodySheet(generateSheetGroove(8)), flute, Lydian, 10) + ' ' + parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(8)), flute, Mixolydian, 10)
					},
					{
						flute: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(16)), flute, Mixolydian, 10),
					},
					{
						flute: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(8)), flute, Mixolydian, 10) + ' ' + parseNumbers(generateGapFillMelodySheet(generateSheetGroove(8)), flute, Major, 10)
					},
					{
						flute: parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Mixolydian, 10) + ' ' + parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Mixolydian, 10),
					},
					{
						flute: parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Lydian, 10) + ' ' + parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Lydian, 10),
					},
					{
						flute: parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Lydian, 10) + ' ' + parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Mixolydian, 10),
					},
					{
						flute: parseNumbers(generateAxialMelodySheet(syncopations[roll(syncopations.length) - 1]), flute, Mixolydian, 10) + ' ' + parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Mixolydian, 10),
					},
					{
						flute: parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Mixolydian, 10) + ' ' + parseNumbers(generateAxialMelodySheet(syncopations[roll(syncopations.length) - 1]), flute, Mixolydian, 10)
					}
				];
		}
	}

	protected getNextProgressionCount(sectionType: SectionType): number {
		return 4;
	}

	protected getNextMeasureCount(sectionType: SectionType, progressionIndex: number, progressionCount: number): number {
		return 16;
	}
}
