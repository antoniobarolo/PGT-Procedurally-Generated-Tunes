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
const Phrygian = [0, 1, 3, 5, 7, 8, 10]
const Dorian = [0, 2, 3, 5, 7, 9, 10]
const Major = [0, 2, 4, 5, 7, 9, 11]
const Lydian = [0, 2, 4, 6, 7, 9, 11]
const Mixolydian = [0, 2, 4, 5, 7, 9, 10]
