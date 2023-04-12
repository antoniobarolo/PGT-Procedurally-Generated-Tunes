class Forro extends Style {
	constructor() {
		super(StyleName.Forro, 240);
	}

	protected generateHarmony(sessionType: SessionType): InstrumentSet[] {
		switch (sessionType) {
			case SessionType.Intro:
				return [
					{
						funkybass: 'a3 - b3 - ',
						accordion: 'd4 - g4 - ',
						xylo: 'f5 - g5 - ',
					},
					{
						funkybass: 'd3 f4 e3 f4 ',
						accordion: 'd4 - g4 - ',
					},
					{
						funkybass: 'd3 f4 e3 f4 ',
						accordion: 'd4 - b4 a4',
					}
				];

			case SessionType.Ponte:
				return [
					{
						funkybass: 'd3 c4',
						accordion: 'd4 - ',
					},
					{
						funkybass: 'd3 f4 e3 f4 d3 f4 e3 f4',
						accordion: 'f4 - - - g4 - - -',
					},
					{
						funkybass: 'a2 - - - ',
						accordion: 'a4 - - -',
					}
				];

			case SessionType.Verso:
				return [
					{
						funkybass: 'a3 - b3 - ',
						accordion: 'd4 - g4 - ',
						xylo: 'f5 - g5 - ',
					},
					{
						funkybass: 'd3 f4 e3 f4 ',
						accordion: 'd4 - g4 - ',
					},
					{
						funkybass: 'd3 f4 e3 f4 ',
						accordion: 'd4 - b4 a4',
					}
				];

			default:
				return [
					{
						funkybass: "d3 - - a2"
					},
				];
		}
	}

	protected generateRhythm(sessionType: SessionType): InstrumentSet[] {
		switch (sessionType) {
			case SessionType.Intro:
				return [
					{
						zabumba: "k1 - s k2 - - - k1",
						triangle: "1 2 3 2 1 2 3 2"
					},
				];

			case SessionType.Ponte:
				return [
					{
						zabumba: "k1 - s k2 - - - k1",
						triangle: "1 2 3 2 1 2 3 2"
					},
					{
						zabumba: "k1 - s k2 - - - k1",
					},
					{
						zabumba: "k1 - - - - - - k1",
					},
				];

			case SessionType.Verso:
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

	protected generateMelody(sessionType: SessionType): InstrumentSet[] {
		switch (sessionType) {
			case SessionType.Intro:
				return [
					{
						accordion: "d5 f5 e5 d5"
					},
					{
						accordion: "b5 - a5"
					},
				];

			case SessionType.Ponte:
				return [
					{
						accordion: "c5 - f5 e5"
					},
					{
						accordion: "d5 - b4 c4"
					},
				];

			case SessionType.Verso:
				return [
					{
						accordion: "d5 f5 e5 d5"
					},
					{
						accordion: "b5 - a5"
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
						accordion: "b5 - a5"
					},
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
