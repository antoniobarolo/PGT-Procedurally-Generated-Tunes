class Funk extends Style {
	constructor() {
		super(StyleName.Funk, 135, 4/16);
	}

	protected generateHarmony(sectionType: SectionType): InstrumentSet[] {
		switch (sectionType) {
			case SectionType.Intro:
				return [
					{
						bass: '- - - -'
					},
				];

			default:
				return [
					{

					},
				];
		}
	}

	protected generateRhythm(sectionType: SectionType): InstrumentSet[] {
		switch (sectionType) {
			case SectionType.Intro:
				return [{
					dark_kick: '1 - - - 1 - - - 1 - - - 1 - - -',
				},
				{
					dark_kick: '1 - - - - - - - - - - - - - - -',
				},
				{
					dark_kick: '- - - - - - - - - - - - - - - -',
				},
				{
					dark_kick: '1 - 1 - 1 - 1 - 1 1 1 1 1 1 1 1',
				},
				{
					dark_kick: '1 - - - - - - - - - - - - - 1 1',
				},
				];

			default:
				return [
					{}
				];
		}
	}

	protected generateMelody(sectionType: SectionType): InstrumentSet[] {
		switch (sectionType) {
			case SectionType.Intro:
				return [
					{
						stab: 'c3 - - c3 - - c3 - - - d3 - d3 - - -'
					},
					{
						stab: 'c3 - - c3 - - c3 - - - d3 - b2 - - -'
					},
					{
						stab: 'c4 - - g4 - - a4 - - - d4 - b3 - - -'
					},
					{
						stab: 'c4 a2 - g4 a2 - a4 a2 a2 - d4 - b3 - - -'
					},
					{
						stab: 'c3 - - b2 - - c3 - - - b2 - a2 - - -'
					},
					{
						stab: 'c3 - - c3 - - c3 - - - c#3 - c#3 - - -'
					},
				];



			default:
				return [
					{

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
