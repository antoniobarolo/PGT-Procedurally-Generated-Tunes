var StyleName;
(function (StyleName) {
    StyleName[StyleName["Forro"] = 0] = "Forro";
    StyleName[StyleName["Jazz"] = 1] = "Jazz";
    StyleName[StyleName["Rock"] = 2] = "Rock";
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
// Enum para representar as notas musicais
var Note;
(function (Note) {
    Note["A"] = "A";
    Note["B"] = "B";
    Note["C"] = "C";
    Note["D"] = "D";
    Note["E"] = "E";
    Note["F"] = "F";
    Note["G"] = "G";
})(Note || (Note = {}));
class Instrument {
}
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
const sheet = [1, -7, 1, 3, 1, 0, 8, 0];
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
        console.log(noteNumber);
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
    console.log(parsedSheet);
    return parsedSheet;
}
parseNumbers(sheet, ExampleInstrument, Minor, 0);
class Section {
    constructor(type, progressions, bpm) {
        this.bpm = bpm;
        // Assuming 120 BPM (120 = 0.5)
        this.beatDuration = 30 / bpm;
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
        this.duration = this.beatDuration * totalSheetLength;
    }
    play(player, startTime) {
        const beatDuration = this.beatDuration;
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
                        const sampleName = instrumentNamePrefix + "_" + sheet[i];
                        const sample = SampleSet.getSample(sampleName);
                        if (!sample)
                            throw new Error("Missing sample: " + sampleName);
                        player.playSample(sample, startTime + ((totalSheetLength + i) * beatDuration));
                    }
                }
            }
            totalSheetLength += maxSheetLength[p];
        }
    }
}
class Style {
    constructor(name, defaultBpm) {
        this.name = name;
        this.defaultBpm = defaultBpm;
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
    generateSection(sectionType, bpm) {
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
        return new Section(sectionType, progressions, bpm || this.defaultBpm);
    }
}
class Forro extends Style {
    constructor() {
        super(StyleName.Forro, 240);
    }
    generateHarmony(sectionType) {
        switch (sectionType) {
            case SectionType.Intro:
                return [
                    {
                        funkybass: 'a3 - b3 - ',
                        accordion: 'd4 - g4 - ',
                        xylo: 'f5 - g5 - ',
                    },
                    {
                        funkybass: 'd3 f4 e3 f4 ',
                        accordion: 'd4 - g4 - ',
                        xylo: 'd4 d5 d4 d5 ',
                    },
                    {
                        funkybass: 'd3 f4 e3 f4 ',
                        accordion: 'd4 - b4 a4',
                        xylo: 'd4 - - -',
                    }
                ];
            case SectionType.Ponte:
                return [
                    {
                        funkybass: 'd3 c4 a4 a4',
                        accordion: 'd4 - a4 e5',
                    },
                    {
                        funkybass: 'd3 f4 d3 f4',
                        accordion: 'f4 - g4 -',
                    },
                    {
                        funkybass: 'a2 - - - ',
                        accordion: 'a4 - - -',
                    }
                ];
            case SectionType.Verso:
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
                        accordion: "b5 - a5 - d5 d5 d5 d5"
                    },
                    {
                        accordion: "d6 b5 c6 a5 b5 f5 a5 f5"
                    },
                    {
                        accordion: "b5 b5 a5 a5"
                    },
                    {
                        accordion: "d5 d4 d4 d5 d4 d4 b4 c4"
                    },
                    {
                        accordion: "d5 - - - c6 a5 b5 - "
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
                        accordion: 'c6 b5 - - a5 g5 f5 - '
                    },
                    {
                        accordion: 'f4 - a4 - c5 - a4 g4'
                    },
                    {
                        accordion: 'f4 - a4 - c5 - a4 g4'
                    },
                    {
                        accordion: 'f4 - g4 - a4 - c6 - '
                    },
                    {
                        accordion: 'g5 - - f5 a5 g5 - -'
                    },
                    {
                        accordion: 'f5 a5 g5 - - f5 e5'
                    },
                    {
                        accordion: 'g6 f6 e6 d6 c6 e6 d6 -'
                    },
                    {
                        accordion: 'd6 c6 b5 a5 f5 a5 g5 -'
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
                        accordion: "c6 - b5"
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
    getNextProgressionCount(sectionType) {
        return 4;
    }
    getNextMeasureCount(sectionType, progressionIndex, progressionCount) {
        return 4;
    }
}
class Jazz extends Style {
    constructor() {
        super(StyleName.Jazz, 100);
    }
    generateHarmony(sectionType) {
        switch (sectionType) {
            case SectionType.Intro:
                return [
                    {
                        piano: 'c4 b3',
                        funkybass: 'a3 e3',
                    },
                    {
                        piano: 'e4 e4',
                        funkybass: 'a3 e3',
                    },
                    {
                        piano: 'g4 g4',
                        funkybass: 'a3 e3',
                    },
                    {
                        piano: 'd4 e4 a4 g4',
                        funkybass: 'b3 e3 a3 a3',
                    },
                    {
                        piano: 'd4 e4 d4 d4 c4 b3 c4 e4',
                        funkybass: 'b3 e3 g3 b3 a3 e3 f3 e3',
                    },
                    {
                        piano: 'g4 g4 g4 g4',
                        funkybass: 'a3 g3 f3 e3',
                    },
                ];
            default:
                return [
                    {
                        piano: 'c4 b3',
                        funkybass: 'a3 e3',
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
                        sax: 'e5 eb5 c5 a4 - -'
                    },
                    {
                        sax: 'e5 - eb5 - - -'
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
                        sax: 'g5 e5 eb5 d5 c5 b5'
                    },
                    {
                        sax: 'a4 e5 eb5 - - -'
                    },
                    {
                        sax: '- a4 e5 eb5 - - e5'
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
                        sax: '- e5 g5 e5 eb5 d5'
                    },
                    {
                        sax: '- - - - e4 g4'
                    },
                    {
                        sax: '- - - - e5 g5'
                    },
                    {
                        sax: 'a4 c5 e5 eb5 - -'
                    },
                    {
                        sax: 'e5 eb5 c5 a4 - -'
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
                        sax: '- - e5 eb5 e5 c5'
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
                        sax: 'a5 g5 e5 eb5 - -'
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
                        sax: 'eb5 - - - g5 e5'
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
// interface Sample {
// 	index: number;
// 	path: string;
// 	color: string;
// 	buffer: AudioBuffer;
// }
class SampleSet {
    static async loadSample(index) {
        const path = SampleSet.samplePaths[index];
        const response = await fetch('samples/' + path + '.wav');
        const arrayBuffer = await response.arrayBuffer();
        const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);
        SampleSet.samples.set(path, {
            index,
            path,
            color: SampleSet.sampleColors[index],
            buffer: decodedAudio
        });
    }
    static async loadSamples() {
        const promises = new Array(SampleSet.samplePaths.length);
        for (let i = 0; i < SampleSet.samplePaths.length; i++)
            promises[i] = SampleSet.loadSample(i);
        await Promise.all(promises);
    }
    static getSample(name) {
        return SampleSet.samples.get(name);
    }
}
SampleSet.samplePaths = ["accordion_a3", "accordion_a4", "accordion_a5", "accordion_a6", "accordion_b3", "accordion_b4", "accordion_b5", "accordion_c4", "accordion_c5", "accordion_c6", "accordion_d4", "accordion_d5", "accordion_d6", "accordion_e4", "accordion_e5", "accordion_e6", "accordion_f4", "accordion_f5", "accordion_f6", "accordion_g4", "accordion_g5", "accordion_g6", "funkybass_a2", "funkybass_a3", "funkybass_a4", "funkybass_b2", "funkybass_b3", "funkybass_c3", "funkybass_c4", "funkybass_d3", "funkybass_d4", "funkybass_e3", "funkybass_e4", "funkybass_f3", "funkybass_f4", "funkybass_g3", "funkybass_g4",
    //percussion
    "ride_3", "hihat_1", "kick_1", "snare", "snare_1", "snare_2", "snare_3", "snare_4", "shaker_1", "shaker_2", "shaker_3", "shaker_4", "shaker_5",
    "triangle", "triangle_1", "triangle_2", "triangle_3", "xylo_a4", "xylo_a5", "xylo_b4", "xylo_c4", "xylo_c5", "xylo_d4", "xylo_d5", "xylo_e4", "xylo_e5", "xylo_f4", "xylo_f5", "xylo_g4", "xylo_g5", "zabumba_k1", "zabumba_k2", "zabumba_s",
    //piano
    "piano_c2", "piano_d2", "piano_e2", "piano_f2", "piano_g2", "piano_a2", "piano_b2",
    "piano_c3", "piano_d3", "piano_e3", "piano_f3", "piano_g3", "piano_a3", "piano_b3",
    "piano_c4", "piano_d4", "piano_e4", "piano_f4", "piano_g4", "piano_a4", "piano_b4",
    "piano_c5", "piano_d5", "piano_e5", "piano_f5", "piano_g5", "piano_a5", "piano_b5",
    "piano_c6", "piano_d6", "piano_e6", "piano_f6", "piano_g6", "piano_a6", "piano_b6",
    "piano_c7",
    //sax
    "sax_c3", "sax_d3", "sax_eb3", "sax_e3", "sax_f3", "sax_g3", "sax_a3", "sax_b3",
    "sax_c4", "sax_d4", "sax_eb4", "sax_e4", "sax_f4", "sax_g4", "sax_a4", "sax_b4",
    "sax_c5", "sax_d5", "sax_eb5", "sax_e5", "sax_f5", "sax_g5", "sax_a5", "sax_b5",
    "sax_c6"
];
SampleSet.sampleColors = ["#FFFF00", "#FFFA00", "#FFF400", "#FFEF00", "#FFEA00", "#FFE500", "#FFE000", "#FFDB00", "#FFD600", "#FFD100", "#FFCC00", "#FFC700", "#FFC200", "#FFBD00", "#FFB800", "#FFB300", "#FFAE00", "#FFA900", "#FFA400", "#FF9F00", "#FF9A00", "#FF9500",
    "#191970", "#22227A", "#2B2B84", "#34348E", "#3D3D98", "#4646A2", "#4F4FAC", "#5858B6", "#6161C0", "#6A6ACA", "#7373D4", "#7C7CDE", "#8585E8", "#8E8EF2", "#9797FC",
    //percussion
    "D7C385", "#0ff", "#00f", "#f0f", "884C4C", "884C4C", "884C4C", "884C4C",
    //shaker
    "#E5CBA7", "#D9B08A", "#CC956E", "#BF7A51", "#B25F35",
    "#C0C0C0", "#C9C9C9", "#D2D2D2", "#DBDBDB",
    "#ADFF2F", "#B5FF2C", "#BEFF29", "#C6FF26", "#CEFF23", "#D7FF20", "#DFFF1D", "#E7FF1A", "#F0FF17", "#F8FF14", "#FFFF11", "#FFFF0E", "#FFFF0B",
    "#8B4513", "#A0522D", "#CD853F",
    //piano
    "#281E39", "#36244D", "#442B60", "#513176", "#5F388B", "#6D3FA0", "#7B46B4",
    "#895DAB", "#9764BF", "#A66AD3", "#B471E8", "#C379FC", "#D081F7", "#DE88EB",
    "#EC8FF0", "#F997E5", "#FF9EE0", "#FFA5DA", "#FFACD5", "#FFB3D0", "#FFBADB",
    "#FFC2D6", "#FFC9D0", "#FFD0CB", "#FFD7C6", "#FFE0C4", "#FFE9C3", "#FFF2C2",
    "#FFFBC1", "#FFFDB6",
    //sax
    "#CD7F32", "#C88C3E", "#C29A4B", "#BDA758", "#B8B465", "#AFC173", "#AACF80", "#A5DC8C",
    "#9FE999", "#9AF6A6", "#95FFB3", "#90FFC0", "#8BFFCD", "#85FFDA", "#80FFE6", "#7BFFF3",
    "#76FFFD", "#82FFFD", "#8EFFFD", "#9BFFFE", "#A7FFFE", "#B3FFFE", "#C0FFFF", "#CCFFFF",
    "#D9FFFF"
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
volumeSlider.addEventListener('input', () => {
    const volume = parseFloat(volumeSlider.value);
    gainNode.gain.value = volume;
});
volumeSlider.value = '0.5';
async function setup() {
    try {
        await SampleSet.loadSamples();
    }
    catch (ex) {
        console.error("Error loading the samples: " + (ex.message || ex));
        return;
    }
}
setup();
function test(section) {
    const forr = new Forro();
    const teste = forr.generateSection(section);
    player.playSection(teste);
}
function playStyle(style, section) {
    const generatedSection = style.generateSection(section);
    player.playSection(generatedSection);
}
class Visualizer {
    constructor() {
        this.samples = [];
        this.canvas = document.getElementById("canvas");
        this.canvasWidth = 800 * devicePixelRatio;
        this.canvasHeight = 400 * devicePixelRatio;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
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
            context.fillRect(sample.sample.index * 14, y - 28, 14, 28);
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
