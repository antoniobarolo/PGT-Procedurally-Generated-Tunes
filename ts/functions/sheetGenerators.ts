function roll(size: number): number {
    return Math.floor(Math.random() * size) + 1;
}

function randomNotes(measureLength: number) {
    let sheet: number[] = []
    for (let n = 0; n < measureLength; n++) {
        sheet.push(roll(9) - 1)
    }
    return sheet
}

//samba:
function generateSectionRhythm() {
    const progressionCount = 2 ** roll(3);
    let progressions: string[] = []
    let baseProgression = generateProgressionRhythm(progressions);
    for (let i = 0; i < progressionCount; i++) {
        progressions.push(baseProgression)
    }
    for (let p in progressions) {
        p = alterProgressionRhythm(p)
        roll(2) > 1 ? setNewBaseProgression(progressions) : null
    }
}

function generateProgressionRhythm(progressions: string[]) {
    const measureCount = 2 ** roll(3);
    let measures: string[] = []
    for (let m = 0; m < measureCount; m++) {
        progressions ?
            measures.push(generateMeasureRhythm())
            : measures.push(alterMeasureRhythm())
    }
    return measures.join()
}

function generateMeasureRhythm() {
    if (roll(2) > 1) {
        //pickRandomMeasure()
    }
    if (roll(2) > 1) {
        //alterRandomMeasure()
    }
    //for i in Instrument
    //for n in timeSignature
    //n = 1 | 0

    return "a"
}

function alterMeasureRhythm() {
    return "a"
}

function alterProgressionRhythm(progression: string) { return progression }

function setNewBaseProgression(progressions: string[]) {
    generateProgressionRhythm(progressions)
}