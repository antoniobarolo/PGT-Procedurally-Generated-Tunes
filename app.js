var StyleName;
(function (StyleName) {
    StyleName[StyleName["Forro"] = 0] = "Forro";
    StyleName[StyleName["Jazz"] = 1] = "Jazz";
    StyleName[StyleName["Samba"] = 2] = "Samba";
    StyleName[StyleName["Funk"] = 3] = "Funk";
})(StyleName || (StyleName = {}));
var MeasureCategory;
(function (MeasureCategory) {
    MeasureCategory[MeasureCategory["Harmony"] = 0] = "Harmony";
    MeasureCategory[MeasureCategory["Rhythm"] = 1] = "Rhythm";
    MeasureCategory[MeasureCategory["Melody"] = 2] = "Melody";
})(MeasureCategory || (MeasureCategory = {}));
var SectionType;
(function (SectionType) {
    SectionType["Intro"] = "Intro";
    SectionType["Refrao"] = "Refrao";
    SectionType["Ponte"] = "Ponte";
    SectionType["Verso"] = "Verso";
})(SectionType || (SectionType = {}));
var NoteNumber;
(function (NoteNumber) {
    NoteNumber[NoteNumber["A"] = 0] = "A";
    NoteNumber[NoteNumber["A#"] = 1] = "A#";
    NoteNumber[NoteNumber["B"] = 2] = "B";
    NoteNumber[NoteNumber["C"] = 3] = "C";
    NoteNumber[NoteNumber["C#"] = 4] = "C#";
    NoteNumber[NoteNumber["D"] = 5] = "D";
    NoteNumber[NoteNumber["D#"] = 6] = "D#";
    NoteNumber[NoteNumber["E"] = 7] = "E";
    NoteNumber[NoteNumber["F"] = 8] = "F";
    NoteNumber[NoteNumber["F#"] = 9] = "F#";
    NoteNumber[NoteNumber["G"] = 10] = "G";
    NoteNumber[NoteNumber["G#"] = 11] = "G#";
})(NoteNumber || (NoteNumber = {}));
const noteNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const Minor = [0, 2, 3, 5, 7, 8, 10];
const Dorian = [0, 2, 3, 5, 7, 9, 10];
const Major = [0, 2, 4, 5, 7, 9, 11];
const Lydian = [0, 2, 4, 6, 7, 9, 11];
const Mixolydian = [0, 2, 4, 5, 7, 9, 10];
function roll(size) {
    return Math.floor(Math.random() * size) + 1;
}
function findInstrumentWithLowestOctave(instrumentSet) {
    let minInstrument = null;
    let minOctave = Infinity;
    for (const instrumentName in instrumentSet) {
        if (instrumentSet.hasOwnProperty(instrumentName)) {
            const instrument = SampleSet.getInstrumentByName(instrumentName);
            if (instrument && instrument.centerOctave < minOctave) {
                minOctave = instrument.centerOctave;
                minInstrument = instrumentName;
            }
        }
    }
    if (minInstrument !== null) {
        return instrumentSet[minInstrument];
    }
    else {
        return null;
    }
}
function getNoteFromNumber(noteNumber) {
    const noteEntries = Object.entries(NoteNumber);
    for (const [note, value] of noteEntries) {
        if (value === noteNumber) {
            return note;
        }
    }
    return undefined;
}
function adjustMelodyToChordNote(instrumentSet, chord) {
    if (!chord)
        return instrumentSet;
    const chordNote = chord.slice(0, -1);
    const chordNoteNumber = NoteNumber[chordNote];
    const possibleIntervals = [0, 0, 0, 3, 4, 7, 7, 10, 12, 12, 14];
    const newNote = getNoteFromNumber(chordNoteNumber + possibleIntervals[roll(possibleIntervals.length - 1)]);
    if (!newNote)
        return instrumentSet;
    for (const instrumentName in instrumentSet) {
        const notes = parseSheet(instrumentSet[instrumentName], 0);
        if (!!notes[0])
            notes[0] = newNote + SampleSet.getInstrumentByName(instrumentName).centerOctave;
        instrumentSet[instrumentName] = notes.join(' ');
    }
    return instrumentSet;
}
class Section {
    constructor(type, progressions, bpm, noteDuration) {
        this.bpm = bpm;
        this.noteDuration = noteDuration / bpm * 60;
        this.type = type;
        this.progressions = progressions;
        this.maxSheetLength = new Array(progressions.length);
        let totalSheetLength = 0;
        for (let p = progressions.length - 1; p >= 0; p--) {
            let maxSheetLength = 0;
            const sequences = progressions[p].sequences;
            for (let s = sequences.length - 1; s >= 0; s--) {
                const sheet = sequences[s].sheet;
                for (let i = sheet.length - 1; i >= 0; i--) {
                    i++;
                    if (maxSheetLength < i)
                        maxSheetLength = i;
                    break;
                }
            }
            totalSheetLength += maxSheetLength;
            this.maxSheetLength[p] = maxSheetLength;
        }
        this.duration = this.noteDuration * totalSheetLength;
    }
    play(player, startTime) {
        const noteDuration = this.noteDuration;
        const progressions = this.progressions;
        const maxSheetLength = this.maxSheetLength;
        let totalSheetLength = 0;
        for (let p = 0; p < progressions.length; p++) {
            //progressions[0] p repetir ou progressions[p] pra nao
            const currentProgression = roll(8) > 5 ? p : 0;
            const sequences = progressions[currentProgression].sequences;
            for (let s = 0; s < sequences.length; s++) {
                const sequence = sequences[s];
                const instrumentNamePrefix = sequence.instrumentName;
                const sheet = sequence.sheet;
                for (let i = 0; i < sheet.length; i++) {
                    if (sheet[i]) {
                        const sampleName = instrumentNamePrefix + "/" + sheet[i];
                        let sample = SampleSet.getSample(sampleName);
                        if (!sample) {
                            const instrument = SampleSet.getInstrumentByName(instrumentNamePrefix);
                            if ((instrument === null || instrument === void 0 ? void 0 : instrument.role) !== MeasureCategory.Rhythm) {
                                let secondChanceSampleName = sampleName;
                                try {
                                    secondChanceSampleName = sampleName.slice(0, -1) + instrument.centerOctave;
                                }
                                catch (_a) {
                                    throw new Error('BadInstrumentName: ' + instrument);
                                }
                                sample = SampleSet.getSample(secondChanceSampleName);
                                if (!sample)
                                    throw new Error("Missing sample on second chance: " + secondChanceSampleName);
                            }
                            if (!sample)
                                throw new Error("Missing sample: " + sampleName);
                        }
                        player.playSample(sample, startTime + ((totalSheetLength + i) * noteDuration));
                    }
                }
            }
            totalSheetLength += maxSheetLength[p];
        }
    }
}
class Style {
    constructor(name, defaultBpm, defaultNoteDuration) {
        this.name = name;
        this.defaultBpm = defaultBpm;
        this.defaultNoteDuration = defaultNoteDuration;
        this.harmony = new Map();
        this.rhythm = new Map();
        this.melody = new Map();
        this.harmony.set(SectionType.Intro, this.generateHarmony(SectionType.Intro));
        this.harmony.set(SectionType.Ponte, this.generateHarmony(SectionType.Ponte));
        this.harmony.set(SectionType.Refrao, this.generateHarmony(SectionType.Refrao));
        this.harmony.set(SectionType.Verso, this.generateHarmony(SectionType.Verso));
        this.rhythm.set(SectionType.Intro, this.generateRhythm(SectionType.Intro));
        this.rhythm.set(SectionType.Ponte, this.generateRhythm(SectionType.Ponte));
        this.rhythm.set(SectionType.Refrao, this.generateRhythm(SectionType.Refrao));
        this.rhythm.set(SectionType.Verso, this.generateRhythm(SectionType.Verso));
        this.melody.set(SectionType.Intro, this.generateMelody(SectionType.Intro));
        this.melody.set(SectionType.Ponte, this.generateMelody(SectionType.Ponte));
        this.melody.set(SectionType.Refrao, this.generateMelody(SectionType.Refrao));
        this.melody.set(SectionType.Verso, this.generateMelody(SectionType.Verso));
    }
    generateSong() { return; }
    static pickInstrumentSet(instrumentSet) {
        const i = Math.trunc(Math.random() * instrumentSet.length * 1000) % instrumentSet.length;
        return instrumentSet[i];
    }
    generateSection(sectionType, song, bpm, noteDuration) {
        const progressions = [];
        const progressionCount = this.getNextProgressionCount(sectionType);
        for (let progression = 0; progression < progressionCount; progression++) {
            const sequences = [];
            const instrumentSetArray = this.harmony.get(sectionType);
            if (!instrumentSetArray)
                throw new Error("instrumentSetArray is null");
            const harmonyInstrumentSet = Style.pickInstrumentSet(instrumentSetArray);
            let maxHarmonySheet = 0;
            for (let instrumentName in harmonyInstrumentSet) {
                let sheet = harmonyInstrumentSet[instrumentName];
                const parsedSheet = parseSheet(sheet, 0);
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
                let instrumentSetArray = this.rhythm.get(sectionType);
                if (!instrumentSetArray)
                    throw new Error("instrumentSetArray is null");
                const rhythmInstrumentSet = Style.pickInstrumentSet(instrumentSetArray);
                for (let instrumentName in rhythmInstrumentSet) {
                    let sheet = rhythmInstrumentSet[instrumentName];
                    const parsedSheet = parseSheet(sheet, sheetPadding);
                    if (maxMeasureSheet < (parsedSheet === null || parsedSheet === void 0 ? void 0 : parsedSheet.length) - sheetPadding)
                        maxMeasureSheet = (parsedSheet === null || parsedSheet === void 0 ? void 0 : parsedSheet.length) - sheetPadding;
                    sequences.push({
                        instrumentName,
                        sheet: parsedSheet
                    });
                }
                instrumentSetArray = this.melody.get(sectionType);
                if (!instrumentSetArray)
                    throw new Error("instrumentSetArray is null");
                let melodyInstrumentSet = Style.pickInstrumentSet(instrumentSetArray);
                ///Adaptar nota para encaixar com acorde
                const bassSheet = findInstrumentWithLowestOctave(harmonyInstrumentSet);
                const bassSheetNotes = parseSheet(bassSheet, 0);
                melodyInstrumentSet = adjustMelodyToChordNote(melodyInstrumentSet, bassSheetNotes[measure]);
                for (let instrumentName in melodyInstrumentSet) {
                    let sheet = melodyInstrumentSet[instrumentName];
                    const parsedSheet = parseSheet(sheet, sheetPadding);
                    if (maxMeasureSheet < parsedSheet.length - sheetPadding)
                        maxMeasureSheet = parsedSheet.length - sheetPadding;
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
        return new Section(sectionType, progressions, bpm || this.defaultBpm, noteDuration || this.defaultNoteDuration);
    }
}
function parseSheet(sheet, sheetPadding) {
    if (!sheet)
        return null;
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
            if (char === ' ' || char === '\t') {
                i--;
                break;
            }
            note += char;
        }
        notes.push(note.toLowerCase());
    }
    return notes;
}
function parseNumbers(sheet, instrument, scale, rootNote) {
    sheet = sheet.map((note) => {
        if (note == 0)
            return undefined;
        if (note < 0) {
            note = Math.abs(note);
            note = scale[note - 1];
            return note - 12 + rootNote;
        }
        if (note > scale.length) {
            note = scale[note - scale.length - 1];
            return note + 12 + rootNote;
        }
        return scale[note - 1] + rootNote;
    });
    const parsedSheet = sheet.map((noteNumber) => {
        if (noteNumber === undefined)
            return "-";
        let octaveShift = 0;
        while (noteNumber < 0) {
            noteNumber = noteNumber + noteNames.length;
            octaveShift--;
        }
        while (noteNumber >= noteNames.length) {
            noteNumber = noteNumber - noteNames.length;
            octaveShift++;
        }
        return noteNames[noteNumber] + (instrument.centerOctave + octaveShift);
    });
    return parsedSheet.join(" ");
}
function generateRandomNotes(measureLength) {
    let sheet = [];
    for (let n = 0; n < measureLength; n++) {
        sheet.push(roll(9) - 1);
    }
    return sheet;
}
function generateChordNotesForMelody(chord) {
    return Math.abs(chord) + roll(3) * 2;
}
function generateSheetGroove(measureLength) {
    const sheet = [];
    for (let i = 0; i < measureLength; i++) {
        sheet.push(roll(2) - 1);
    }
    return sheet;
}
function generateSkippingNoteRhythmSheet(grooveSheet, instrument) {
    let sheet = '';
    for (const note of grooveSheet) {
        if (note === 0) {
            sheet += ' - - ';
        }
        if (note === 1) {
            sheet += roll(instrument.samples.length) + ' - ';
        }
    }
    return sheet;
}
function generateRhythmSheet(grooveSheet, instrument) {
    let sheet = '';
    for (const note of grooveSheet) {
        if (note === 0) {
            sheet += ' - ';
        }
        if (note === 1) {
            sheet += roll(instrument.samples.length) + ' ';
        }
    }
    return sheet;
}
function mutateSheetGroove(grooveSheet) {
    for (let i = 0; i < grooveSheet.length; i++) {
        grooveSheet[i] = roll(3) > 2 ? grooveSheet[i] : grooveSheet[i] === 1 ? 0 : 1;
    }
    return grooveSheet;
}
function generateLinearPatternMelodySheet(baseSheet, firstNote) {
    if (!baseSheet)
        throw new Error();
    let lastNote = firstNote ? firstNote : null;
    for (let note = 0; note < baseSheet.length; note++) {
        if (baseSheet[note] == 0)
            null;
        else if (lastNote === null) {
            lastNote = roll(8);
            baseSheet[note] = lastNote;
        }
        else {
            const rollResult = roll(7);
            switch (rollResult) {
                case 1:
                    baseSheet[note] = lastNote + 0;
                    break;
                case 2:
                case 3:
                    baseSheet[note] = lastNote + 1;
                    break;
                case 4:
                case 5:
                    baseSheet[note] = lastNote - 1;
                    break;
                case 6:
                    baseSheet[note] = lastNote + 2;
                    break;
                case 7:
                    baseSheet[note] = lastNote - 2;
                    break;
            }
        }
    }
    return baseSheet;
}
function generateGapFillMelodySheet(baseSheet, chordNote) {
    if (!baseSheet)
        throw new Error();
    let lastNote = chordNote ? generateChordNotesForMelody(chordNote) : null;
    let gap = null;
    for (let note = 0; note < baseSheet.length; note++) {
        if (baseSheet[note] == 0)
            null;
        else if (lastNote === null) {
            lastNote = roll(8);
            baseSheet[note] = lastNote;
        }
        else if (!gap) {
            gap = roll(5) + 2;
            baseSheet[note] = gap + lastNote;
        }
        else {
            baseSheet[note] = roll(4) > 3 ? lastNote : lastNote - 1;
        }
    }
    return baseSheet;
}
function generateAxialMelodySheet(baseSheet, chordNote) {
    if (!baseSheet)
        throw new Error();
    const firstNote = roll(8);
    const startingDirection = roll(2) > 1 ? 1 : -1;
    const noteSequence = [firstNote, firstNote + startingDirection, firstNote, firstNote - startingDirection];
    let noteSequenceIndex = 0;
    let lastNote = chordNote ? generateChordNotesForMelody(chordNote) : null;
    for (let note = 0; note < baseSheet.length; note++) {
        if (baseSheet[note] == 0)
            null;
        else if (lastNote === null) {
            lastNote = firstNote;
            baseSheet[note] = lastNote;
        }
        else {
            baseSheet[note] = noteSequence[noteSequenceIndex];
        }
        noteSequenceIndex++;
        if (noteSequenceIndex >= noteSequence.length - 1)
            noteSequenceIndex = 0;
    }
    return baseSheet;
}
//TODO
//bloqueio de clique pra esperar as samples carregarem
//remover o cursor piscando no slider
class Instrument {
    constructor(path, samples, centerOctave, color, role) {
        this.path = path;
        this.samples = samples;
        this.centerOctave = centerOctave;
        this.color = color;
        this.role = role;
    }
}
const accordion = new Instrument('accordion', ["a3",
    "a#3",
    "b3",
    "c4",
    "c#4",
    "d4",
    "d#4",
    "e4",
    "f4",
    "f#4",
    "g4",
    "g#4",
    "a4",
    "a#4",
    "b4",
    "c5",
    "c#5",
    "d5",
    "d#5",
    "e5",
    "f5",
    "f#5",
    "g5",
    "g#5",
    "a5",], 4, "#8B331D", MeasureCategory.Melody);
const bass = new Instrument('bass', ["a2",
    "a#2",
    "b2",
    "c3",
    "c#3",
    "d3",
    "d#3",
    "e3",
    "f3",
    "f#3",
    "g3",
    "g#3",
    "a3",
    "a#3",
    "b3",
    "c4",
    "c#4",
    "d4",
    "d#4",
    "e4",
    "f4",
    "f#4",
    "g4",
    "g#4",
    "a4"], 3, "#2E149A", MeasureCategory.Harmony);
const brassStab = new Instrument('brass_stab', [
    "c3",
    "c#3",
    "d3",
    "d#3",
    "e3",
    "f3",
    "f#3",
    "g3",
    "g#3",
    "a3",
    "a#3",
    "b3",
    "c4",
    // "c#4",
    // "d4",
    // "d#4",
    // "e4",
    // "f4",
    // "f#4",
    // "g4",
    // "g#4",
    // "a4",
    // "a#4",
    // "b4",
    // "c5",
], 3, "#596ABD", MeasureCategory.Melody);
const caixa = new Instrument('caixa', ["1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",], null, "#E49885", MeasureCategory.Rhythm);
const cuica = new Instrument('cuica', ["1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",], null, "#77A176", MeasureCategory.Rhythm);
const drop = new Instrument('drop', ["1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
], null, "#1D0021", MeasureCategory.Rhythm);
const dulcimer = new Instrument('dulcimer', [
    "a3",
    "a#3",
    "b3",
    "c4",
    "c#4",
    "d4",
    "d#4",
    "e4",
    "f4",
    "f#4",
    "g4",
    "g#4",
    "a4",
    "a#4",
    "b4",
    "c5",
    "c#5",
    "d5",
    "d#5",
    "e5",
    "f5",
    "f#5",
    "g5",
    "g#5",
    "a5",
], 4, "#0E4D34", MeasureCategory.Harmony);
const flute = new Instrument('flute', [
    "c4",
    "c#4",
    "d4",
    "d#4",
    "e4",
    "f4",
    "f#4",
    "g4",
    "g#4",
    "a4",
    "a#4",
    "b4",
    "c5",
    "c#5",
    "d5",
    "d#5",
    "e5",
    "f5",
    "f#5",
    "g5",
    "g#5",
    "a5",
    "a#5",
    "b5",
    "c6",
    "d6",
    "d#6",
    "e6",
    "f6",
    "f#6",
    "g6",
    "g#6",
    "a6"
], 5, "#E095E2", MeasureCategory.Harmony);
const funkBrass = new Instrument('funk_brass', [
    "c3",
    "c#3",
    "d3",
    "d#3",
    "e3",
    "f3",
    "f#3",
    "g3",
    "g#3",
    "a3",
    "a#3",
    "b3",
    "c4",
    "c#4",
    "d4",
    "d#4",
    "e4",
    "f4",
    "f#4",
    "g4",
    // "g#4",
    // "a4",
    // "a#4",
    // "b4",
    // "c5",
], 3, "#13A821", MeasureCategory.Melody);
const funkHighPercussion = new Instrument('funk_high_percussion', ["1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11"], null, "#380B3F", MeasureCategory.Rhythm);
const funkKick = new Instrument('funk_kick', ["1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10"], null, "#380B3F", MeasureCategory.Rhythm);
const funkLoop = new Instrument('funk_loop', ["1",
    "2",
    "3",
    "4",
    "5"], null, "#93999C", MeasureCategory.Rhythm);
const funkVoice = new Instrument('funk_voice', ["1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11"], null, "#5B401A", MeasureCategory.Rhythm);
const ganza = new Instrument('ganza', ["1",
    "2",
    "3",
    "4"], null, "#C4C68A", MeasureCategory.Rhythm);
const hihat = new Instrument('hihat', ["1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10"], null, "#380B3F", MeasureCategory.Rhythm);
const kick = new Instrument('kick', ["1",
    "2",
    "3",
    "4",
    "5"], null, "#403420", MeasureCategory.Rhythm);
const piano = new Instrument('piano', ["a2",
    "a#2",
    "b2",
    "c3",
    "c#3",
    "d3",
    "d#3",
    "e3",
    "f3",
    "f#3",
    "g3",
    "g#3",
    "a3",
    "a#3",
    "b3",
    "c4",
    "c#4",
    "d4",
    "d#4",
    "e4",
    "f4",
    "f#4",
    "g4",
    "g#4",
    "a4",
    "a#4",
    "b4",
    "c5",
    "c#5",
    "d5",
    "d#5",
    "e5",
    "f5",
    "f#5",
    "g5",
    "g#5",
    "a5",
    "a#5",
    "b5",
    "c6",
    "c#6",
    "d6",
    "d#6",
    "e6",
    "f6",
    "f#6",
    "g6",
    "g#6",
    "a6",], 3, "#596ABD", MeasureCategory.Melody);
const harpsichord = new Instrument('harpsichord', ["a2",
    "a#2",
    "b2",
    "c3",
    "c#3",
    "d3",
    "d#3",
    "e3",
    "f3",
    "f#3",
    "g3",
    "g#3",
    "a3",
    "a#3",
    "b3",
    "c4",
    "c#4",
    "d4",
    "d#4",
    "e4",
    "f4",
    "f#4",
    "g4",
    "g#4",
    "a4",
    "a#4",
    "b4",
    "c5",
    "c#5",
    "d5",
    "d#5",
    "e5",
    "f5",
    "f#5",
    "g5",
    "g#5",
    "a5",
    "a#5",
    "b5",
    "c6",], 4, "#390619", MeasureCategory.Harmony);
const ride = new Instrument('ride', ["1",
    "2",
    "3",
    "4",
    "5",
    "6",], null, "#BD844B", MeasureCategory.Rhythm);
const sax = new Instrument('sax', ["a3",
    "a#3",
    "b3",
    "c4",
    "c#4",
    "d4",
    "d#4",
    "e4",
    "f4",
    "f#4",
    "g4",
    "g#4",
    "a4",
    "a#4",
    "b4",
    "c5",
    "c#5",
    "d5",
    "d#5",
    "e5",
    "f5",
    "f#5",
    "g5",
    "g#5",
    "a5",
    "a#5",
    "b5",
    "c6",], 4, "#CEC54A", MeasureCategory.Melody);
const shaker = new Instrument('shaker', ["1", "2", "3", "4"], null, "#77A176", MeasureCategory.Rhythm);
const snare = new Instrument('snare', ["1",
    "2",
    "3",
    "4",
    "5"], null, "#D58548", MeasureCategory.Rhythm);
const stab = new Instrument('stab', ["a2",
    "a#2",
    "b2",
    "c3",
    "c#3",
    "d3",
    "d#3",
    "e3",
    "f3",
    "f#3",
    "g3",
    "g#3",
    "a3",
    "a#3",
    "b3",
    "c4",
    "c#4",
    "d4",
    "d#4",
    "e4",
    "f4",
    "f#4",
    "g4",
    "g#4",
    "a4",], 3, "#943966", MeasureCategory.Melody);
const surdo1 = new Instrument('surdo1', ["1", "2", "3", "4"], null, "#384436", MeasureCategory.Rhythm);
const surdo2 = new Instrument('surdo2', ["1", "2", "3", "4"], null, "#395447", MeasureCategory.Rhythm);
const surdo3 = new Instrument('surdo3', ["1", "2", "3", "4"], null, "#41686C", MeasureCategory.Rhythm);
const tamborim = new Instrument('tamborim', ["1", "2", "3", "4"], null, "#8ED3DB", MeasureCategory.Rhythm);
const triangle = new Instrument('triangle', ["1", "2", "3", "4"], null, "#C0BEB0", MeasureCategory.Rhythm);
const vibraslap = new Instrument('vibraslap', ["1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12"], null, "#380B3F", MeasureCategory.Rhythm);
const xylo = new Instrument('xylo', ["a4",
    "a5",
    "b4",
    "c4",
    "c5",
    "d4",
    "d5",
    "e4",
    "e5",
    "f4",
    "f5",
    "g4",
    "g5"], null, "#BA8DC3", MeasureCategory.Rhythm);
const zabumba = new Instrument('zabumba', ["k1", "k2", "s"], null, "#4B451F", MeasureCategory.Melody);
class SampleSet {
    static async loadSample(instrument, sample) {
        const path = instrument.path + '/' + sample;
        const response = await fetch('samples/' + path.replace("#", "%23") + '.wav');
        const arrayBuffer = await response.arrayBuffer();
        const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);
        SampleSet.samples.set(path, {
            index: SampleSet.samples.size,
            path,
            color: instrument.color,
            buffer: decodedAudio
        });
    }
    static async loadSamples() {
        await Promise.all(SampleSet.instruments.map((instrument) => {
            instrument.samples.map((sample) => SampleSet.loadSample(instrument, sample));
        }));
    }
    static getSample(name) {
        return SampleSet.samples.get(name);
    }
    static getInstrumentByName(name) {
        return SampleSet.instruments.find((instrument) => instrument.path === name);
    }
}
SampleSet.instruments = [
    accordion,
    bass,
    brassStab,
    caixa,
    cuica,
    drop,
    funkBrass,
    funkHighPercussion,
    funkKick,
    funkLoop,
    funkVoice,
    ganza,
    hihat,
    kick,
    piano,
    ride,
    sax,
    shaker,
    snare,
    stab,
    surdo1,
    surdo2,
    surdo3,
    tamborim,
    triangle,
    vibraslap,
    xylo,
    zabumba,
    flute,
    harpsichord,
    dulcimer
];
SampleSet.samples = new Map();
class Forro extends Style {
    constructor() {
        super(StyleName.Forro, 115, 4 / 16);
        this.sections = [SectionType.Intro, SectionType.Refrao, SectionType.Verso, SectionType.Ponte, SectionType.Verso, SectionType.Ponte, SectionType.Refrao, SectionType.Refrao, SectionType.Ponte, SectionType.Ponte, SectionType.Intro];
    }
    generateHarmony(sectionType) {
        switch (sectionType) {
            case SectionType.Intro:
                if (roll(2) > 1) {
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
                        },
                        {
                            bass: 'd3 d3 a2 d3 ',
                            accordion: 'd3 d3 c3 d3',
                            xylo: 'd4 - - -',
                        },
                        {
                            bass: 'd3 d3 a2 d3 ',
                            accordion: 'f3 f3 e3 d3',
                            xylo: 'd4 - - -',
                        }
                    ];
                }
                else {
                    return [{
                            bass: 'd3 a2',
                            accordion: 'a4 a4',
                            xylo: 'd5 a4',
                        },
                        {
                            bass: 'd3 a2',
                            accordion: 'a3 a3',
                            xylo: 'd5 a4',
                        },
                        {
                            bass: 'a2 d3',
                            accordion: 'a4 a4',
                            xylo: 'a4 d5',
                        },
                        {
                            bass: 'd3 d3',
                            accordion: 'a4 d4',
                            xylo: 'a4 d5',
                        },
                        {
                            bass: 'd3 d3',
                            accordion: 'a4 d4',
                            xylo: 'd4 d5',
                        }];
                }
            case SectionType.Refrao:
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
                    },
                    {
                        bass: 'a2 d3 c3 d3',
                        accordion: 'a4 a4 e4 f4',
                        xylo: 'a4 d5 c5 d5',
                    },
                    {
                        bass: 'd3 g3 a3 d3 ',
                        accordion: 'd4 g4 a4 a4',
                    },
                    {
                        bass: 'd3 g3 a3 d3 ',
                        accordion: 'd4 c4 a3 a4',
                    },
                ];
            case SectionType.Ponte:
                return [
                    {
                        bass: 'c3 a2',
                        accordion: 'c4 a3',
                    },
                    {
                        bass: 'c3 d3',
                        accordion: 'c4 d4',
                    },
                    {
                        bass: 'g3 d3',
                        accordion: 'b4 d4',
                    },
                    {
                        bass: 'g3 d3',
                        accordion: 'd4 d4',
                    },
                    {
                        bass: 'a2 d3',
                        accordion: 'c4 d4',
                        xylo: 'a4 d5',
                    },
                    {
                        bass: 'a2 d3',
                        accordion: 'c4 a4',
                        xylo: 'a4 d5',
                    },
                    {
                        bass: 'a2 d3 ',
                        accordion: 'a4 a4',
                        xylo: 'a4 d5',
                    },
                ];
            default:
                return [
                    {
                        bass: "d3 - - a2"
                    },
                ];
        }
    }
    generateRhythm(sectionType) {
        const zabumbaGrooves = [
            "k1 - s k2 - - - k1",
            "k1 - s k2 - - - k1",
            "k1 - s k2 s - - k1",
            "k1 - s k2 s - s k1",
            "k1 - - - - - - k1",
            "k1 - s k2 - - k1 - ",
            "k1 - s k2 - - k1 k2 ",
            "k1 k2 s k2 s s k1 k1",
            "k1 k2 k1 k2 k1 k2 k1 k2",
            "k1 k2 k2 k1 k2 k2 k1 k2",
        ];
        switch (sectionType) {
            case SectionType.Intro:
                const zabumbaIntroGrooves = [
                    "k1 - s k2 - - - k1",
                    "k1 - s k2 s - - k1",
                    "k1 - k2 - k1 s k2 s ",
                    "k1 - s k2 - - - k1",
                    "k1 - - - - - - k1",
                    "s - - - - - - s",
                    "- - - - - - - - ",
                    "k1 - - - - - - - ",
                    "s - - - s - - - ",
                ];
                const triangleIntroGrooves = [
                    "1 2 3 2 1 2 3 2",
                    "1 - - - 1 2 3 2",
                    "1 - - - 1 - 3 -",
                    "3 - - - - - 3 -",
                    "3 - - - - - - -",
                    "- - - - 2 - - -",
                    "- - - - - - - - ",
                    "3 - - - - - - - ",
                    "1 - - 1 - - 2 - ",
                ];
                return [
                    {
                        zabumba: zabumbaIntroGrooves[roll(zabumbaIntroGrooves.length) - 1],
                        triangle: triangleIntroGrooves[roll(triangleIntroGrooves.length) - 1]
                    },
                    {
                        zabumba: zabumbaIntroGrooves[roll(zabumbaGrooves.length) - 1],
                        triangle: triangleIntroGrooves[roll(triangleIntroGrooves.length) - 1]
                    },
                    {
                        zabumba: zabumbaIntroGrooves[roll(zabumbaGrooves.length) - 1],
                    },
                    {
                        triangle: "1 2 3 2 1 2 3 2"
                    },
                    {
                        triangle: "1 3 3 3 2 3 3 3"
                    },
                    {
                        triangle: "2 3 3 3 2 3 3 3"
                    },
                    {
                        triangle: "- - - - 2 - - -"
                    },
                    {
                        triangle: "- - 2 - - - 2 -"
                    },
                    {
                        triangle: "- - 3 - - - 3 -"
                    },
                    {
                        triangle: "- - 1 - - - 1 -"
                    },
                    {
                        triangle: "3 2 1 2 3 2 1 2"
                    },
                    {
                        triangle: "3 - - 3 - - 2 - "
                    },
                ];
            case SectionType.Ponte:
                return [{
                        triangle: "1 2 3 2",
                        zabumba: "k1 - s k2"
                    },
                    {
                        triangle: "1 2 3 2",
                        zabumba: "- - - k1"
                    },
                    {
                        triangle: "1 - - -",
                        zabumba: "k1 - s k2"
                    },
                    {
                        triangle: "1 - - -",
                        zabumba: "- - - k1"
                    },
                    {
                        triangle: "2 - 2 -",
                        zabumba: "k1 - s k2"
                    },
                    {
                        triangle: "2 - 2 -",
                        zabumba: "k2 - - k1"
                    },
                    {
                        triangle: "1 2 3 2",
                        zabumba: "k1 - k1 - "
                    },
                    {
                        triangle: "1 2 3 2",
                        zabumba: "k2 s k1 s"
                    },
                ];
            case SectionType.Verso:
                return [
                    {
                        zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1]
                    },
                    {
                        zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
                        triangle: "1 2 3 2 1 2 3 2"
                    },
                    {
                        zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
                        triangle: "1 2 3 2 1 2 3 2",
                        xylo: "d4 - - - a4 - - - "
                    },
                    {
                        zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
                        triangle: "1 2 3 2 1 2 3 2",
                        xylo: "d5 - - - a4 - - - "
                    },
                    {
                        zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
                        triangle: "1 - - 3 1 2 3 2"
                    },
                    {
                        zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
                        triangle: "1 2 3 2 1 - 1 -"
                    },
                    {
                        zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
                        triangle: "1 - - 1 - - 2 - "
                    },
                    {
                        zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
                        triangle: "2 1 - 2 2 1 - 2 "
                    },
                    {
                        zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
                        triangle: "1 - - - 2 - 2 - "
                    },
                ];
            case SectionType.Refrao:
                const xyloChorusGrooves = [
                    "d4 - - - a4 - - -",
                    "d5 - - - a4 - - -",
                    "d5 - - - a4 - d4 -",
                    "d5 - a4 - d5 - a4 -",
                ];
                return [
                    {
                        zabumba: "k1 - s k2 - - - k1",
                        triangle: "1 2 3 2 1 2 3 2"
                    },
                    {
                        zabumba: "k1 - s k2 - - - k1",
                        triangle: "1 2 3 2 1 2 3 2",
                        xylo: xyloChorusGrooves[roll(xyloChorusGrooves.length) - 1]
                    },
                    {
                        zabumba: zabumbaGrooves[roll(zabumbaGrooves.length) - 1],
                        triangle: "1 2 3 2 1 2 3 2",
                        xylo: xyloChorusGrooves[roll(xyloChorusGrooves.length) - 1]
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
    generateMelody(sectionType) {
        let chosenScale = Dorian;
        const melodies8thNotes = [
            "d5 f5 e5 d5 a5 g5 f5 g5",
            "b4 - a4 - d4 d4 d4 d4",
            "d5 b4 c5 a4 b4 f4 a4 f4",
            "b4 b4 a5 a5",
            "d5 d4 d4 d5 d4 d4 b4 c4",
            "d4 - - - c5 a4 b4 - ",
            "a5 - f5 - a4 - d5 - ",
            "d5 - a4 - d5 - a4 - ",
            "d5 - - a4 d5 - - a4 ",
            "- - d5 d5 d5 d5 d5 e5",
            'f5 f5 f5 f5 e5 d5 d5 d5',
            'd5 - - c5 e5 - c5 - ',
            'f5 - g5 - a5 - - - ',
            'g5 - - - f5 - - - ',
            'c5 b4 - - a4 g4 f4 - ',
            'f4 - a4 - c5 - a4 g4',
            'f4 - a4 - c5 - a4 g4',
            'f4 - g4 - a4 - c5 - ',
            'g5 - - f5 a5 g5 - -',
            'f5 a5 g5 - - f5 e5',
            'g5 f5 e5 d5 c5 e5 d5 -',
            'd5 c5 b4 a4 f4 a4 g4 -',
            'g5 - - a5 g5 -- f5',
            'g5 - - d5 g5 g5 d5 g5',
            'f5 g5 a5 - - - g5 -'
        ];
        const melodies4thNotes = [
            "c5 - - f5",
            "d5 - - c5",
            "c5 c5 c5 d5",
            "f5 e5 e5 d5",
            "d5 a5 a5 a5",
            "d5 f5 e5 d5",
            "c5 - b4 - ",
            "d5 - - d5",
            "a5 g5 f5 e5",
            "d5 e5 f5 g5",
            "f5 - g5 - ",
            "g5 - f5 - ",
            "d5 - c5 e5",
            "- - d5 e5",
        ];
        const scaleMelodies = [
            [1, 0, 2, 0, 3, 0, 4, 0],
            [1, 0, 0, 2, 0, 0, 3, 0],
            [1, 0, 0, 0, 5, 0, 0, 0],
            [5, 0, 4, 0, 3, 0, 2, 0],
            [1, 0, 0, 1, 2, 0, 1, 0],
            [1, 0, 0, 1, -7, 0, 2, 0],
            [1, 0, 0, 1, -7, 0, -6, 0],
            [1, 0, 2, 0, 3, 0, 3, 0],
            [2, 0, 1, 0, 2, 0, 1, 0],
            [3, 0, 2, 0, 1, 0, 1, 0]
        ];
        const syncopations = [
            [1, 1, 0, 1, 1, 0, 1, 0],
            [1, 1, 0, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 1, 0, 0, 1, 0],
            [1, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 1, 0],
        ];
        switch (sectionType) {
            case SectionType.Intro:
                return [
                    {
                        accordion: parseNumbers(generateLinearPatternMelodySheet(syncopations[roll(syncopations.length) - 1]), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove([1, 0, 1, 0, 1, 0, 1, 0,])), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateAxialMelodySheet(mutateSheetGroove(syncopations[roll(syncopations.length) - 1])), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateAxialMelodySheet(mutateSheetGroove([1, 0, 1, 0, 1, 0, 1, 0,])), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateGapFillMelodySheet([1, 0, 1, 0, 1, 0, 1, 0,]), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
                    },
                    {
                        accordion: melodies8thNotes[roll(melodies8thNotes.length) - 1]
                    },
                    {
                        accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1] + ' ' + melodies4thNotes[roll(melodies4thNotes.length) - 1]
                    },
                ];
            case SectionType.Verso:
                return [
                    {
                        accordion: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(8)), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateGapFillMelodySheet(generateSheetGroove(8)), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateLinearPatternMelodySheet(syncopations[roll(syncopations.length) - 1]), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateAxialMelodySheet([1, 0, 1, 0, 1, 0, 1, 0]), accordion, chosenScale, 5)
                    },
                    {
                        accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1] + ' ' + parseNumbers(generateAxialMelodySheet([1, 1, 1, 1,]), accordion, chosenScale, 5)
                    },
                    {
                        accordion: parseNumbers(generateAxialMelodySheet(syncopations[roll(syncopations.length) - 1]), accordion, chosenScale, 5)
                    },
                    {
                        accordion: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(4)), accordion, chosenScale, 5) + ' ' + parseNumbers(generateAxialMelodySheet([1, 1, 1, 1]), accordion, chosenScale, 5)
                    },
                    {
                        accordion: melodies8thNotes[roll(melodies8thNotes.length) - 1]
                    },
                    {
                        accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1] + ' ' + melodies4thNotes[roll(melodies4thNotes.length) - 1]
                    },
                    {
                        accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
                    }
                ];
            case SectionType.Refrao:
                return [{
                        accordion: melodies8thNotes[roll(melodies8thNotes.length) - 1]
                    },
                    {
                        accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1] + ' ' + melodies4thNotes[roll(melodies4thNotes.length) - 1]
                    },
                    {
                        accordion: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(8)), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateGapFillMelodySheet(generateSheetGroove(8)), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateLinearPatternMelodySheet(syncopations[roll(syncopations.length) - 1]), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateAxialMelodySheet(mutateSheetGroove(syncopations[roll(syncopations.length) - 1])), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(syncopations[roll(syncopations.length) - 1])), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateAxialMelodySheet([1, 0, 1, 0, 1, 0, 1, 0]), accordion, chosenScale, 5)
                    },
                    {
                        accordion: parseNumbers(generateAxialMelodySheet([1, 1, 1, 1, 1, 1, 1, 1]), accordion, chosenScale, 5)
                    },
                    {
                        accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(scaleMelodies[roll(scaleMelodies.length - 1)], accordion, chosenScale, 5),
                    },
                    {
                        accordion: melodies8thNotes[roll(melodies8thNotes.length) - 1]
                    },
                    {
                        accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1] + ' ' + melodies4thNotes[roll(melodies4thNotes.length) - 1]
                    },
                    {
                        accordion: melodies8thNotes[roll(melodies8thNotes.length) - 1]
                    },
                    {
                        accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1] + ' ' + melodies4thNotes[roll(melodies4thNotes.length) - 1]
                    },];
            case SectionType.Ponte:
                return [
                    {
                        accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1]
                    },
                    {
                        accordion: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(4)), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateGapFillMelodySheet(generateSheetGroove(4)), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(mutateSheetGroove(generateLinearPatternMelodySheet([1, 0, 1, 0])), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateLinearPatternMelodySheet([1, 0, 0, 1]), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateAxialMelodySheet([1, 1, 1, 1]), accordion, chosenScale, 5),
                    },
                    {
                        accordion: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(2)), accordion, chosenScale, 5) + ' ' + parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(2)), accordion, chosenScale, 5)
                    },
                    {
                        accordion: "c4 - c4 - "
                    },
                    {
                        accordion: "c4 d4 e4 f4 "
                    },
                    {
                        accordion: "d4 e4 f4 g4"
                    },
                    {
                        accordion: "c4 - c4 c4"
                    },
                    {
                        accordion: "a3 - a3 a3"
                    },
                    {
                        accordion: "a3 - a3 -"
                    },
                    {
                        accordion: "a4 - c4 - "
                    },
                    {
                        accordion: "d5 - c5 b4"
                    },
                    {
                        accordion: "c5 - b4 - "
                    },
                    {
                        accordion: "d5 - - -"
                    },
                    {
                        accordion: melodies8thNotes[roll(melodies8thNotes.length) - 1]
                    },
                    {
                        accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1]
                    }
                ];
            default:
                return [
                    {
                        accordion: melodies4thNotes[roll(melodies4thNotes.length) - 1]
                    },
                ];
        }
    }
    getNextProgressionCount(sectionType) {
        return 4;
    }
    getNextMeasureCount(sectionType, progressionIndex, progressionCount) {
        return 4;
    }
}
class Jazz extends Style {
    constructor() {
        super(StyleName.Jazz, 115, 8 / 12);
        this.sections = [SectionType.Intro, SectionType.Refrao, SectionType.Verso, SectionType.Refrao, SectionType.Ponte, SectionType.Refrao, SectionType.Intro, SectionType.Intro];
    }
    generateHarmony(sectionType) {
        switch (sectionType) {
            case SectionType.Intro:
                return [{
                        bass: 'a2'
                    }];
            case SectionType.Verso:
                return [
                    {
                        piano: 'c4 b3',
                        bass: 'a3 e3',
                    },
                    {
                        piano: 'e4 e4',
                        bass: 'a3 e3',
                    },
                    {
                        piano: 'g4 g4',
                        bass: 'a3 e3',
                    },
                    {
                        piano: 'd4 e4 a4 g4',
                        bass: 'b3 e3 a3 a3',
                    },
                    {
                        piano: 'd4 e4 d4 d4 c4 b3 c4 e4',
                        bass: 'b3 e3 g3 b3 a3 e3 f3 e3',
                    },
                    {
                        piano: 'g4 g4 g4 g4',
                        bass: 'a3 g3 f3 e3',
                    },
                ];
            case SectionType.Refrao:
                return [
                    {
                        piano: 'f5 e5 d5 d5 c5 b4 a4 g#4',
                        bass: 'g3 d3 g3 d3 a3 e3 a3 e4',
                    },
                    {
                        piano: 'd5 e5 e5 f5 g5 g5 a5 b5',
                        bass: 'b3 e4 a3 d4 g3 c4 f3 g3',
                    },
                    {
                        piano: 'b4 c5 d5 e5',
                        bass: 'g3 a3 g3 a3',
                    },
                    {
                        piano: '- - a5 b5',
                        bass: 'e3 e3 a3 e3',
                    },
                    {
                        piano: 'e5 - a5 b5',
                        bass: 'e3 e3 a3 e3',
                    },
                    {
                        piano: 'e5 - c5 b5',
                        bass: 'e3 e3 a3 e3',
                    },
                    {
                        piano: 'd5 g5 a5 g#5',
                        bass: 'd4 g3 a3 e3',
                    },
                ];
            case SectionType.Ponte:
                return [
                    {
                        piano: 'a4 b4 c5 b4',
                        bass: 'a3 g3 f3 e3',
                    },
                    {
                        piano: 'a4 b4 c5 e5',
                        bass: 'f3 e3 a3 a3',
                    },
                    {
                        piano: 'c5 b4 a4 e4',
                        bass: 'f3 e3 a3 a3',
                    },
                    {
                        piano: 'b4 b4 a4 e4',
                        bass: 'b3 e3 a3 a3',
                    },
                ];
            default:
                return [
                    {
                        piano: 'c4 b3',
                        bass: 'a3 e3',
                    },
                ];
        }
    }
    generateRhythm(sectionType) {
        switch (sectionType) {
            case SectionType.Intro:
                return [
                    {
                        ride: '- 1 1 1 - -',
                        kick: '3 - - 3 - -'
                    },
                    {
                        ride: '- 2 2 2 - -',
                        kick: '3 - - 3 - -'
                    },
                    {
                        ride: '- 3 3 3 - -',
                        kick: '3 - - 3 - -'
                    },
                    {
                        ride: '- 4 4 4 - -',
                        kick: '3 - - 3 - -'
                    },
                    {
                        ride: '- 5 5 5 - -',
                        kick: '3 - - 3 - -'
                    },
                    {
                        ride: '- 3 3 3 - -'
                    },
                    {
                        ride: '- 4 4 4 - -'
                    },
                    {
                        ride: '- 5 5 5 - -'
                    },
                    {
                        ride: '1 - 2 - 3 -'
                    },
                    {
                        ride: '5 - - - - -'
                    },
                    {
                        ride: '- - - 5 - -'
                    },
                    {
                        ride: '3 - - - - -'
                    },
                    {
                        ride: '- - - 3 - -'
                    },
                    {
                        ride: '1 2 3 - 2 3'
                    },
                    {
                        ride: '5 5 5 5 5 5'
                    },
                    {
                        ride: '1 4 3 4 5 5'
                    },
                    {
                        shaker: '1 2 3 4 3 2'
                    },
                    {
                        shaker: '1 - 2 1 - 2'
                    },
                    {
                        shaker: '1 - - 1 - -'
                    },
                    {
                        ride: '2 - - 4 - -',
                        shaker: '1 2 3 4 3 2'
                    },
                    {
                        ride: '- - - - - - '
                    }
                ];
            case SectionType.Verso:
                return [
                    {
                        ride: '- 3 3 - 3 3',
                        kick: '1 - - - - -',
                        snare: '- - - 3 - 2'
                    },
                    {
                        ride: '- 3 4 - 5 6',
                        kick: '1 - - - - -',
                        snare: '3 - 3 1 - 2'
                    },
                    {
                        ride: '- 3 5 3 - -',
                        kick: '1 - - 3 - -',
                        snare: '- - -  4 3 2'
                    },
                    {
                        ride: '- 3 2 - 3',
                        kick: '2 - - 3 1',
                        snare: '- 3 2 - -'
                    },
                    {
                        ride: '3 - 3 - 3 -',
                        kick: '1 - - 2 - ',
                        snare: '- 3 - 4 - 5'
                    },
                ];
            case SectionType.Refrao:
                return [
                    {
                        ride: '- 3 2 - 2 4',
                        kick: '1 - - - - -',
                        snare: '- - - 4 - 4',
                        shaker: '1 2 3 4 3 2'
                    },
                    {
                        ride: '- 3 5 - 5 4',
                        kick: '1 - - - - -',
                        snare: '3 - 1 3 - 3',
                        shaker: '1 2 3 4 3 2'
                    },
                    {
                        ride: '- 3 5 4 - -',
                        kick: '1 - - 2 - -',
                        snare: '- - - 5 4 3',
                        shaker: '1 2 3 4 3 2'
                    },
                    {
                        ride: '- 3 3 - 5',
                        kick: '1 - - 2 3',
                        snare: '- 2 1 - -',
                        shaker: '1 2 3 4 3 2'
                    },
                    {
                        ride: '3 - 5 - 4 -',
                        kick: '1 - - 2 - ',
                        snare: '- 2 - 1 - 4',
                        shaker: '1 2 3 4 3 2'
                    },
                ];
            case SectionType.Ponte:
                return [
                    {
                        ride: '- 3 3 - 3 3',
                        kick: '1 - - - - -',
                        snare: '- - - 1 - 1'
                    },
                ];
            default:
                return [
                    {
                        ride: '- 3 3 - - 3',
                        kick: '1 - - - - -',
                        snare: '- - - 1 - 1'
                    },
                ];
        }
    }
    generateMelody(sectionType) {
        const saxMelodies = [
            'a4 b4 c5 e5 d5 -',
            'e5 d5 - g4 a4 -',
            'g4 a4 b4 g4 e4 -',
            'a4 - - - - -',
            'a5 - - - - -',
            'a4 - - - - -',
            'c5 a4 - - - -',
            'e5 d#5 c5 a4 - -',
            'e5 - d#5 - - -',
            'e4 - g4 - a4 -',
            'e4 - b4 - a4',
            'a5 c6 b5 a5 g5 a5',
            'g5 e5 d#5 d5 c5 b5',
            'a4 e5 d#5 - - -',
            '- a4 e5 d#5 - - e5',
            '- - - e4 g4 c5',
            '- - - - a4 b4',
            'd5 c5 e5 d5 g5 e5',
            'a4 c5 e5 g5 b5 -',
            'b5 c6 b5 - - -',
            'b5 c6 b5 a5 g5 a5',
            'g5 - - g5 g5 g5',
            'e5 - - - - -',
            '- e5 g5 e5 d#5 d5',
            '- - - - e4 g4',
            '- - - - e5 g5',
            'a4 c5 e5 d#5 - -',
            'e5 d#5 c5 a4 - -',
            'g5 b5 g5 b5 g5 -',
            '- - e4 g4 d4 -',
            'a4 - - - e4 a4',
            'a4 c5 d5 c5 e5 -',
            'a4 c5 d5 c5 a5 -',
            '- - e5 d#5 e5 c5',
            'e5 f5 e5 - e5 f5',
            'a4 g4 a4 c5 d5 c5',
            'g4 a4 c5 g4 a4 -',
            'a4 b4 c5 d5 b4 -',
            'g4 a4 - - g4 a4',
            'g5 - - - f5 e5',
            'g5 - - - - -',
            ' - f5 e5 g5 f5 e5',
            'e5 - - - - -',
            'a5 g5 e5 d5 c5 a4',
            'a5 g5 e5 d#5 - -',
            'c5 - - - - -',
            'b5 - - - - -',
            'd5 - - - - -',
            'd#5 - - - g5 e5',
            'g4 - - - b4 g4',
            'd5 e5 f5 e5 f5 g5',
            '- - - - c5 b4',
            '- - - - - g4',
            'a4 - - a5 - -'
        ];
        switch (sectionType) {
            case SectionType.Intro:
            default:
                return [
                    {
                        sax: parseNumbers(generateRandomNotes(6), sax, Minor, 0)
                    },
                    {
                        sax: saxMelodies[roll(saxMelodies.length - 1)]
                    },
                    {
                        sax: (saxMelodies[roll(saxMelodies.length - 1)])
                    },
                    {
                        sax: saxMelodies[roll(saxMelodies.length - 1)]
                    },
                    {
                        sax: saxMelodies[roll(saxMelodies.length - 1)]
                    },
                    {
                        sax: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(6)), sax, Minor, 0),
                    },
                    {
                        sax: parseNumbers(generateGapFillMelodySheet(generateSheetGroove(6)), sax, Minor, 0),
                    },
                    {
                        sax: parseNumbers(generateAxialMelodySheet(generateSheetGroove(6)), sax, Minor, 0),
                    },
                ];
        }
    }
    getNextProgressionCount(sectionType) {
        return 4;
    }
    getNextMeasureCount(sectionType, progressionIndex, progressionCount) {
        return 4;
    }
}
class Samba extends Style {
    constructor() {
        super(StyleName.Samba, 144, 4 / 16);
        this.sections = [SectionType.Intro, SectionType.Verso, SectionType.Refrao, SectionType.Ponte, SectionType.Refrao];
    }
    generateHarmony(sectionType) {
        switch (sectionType) {
            case SectionType.Intro:
                return [
                    {
                        bass: 'g3 g3',
                        piano: 'c5 b4'
                    },
                    {
                        bass: 'g3 g3',
                        piano: 'd5 b4'
                    },
                    {
                        bass: 'g3 d3',
                        piano: 'd4 d4'
                    },
                    {
                        bass: 'g3 f3',
                        piano: 'b4 c5'
                    },
                ];
            case SectionType.Verso:
                return [
                    {
                        bass: 'g3 f3 g3 f3',
                        dulcimer: 'g4 a4 b4 d5',
                        piano: 'b4 c5 b4 c5'
                    },
                    {
                        bass: 'g3 c4 d4 g3',
                        dulcimer: 'b4 b4 c5 d5',
                        piano: 'd5 d5 d5 g5'
                    },
                    {
                        bass: 'g3 f3 c3 g3',
                        dulcimer: 'd5 c5 c5 b4',
                        piano: 'b5 c6 e6 d6'
                    },
                    {
                        bass: 'g3 f3 c3 g3',
                        dulcimer: 'd5 c5 b5 b4',
                        piano: 'b5 c6 e6 d6'
                    },
                    {
                        bass: 'g3 f3 c3 g3',
                        dulcimer: 'd5 c5 e5 d5',
                        piano: 'b5 c6 b5 b5'
                    },
                    {
                        bass: 'g3 c4 d4 g3',
                        dulcimer: 'b4 c5 a4 g4',
                        piano: 'd5 e5 f5 g5'
                    },
                    {
                        bass: 'g3 c4 d4 g3',
                        dulcimer: 'd4 g5 a4 d4',
                        piano: 'b6 e6 f6 b6'
                    },
                    {
                        bass: 'g3 g4 g3 g4',
                        dulcimer: 'g5 d5 b4 g4',
                        piano: 'd6 g5 d6 f6'
                    },
                    {
                        bass: 'g3 g4 d4 g4',
                        dulcimer: 'g5 d5 a4 g4',
                        piano: 'd6 g5 f6 f6'
                    },
                ];
            case SectionType.Refrao:
                return [
                    {
                        bass: 'g3 c4 d4 g3',
                        dulcimer: 'b4 b4 c5 d5',
                        piano: 'd5 d5 d5 g5'
                    },
                    {
                        bass: 'g3 f3 c3 g3',
                        dulcimer: 'd5 c5 e5 d5',
                        piano: 'b5 c6 b5 b5'
                    },
                    {
                        bass: 'g3 c4 d4 g3',
                        dulcimer: 'b4 c5 a4 g4',
                        piano: 'd5 e5 f5 g5'
                    },
                    {
                        bass: 'g3 c4 d4 g3',
                        dulcimer: 'd4 g5 a4 d4',
                        piano: 'b6 e6 f6 b6'
                    },
                ];
            case SectionType.Ponte:
                return [
                    {
                        bass: '- - - - '
                    },
                ];
        }
    }
    generateRhythm(sectionType) {
        switch (sectionType) {
            case SectionType.Intro:
                const introGrooves = [
                    {
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3)
                    },
                    {
                        surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3),
                    },
                    {
                        shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3),
                    },
                    {
                        shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4'
                    },
                    {
                        ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4'
                    },
                    {
                        shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        surdo1: '1 - - - - - - - 2 - - - - - - -',
                    },
                    {
                        ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        surdo1: '1 - - - - - - - 2 - - - - - - -',
                    },
                    {
                        shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        surdo1: '1 - - - - - - - 2 - - - - - - -',
                        surdo3: '- - 2 - 2 - 2 - 3 - 2 - 2 - 2 -',
                    },
                    {
                        ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        surdo1: '1 - - - - - - - 2 - - - - - - -',
                        surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3)
                    },
                    {
                        caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
                    },
                    {
                        shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim)
                    },
                    {
                        caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
                        tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim)
                    },
                    {
                        shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4'
                    },
                    {
                        caixa: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                    }
                ];
                return [introGrooves[roll(introGrooves.length - 1)]];
            case SectionType.Verso:
                return [
                    {
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3),
                        shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        tamborim: '- 1 - 1 - - 1 - 1 - 1 - 1 - - 1'
                    },
                    {
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3),
                        ganza: generateRhythmSheet(generateSheetGroove(16), surdo3),
                        tamborim: '- 1 - 1 - - 1 - 1 - 1 - 1 - - 1'
                    },
                    {
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3),
                        ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim),
                    },
                    {
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        shaker: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim),
                    },
                    {
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3),
                        ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim)
                    }
                ];
            case SectionType.Refrao:
                return [{
                        tamborim: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3)
                    },
                    {
                        tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim),
                        ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3)
                    },
                    {
                        tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim),
                        ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        surdo3: generateRhythmSheet(generateSheetGroove(16), surdo3),
                    },
                ];
            case SectionType.Ponte:
                const groove = generateSheetGroove(16);
                return [
                    {
                        tamborim: generateRhythmSheet(mutateSheetGroove(groove), tamborim),
                        ganza: '1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4',
                        caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        surdo3: generateRhythmSheet(mutateSheetGroove(groove), surdo3),
                    },
                    {
                        tamborim: generateRhythmSheet(mutateSheetGroove(groove), tamborim),
                        ganza: generateRhythmSheet(mutateSheetGroove(groove), ganza),
                        caixa: generateRhythmSheet(mutateSheetGroove(groove), caixa),
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        surdo3: generateRhythmSheet(mutateSheetGroove(groove), surdo3),
                    },
                    {
                        tamborim: generateRhythmSheet(mutateSheetGroove(groove), tamborim),
                        ganza: generateRhythmSheet(mutateSheetGroove(groove), ganza),
                        caixa: generateRhythmSheet(mutateSheetGroove(groove), caixa),
                        surdo1: generateRhythmSheet(mutateSheetGroove(groove), surdo1),
                        surdo2: generateRhythmSheet(mutateSheetGroove(groove), surdo2),
                        surdo3: generateRhythmSheet(mutateSheetGroove(groove), surdo3),
                    },
                    {
                        tamborim: generateRhythmSheet(mutateSheetGroove(groove), tamborim),
                        ganza: generateRhythmSheet(mutateSheetGroove(groove), ganza),
                        caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        surdo3: generateRhythmSheet(mutateSheetGroove(groove), surdo3),
                    },
                    {
                        tamborim: generateRhythmSheet(mutateSheetGroove(groove), tamborim),
                        ganza: generateRhythmSheet(mutateSheetGroove(groove), ganza),
                        caixa: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16',
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        surdo3: generateRhythmSheet(mutateSheetGroove(groove), surdo3),
                    },
                    {
                        tamborim: generateRhythmSheet(generateSheetGroove(16), tamborim),
                        ganza: generateRhythmSheet(generateSheetGroove(16), ganza),
                        caixa: generateRhythmSheet(generateSheetGroove(16), caixa),
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        surdo3: generateRhythmSheet(mutateSheetGroove(groove), surdo3),
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
                        tamborim: generateRhythmSheet(mutateSheetGroove(groove), tamborim),
                        ganza: '- - - - - - 1 2 3 4 1 - - - - -',
                        caixa: generateRhythmSheet(generateSheetGroove(16), caixa),
                        surdo1: '1 - - - 2 - - - 3 - - - 2 - - -',
                        surdo2: '- - 1 - - - 2 - - - 3 - - - 2 -',
                        surdo3: '- 2 - 1 - 3 3 2 1 - - 4 4 3 3 -',
                    },
                    {
                        tamborim: '- 1 - 1 - - 1 - 1 - 1 - 1 - - -',
                        ganza: '- - - - - - - - - - - - 1 2 3 4',
                        caixa: '- - 16 - - - 16 - - - 16 - - - 16 - ',
                        surdo1: generateRhythmSheet(mutateSheetGroove(groove), surdo1),
                        surdo2: generateRhythmSheet(mutateSheetGroove(groove), surdo2),
                        surdo3: '4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4',
                    },
                    {
                        tamborim: '1 2 3 4 1 - 1 - 1 - - - - -',
                        ganza: '1 2 3 4 1 - 1 - 1 - 1 2 1 - 1 -',
                        caixa: '1 2 3 4 1 - 5 - 9 - - - - - - -',
                        surdo1: '1 - - 2 - - - - - - - - - - - -',
                        surdo2: '2 - - 1 - - - - - - - - - - - -',
                        surdo3: '- - - - - - - - - - 3 - 3 - 3 -',
                    },
                    {
                        tamborim: '1 - - 1 - - 1 - - - 1 - 1 - - -',
                        ganza: '1 - - 1 - - 1 - 1 2 3 4 1 2 3 4',
                        caixa: generateRhythmSheet(mutateSheetGroove(groove), caixa),
                        surdo1: '1 - - 1 - - 1 - - - 1 - 1 - - -',
                        surdo2: '1 - - 1 - - 1 - - - 1 - 1 - - -',
                        surdo3: '1 - - 1 - - 1 - - - 1 - 1 3 2 1',
                    },
                    {
                        tamborim: '1 2 3 4 1 - 1 - 1 - - -',
                        ganza: '1 2 3 4 1 - 1 - 1 - - - - - - -',
                        caixa: '1 2 3 4 1 - 1 - 1 - - - - - - -',
                        surdo1: '1 - - - - - - - 3 - - - 2 - - -',
                        surdo2: '- - - - - - 2 - - - 3 - - - 2 -',
                        surdo3: '- - - - - - - - - - 4 3 3 2 2 1',
                    },
                ];
        }
    }
    generateMelody(sectionType) {
        const syncopations = [
            [1, 1, 0, 1, 1, 0, 1, 0],
            [1, 1, 0, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 1, 0, 0, 1, 0],
            [1, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 1, 0],
        ];
        const sambaMelodies = [
            [0, 0, 0, 0, 0, 8, 8, 8],
            [0, 0, 0, 0, 0, 5, 5, 5],
            [8, 1, 1, 3, 5, 7, 6, 0],
            [8, 8, 7, 6, 8, 8, 7, 6],
            [1, 2, 3, 5, 7, 6, 5, 0],
            [5, 4, 3, 2, 1, -7, 1, 2],
            [5, 5, 0, 5, 4, 4, 0, 4],
            [4, 4, 0, 4, 3, 3, 0, 3],
            [1, 1, 0, 1, 1, -7, 0, 2],
            [1, 1, 0, 1, -7, 0, 2, 0],
            [1, 1, 0, 1, -7, 0, 2, 0],
            [8, 3, 5, 8, 3, 5, 8, 0],
            [8, 8, 7, 6, 5, 5, 4, 3],
            [8, 8, 7, 6, 8, 8, 7, 6],
            [1, 0, 2, 0, 3, 0, 4, 0],
            [4, 3, 2, 1, 4, 3, 2, 1],
            [5, 4, 3, 2, 5, 4, 3, 2],
            [8, 7, 6, 5, 8, 7, 6, 5],
            [5, 0, 0, 0, 0, 5, 5, 5],
            [5, 5, 0, 5, 0, 5, 5, 5],
            [4, 0, 0, 0, 0, 4, 4, 4],
            [4, 4, 0, 4, 0, 4, 4, 4],
            [3, 0, 0, 0, 0, 3, 3, 3],
            [3, 3, 0, 3, 0, 3, 3, 3],
            [8, 0, 0, 0, 0, 8, 8, 8],
            [8, 8, 0, 8, 0, 8, 8, 8],
            [5, 5, 0, 5, 0, 4, 4, 4],
            [4, 4, 0, 4, 0, 5, 5, 5],
            [1, 1, 0, 1, 0, 1, 2, 3],
            [1, 1, 0, 1, 0, 1, 3, 5],
            [7, 6, 5, 7, 6, 5, 7, 0],
        ];
        switch (sectionType) {
            case SectionType.Ponte:
                return [{
                        flute: '-'
                    }];
            default:
                return [
                    {
                        flute: parseNumbers(generateAxialMelodySheet(generateSheetGroove(16)), flute, Mixolydian, 10),
                    },
                    {
                        flute: parseNumbers(generateAxialMelodySheet(syncopations[roll(syncopations.length) - 1]), flute, Mixolydian, 10) + ' ' + parseNumbers(generateAxialMelodySheet(syncopations[roll(syncopations.length) - 1]), flute, Mixolydian, 10)
                    },
                    {
                        flute: parseNumbers(generateAxialMelodySheet(syncopations[roll(syncopations.length) - 1]), flute, Mixolydian, 10) + ' ' + parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(8)), flute, Mixolydian, 10)
                    },
                    {
                        flute: parseNumbers(generateGapFillMelodySheet(generateSheetGroove(8)), flute, Lydian, 10) + ' ' + parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(8)), flute, Mixolydian, 10)
                    },
                    {
                        flute: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(16)), flute, Mixolydian, 10),
                    },
                    {
                        flute: parseNumbers(generateLinearPatternMelodySheet(generateSheetGroove(8)), flute, Mixolydian, 10) + ' ' + parseNumbers(generateGapFillMelodySheet(generateSheetGroove(8)), flute, Major, 10)
                    },
                    {
                        flute: parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Mixolydian, 10) + ' ' + parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Mixolydian, 10),
                    },
                    {
                        flute: parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Lydian, 10) + ' ' + parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Lydian, 10),
                    },
                    {
                        flute: parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Lydian, 10) + ' ' + parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Mixolydian, 10),
                    },
                    {
                        flute: parseNumbers(generateAxialMelodySheet(syncopations[roll(syncopations.length) - 1]), flute, Mixolydian, 10) + ' ' + parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Mixolydian, 10),
                    },
                    {
                        flute: parseNumbers(sambaMelodies[roll(sambaMelodies.length - 1)], accordion, Mixolydian, 10) + ' ' + parseNumbers(generateAxialMelodySheet(syncopations[roll(syncopations.length) - 1]), flute, Mixolydian, 10)
                    }
                ];
        }
    }
    getNextProgressionCount(sectionType) {
        return 4;
    }
    getNextMeasureCount(sectionType, progressionIndex, progressionCount) {
        return 16;
    }
}
class Funk extends Style {
    constructor() {
        super(StyleName.Funk, 135, 4 / 16);
        this.sections = [SectionType.Intro, SectionType.Refrao, SectionType.Verso, SectionType.Refrao, SectionType.Ponte, SectionType.Refrao, SectionType.Refrao];
    }
    generateHarmony(sectionType) {
        switch (sectionType) {
            case SectionType.Intro:
                return [
                    {
                        bass: 'c1'
                    },
                ];
            case SectionType.Ponte:
            case SectionType.Verso:
                if (roll(2) > 1) {
                    return [
                        { bass: 'c1' },
                        { bass: 'c1' },
                        { bass: 'g1' },
                        { bass: 'f1' },
                        { bass: 'd#1' },
                    ];
                }
                else {
                    return [{
                            bass: 'c1 g1'
                        },
                        {
                            bass: 'g#1 g1'
                        }];
                }
            default:
                if (roll(2) > 1) {
                    return [
                        { bass: 'a2 c1' },
                        { bass: 'c1 c1' },
                        { bass: 'c1 g1' },
                        { bass: 'g1 g1' },
                        { bass: 'f1 f1' },
                        { bass: 'c1 a1' },
                        { bass: 'g#1 g1' },
                        { bass: 'c1 c#1' },
                        { bass: 'c1 d1' },
                    ];
                }
                else {
                    return [
                        { bass: 'c1' },
                        { bass: 'g1' },
                        { bass: 'f1' },
                        { bass: 'd#1' },
                    ];
                }
        }
    }
    generateRhythm(sectionType) {
        const clave = [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0];
        const rhythmOneShotFunkInstruments = [funkHighPercussion, funkKick, funkLoop, funkVoice];
        const rhythmVaryingFunkInstruments = [shaker, triangle, tamborim, caixa, cuica, vibraslap];
        const funkKickGrooves = [
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,],
        ];
        function produceFunkArrangement(maxInstrumentNo) {
            const arrangement = rhythmOneShotFunkInstruments.concat(rhythmVaryingFunkInstruments)
                .filter((instrument) => instrument.path !== 'funk_loop')
                .map((instrument) => (roll(2) > 1) ? instrument : null)
                .filter(instrument => instrument !== null);
            if (arrangement.length === 0)
                arrangement.push(funkHighPercussion);
            if (arrangement.length > maxInstrumentNo)
                arrangement.slice(0, maxInstrumentNo);
            const combinedSheets = arrangement.reduce((accumulator, instrument) => {
                const currentClave = roll(3) > 2 ? mutateSheetGroove(clave) : clave;
                const alteredClaveBool = currentClave.map((note) => (roll(4) > 1 ? false : !!(note === 1)));
                let sheet = '';
                const chosenSample = (rhythmOneShotFunkInstruments.includes(instrument)) ? (roll(instrument.samples.length)).toString() : null;
                for (let index = 0; index < alteredClaveBool.length; index++) {
                    rhythmOneShotFunkInstruments.includes(instrument) ?
                        sheet += alteredClaveBool[index] ? `${chosenSample} ` : '- ' :
                        sheet += alteredClaveBool[index] ? `${(roll(instrument.samples.length)).toString()} ` : '- ';
                }
                accumulator[instrument.path] = sheet.trim();
                return accumulator;
            }, {});
            return combinedSheets;
        }
        switch (sectionType) {
            case SectionType.Intro:
                return [produceFunkArrangement(3)];
            case SectionType.Refrao:
                function loop4thNote() {
                    const chosenSample = (roll(funkKick.samples.length)).toString();
                    let sheet = '';
                    for (let i = 0; i < 4; i++) {
                        sheet += `${chosenSample} - - - `;
                    }
                    return sheet;
                }
                function claveToSheet() {
                    const chosenSample = (roll(funkHighPercussion.samples.length)).toString();
                    let sheet = '';
                    for (let note = 0; note < clave.length; note++) {
                        if (clave[note] === 1) {
                            if (roll(4) > 1)
                                sheet += `${chosenSample} `;
                            else
                                sheet += '- ';
                        }
                        else
                            sheet += '- ';
                    }
                    return sheet;
                }
                return [{
                        funk_kick: loop4thNote(),
                        funk_high_percussion: claveToSheet(),
                        funk_loop: funkLoop.samples[roll(funkLoop.samples.length) - 1].toString()
                    }, {
                        funk_kick: loop4thNote(),
                        funk_high_percussion: claveToSheet(),
                    },
                    {
                        funk_kick: loop4thNote(),
                        funk_high_percussion: claveToSheet(),
                        drop: (roll(drop.samples.length)).toString()
                    },
                    {
                        funk_kick: generateRhythmSheet(funkKickGrooves[roll(funkKickGrooves.length - 1)], funkKick),
                        funk_high_percussion: claveToSheet(),
                        cuica: generateRhythmSheet(clave, cuica),
                        drop: (roll(drop.samples.length)).toString()
                    }, Object.assign(Object.assign({}, produceFunkArrangement(2)), { funk_kick: loop4thNote(), funk_high_percussion: claveToSheet(), drop: (roll(drop.samples.length)).toString() }),];
            case SectionType.Verso:
            case SectionType.Ponte:
                return [{
                        funk_voice: generateSkippingNoteRhythmSheet([1, 0, 1, 0, 1, 0, 1, 0], funkVoice) + ' ' + generateSkippingNoteRhythmSheet([0, 0, 1, 0], funkVoice)
                    },
                    {
                        funk_voice: generateSkippingNoteRhythmSheet([1, 0, 1, 0, 1, 0, 1, 0], funkVoice)
                    },
                    {
                        funk_voice: generateSkippingNoteRhythmSheet(generateSheetGroove(8), funkVoice),
                        funk_high_percussion: generateRhythmSheet(mutateSheetGroove(clave), funkHighPercussion)
                    },
                    {
                        funk_voice: generateSkippingNoteRhythmSheet(mutateSheetGroove([1, 0, 0, 0, 1, 0, 0, 0]), funkVoice) + ' ' + generateSkippingNoteRhythmSheet([0, 0, 1, 0], funkVoice)
                    },
                    {
                        funk_voice: generateSkippingNoteRhythmSheet(mutateSheetGroove([1, 0, 0, 0, 1, 0, 0, 0]), funkVoice)
                    },
                    {
                        funk_loop: generateSkippingNoteRhythmSheet([1, 0, 0, 0, 0, 0, 0, 0,], funkLoop),
                        drop: generateRhythmSheet([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,], drop),
                        vibraslap: roll(vibraslap.samples.length) + ' '
                    },
                    {
                        funk_high_percussion: generateRhythmSheet(funkKickGrooves[roll(funkKickGrooves.length - 1)], funkLoop),
                        drop: generateRhythmSheet(funkKickGrooves[roll(funkKickGrooves.length - 1)], drop),
                        vibraslap: roll(vibraslap.samples.length) + ' '
                    },
                    {
                        funk_high_percussion: generateRhythmSheet(funkKickGrooves[roll(funkKickGrooves.length - 1)], funkLoop),
                        drop: generateRhythmSheet(funkKickGrooves[roll(funkKickGrooves.length - 1)], drop),
                    },
                    {
                        funk_kick: generateRhythmSheet(funkKickGrooves[roll(funkKickGrooves.length - 1)], funkKick),
                        drop: roll(drop.samples.length) + ' ',
                        vibraslap: roll(vibraslap.samples.length) + ' '
                    },
                    {
                        funk_loop: roll(funkLoop.samples.length) + ' ',
                        drop: roll(drop.samples.length) + ' ',
                        triangle: generateRhythmSheet(mutateSheetGroove(generateSheetGroove(16)), triangle)
                    }, Object.assign({ funk_loop: generateRhythmSheet([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,], funkLoop), drop: generateRhythmSheet([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,], drop) }, produceFunkArrangement(3)), produceFunkArrangement(5),
                    {
                        funk_high_percussion: claveToSheet(),
                    },
                    {
                        funk_high_percussion: generateRhythmSheet([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,], funkHighPercussion),
                    },
                    {
                        drop: roll(drop.samples.length) + ' '
                    },
                    {
                        vibraslap: roll(vibraslap.samples.length) + ' '
                    },
                    {
                        funk_high_percussion: generateRhythmSheet([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,], funkHighPercussion),
                        drop: roll(drop.samples.length) + ' '
                    },
                    {
                        funk_high_percussion: claveToSheet(),
                        drop: roll(drop.samples.length) + ' '
                    }];
        }
    }
    generateMelody(sectionType) {
        const clave = [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0];
        const full8thNote = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
        const highRegisterPiano = piano;
        highRegisterPiano.centerOctave = 5;
        const melodyFunkInstruments = [funkBrass, highRegisterPiano, stab, flute, harpsichord, dulcimer, brassStab];
        const funkRaveSheets = [
            'c3 - - c3 - - c3 - - - d3 - d3 - - -',
            'c3 - - c3 - - c3 - - - d3 - - d3 - -',
            'c3 - - c3 - - c3 - - - c#3 - - c#3 - -',
            'c3 - - c3 - - c3 - - - - - - - - -',
            'c3 - - c3 - - c3 - - - - - c#3 - - -',
            'c3 - - f3 - - e3 - - - d#3 - d3 - - -',
            'c3 - - c3 - - c3 - - - d3 - c#3 - - -',
            'c3 - - c3 - - c3 - - - d#3 - c#3 - - -',
            'c3 - - c3 - - c3 - - - d#3 - b2 - - -',
            'g3 - - g3 - - g3 - - a3 - - g#3 - - -',
            'c3 - - c3 - - c3 - - - d3 - b2 - - -',
            '- - - c3 - - c3 - - - c#3 - c#3 - - -',
            'c4 - - g4 - - g4 - - - g4 - g#3 - - -',
            'c4 - - g4 - - g4 - - - - - g#3 - - -',
            'c5 - - g5 - - g5 - - - - - g#5 - - -',
            'c4 c3 - c4 c3  - c4 c4 c3 - c4 c3 - - -',
            'c4 c3 - c4 c3  - c4 c4 c3 - a3 a3 - - -',
            'c3 - - b2 - - c3 - - - b2 - b2 - - -',
            'c3 - - c3 - - c3 - - - c#3 - c#3 - - -',
            '- - - c3 - - c3 - - - c3 - c3 - - -',
            '- - - c3 - - c3 - - - - - c3 - - -',
            '- - - c3 - - c3 - - - - - c#3 - - -',
            '- - - c3 - - c3 - - - - - b3 - - -',
            `c3 - - - - - - - - - c3 - c3 - c3 -`,
            `c4 - - - - - - - - - c4 - c4 - c4 -`,
            `c4 - - - - - - - a3 - a3 - a3 - a3 -`,
            'c3 - - c#3 - - d#3 - - - c#3 - c3 - - -',
            'c3 - - c#3 - - d#3 - - - c#3 - c#3 - - -',
            'c4 - - c#4 - - c4 - - - c4 - b3 - - -',
        ];
        const funkMelodySheets = [
            'c4 - - - - - c3 - d4 - c4 - d4 - d#4 - ',
            'd#4 - - - d#4 - d4 - g4 - - - g4 - - - ',
            '- - - - d#4 - d4 - g4 - g4 - g#4 - g#4 - ',
            'c4 - - - - - f4 - d#4 - d#4 - c#4 - c#4 - ',
            'c4 - - - - - d#4 - c#4 - c4 - a#3 - c#4 - ',
            'c4 - - - - - - - d#4 - - - c#4 - - -',
            'c4 - - - d4 - - - d#4 - - - d4 - - -',
            'c4 - - - d4 - - - c4 - - - d4 - - -',
            'c4 - - - d4 - - - c4 - - - d#4 - - -',
            'g4 - - - - - - - g4 - - - - - - -',
            'g4 - - - d#4 - - - g4 - - - d#4 - - -',
            'g4 - - - d#4 - - - f4 - - - c4 - - -',
            'c4 - - - g4 - f4 - d#4 - f4 - d#4 - c#4 - ',
            '- - - - g4 - - - d#4 - - - f4 - d#4 - ',
            'g4 - - - f4 - - - g4 - - - f4 - - -',
            'g4 - - - d#4 - - - d4 - - - c4 - - -',
            'g4 - d#4 - f4 - d#4 - d4 - - - c4 - - -',
            'g4 - - - f4 - - - d#4 - d#4 - d4 - c#4 -',
            'c4 - - c4 - - c4 - g4 - f4 - d#4 - d4 -',
            'g4 - g4 - g4 - g4 - g4 - g#4 - g4 - f4 -',
            'c4 - g4 - g4 - g4 - g4 - - - g4 - g#4 -',
            'f4 - f4 - f4 - f4 - f4 - f4 - f4 - f4 -',
            'g4 - f4 - d#4 - d4 - c4 - - - - - - -',
            'c4 - c4 - g#4 - g#4 - g4 - g4 - - - d4 -',
            'c4 - d4 - d#4 - d4 - c4 - d4 - d#4 - d4 - ',
            '- - - - - - - -  c4 - d4 - d#4 - d4 - ',
            '- - - - a3 - a3 -  a3 - a3 - a3 - a3 - ',
            'c4 - - - g4 - - - c4 - g4 - g4 - g4 - ',
            'c4 - d4 - c4 - d4 - c4 - d4 - c4 - d4 -',
            'c4 - d#4 - c4 - d#4 - c4 - d#4 - c4 - d#4 -',
            'c4 - c#4 - c4 - c#4 - c4 - c#4 - c4 - c#4 -',
            'c4 - - - g4 - - - f4 - - - g4 - - - ',
            'c4 - - - d4 - d#4 - d4 - d#4 - d4 - d#4 -',
            '- - - - g4 - - - g4 - - - - - - -',
            '- - - - d#4 - - - d4 - - - d#4 - - -',
            '- - - - d4 - - - d#4 - - - d4 - - -',
        ];
        const chosenInstrument = melodyFunkInstruments[roll(melodyFunkInstruments.length) - 1];
        switch (sectionType) {
            case SectionType.Intro:
                if (roll(4) > 3)
                    return [{ [chosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)] }];
                return [{
                        flute: parseNumbers(generateGapFillMelodySheet(mutateSheetGroove(clave)), flute, Minor, 3)
                    },
                    {
                        [chosenInstrument.path]: parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(clave)), chosenInstrument, Minor, 3),
                    },
                    {
                        [chosenInstrument.path]: parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(full8thNote)), chosenInstrument, Minor, 3),
                    },
                    {
                        [chosenInstrument.path]: parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(full8thNote)), chosenInstrument, Minor, 3),
                    },
                    {
                        [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        flute: funkMelodySheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        [chosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        flute: '-'
                    }
                ];
            case SectionType.Refrao:
                return [{
                        [chosenInstrument.path]: parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(clave)), chosenInstrument, Minor, 3),
                    },
                    {
                        [chosenInstrument.path]: parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(full8thNote)), chosenInstrument, Minor, 3),
                    },
                    {
                        [chosenInstrument.path]: parseNumbers(generateAxialMelodySheet(mutateSheetGroove(full8thNote)), chosenInstrument, Minor, 3),
                    },
                    {
                        [chosenInstrument.path]: parseNumbers(generateLinearPatternMelodySheet([0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,]), chosenInstrument, Minor, 3),
                    },
                    {
                        [chosenInstrument.path]: parseNumbers(generateGapFillMelodySheet(mutateSheetGroove(full8thNote)), chosenInstrument, Minor, 3),
                    },
                    {
                        [chosenInstrument.path]: parseNumbers(generateLinearPatternMelodySheet([0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0]), chosenInstrument, Minor, 3),
                    },
                    {
                        [chosenInstrument.path]: parseNumbers(generateRandomNotes(16), chosenInstrument, Minor, 3),
                    },
                    {
                        [chosenInstrument.path]: parseNumbers(generateGapFillMelodySheet(mutateSheetGroove(clave)), chosenInstrument, Minor, 3),
                    },
                    {
                        [chosenInstrument.path]: parseNumbers(generateAxialMelodySheet(mutateSheetGroove(clave)), chosenInstrument, Minor, 3),
                    },
                    {
                        [chosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        [chosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        stab: funkRaveSheets[roll(funkRaveSheets.length - 1)],
                        [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        stab: funkRaveSheets[roll(funkRaveSheets.length - 1)],
                        [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        [melodyFunkInstruments[roll(melodyFunkInstruments.length) - 1].path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        [melodyFunkInstruments[roll(melodyFunkInstruments.length) - 1].path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        [melodyFunkInstruments[roll(melodyFunkInstruments.length) - 1].path]: funkRaveSheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        stab: funkRaveSheets[roll(funkRaveSheets.length - 1)]
                    },
                    {
                        funk_brass: funkRaveSheets[roll(funkRaveSheets.length - 1)]
                    }
                ];
            case SectionType.Verso:
                const verseChosenInstrument = melodyFunkInstruments[roll(melodyFunkInstruments.length) - 1];
                return [
                    { [verseChosenInstrument.path]: parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(full8thNote)), verseChosenInstrument, Minor, 3) },
                    { [verseChosenInstrument.path]: parseNumbers(generateAxialMelodySheet(mutateSheetGroove(full8thNote)), verseChosenInstrument, Minor, 3) },
                    { [verseChosenInstrument.path]: parseNumbers(generateGapFillMelodySheet(mutateSheetGroove(full8thNote)), verseChosenInstrument, Minor, 3) },
                    { [verseChosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)] },
                    { [verseChosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)] },
                    { [verseChosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
                    { [verseChosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
                    { [verseChosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
                    { [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
                    { [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
                    { [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
                ];
            case SectionType.Ponte:
                const bridgeChosenInstrument = melodyFunkInstruments[roll(melodyFunkInstruments.length) - 1];
                return [
                    { [bridgeChosenInstrument.path]: parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(full8thNote)), bridgeChosenInstrument, Minor, 3) },
                    { [bridgeChosenInstrument.path]: parseNumbers(generateAxialMelodySheet(mutateSheetGroove(full8thNote)), bridgeChosenInstrument, Minor, 3) },
                    { [bridgeChosenInstrument.path]: parseNumbers(generateGapFillMelodySheet(mutateSheetGroove(full8thNote)), bridgeChosenInstrument, Minor, 3) },
                    { [bridgeChosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
                    { [bridgeChosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
                    { [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
                    { [bridgeChosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)] },
                    { [bridgeChosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)] },
                    { [chosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)] },
                ];
        }
    }
    getNextProgressionCount(sectionType) {
        return 4;
    }
    getNextMeasureCount(sectionType, progressionIndex, progressionCount) {
        return 4;
    }
}
class Player {
    constructor() {
        this.nextTime = -1;
        this.samplePosition = new Map();
        this.visualizer = null;
    }
    playSample(sample, time) {
        if (!sample)
            return;
        const source = audioContext.createBufferSource();
        source.buffer = sample.buffer;
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start(time);
        if (this.visualizer) {
            let xIndex = this.samplePosition.get(sample.index);
            if (xIndex === undefined) {
                xIndex = this.samplePosition.size;
                this.samplePosition.set(sample.index, xIndex);
            }
            this.visualizer.playSample(sample, time, xIndex, this.samplePosition.size);
        }
    }
    playSection(section) {
        const currentTime = audioContext.currentTime;
        if (this.nextTime < 0)
            audioContext.resume().catch(console.error);
        const startTime = ((this.nextTime < currentTime) ? (currentTime + 0.075) : this.nextTime);
        this.nextTime = startTime + section.duration;
        section.play(this, startTime);
    }
}
const audioContext = new AudioContext();
const player = new Player();
const volumeSlider = document.getElementById('volumeSlider');
const gainNode = audioContext.createGain();
let currentStyle = null;
function updateVolume() {
    const dB = parseInt(volumeSlider.value);
    // dB = 20.log Mag
    // dB/20 = log Mag
    // 10 ^ (dB/20) = Mag
    gainNode.gain.value = (dB <= -40 ? 0 : Math.pow(10, dB / 20));
}
function parseQueryString() {
    const assoc = {};
    const keyValues = location.search.substring(1).split("&");
    for (let i in keyValues) {
        const pair = keyValues[i].split("=");
        if (pair.length > 1) {
            assoc[decodeURIComponent(pair[0].replace(/\+/g, " "))] = decodeURIComponent(pair[1].replace(/\+/g, " "));
        }
    }
    return assoc;
}
;
async function setup() {
    const queryString = parseQueryString();
    let itemId;
    switch (queryString["style"]) {
        case "jazz":
            currentStyle = new Jazz();
            itemId = "itemJazz";
            break;
        case "funk":
            currentStyle = new Funk();
            itemId = "itemFunk";
            break;
        case "samba":
            currentStyle = new Samba();
            itemId = "itemSamba";
            break;
        default:
            currentStyle = new Forro();
            itemId = "itemForro";
            break;
    }
    const item = document.getElementById(itemId);
    item.classList.add("active");
    document.getElementById("headingStyle").textContent = item.textContent;
    updateVolume();
    try {
        await SampleSet.loadSamples();
    }
    catch (ex) {
        console.error("Error loading the samples: " + (ex.message || ex));
        return;
    }
}
setup();
function playStyle(style, section) {
    const generatedSection = style.generateSection(section);
    player.playSection(generatedSection);
    return generatedSection;
}
function playCurrentStyle() {
    const generatedSections = [
        currentStyle.generateSection(SectionType.Intro),
        currentStyle.generateSection(SectionType.Verso),
        currentStyle.generateSection(SectionType.Ponte),
        currentStyle.generateSection(SectionType.Refrao)
    ];
    for (let index = 0; index < currentStyle.sections.length; index++) {
        const currentSection = generatedSections.find(section => section.type === currentStyle.sections[index]);
        player.playSection(currentSection);
    }
}
class Visualizer {
    constructor() {
        this.samples = [];
        this.canvas = document.getElementById("canvas");
        this.canvasWidth = 800 * devicePixelRatio;
        this.canvasHeight = 400 * devicePixelRatio;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.canvas.style.maxWidth = "100%";
        this.canvas.style.width = "800px";
        this.canvas.style.height = "400px";
        this.context = this.canvas.getContext("2d", { alpha: false });
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.maxInstrumentCount = 1;
        this.boundUpdateDisplay = this.updateDisplay.bind(this);
        requestAnimationFrame(this.boundUpdateDisplay);
    }
    updateDisplay() {
        requestAnimationFrame(this.boundUpdateDisplay);
        const samples = this.samples;
        const context = this.context;
        const canvasWidth = this.canvasWidth;
        const canvasHeight = this.canvasHeight;
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        const currentTime = audioContext.currentTime;
        const currentTimeLimitBottom = currentTime - 0.1;
        const currentTimeLimitTop = currentTime + 4;
        for (let i = samples.length - 1; i >= 0; i--) {
            const sample = samples[i];
            if (sample.time < currentTimeLimitBottom) {
                samples.splice(i, 1);
                continue;
            }
            if (sample.time > currentTimeLimitTop) {
                continue;
            }
            const y = canvasHeight - (canvasHeight * (sample.time - currentTime) / 4);
            context.fillStyle = sample.sample.color;
            context.fillRect(14 + (canvasWidth - 28) * (sample.xIndex / this.maxInstrumentCount), y - 28, 14, 28);
        }
    }
    playSample(sample, time, xIndex, maxInstrumentCount) {
        if (this.maxInstrumentCount < maxInstrumentCount)
            this.maxInstrumentCount = maxInstrumentCount;
        this.samples.push({
            sample,
            time,
            xIndex
        });
    }
}
player.visualizer = new Visualizer();
