"use strict";
//Diagrama de classes
var StyleName;
(function (StyleName) {
	StyleName[StyleName["Forro"] = 0] = "Forro";
	StyleName[StyleName["Pop"] = 1] = "Pop";
	StyleName[StyleName["Rock"] = 2] = "Rock";
})(StyleName || (StyleName = {}));
var MeasureCategory;
(function (MeasureCategory) {
	MeasureCategory[MeasureCategory["Harmony"] = 0] = "Harmony";
	MeasureCategory[MeasureCategory["Rhythm"] = 1] = "Rhythm";
	MeasureCategory[MeasureCategory["Melody"] = 2] = "Melody";
})(MeasureCategory || (MeasureCategory = {}));
var SessionType;
(function (SessionType) {
	SessionType[SessionType["Intro"] = 0] = "Intro";
	SessionType[SessionType["Refrao"] = 1] = "Refrao";
	SessionType[SessionType["Ponte"] = 2] = "Ponte";
	SessionType[SessionType["Verso"] = 3] = "Verso";
})(SessionType || (SessionType = {}));
class Style {
	constructor(name) {
		this.name = name;
		this.harmony = new Map();
		this.rhythm = new Map();
		this.melody = new Map();
		this.harmony.set(SessionType.Intro, this.generateHarmony(SessionType.Intro));
		this.harmony.set(SessionType.Ponte, this.generateHarmony(SessionType.Ponte));
		this.harmony.set(SessionType.Refrao, this.generateHarmony(SessionType.Refrao));
		this.harmony.set(SessionType.Verso, this.generateHarmony(SessionType.Verso));
		this.rhythm.set(SessionType.Intro, this.generateRhythm(SessionType.Intro));
		this.rhythm.set(SessionType.Ponte, this.generateRhythm(SessionType.Ponte));
		this.rhythm.set(SessionType.Refrao, this.generateRhythm(SessionType.Refrao));
		this.rhythm.set(SessionType.Verso, this.generateRhythm(SessionType.Verso));
		this.melody.set(SessionType.Intro, this.generateMelody(SessionType.Intro));
		this.melody.set(SessionType.Ponte, this.generateMelody(SessionType.Ponte));
		this.melody.set(SessionType.Refrao, this.generateMelody(SessionType.Refrao));
		this.melody.set(SessionType.Verso, this.generateMelody(SessionType.Verso));
	}
	static pickInstrumentSet(instrumentSet) {
		// Math.trunc(Math.random() * 4)
		// Saída 0 - Entrada 0 ... 0.99999999... (25%)
		// Saída 1 - Entrada 1 ... 1.99999999... (25%)
		// Saída 2 - Entrada 2 ... 2.99999999... (25%)
		// Saída 3 - Entrada 3 ... 3.99999999... (25%)
		//
		// Math.trunc(Math.random() * 4000) % 4
		// Saída 0 - 0, 4, 8, 12, 16 ... 3996
		// Saída 1 - 1, 5, 9, 13, 17 ... 3997
		// Saída 2 - 2, 6, 10, 14, 18 ... 3998
		// Saída 3 - 3, 7, 11, 15, 19 ... 3999
		const i = Math.trunc(Math.random() * instrumentSet.length * 1000) % instrumentSet.length;
		return instrumentSet[i];
	}
	static parseSheet(sheet, sheetPadding) {
		// "dm7 xyz8 a1 b3 c2c4c5"
		const count = sheet.length;
		const notes = new Array(sheetPadding);
		for (let i = notes.length - 1; i >= 0; i--)
			notes[i] = null;
		for (let i = 0; i < count; i++) {
			let char = sheet.charAt(i);
			if (char === ' ' || char === '\t')
				continue;
			if (char === '-') {
				notes.push(null);
				continue;
			}
			let note = char;
			i++;
			while (i < count) {
				char = sheet.charAt(i);
				i++;
				if (char === ' ' || char === '\t')
					break;
				note += char;
			}
			notes.push(note.toLowerCase());
		}
		return notes;
	}
	generateSession(sessionType) {
		const progressions = [];
		const progressionCount = this.getNextProgressionCount(sessionType);
		for (let progression = 0; progression < progressionCount; progression++) {
			const sequences = [];
			const instrumentSetArray = this.harmony.get(sessionType);
			if (!instrumentSetArray)
				throw new Error("instrumentSetArray is null");
			const harmonyInstrumentSet = Style.pickInstrumentSet(instrumentSetArray);
			let maxHarmonySheet = 0;
			for (let instrumentName in harmonyInstrumentSet) {
				let sheet = harmonyInstrumentSet[instrumentName];
				if (typeof sheet !== "string")
					sheet = sheet.generate(this.name, MeasureCategory.Harmony, progression, progressionCount, 0, 1);
				const parsedSheet = Style.parseSheet(sheet, 0);
				if (maxHarmonySheet < parsedSheet.length)
					maxHarmonySheet = parsedSheet.length;
				sequences.push({
					instrumentName,
					sheet: parsedSheet
				});
			}
			for (let i = 0; i < sequences.length; i++) {
				const sequenceSheet = sequences[i].sheet;
				while (sequenceSheet.length < maxHarmonySheet)
					sequenceSheet.push(null);
			}
			// A partir daqui, todos os sheets de harmonia têm a mesma quantidade de notas
			const measureCount = maxHarmonySheet;
			const harmonySequenceCount = sequences.length;
			let sheetPadding = 0;
			for (let measure = 0; measure < measureCount; measure++) {
				let maxMeasureSheet = 0;
				let instrumentSetArray = this.rhythm.get(sessionType);
				if (!instrumentSetArray)
					throw new Error("instrumentSetArray is null");
				const rhythmInstrumentSet = Style.pickInstrumentSet(instrumentSetArray);
				for (let instrumentName in rhythmInstrumentSet) {
					let sheet = rhythmInstrumentSet[instrumentName];
					if (typeof sheet !== "string")
						sheet = sheet.generate(this.name, MeasureCategory.Rhythm, progression, progressionCount, measure, measureCount);
					const parsedSheet = Style.parseSheet(sheet, sheetPadding);
					if (maxMeasureSheet < parsedSheet.length)
						maxMeasureSheet = parsedSheet.length;
					sequences.push({
						instrumentName,
						sheet: parsedSheet
					});
				}
				instrumentSetArray = this.melody.get(sessionType);
				if (!instrumentSetArray)
					throw new Error("instrumentSetArray is null");
				const melodyInstrumentSet = Style.pickInstrumentSet(instrumentSetArray);
				for (let instrumentName in melodyInstrumentSet) {
					let sheet = melodyInstrumentSet[instrumentName];
					if (typeof sheet !== "string")
						sheet = sheet.generate(this.name, MeasureCategory.Melody, progression, progressionCount, measure, measureCount);
					const parsedSheet = Style.parseSheet(sheet, sheetPadding);
					if (maxMeasureSheet < parsedSheet.length)
						maxMeasureSheet = parsedSheet.length;
					sequences.push({
						instrumentName,
						sheet: parsedSheet
					});
				}
				if (measure < (measureCount - 1) && maxMeasureSheet > 1) {
					const paddingArray = new Array(maxMeasureSheet - 1);
					for (let i = paddingArray.length - 1; i >= 0; i--)
						paddingArray[i] = null;
					// Insere elementos dentro do array da harmonia
					for (let i = 0; i < harmonySequenceCount; i++)
						sequences[i].sheet.splice(sheetPadding + 1, 0, ...paddingArray);
					sheetPadding += maxMeasureSheet;
				}
			}
			progressions.push({
				sequences
			});
		}
		return {
			type: sessionType,
			progressions
		};
	}
}
class Forro extends Style {
	constructor() {
		super(StyleName.Forro);
	}
	generateHarmony(sessionType) {
		switch (sessionType) {
			case SessionType.Intro:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
			case SessionType.Ponte:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
			case SessionType.Verso:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
			default:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
		}
	}
	generateRhythm(sessionType) {
		switch (sessionType) {
			case SessionType.Intro:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
			case SessionType.Ponte:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
			case SessionType.Verso:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
			default:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
		}
	}
	generateMelody(sessionType) {
		switch (sessionType) {
			case SessionType.Intro:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
			case SessionType.Ponte:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
			case SessionType.Verso:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
			default:
				return [
					{
						xylo: "a b c"
					},
					{
						xylo: "d e f"
					},
					{
						xylo: "g a b a",
						funkybass: "d e f a"
					}
				];
		}
	}
	getNextProgressionCount(sessionType) {
		return 4;
	}
	getNextMeasureCount(sessionType, progressionIndex, progressionCount) {
		return 4;
	}
}
class Player {
	constructor() {
		this.nextGrooveTime = -1;
	}
	playSample(sample, time) {
		const source = ctx.createBufferSource();
		source.buffer = sample;
		source.connect(ctx.destination);
		source.start(time);
	}
	playGroove(groove) {
		const currentTime = ctx.currentTime;
		const startTime = ((this.nextGrooveTime < currentTime) ? currentTime : this.nextGrooveTime);
		this.nextGrooveTime = startTime + groove.duration;
		groove.play(this, startTime);
	}
}
class SampleSet {
	static async loadSample(path) {
		const response = await fetch('samples/' + path + '.wav');
		const arrayBuffer = await response.arrayBuffer();
		const decodedAudio = await ctx.decodeAudioData(arrayBuffer);
		SampleSet.samples.set(path, decodedAudio);
	}
	static async loadSamples() {
		const promises = new Array(SampleSet.samplePaths.length);
		for (let i = 0; i < SampleSet.samplePaths.length; i++)
			promises[i] = SampleSet.loadSample(SampleSet.samplePaths[i]);
		await Promise.all(promises);
	}
	static getSample(name) {
		return SampleSet.samples.get(name);
	}
}
SampleSet.samplePaths = ['kick', 'snare', 'hihat',
	'xylo_a4', 'xylo_c5', 'xylo_d5', 'xylo_e5', 'xylo_g5', 'xylo_a5',
	'funkybass_a2', 'funkybass_b2', 'funkybass_c3', 'funkybass_d3', 'funkybass_e3', 'funkybass_f3', 'funkybass_g3',
	'funkybass_a3', 'funkybass_b3', 'funkybass_c4', 'funkybass_d4', 'funkybass_e4', 'funkybass_f4', 'funkybass_g4', 'funkybass_a4',
];
SampleSet.samples = new Map();
class Groove {
	constructor(bpm, notes) {
		this.bpm = bpm;
		// Assuming 120 BPM (120 = 0.5)
		this.beatDuration = 30 / bpm;
		this.tracks = [];
		let maxLength = 0;
		for (let note in notes) {
			const sample = SampleSet.getSample(note);
			if (!sample)
				throw new Error("Unknown sample: " + note);
			const sheet = notes[note];
			if (maxLength < sheet.length)
				maxLength = sheet.length;
			this.tracks.push({
				sampleName: note,
				sample,
				sheet
			});
		}
		this.duration = this.beatDuration * maxLength;
	}
	play(player, startTime) {
		for (let i = 0; i < this.tracks.length; i++) {
			const track = this.tracks[i];
			for (let j = 0; j < track.sheet.length; j++) {
				if (track.sheet[j] == '1')
					player.playSample(track.sample, startTime + (j * this.beatDuration));
			}
		}
	}
}
const ctx = new AudioContext();
const player = new Player();
let forro, rock, powermetal, xylo1, xylo2, xylo3, xylo4;
async function setup() {
	try {
		await SampleSet.loadSamples();
	}
	catch (ex) {
		console.error("Error loading the samples: " + (ex.message || ex));
		return;
	}
	forro = new Groove(190, {
		kick: '10010001',
		snare: '00010010',
		hihat: '10011101'
	});
	rock = new Groove(190, {
		kick: '10001000',
		snare: '00100010',
		hihat: '11111111'
	});
	powermetal = new Groove(380, {
		kick: '10001100',
		snare: '00100010',
		hihat: '10001000'
	});
	xylo1 = new Groove(200, {
		kick: '1010101010101111',
		xylo_a4: '1011011010110000',
		xylo_e5: '0000000000001010'
	});
	xylo2 = new Groove(200, {
		kick: '1010101010101111',
		xylo_a4: '0001000010110010',
		xylo_c5: '0010000010001101',
		xylo_e5: '1100001010110000'
	});
	xylo3 = new Groove(200, {
		kick: '1000000010010010',
		xylo_a4: '1000000010010010',
		xylo_c5: '0000000000000010',
		xylo_e5: '0000100000010000',
		xylo_a5: '0000000010000000'
	});
	xylo4 = new Groove(200, {
		kick: '1111011111110111',
		hihat: '1000100010001010',
		xylo_c5: '100100100000101',
		xylo_e5: '000000001001010'
	});
}
function xyloSong() {
	player.playGroove(xylo1);
	player.playGroove(xylo1);
	player.playGroove(xylo2);
	player.playGroove(xylo2);
	player.playGroove(xylo1);
	player.playGroove(xylo1);
	player.playGroove(xylo1);
	player.playGroove(xylo3);
	player.playGroove(xylo4);
	player.playGroove(xylo4);
	player.playGroove(xylo4);
	player.playGroove(xylo1);
	player.playGroove(xylo4);
	player.playGroove(xylo4);
	player.playGroove(xylo4);
	player.playGroove(xylo1);
}
function rngGroove() {
	let length = 32;
	function roll() {
		return (Math.floor(Math.random() * Math.pow(2, 8)) >>> 0).toString(2);
	}
	let groove = new Groove(200, {
		kick: roll(),
		hihat: roll(),
		snare: roll(),
		xylo_a4: roll(),
		xylo_c5: roll(),
		xylo_e5: roll(),
		xylo_g5: roll(),
		xylo_a5: roll(),
	});
	console.log(groove);
	return groove;
}
function makeSong() {
	let a = rngGroove();
	let b = rngGroove();
	let c = rngGroove();
	for (let i = 0; i < 4; i++) {
		player.playGroove(a);
	}
	for (let i = 0; i < 4; i++) {
		player.playGroove(b);
	}
	for (let i = 0; i < 2; i++) {
		player.playGroove(a);
	}
	for (let i = 0; i < 2; i++) {
		player.playGroove(b);
	}
	for (let i = 0; i < 4; i++) {
		player.playGroove(c);
	}
	for (let i = 0; i < 4; i++) {
		player.playGroove(b);
	}
}
setup();
const forr = new Forro();
const teste = forr.generateSession(SessionType.Intro);
debugger;
