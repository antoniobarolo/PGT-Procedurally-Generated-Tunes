function parseSheet(sheet: string, sheetPadding: number): (string | null)[] {
    // no prox semestre, no documento explicaremos a lógica de notação da sheet como ABNF
    // "dm7 xyz8 a1 b3 c2c4c5"
    if (!sheet) return null
    const count = sheet.length;
    const notes: (string | null)[] = new Array(sheetPadding);

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

function parseNumbers(sheet: number[], instrument: Instrument, scale: number[], rootNote: number): string {
    sheet = sheet.map((note) => {
        if (note == 0)
            return undefined
        if (note < 0) {
            note = Math.abs(note)
            note = scale[note - 1]
            return note - 12 + rootNote
        }
        if (note > scale.length) {
            note = scale[note - scale.length - 1]
            return note + 12 + rootNote
        }
        return scale[note - 1] + rootNote
    })
    const parsedSheet = sheet.map((noteNumber) => {
        if (noteNumber === undefined)
            return "-"
        let octaveShift = 0
        while (noteNumber < 0) {
            noteNumber = noteNumber + noteNames.length
            octaveShift--;
        }
        while (noteNumber >= noteNames.length) {
            noteNumber = noteNumber - noteNames.length
            octaveShift++;
        }
        return noteNames[noteNumber] + (instrument.centerOctave + octaveShift)
    })
    return parsedSheet.join(" ")
}
