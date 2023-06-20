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
var SectionType;
(function (SectionType) {
    SectionType[SectionType["Intro"] = 0] = "Intro";
    SectionType[SectionType["Refrao"] = 1] = "Refrao";
    SectionType[SectionType["Ponte"] = 2] = "Ponte";
    SectionType[SectionType["Verso"] = 3] = "Verso";
})(SectionType || (SectionType = {}));
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
SampleSet.samplePaths = ["accordion_a3", "accordion_a4", "accordion_a5", "accordion_a6", "accordion_b3", "accordion_b4", "accordion_b5", "accordion_c4", "accordion_c5", "accordion_c6", "accordion_d4", "accordion_d5", "accordion_d6", "accordion_e4", "accordion_e5", "accordion_e6", "accordion_f4", "accordion_f5", "accordion_f6", "accordion_g4", "accordion_g5", "accordion_g6", "funkybass_a2", "funkybass_a3", "funkybass_a4", "funkybass_b2", "funkybass_b3", "funkybass_c3", "funkybass_c4", "funkybass_d3", "funkybass_d4", "funkybass_e3", "funkybass_e4", "funkybass_f3", "funkybass_f4", "funkybass_g3", "funkybass_g4", "hihat", "kick", "snare", "triangle", "triangle_1", "triangle_2", "triangle_3", "xylo_a4", "xylo_a5", "xylo_b4", "xylo_c4", "xylo_c5", "xylo_d4", "xylo_d5", "xylo_e4", "xylo_e5", "xylo_f4", "xylo_f5", "xylo_g4", "xylo_g5", "zabumba_k1", "zabumba_k2", "zabumba_s"];
SampleSet.sampleColors = ["#FFFF00", "#FFFA00", "#FFF400", "#FFEF00", "#FFEA00", "#FFE500", "#FFE000", "#FFDB00", "#FFD600", "#FFD100", "#FFCC00", "#FFC700", "#FFC200", "#FFBD00", "#FFB800", "#FFB300", "#FFAE00", "#FFA900", "#FFA400", "#FF9F00", "#FF9A00", "#FF9500",
    "#191970", "#22227A", "#2B2B84", "#34348E", "#3D3D98", "#4646A2", "#4F4FAC", "#5858B6", "#6161C0", "#6A6ACA", "#7373D4", "#7C7CDE", "#8585E8", "#8E8EF2", "#9797FC",
    "#0ff", "#00f", "#f0f",
    "#C0C0C0", "#C9C9C9", "#D2D2D2", "#DBDBDB",
    "#ADFF2F", "#B5FF2C", "#BEFF29", "#C6FF26", "#CEFF23", "#D7FF20", "#DFFF1D", "#E7FF1A", "#F0FF17", "#F8FF14", "#FFFF11", "#FFFF0E", "#FFFF0B",
    "#8B4513", "#A0522D", "#CD853F"];
SampleSet.samples = new Map();
class Player {
    constructor() {
        this.nextTime = -1;
        this.visualizer = null;
    }
    playSample(sample, time) {
        const source = audioContext.createBufferSource();
        source.buffer = sample.buffer;
        source.connect(audioContext.destination);
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
