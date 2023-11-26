interface SheetGenerator {
	generate(styleName?: StyleName, measureCategory?: MeasureCategory, progressionIndex?: number, progressionCount?: number, measureIndex?: number, measureCount?: number): string;
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