interface InstrumentSet { [instrumentName: string]: string }

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

interface Sample {
	index: number;
	path: string;
	color: string;
	buffer: AudioBuffer;
}