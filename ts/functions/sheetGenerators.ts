function randomNotes(measureLength: number): number[] {
    let sheet: number[] = []
    for (let n = 0; n < measureLength; n++) {
        sheet.push(roll(9) - 1)
    }
    return sheet
}

function generateRandomNote(instrument: Instrument): number {
    return roll(9) - 1
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

function generateSheetGroove(measureLength: number): number[] {
    const sheet = []
    for (let i = 0; i < measureLength; i++) {
        sheet.push(roll(2) - 1)
    }
    return sheet
}

function generateSkippingNoteRhythmSheet(grooveSheet: number[], instrument: Instrument): Sheet {
    let sheet = ''
    for (const note of grooveSheet) {
        if (note === 0) { sheet += ' - - ' }
        if (note === 1) {
            sheet += roll(instrument.samples.length) + ' - '
        }
    }
    return sheet
}

function generateRhythmSheet(grooveSheet: number[], instrument: Instrument): Sheet {
    let sheet = ''
    for (const note of grooveSheet) {
        if (note === 0) { sheet += ' - ' }
        if (note === 1) {
            sheet += roll(instrument.samples.length) + ' '
        }
    }
    return sheet
}

function mutateSheetGroove(grooveSheet: number[]): number[] {
    for (let i = 0; i < grooveSheet.length; i++) {
        grooveSheet[i] = roll(3) > 2 ? grooveSheet[i] : grooveSheet[i] === 1 ? 0 : 1;
    }
    return grooveSheet;
}

function generateLinearPatternMelodySheet(baseSheet: number[], firstNote?: number): number[] {
    if (!baseSheet) throw new Error()
    let lastNote = firstNote ? firstNote : null;
    for (let note = 0; note < baseSheet.length; note++) {
        if (baseSheet[note] == 0) null
        else if (lastNote === null) {
            lastNote = roll(8)
            baseSheet[note] = lastNote
        }
        else {
            const rollResult = roll(7)
            switch (rollResult) {
                case 1:
                    baseSheet[note] = lastNote + 0
                    break;
                case 2:
                case 3:
                    baseSheet[note] = lastNote + 1
                    break;
                case 4:
                case 5:
                    baseSheet[note] = lastNote - 1
                    break;
                case 6:
                    baseSheet[note] = lastNote + 2
                    break;
                case 7:
                    baseSheet[note] = lastNote - 2
                    break;
            }
        }
    }
    return baseSheet
}

function generateGapFillMelodySheet(baseSheet: number[], chordNote?: number): number[] {
    if (!baseSheet) throw new Error()
    let lastNote = chordNote ? generateChordNotesForMelody(chordNote) : null;
    let gap = null;
    for (let note = 0; note < baseSheet.length; note++) {
        if (baseSheet[note] == 0) null
        else if (lastNote === null) {
            lastNote = roll(8)
            baseSheet[note] = lastNote
        }
        else if (!gap) {
            gap = roll(5) + 2;
            baseSheet[note] = gap + lastNote;
        }
        else {
            baseSheet[note] = roll(4) > 3 ? lastNote : lastNote - 1
        }
    }
    return baseSheet
}

function generateAxialMelodySheet(baseSheet: number[], chordNote?: number): number[] {
    if (!baseSheet) throw new Error()
    const firstNote = roll(8)
    const startingDirection = roll(2) > 1 ? 1 : -1
    const noteSequence = [firstNote, firstNote + startingDirection, firstNote, firstNote - startingDirection];
    let noteSequenceIndex = 0

    let lastNote = chordNote ? generateChordNotesForMelody(chordNote) : null;
    for (let note = 0; note < baseSheet.length; note++) {
        if (baseSheet[note] == 0) null
        else if (lastNote === null) {
            lastNote = firstNote
            baseSheet[note] = lastNote
        }
        else {
            baseSheet[note] = noteSequence[noteSequenceIndex]
        }
        noteSequenceIndex++
        if (noteSequenceIndex >= noteSequence.length - 1) noteSequenceIndex = 0;
    }
    return baseSheet
}



//TODO
// DEPR se for pra fazer as funcoes que tao no texto tem que refazer a estrutura da sheets pra uma visao global a partir da section
//  OK linear pattern: graus conjuntos entre notas de acorde
//  OK gap fill: salto e dps preenchimento
//  OK axial melodies: cobrinha
// DEPR ou seja, generateSection tem que ir pro style (mentira)
//  OK como nao vai ter linguagens formais ja podia fazer a funcao song que concatena tudo numa ordem especifica


//OK arrumar contagem da progression - 	// Procura pela última entrada não-nula (section - MaxSheetLenght, nao pode eliminar as nao nulas)
//bloqueio de clique pra esperar as samples carregarem
//OK encadear linearmente as sections
//avaliar a riqueza das partes

//remover o cursor piscando no slider