"use strict";
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
class Session {
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
                        const sample = SampleSet.getSample(instrumentNamePrefix + "_" + sheet[i]);
                        if (!sample)
                            throw new Error("Missing sample: " + instrumentNamePrefix + "_" + sheet[i]);
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
    generateSession(sessionType, bpm) {
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
                    if (maxMeasureSheet < parsedSheet.length - sheetPadding)
                        maxMeasureSheet = parsedSheet.length - sheetPadding;
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
        return new Session(sessionType, progressions, bpm || this.defaultBpm);
    }
}
class Forro extends Style {
    constructor() {
        super(StyleName.Forro, 240);
    }
    generateHarmony(sessionType) {
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
                        xylo: 'd4 d5 d4 d5 ',
                    },
                    {
                        funkybass: 'd3 f4 e3 f4 ',
                        accordion: 'd4 - b4 a4',
                        xylo: 'd4 - - -',
                    }
                ];
            case SessionType.Ponte:
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
    generateRhythm(sessionType) {
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
    generateMelody(sessionType) {
        switch (sessionType) {
            case SessionType.Intro:
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
                ];
            case SessionType.Ponte:
                return [
                    {
                        accordion: "c5 - - f5"
                    },
                    {
                        accordion: "d5 - - c5"
                    },
                ];
            case SessionType.Verso:
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
    getNextProgressionCount(sessionType) {
        return 4;
    }
    getNextMeasureCount(sessionType, progressionIndex, progressionCount) {
        return 4;
    }
}
class SampleSet {
    static async loadSample(path) {
        const response = await fetch('samples/' + path + '.wav');
        const arrayBuffer = await response.arrayBuffer();
        const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);
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
SampleSet.samplePaths = ["accordion_a3", "accordion_a4", "accordion_a5", "accordion_a6", "accordion_b3", "accordion_b4", "accordion_b5", "accordion_c4", "accordion_c5", "accordion_c6", "accordion_d4", "accordion_d5", "accordion_d6", "accordion_e4", "accordion_e5", "accordion_e6", "accordion_f4", "accordion_f5", "accordion_f6", "accordion_g4", "accordion_g5", "accordion_g6", "funkybass_a2", "funkybass_a3", "funkybass_a4", "funkybass_b2", "funkybass_b3", "funkybass_c3", "funkybass_c4", "funkybass_d3", "funkybass_d4", "funkybass_e3", "funkybass_e4", "funkybass_f3", "funkybass_f4", "funkybass_g3", "funkybass_g4", "hihat", "kick", "snare", "triangle", "triangle_1", "triangle_2", "triangle_3", "xylo_a4", "xylo_a5", "xylo_b4", "xylo_c4", "xylo_c5", "xylo_d4", "xylo_d5", "xylo_e4", "xylo_e5", "xylo_f4", "xylo_f5", "xylo_g4", "xylo_g5", "zabumba_k1", "zabumba_k2", "zabumba_s"];
SampleSet.samples = new Map();
class Player {
    constructor() {
        this.nextTime = -1;
    }
    playSample(sample, time) {
        const source = audioContext.createBufferSource();
        source.buffer = sample;
        source.connect(audioContext.destination);
        source.start(time);
    }
    playSession(session) {
        const currentTime = audioContext.currentTime;
        if (this.nextTime < 0)
            audioContext.resume().catch(console.error);
        const startTime = ((this.nextTime < currentTime) ? (currentTime + 0.075) : this.nextTime);
        this.nextTime = startTime + session.duration;
        session.play(this, startTime);
    }
}
const audioContext = new AudioContext();
const player = new Player();
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
function test(session) {
    const forr = new Forro();
    const teste = forr.generateSession(session);
    player.playSession(teste);
}
