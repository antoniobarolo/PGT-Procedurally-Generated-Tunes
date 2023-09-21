class Jazz extends Style {
	constructor() {
		super(StyleName.Jazz, 100, 0.6);
	}

	protected generateHarmony(sectionType: SectionType): InstrumentSet[] {
		switch (sectionType) {
			case SectionType.Intro:
				return [
					{
						piano: 'c4 b3',
						funkybass: 'a3 e3',
					},
					{
						piano: 'e4 e4',
						funkybass: 'a3 e3',
					},
					{
						piano: 'g4 g4',
						funkybass: 'a3 e3',
					},
					{
						piano: 'd4 e4 a4 g4',
						funkybass: 'b3 e3 a3 a3',
					},
					{
						piano: 'd4 e4 d4 d4 c4 b3 c4 e4',
						funkybass: 'b3 e3 g3 b3 a3 e3 f3 e3',
					},
					{
						piano: 'g4 g4 g4 g4',
						funkybass: 'a3 g3 f3 e3',
					},
				];

			default:
				return [
					{
						piano: 'c4 b3',
						funkybass: 'a3 e3',
					},
				];
		}
	}

	protected generateRhythm(sectionType: SectionType): InstrumentSet[] {
		switch (sectionType) {
			case SectionType.Intro:
				return [
					{
						ride: '- 3 3 - 3 3',
						kick: '1 - - - - -',
						snare: '- - - 1 - 1'
					},
					{
						ride: '- 3 3 - 3 3',
						kick: '1 - - - - -',
						snare: '1 - 1 1 - 1'
					},
					{
						ride: '- 3 3 3 - -',
						kick: '1 - - 1 - -',
						snare: '- - - 1 1 1'
					},
					{
						ride: '- 3 3 - 3',
						kick: '1 - - 1 1',
						snare: '- 1 1 - -'
					},
					{
						ride: '3 - 3 - 3 -',
						kick: '1 - - 1 - ',
						snare: '- 1 - 1 - 1'
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
		switch (sectionType) {
			case SectionType.Intro:
				return [
					{
						sax: 'a4 b4 c5 e5 d5 -'
					},
					{
						sax: 'e5 d5 - g4 a4 -'
					},
					{
						sax: 'g4 a4 b4 g4 e4 -'
					},
					{
						sax: 'a4 - - - - -'
					},
					{
						sax: 'a5 - - - - -'
					},
					{
						sax: 'a4 - - - - -'
					},
					{
						sax: 'c5 a4 - - - -'
					},
					{
						sax: 'e5 eb5 c5 a4 - -'
					},
					{
						sax: 'e5 - eb5 - - -'
					},
					{
						sax: 'e4 - g4 - a4 -'
					},
					{
						sax: 'e4 - b4 - a4'
					},
					{
						sax: 'a5 c6 b5 a5 g5 a5'
					},
					{
						sax: 'g5 e5 eb5 d5 c5 b5'
					},
					{
						sax: 'a4 e5 eb5 - - -'
					},
					{
						sax: '- a4 e5 eb5 - - e5'
					},
					{
						sax: '- - - e4 g4 c5'
					},
					{
						sax: '- - - - a4 b4'
					},
					{
						sax: 'd5 c5 e5 d5 g5 e5'
					},
					{
						sax: 'a4 c5 e5 g5 b5 -'
					},
					{
						sax: 'b5 c6 b5 - - -'
					},
					{
						sax: 'b5 c6 b5 a5 g5 a5'
					},
					{
						sax: 'g5 - - g5 g5 g5'
					},
					{
						sax: 'e5 - - - - -'
					},
					{
						sax: '- e5 g5 e5 eb5 d5'
					},
					{
						sax: '- - - - e4 g4'
					},
					{
						sax: '- - - - e5 g5'
					},
					{
						sax: 'a4 c5 e5 eb5 - -'
					},
					{
						sax: 'e5 eb5 c5 a4 - -'
					},
					{
						sax: 'g5 b5 g5 b5 g5 -'
					},
					{
						sax: '- - e4 g4 d4 -'
					},
					{
						sax: 'a4 - - - e4 a4'
					},
					{
						sax: 'a4 c5 d5 c5 e5 -'
					},
					{
						sax: 'a4 c5 d5 c5 a5 -'
					},
					{
						sax: '- - e5 eb5 e5 c5'
					},
					{
						sax: 'e5 f5 e5 - e5 f5'
					},
					{
						sax: 'a4 g4 a4 c5 d5 c5'
					},
					{
						sax: 'g4 a4 c5 g4 a4 -'
					},
					{
						sax: 'a4 b4 c5 d5 b4 -'
					},
					{
						sax: 'g4 a4 - - g4 a4'
					},
					{
						sax: 'g5 - - - f5 e5'
					},
					{
						sax: 'g5 - - - - -'
					},
					{
						sax: ' - f5 e5 g5 f5 e5'
					},
					{
						sax: 'e5 - - - - -'
					},
					{
						sax: 'a5 g5 e5 d5 c5 a4'
					},
					{
						sax: 'a5 g5 e5 eb5 - -'
					},
					{
						sax: 'c5 - - - - -'
					},
					{
						sax: 'b5 - - - - -'
					},
					{
						sax: 'd5 - - - - -'
					},
					{
						sax: 'eb5 - - - g5 e5'
					},
					{
						sax: 'g4 - - - b4 g4'
					},
					{
						sax: 'd5 e5 f5 e5 f5 g5'
					},
					{
						sax: '- - - - c5 b4'
					},
					{
						sax: '- - - - - g4'
					},
				];

			

			default:
				return [
					{
						sax: 'a4 - - a5 - -'
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
