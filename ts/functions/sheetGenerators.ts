function generateSheetGroove(measureLength: number): number[] {
    const sheet = []
    for (let i = 0; i < measureLength; i++) {
        sheet.push(roll(2) - 1)
    }
    return sheet
}

function mutateSheetGroove(grooveSheet: number[]): number[] {
    for (let i = 0; i < grooveSheet.length; i++) {
        grooveSheet[i] = roll(3) > 2 ? grooveSheet[i] : grooveSheet[i] === 1 ? 0 : 1;
    }
    return grooveSheet;
}


function generateRhythmSheet(grooveSheet: number[], instrument: Instrument): string {
    let sheet = ''
    for (const note of grooveSheet) {
        if (note === 0) { sheet += ' - ' }
        if (note === 1) {
            sheet += roll(instrument.samples.length) + ' '
        }
    }
    return sheet
}

function generateSkippingNoteRhythmSheet(grooveSheet: number[], instrument: Instrument): string {
    let sheet = ''
    for (const note of grooveSheet) {
        if (note === 0) { sheet += ' - - ' }
        if (note === 1) {
            sheet += roll(instrument.samples.length) + ' - '
        }
    }
    return sheet
}

function generateRandomNotes(measureLength: number): number[] {
    let sheet: number[] = []
    for (let n = 0; n < measureLength; n++) {
        sheet.push(roll(9) - 1)
    }
    return sheet
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

function generateChordNotesForMelody(chord: number) {
    return Math.abs(chord) + roll(3) * 2
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

//CODIGO
//bloqueio de clique pra esperar as samples carregarem
//remover o cursor piscando no slider
//remover atributos e metodos nao usados

//TEXTO
//mudar arquitetura de classes
//revisar
//?