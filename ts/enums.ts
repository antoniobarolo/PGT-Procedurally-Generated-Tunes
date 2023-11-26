enum StyleName {
	Forro = 0,
	Jazz = 1,
	Samba = 2,
	Funk = 3
}

enum MeasureCategory {
	Harmony = 0,
	Rhythm = 1,
	Melody = 2
}

enum SectionType {
	Intro = 'Intro',
	Refrao = 'Refrao',
	Ponte = 'Ponte',
	Verso = 'Verso',
}

enum ScaleDegree {
	Root = 1,
	Second,
	Third,
	Fourth,
	Fifth,
	Sixth,
	Seventh,
	Silence = 0,
}

interface Sample {
	index: number;
	path: string;
	color: string;
	buffer: AudioBuffer;
}

enum NoteNumber {
	'A' = 0,
	'A#' = 1,
	'B' = 2,
	'C' = 3,
	'C#' = 4,
	'D' = 5,
	'D#' = 6,
	'E' = 7,
	'F' = 8,
	'F#' = 9,
	'G' = 10,
	'G#' = 11,
}

const noteNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

const Minor = [0, 2, 3, 5, 7, 8, 10]
const Dorian = [0, 2, 3, 5, 7, 9, 10]
const Major = [0, 2, 4, 5, 7, 9, 11]
const Lydian = [0, 2, 4, 6, 7, 9, 11]
const Mixolydian = [0, 2, 4, 5, 7, 9, 10]

// const ExampleInstrument = {
// 	centerOctave: 4,
// 	samples: ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
// 		'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
// 		'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
// 		'C6']
// }

// const exampleSheet = [1, -7, 1, 3, 1, 0, 8, 0];

//const parsedSheet = parseNumbers(exampleSheet, ExampleInstrument, Minor, 0)