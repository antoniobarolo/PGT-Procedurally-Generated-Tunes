function randomNotes(measureLength: number) {
    let sheet: number[] = []
    for (let n = 0; n < measureLength; n++) {
        sheet.push(roll(9) - 1)
    }
    return sheet
}

//samba:
function generateSectionRhythm(progressionCount?: number) {
    progressionCount ?? 2 ** roll(3);
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
            measures.push(generateMeasureRhythm(8) as string)
            : measures.push(alterMeasureRhythm())
    }
    return measures.join()
}

function generateMeasureRhythm(measureLength: number): Sheet {
    if (roll(2) > 1) {
        //pickRandomMeasure()
    }
    if (roll(2) > 1) {
        //alterRandomMeasure()
    }
    //for i in Instrument
    //for n in timeSignature
    //n = 1 | 0
    let measure = ''
    for (let index = 0; index < measureLength; index++) {
        roll(2) > 1 ? measure += ' - ' :
            measure += ` ${roll(4)} `
    }
    return measure
}

function alterMeasureRhythm() {
    return "a"
}

function alterProgressionRhythm(progression: string) { return progression }

function setNewBaseProgression(progressions: string[]) {
    generateProgressionRhythm(progressions)
}

function generateChordNotesForMelody(chord: number) {
    return Math.abs(chord) + roll(3) * 2
}

//TODO
//se for pra fazer as funcoes que tao no texto tem que refazer a estrutura da sheets pra uma visao global a partir da section
//  linear pattern: graus conjuntos entre notas de acorde
//  gap fill: salto e dps preenchimento
//  axial melodies: cobrinha
// ou seja, generateSection tem que ir pro style
//samples do funk
//como nao vai ter linguagens formais ja podia fazer a funcao song que concatena tudo numa ordem especifica