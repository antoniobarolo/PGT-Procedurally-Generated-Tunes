enum StyleName {
	Forro = 0,
	Jazz = 1,
	Rock = 2
}

enum MeasureCategory {
	Harmony = 0,
	Rhythm = 1,
	Melody = 2
}

enum SectionType {
	Intro = 0,
	Refrao = 1,
	Ponte = 2,
	Verso = 3
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

// Enum para representar as notas musicais
enum Note {
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D',
	E = 'E',
	F = 'F',
	G = 'G',
}


class Instrument {
	centerOctave?: number;
	notes: Sample[];
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

const ExampleInstrument = {
	centerOctave: 4,
	samples: ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
		'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
		'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
		'C6']
}

const sheet = [1, -7, 1, 3, 1, 0, 8, 0];

function parseNumbers(sheet: number[], Instrument, scale, rootNote: number): string[] {
	sheet = sheet.map((note) => {
		if (note == 0)
			return undefined
		if (note < 0) {
			note = Math.abs(note)
			note = scale[note - 1]
			return note - 12 + rootNote
		}
		if (note > scale.length) {
			note = scale[note - scale.length - 1]
			return note + 12 + rootNote
		}
		return scale[note - 1] + rootNote
	})
	const parsedSheet = sheet.map((noteNumber) => {
		if (noteNumber === undefined)
			return "-"
		let octaveShift = 0
		while (noteNumber < 0) {
			noteNumber = noteNumber + noteNames.length
			octaveShift--;
		}
		while (noteNumber >= noteNames.length) {
			noteNumber = noteNumber - noteNames.length
			octaveShift++;
		}
		return noteNames[noteNumber] + (Instrument.centerOctave + octaveShift)
	})
	return parsedSheet
}

parseNumbers(sheet, ExampleInstrument, Minor, 0)