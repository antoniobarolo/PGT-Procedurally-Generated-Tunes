function roll(size) {
    return Math.floor(Math.random() * size) + 1;
}
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
    SectionType[SectionType["Intro"] = 0] = "Intro";
    SectionType[SectionType["Refrao"] = 1] = "Refrao";
    SectionType[SectionType["Ponte"] = 2] = "Ponte";
    SectionType[SectionType["Verso"] = 3] = "Verso";
})(SectionType || (SectionType = {}));
var ScaleDegree;
(function (ScaleDegree) {
    ScaleDegree[ScaleDegree["Root"] = 1] = "Root";
    ScaleDegree[ScaleDegree["Second"] = 2] = "Second";
    ScaleDegree[ScaleDegree["Third"] = 3] = "Third";
    ScaleDegree[ScaleDegree["Fourth"] = 4] = "Fourth";
    ScaleDegree[ScaleDegree["Fifth"] = 5] = "Fifth";
    ScaleDegree[ScaleDegree["Sixth"] = 6] = "Sixth";
    ScaleDegree[ScaleDegree["Seventh"] = 7] = "Seventh";
    ScaleDegree[ScaleDegree["Silence"] = 0] = "Silence";
})(ScaleDegree || (ScaleDegree = {}));
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
const ExampleInstrument = {
    centerOctave: 4,
    samples: ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
        'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
        'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
        'C6']
};
const exampleSheet = [1, -7, 1, 3, 1, 0, 8, 0];
function parseNumbers(sheet, Instrument, scale, rootNote) {
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
        return noteNames[noteNumber] + (Instrument.centerOctave + octaveShift);
    });
    return parsedSheet.join(" ");
}
const parsedSheet = parseNumbers(exampleSheet, ExampleInstrument, Minor, 0);
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
                    // Procura pela última entrada não-nula
                    if (sheet[i]) {
                        i++;
                        if (maxSheetLength < i)
                            maxSheetLength = i;
                        break;
                    }
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
            const sequences = progressions[0].sequences;
            for (let s = 0; s < sequences.length; s++) {
                const sequence = sequences[s];
                const instrumentNamePrefix = sequence.instrumentName;
                const sheet = sequence.sheet;
                for (let i = 0; i < sheet.length; i++) {
                    if (sheet[i]) {
                        //const sampleName = instrumentNamePrefix + "_" + sheet[i];
                        const sampleName = instrumentNamePrefix + "/" + sheet[i];
                        const sample = SampleSet.getSample(sampleName);
                        if (!sample)
                            throw new Error("Missing sample: " + sampleName);
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
        // no prox semestre, no documento explicaremos a lógica de notação da sheet como ABNF
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
    generateSection(sectionType, bpm, noteDuration) {
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
                let instrumentSetArray = this.rhythm.get(sectionType);
                if (!instrumentSetArray)
                    throw new Error("instrumentSetArray is null");
                const rhythmInstrumentSet = Style.pickInstrumentSet(instrumentSetArray);
                for (let instrumentName in rhythmInstrumentSet) {
                    let sheet = rhythmInstrumentSet[instrumentName];
                    if (typeof sheet !== "string")
                        sheet = sheet.generate(this.name, MeasureCategory.Rhythm, progression, progressionCount, measure, measureCount);
                    const parsedSheet = Style.parseSheet(sheet, sheetPadding);
                    if (maxMeasureSheet < parsedSheet.length - sheetPadding)
                        maxMeasureSheet = parsedSheet.length - sheetPadding;
                    sequences.push({
                        instrumentName,
                        sheet: parsedSheet
                    });
                }
                instrumentSetArray = this.melody.get(sectionType);
                if (!instrumentSetArray)
                    throw new Error("instrumentSetArray is null");
                const melodyInstrumentSet = Style.pickInstrumentSet(instrumentSetArray);
                for (let instrumentName in melodyInstrumentSet) {
                    let sheet = melodyInstrumentSet[instrumentName];
                    if (typeof sheet !== "string")
                        sheet = sheet.generate(this.name, MeasureCategory.Melody, progression, progressionCount, measure, measureCount);
                    const parsedSheet = Style.parseSheet(sheet, sheetPadding);
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
class Forro extends Style {
    constructor() {
        super(StyleName.Forro, 115, 4 / 16);
    }
    generateHarmony(sectionType) {
        switch (sectionType) {
            case SectionType.Intro:
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
                    }
                ];
            case SectionType.Ponte:
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
                    }
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
        switch (sectionType) {
            case SectionType.Intro:
                return [
                    {
                        zabumba: "k1 - s k2 - - - k1",
                        triangle: "1 2 3 2 1 2 3 2"
                    },
                ];
            case SectionType.Ponte:
                return [
                    {
                        zabumba: "k1 - s k2 - - - k1",
                    },
                    {
                        zabumba: "k1 - s k2 - - - k1",
                    },
                    {
                        zabumba: "k1 - - - - - - k1",
                    },
                ];
            case SectionType.Verso:
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
    generateMelody(sectionType) {
        switch (sectionType) {
            case SectionType.Intro:
                return [
                    {
                        accordion: "d5 f5 e5 d5 a5 g5 f5 g5"
                    },
                    {
                        accordion: "b4 - a4 - d4 d4 d4 d4"
                    },
                    {
                        accordion: "d5 b4 c5 a4 b4 f4 a4 f4"
                    },
                    {
                        accordion: "b4 b4 a5 a5"
                    },
                    {
                        accordion: "d5 d4 d4 d5 d4 d4 b4 c4"
                    },
                    {
                        accordion: "d4 - - - c5 a4 b4 - "
                    },
                    {
                        accordion: "a5 - f5 - a4 - d5 - "
                    },
                    {
                        accordion: "d5 - a4 - d5 - a4 - "
                    },
                    {
                        accordion: "d5 - - a4 d5 - - a4 "
                    },
                    {
                        accordion: "- - d5 d5 d5 d5 d5 e5"
                    },
                    {
                        accordion: 'f5 f5 f5 f5 e5 d5 d5 d5'
                    },
                    {
                        accordion: 'd5 - - c5 e5 - c5 - '
                    },
                    {
                        accordion: 'f5 - g5 - a5 - - - '
                    },
                    {
                        accordion: 'g5 - - - f5 - - - '
                    },
                    {
                        accordion: 'c5 b4 - - a4 g4 f4 - '
                    },
                    {
                        accordion: 'f4 - a4 - c5 - a4 g4'
                    },
                    {
                        accordion: 'f4 - a4 - c5 - a4 g4'
                    },
                    {
                        accordion: 'f4 - g4 - a4 - c5 - '
                    },
                    {
                        accordion: 'g5 - - f5 a5 g5 - -'
                    },
                    {
                        accordion: 'f5 a5 g5 - - f5 e5'
                    },
                    {
                        accordion: 'g5 f5 e5 d5 c5 e5 d5 -'
                    },
                    {
                        accordion: 'd5 c5 b4 a4 f4 a4 g4 -'
                    },
                    {
                        accordion: 'g5 - - a5 g5 -- f5'
                    },
                    {
                        accordion: 'g5 - - d5 g5 g5 d5 g5'
                    },
                    {
                        accordion: 'f5 g5 a5 - - - g5 -'
                    },
                ];
            case SectionType.Ponte:
                return [
                    {
                        accordion: "c5 - - f5"
                    },
                    {
                        accordion: "d5 - - c5"
                    },
                    {
                        accordion: "c5 c5 c5 d5"
                    },
                    {
                        accordion: "f5 e5 e5 d5"
                    },
                    {
                        accordion: "d5 a5 a5 a5"
                    },
                ];
            case SectionType.Verso:
                return [
                    {
                        accordion: "d5 f5 e5 d5"
                    },
                    {
                        accordion: "c5 - b4"
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
                        accordion: "b4 - a4"
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
        super(StyleName.Jazz, 100, 1.2);
    }
    generateHarmony(sectionType) {
        switch (sectionType) {
            case SectionType.Intro:
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
            case SectionType.Ponte:
                return [
                    {
                        piano: 'a4 b4 c5 b4',
                        bass: 'a3 g3 f3 e3',
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
                        ride: '- 3 3 - 3 3',
                        kick: '1 - - - - -',
                        snare: '- - - 1 - 1'
                    },
                    {
                        ride: '- 3 3 - 3 3',
                        kick: '1 - - - - -',
                        snare: '1 - 1 1 - 1'
                    },
                    {
                        ride: '- 3 3 3 - -',
                        kick: '1 - - 1 - -',
                        snare: '- - - 1 1 1'
                    },
                    {
                        ride: '- 3 3 - 3',
                        kick: '1 - - 1 1',
                        snare: '- 1 1 - -'
                    },
                    {
                        ride: '3 - 3 - 3 -',
                        kick: '1 - - 1 - ',
                        snare: '- 1 - 1 - 1'
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
        switch (sectionType) {
            case SectionType.Intro:
                return [
                    {
                        sax: 'a4 b4 c5 e5 d5 -'
                    },
                    {
                        sax: 'e5 d5 - g4 a4 -'
                    },
                    {
                        sax: 'g4 a4 b4 g4 e4 -'
                    },
                    {
                        sax: 'a4 - - - - -'
                    },
                    {
                        sax: 'a5 - - - - -'
                    },
                    {
                        sax: 'a4 - - - - -'
                    },
                    {
                        sax: 'c5 a4 - - - -'
                    },
                    {
                        sax: 'e5 d#5 c5 a4 - -'
                    },
                    {
                        sax: 'e5 - d#5 - - -'
                    },
                    {
                        sax: 'e4 - g4 - a4 -'
                    },
                    {
                        sax: 'e4 - b4 - a4'
                    },
                    {
                        sax: 'a5 c6 b5 a5 g5 a5'
                    },
                    {
                        sax: 'g5 e5 d#5 d5 c5 b5'
                    },
                    {
                        sax: 'a4 e5 d#5 - - -'
                    },
                    {
                        sax: '- a4 e5 d#5 - - e5'
                    },
                    {
                        sax: '- - - e4 g4 c5'
                    },
                    {
                        sax: '- - - - a4 b4'
                    },
                    {
                        sax: 'd5 c5 e5 d5 g5 e5'
                    },
                    {
                        sax: 'a4 c5 e5 g5 b5 -'
                    },
                    {
                        sax: 'b5 c6 b5 - - -'
                    },
                    {
                        sax: 'b5 c6 b5 a5 g5 a5'
                    },
                    {
                        sax: 'g5 - - g5 g5 g5'
                    },
                    {
                        sax: 'e5 - - - - -'
                    },
                    {
                        sax: '- e5 g5 e5 d#5 d5'
                    },
                    {
                        sax: '- - - - e4 g4'
                    },
                    {
                        sax: '- - - - e5 g5'
                    },
                    {
                        sax: 'a4 c5 e5 d#5 - -'
                    },
                    {
                        sax: 'e5 d#5 c5 a4 - -'
                    },
                    {
                        sax: 'g5 b5 g5 b5 g5 -'
                    },
                    {
                        sax: '- - e4 g4 d4 -'
                    },
                    {
                        sax: 'a4 - - - e4 a4'
                    },
                    {
                        sax: 'a4 c5 d5 c5 e5 -'
                    },
                    {
                        sax: 'a4 c5 d5 c5 a5 -'
                    },
                    {
                        sax: '- - e5 d#5 e5 c5'
                    },
                    {
                        sax: 'e5 f5 e5 - e5 f5'
                    },
                    {
                        sax: 'a4 g4 a4 c5 d5 c5'
                    },
                    {
                        sax: 'g4 a4 c5 g4 a4 -'
                    },
                    {
                        sax: 'a4 b4 c5 d5 b4 -'
                    },
                    {
                        sax: 'g4 a4 - - g4 a4'
                    },
                    {
                        sax: 'g5 - - - f5 e5'
                    },
                    {
                        sax: 'g5 - - - - -'
                    },
                    {
                        sax: ' - f5 e5 g5 f5 e5'
                    },
                    {
                        sax: 'e5 - - - - -'
                    },
                    {
                        sax: 'a5 g5 e5 d5 c5 a4'
                    },
                    {
                        sax: 'a5 g5 e5 d#5 - -'
                    },
                    {
                        sax: 'c5 - - - - -'
                    },
                    {
                        sax: 'b5 - - - - -'
                    },
                    {
                        sax: 'd5 - - - - -'
                    },
                    {
                        sax: 'd#5 - - - g5 e5'
                    },
                    {
                        sax: 'g4 - - - b4 g4'
                    },
                    {
                        sax: 'd5 e5 f5 e5 f5 g5'
                    },
                    {
                        sax: '- - - - c5 b4'
                    },
                    {
                        sax: '- - - - - g4'
                    },
                ];
            case SectionType.Ponte:
                function randomNotes() {
                    let sheet = [];
                    for (let note = 0; note < 6; note++) {
                        sheet.push(roll(9) - 1);
                    }
                    return sheet;
                }
                const ExInstrument = {
                    centerOctave: 4,
                    samples: ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
                        'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
                        'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
                        'C6']
                };
                const Minor = [0, 2, 3, 5, 7, 8, 10];
                return [
                    {
                        sax: parseNumbers(randomNotes(), ExInstrument, Minor, 0)
                    }
                ];
            default:
                return [
                    {
                        sax: 'a4 - - a5 - -'
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
    }
    generateHarmony(sectionType) {
        switch (sectionType) {
            case SectionType.Intro:
                return [
                    {
                        bass: '-'
                    },
                ];
            default:
                return [
                    {},
                ];
        }
    }
    generateRhythm(sectionType) {
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
            default:
                return [
                    {
                        tamborim: '1 - 2 - 3 - 4',
                        ganza: '1 - 2 - 3 - 4',
                        caixa: '1 - 2 - 3 - 4',
                        surdo1: '1 - - -',
                        surdo2: '- - 1 -',
                    },
                ];
        }
    }
    generateMelody(sectionType) {
        switch (sectionType) {
            case SectionType.Intro:
                return [{
                        stab: '-'
                    }];
            default:
                return [
                    {},
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
    }
    generateHarmony(sectionType) {
        switch (sectionType) {
            case SectionType.Intro:
                return [
                    {
                        bass: '- - - -'
                    },
                ];
            default:
                return [
                    {},
                ];
        }
    }
    generateRhythm(sectionType) {
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
    generateMelody(sectionType) {
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
                    {},
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
class Instrument {
    constructor(path, samples, centerOctave, color, role) {
        this.path = path;
        this.samples = samples;
        this.centerOctave = centerOctave;
        this.color = color;
        this.role = role;
    }
}
const bass = new Instrument('bass', ["bass/a2",
    "bass/a#2",
    "bass/b2",
    "bass/c3",
    "bass/c#3",
    "bass/d3",
    "bass/d#3",
    "bass/e3",
    "bass/f3",
    "bass/f#3",
    "bass/g3",
    "bass/g#3",
    "bass/a3",
    "bass/a#3",
    "bass/b3",
    "bass/c4",
    "bass/c#4",
    "bass/d4",
    "bass/d#4",
    "bass/e4",
    "bass/f4",
    "bass/f#4",
    "bass/g4",
    "bass/g#4",
    "bass/a4"], 3, "#2E149A", MeasureCategory.Harmony);
const piano = new Instrument('piano', ["piano/a2",
    "piano/a#2",
    "piano/b2",
    "piano/c3",
    "piano/c#3",
    "piano/d3",
    "piano/d#3",
    "piano/e3",
    "piano/f3",
    "piano/f#3",
    "piano/g3",
    "piano/g#3",
    "piano/a3",
    "piano/a#3",
    "piano/b3",
    "piano/c4",
    "piano/c#4",
    "piano/d4",
    "piano/d#4",
    "piano/e4",
    "piano/f4",
    "piano/f#4",
    "piano/g4",
    "piano/g#4",
    "piano/a4",
    "piano/a#4",
    "piano/b4",
    "piano/c5",
    "piano/c#5",
    "piano/d5",
    "piano/d#5",
    "piano/e5",
    "piano/f5",
    "piano/f#5",
    "piano/g5",
    "piano/g#5",
    "piano/a5",
    "piano/a#5",
    "piano/b5",
    "piano/c6",
    "piano/c#6",
    "piano/d6",
    "piano/d#6",
    "piano/e6",
    "piano/f6",
    "piano/f#6",
    "piano/g6",
    "piano/g#6",
    "piano/a6",], 3, "#FFFF00", MeasureCategory.Harmony);
const sax = new Instrument('sax', ["sax/a3",
    "sax/a#3",
    "sax/b3",
    "sax/c4",
    "sax/c#4",
    "sax/d4",
    "sax/d#4",
    "sax/e4",
    "sax/f4",
    "sax/f#4",
    "sax/g4",
    "sax/g#4",
    "sax/a4",
    "sax/a#4",
    "sax/b4",
    "sax/c5",
    "sax/c#5",
    "sax/d5",
    "sax/d#5",
    "sax/e5",
    "sax/f5",
    "sax/f#5",
    "sax/g5",
    "sax/g#5",
    "sax/a5",
    "sax/a#5",
    "sax/b5",
    "sax/c6",], 4, "#FFFF00", MeasureCategory.Melody);
const ride = new Instrument('ride', ["ride/3"], null, "#FFFF00", MeasureCategory.Rhythm);
const kick = new Instrument('kick', ["kick/1"], null, "#FFFF00", MeasureCategory.Rhythm);
const snare = new Instrument('snare', ["snare/1",
    "snare/2",
    "snare/3",
    "snare/4",
    "snare/5"], null, "#FFFF00", MeasureCategory.Rhythm);
const accordion = new Instrument('accordion', ["accordion/a3",
    "accordion/a#3",
    "accordion/b3",
    "accordion/c4",
    "accordion/c#4",
    "accordion/d4",
    "accordion/d#4",
    "accordion/e4",
    "accordion/f4",
    "accordion/f#4",
    "accordion/g4",
    "accordion/g#4",
    "accordion/a4",
    "accordion/a#4",
    "accordion/b4",
    "accordion/c5",
    "accordion/c#5",
    "accordion/d5",
    "accordion/d#5",
    "accordion/e5",
    "accordion/f5",
    "accordion/f#5",
    "accordion/g5",
    "accordion/g#5",
    "accordion/a5",], 4, "#8B331D", MeasureCategory.Melody);
const shaker = new Instrument('shaker', ["shaker/1", "shaker/2", "shaker/3", "shaker/4", "shaker/5",], null, "#FFFF00", MeasureCategory.Rhythm);
const triangle = new Instrument('triangle', ["triangle/1", "triangle/2", "triangle/3", "triangle/4",], null, "#FFFF00", MeasureCategory.Rhythm);
const xylo = new Instrument('xylo', ["xylo/a4", "xylo/a5", "xylo/b4", "xylo/c4", "xylo/c5", "xylo/d4", "xylo/d5", "xylo/e4", "xylo/e5", "xylo/f4", "xylo/f5", "xylo/g4", "xylo/g5"], null, "#FFFF00", MeasureCategory.Rhythm);
const zabumba = new Instrument('zabumba', ["zabumba/k1", "zabumba/k2", "zabumba/s"], null, "#FFFF00", MeasureCategory.Melody);
const tamborim = new Instrument('tamborim', ["tamborim/1", "tamborim/2", "tamborim/3", "tamborim/4",], null, "#FFFF00", MeasureCategory.Rhythm);
const caixa = new Instrument('shaker', ["caixa/1", "caixa/2", "caixa/3", "caixa/4",
    "caixa/5", "caixa/6", "caixa/7", "caixa/8",
    "caixa/9", "caixa/10", "caixa/11", "caixa/12",
    "caixa/13", "caixa/14", "caixa/15", "caixa/16",], null, "#E49885", MeasureCategory.Rhythm);
const surdo1 = new Instrument('surdo1', ["surdo1/1", "surdo1/2", "surdo1/3", "surdo1/4"], null, "#FFFF00", MeasureCategory.Rhythm);
const surdo2 = new Instrument('surdo2', ["surdo2/1", "surdo2/2", "surdo2/3", "surdo2/4"], null, "#FFFF00", MeasureCategory.Rhythm);
const surdo3 = new Instrument('surdo3', ["surdo3/1", "surdo3/2", "surdo3/3", "surdo3/4"], null, "#FFFF00", MeasureCategory.Rhythm);
const ganza = new Instrument('shaker', ["ganza/1", "ganza/2", "ganza/3", "ganza/4",], null, "#FFFF00", MeasureCategory.Rhythm);
const stab = new Instrument('stab', ["stab/a2",
    "stab/a#2",
    "stab/b2",
    "stab/c3",
    "stab/c#3",
    "stab/d3",
    "stab/d#3",
    "stab/e3",
    "stab/f3",
    "stab/f#3",
    "stab/g3",
    "stab/g#3",
    "stab/a3",
    "stab/a#3",
    "stab/b3",
    "stab/c4",
    "stab/c#4",
    "stab/d4",
    "stab/d#4",
    "stab/e4",
    "stab/f4",
    "stab/f#4",
    "stab/g4",
    "stab/g#4",
    "stab/a4",], 3, "#FFFF00", MeasureCategory.Melody);
const darkKick = new Instrument('dark_kick', ["dark_kick/1"], null, "#380B3F", MeasureCategory.Rhythm);
class SampleSet {
    static async loadSample(instrument, sample) {
        const path = sample;
        const response = await fetch('samples/' + path.replace("#", "%23") + '.wav');
        const arrayBuffer = await response.arrayBuffer();
        const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);
        SampleSet.samples.set(path, {
            index: 1,
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
}
SampleSet.instruments = [
    bass,
    piano,
    sax,
    ride,
    kick,
    snare,
    accordion,
    shaker,
    triangle,
    xylo,
    zabumba,
    tamborim,
    caixa,
    surdo1,
    surdo2,
    surdo3,
    ganza,
    stab,
    darkKick
];
SampleSet.samples = new Map();
class Player {
    constructor() {
        this.nextTime = -1;
        this.visualizer = null;
    }
    playSample(sample, time) {
        const source = audioContext.createBufferSource();
        source.buffer = sample.buffer;
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start(time);
        if (this.visualizer)
            this.visualizer.playSample(sample, time);
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
}
function playCurrentStyle() {
    playStyle(currentStyle, SectionType.Intro);
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
            context.fillRect(i * 14, y - 28, 14, 28);
        }
    }
    playSample(sample, time) {
        this.samples.push({
            sample,
            time
        });
    }
}
player.visualizer = new Visualizer();
