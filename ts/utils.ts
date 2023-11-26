function roll(size: number): number {
    return Math.floor(Math.random() * size) + 1;
}

function findInstrumentWithLowestOctave(instrumentSet: InstrumentSet): Sheet | null {
    let minInstrument: string | null = null;
    let minOctave = Infinity;

    for (const instrumentName in instrumentSet) {
        if (instrumentSet.hasOwnProperty(instrumentName)) {
            const instrument = SampleSet.getInstrumentByName(instrumentName)

            if (instrument && instrument.centerOctave < minOctave) {
                minOctave = instrument.centerOctave;
                minInstrument = instrumentName;
            }
        }
    }

    if (minInstrument !== null) {
        return instrumentSet[minInstrument];
    } else {
        return null;
    }
}

function getNoteFromNumber(noteNumber: number): string | undefined {
    const noteEntries = Object.entries(NoteNumber);

    for (const [note, value] of noteEntries) {
        if (value === noteNumber) {
            return note as string;
        }
    }
    return undefined;
}

function adjustMelodyToChordNote(instrumentSet: InstrumentSet, chord: string): InstrumentSet {
    if (!chord) return instrumentSet
    const chordNote = chord.slice(0, -1)
    const chordNoteNumber = NoteNumber[chordNote as keyof typeof NoteNumber];
    const possibleIntervals = [0, 0, 0, 3, 4, 7, 7, 10, 12, 12, 14]
    const newNote = getNoteFromNumber(chordNoteNumber + possibleIntervals[roll(possibleIntervals.length - 1)])
    if (!newNote) return instrumentSet

    for (const instrumentName in instrumentSet) {
        const notes = parseSheet(instrumentSet[instrumentName] as string, 0)
        if (!!notes[0]) notes[0] = newNote + SampleSet.getInstrumentByName(instrumentName).centerOctave

        instrumentSet[instrumentName] = notes.join(' ')
    }
    return instrumentSet
}