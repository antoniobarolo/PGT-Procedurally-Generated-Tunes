class Samba extends Style {
	constructor() {
		super(StyleName.Samba, 144, 4 / 16);
	}

	protected generateHarmony(sectionType: SectionType): InstrumentSet[] {
		switch (sectionType) {
			case SectionType.Intro:
				return [
					{
						bass: '-'
					},
				];
			case SectionType.Verso:
				return [
					{
						bass: '-'
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

					tamborim: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
					ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
					caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
					surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
					surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
					surdo3: '- 3 3 3 - - - - - - 4 3 3 2 2 1',
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

					tamborim: '- - - - - - - - - 1 2 3 1 2 3 4',
					ganza: '- - - - - - 1 2 3 4 1 - - - - - -',
					caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
					surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
					surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
					surdo3: '- 2 - 1 - 3 3 2 1 - - 4 4 3 3 -',
				},
				{

					tamborim: '- 1 - 1 - - 1 - 1 - 1 - 1 - - -',
					ganza: '- - - - - - - - - - - - 1 2 3 4',
					caixa: '- - 16 - - - 16 - - - 16 - - - 16 - ',
					surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
					surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
					surdo3: '4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4',
				},
				{
					tamborim: '1 2 3 4 1 - 1 - 1 - - - - - - -',
					ganza: '1 2 3 4 1 - 1 - 1 - 1 2 1 - 1 -',
					caixa: '1 2 3 4 1 - 5 - 9 - - - - - - -',
					surdo1: '1 - - 2 - - - - - - - - - - - -',
					surdo2: '2 - - 1 - - - - - - - - - - - -',
					surdo3: '- - - - - - - - - - 3 - 3 - 3 -',
				},
				{
					tamborim: '1 - - 1 - - 1 - - - 1 - 1 - - -',
					ganza: '1 - - 1 - - 1 - 1 2 3 4 1 2 3 4',
					caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
					surdo1: '1 - - 1 - - 1 - - - 1 - 1 - - -',
					surdo2: '1 - - 1 - - 1 - - - 1 - 1 - - -',
					surdo3: '1 - - 1 - - 1 - - - 1 - 1 3 2 1',
				}

				];
			case SectionType.Verso:
				return [{
					tamborim: generateMeasureRhythm(16),
					ganza: generateMeasureRhythm(16),
					caixa: generateMeasureRhythm(16),
					surdo1: generateMeasureRhythm(16),
					surdo2: generateMeasureRhythm(16),
					surdo3: generateMeasureRhythm(16)
				},
				{
					tamborim: generateMeasureRhythm(4) + ' - - - - ' + generateMeasureRhythm(8),
					ganza: '- - - - ' + generateMeasureRhythm(12),
					caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
					surdo1: '1 - - 1 - - 1 - - - 1 - 1 - - -',
					surdo2: '1 - - 1 - - 1 - - - 1 - 1 - - -',
					surdo3: generateMeasureRhythm(16)
				},
				{
					surdo1: generateMeasureRhythm(16),
					surdo2: generateMeasureRhythm(16),
					surdo3: generateMeasureRhythm(16)
				},
				{
					tamborim: generateMeasureRhythm(32),
				},

				];

			default:
				return [
					{
						tamborim: '1 - 2 - 3 - 4 - ',
						ganza: '1 - 2 - 3 - 4 - ',
						caixa: '1 - 2 - 3 - 4 - ',
						surdo1: '1 - - - 1 - - -',
						surdo2: '- - 1 - - - 1 -',
					},
				];
		}
	}

	protected generateMelody(sectionType: SectionType): InstrumentSet[] {
		switch (sectionType) {
			case SectionType.Intro:
				return [{
					stab: '-'
				}];
			case SectionType.Verso:
				return [{
					stab: '-'
				}];


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
		return 16;
	}
}
