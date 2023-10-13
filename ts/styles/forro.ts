class Forro extends Style {
	constructor() {
		super(StyleName.Forro, 115, 4/16);
	}

	protected generateHarmony(sectionType: SectionType): InstrumentSet[] {
		switch (sectionType) {
			case SectionType.Intro:
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
					}
				];

			case SectionType.Ponte:
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
					}
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
		switch (sectionType) {
			case SectionType.Intro:
				return [
					{
						zabumba: "k1 - s k2 - - - k1",
						triangle: "1 2 3 2 1 2 3 2"
					},
				];

			case SectionType.Ponte:
				return [
					{
						zabumba: "k1 - s k2 - - - k1",
					},
					{
						zabumba: "k1 - s k2 - - - k1",
					},
					{
						zabumba: "k1 - - - - - - k1",
					},
				];

			case SectionType.Verso:
				return [
					{
						zabumba: "k1 - s k2 - - - k1",
						triangle: "1 2 3 2 1 2 3 2"
					},
					{
						zabumba: "k1 - s k2 - - - k1",
					},
				];

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
		switch (sectionType) {
			case SectionType.Intro:
				return [
					{
						accordion: "d5 f5 e5 d5 a5 g5 f5 g5"
					},
					{
						accordion: "b4 - a4 - d4 d4 d4 d4"
					},
					{
						accordion: "d5 b4 c5 a4 b4 f4 a4 f4"
					},
					{
						accordion: "b4 b4 a5 a5"
					},
					{
						accordion: "d5 d4 d4 d5 d4 d4 b4 c4"
					},
					{
						accordion: "d4 - - - c5 a4 b4 - "
					},
					{
						accordion: "a5 - f5 - a4 - d5 - "
					},
					{
						accordion: "d5 - a4 - d5 - a4 - "
					},
					{
						accordion: "d5 - - a4 d5 - - a4 "
					},
					{
						accordion: "- - d5 d5 d5 d5 d5 e5"
					},
					{
						accordion: 'f5 f5 f5 f5 e5 d5 d5 d5'
					},
					{
						accordion: 'd5 - - c5 e5 - c5 - '
					},
					{
						accordion: 'f5 - g5 - a5 - - - '
					},
					{
						accordion: 'g5 - - - f5 - - - '
					},
					{
						accordion: 'c5 b4 - - a4 g4 f4 - '
					},
					{
						accordion: 'f4 - a4 - c5 - a4 g4'
					},
					{
						accordion: 'f4 - a4 - c5 - a4 g4'
					},
					{
						accordion: 'f4 - g4 - a4 - c5 - '
					},
					{
						accordion: 'g5 - - f5 a5 g5 - -'
					},
					{
						accordion: 'f5 a5 g5 - - f5 e5'
					},
					{
						accordion: 'g5 f5 e5 d5 c5 e5 d5 -'
					},
					{
						accordion: 'd5 c5 b4 a4 f4 a4 g4 -'
					},
					{
						accordion: 'g5 - - a5 g5 -- f5'
					},
					{
						accordion: 'g5 - - d5 g5 g5 d5 g5'
					},
					{
						accordion: 'f5 g5 a5 - - - g5 -'
					},
				];

			case SectionType.Ponte:
				return [
					{
						accordion: "c5 - - f5"
					},
					{
						accordion: "d5 - - c5"
					},
					{
						accordion: "c5 c5 c5 d5"
					},
					{
						accordion: "f5 e5 e5 d5"
					},
					{
						accordion: "d5 a5 a5 a5"
					},
				];

			case SectionType.Verso:
				return [
					{
						accordion: "d5 f5 e5 d5"
					},
					{
						accordion: "c5 - b4"
					},
					{
						accordion: "d5 - - d5"
					},
					{
						accordion: "a5 g5 f5 e5"
					},
					{
						accordion: "d5 e5 f5 g5"
					},
					{
						accordion: "f5 - g5"
					},
					{
						accordion: "g5 - f5"
					},
					{
						accordion: "d5 - c5 e5"
					},
					{
						accordion: "- - d5 e5"
					},
				];

			default:
				return [
					{
						accordion: "d5 f5 e5 d5"
					},
					{
						accordion: "b4 - a4"
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
