class Funk extends Style {
	readonly sections = [SectionType.Intro, SectionType.Refrao, SectionType.Verso, SectionType.Refrao, SectionType.Ponte, SectionType.Refrao, SectionType.Refrao]

	constructor() {
		super(StyleName.Funk, 135, 4 / 16);
	}

	protected generateHarmony(sectionType: SectionType): InstrumentSet[] {
		switch (sectionType) {
			case SectionType.Intro:
				return [
					{
						bass: 'c1'
					},
				];
			case SectionType.Ponte:
			case SectionType.Verso:
				if (roll(2) > 1) {
					return [
						{ bass: 'c1' },
						{ bass: 'c1' },
						{ bass: 'g1' },
						{ bass: 'f1' },
						{ bass: 'd#1' },]
				}
				else {
					return [{
						bass: 'c1 g1'
					},
					{
						bass: 'g#1 g1'
					}]
				}
			default:
				if (roll(2) > 1) {
					return [
						{ bass: 'a2 c1' },
						{ bass: 'c1 c1' },
						{ bass: 'c1 g1' },
						{ bass: 'g1 g1' },
						{ bass: 'f1 f1' },
						{ bass: 'c1 a1' },
						{ bass: 'g#1 g1' },
						{ bass: 'c1 c#1' },
						{ bass: 'c1 d1' },
					];
				}
				else {
					return [
						{ bass: 'c1' },
						{ bass: 'g1' },
						{ bass: 'f1' },
						{ bass: 'd#1' },
					]
				}
		}
	}

	protected generateRhythm(sectionType: SectionType): InstrumentSet[] {
		const clave = [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0]
		const rhythmOneShotFunkInstruments = [funkHighPercussion, funkKick, funkLoop, funkVoice]
		const rhythmVaryingFunkInstruments = [shaker, triangle, tamborim, caixa, cuica, vibraslap]

		const funkKickGrooves = [
			[1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
			[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,],
			[1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,],
		]

		function produceFunkArrangement(maxInstrumentNo: number) {
			const arrangement = rhythmOneShotFunkInstruments.concat(rhythmVaryingFunkInstruments)
				.filter((instrument) => instrument.path !== 'funk_loop')
				.map((instrument) => (roll(2) > 1) ? instrument : null)
				.filter(instrument => instrument !== null);

			if (arrangement.length === 0) arrangement.push(funkHighPercussion);
			if (arrangement.length > maxInstrumentNo) arrangement.slice(0, maxInstrumentNo)

			const combinedSheets = arrangement.reduce((accumulator, instrument) => {
				const currentClave = roll(3) > 2 ? mutateSheetGroove(clave) : clave
				const alteredClaveBool = currentClave.map((note) => (roll(4) > 1 ? false : !!(note === 1)));
				let sheet = '';
				const chosenSample = (rhythmOneShotFunkInstruments.includes(instrument)) ? (roll(instrument.samples.length)).toString() : null;

				for (let index = 0; index < alteredClaveBool.length; index++) {
					rhythmOneShotFunkInstruments.includes(instrument) ?
						sheet += alteredClaveBool[index] ? `${chosenSample} ` : '- ' :
						sheet += alteredClaveBool[index] ? `${(roll(instrument.samples.length)).toString()} ` : '- ';
				}

				accumulator[instrument.path] = sheet.trim();
				return accumulator;
			}, {});
			return combinedSheets
		}

		switch (sectionType) {
			case SectionType.Intro:

				return [produceFunkArrangement(3)];


			case SectionType.Refrao:
				function loop4thNote() {
					const chosenSample = (roll(funkKick.samples.length)).toString()
					let sheet = ''
					for (let i = 0; i < 4; i++) {
						sheet += `${chosenSample} - - - `
					}
					return sheet
				}
				function claveToSheet() {
					const chosenSample = (roll(funkHighPercussion.samples.length)).toString()
					let sheet = ''
					for (let note = 0; note < clave.length; note++) {
						if (clave[note] === 1) {
							if (roll(4) > 1) sheet += `${chosenSample} `
							else sheet += '- '
						}
						else sheet += '- '
					}
					return sheet
				}
				return [{
					funk_kick: loop4thNote(),
					funk_high_percussion: claveToSheet(),
					funk_loop: funkLoop.samples[roll(funkLoop.samples.length) - 1].toString()
				},
				{
					funk_kick: loop4thNote(),
					funk_high_percussion: claveToSheet(),
				},
				{
					funk_kick: loop4thNote(),
					funk_high_percussion: claveToSheet(),
					drop: (roll(drop.samples.length)).toString()
				},
				{
					funk_kick: generateRhythmSheet(funkKickGrooves[roll(funkKickGrooves.length - 1)], funkKick),
					funk_high_percussion: claveToSheet(),
					cuica: generateRhythmSheet(clave, cuica),
					drop: (roll(drop.samples.length)).toString()
				},
				{
					...produceFunkArrangement(2),
					funk_kick: loop4thNote(),
					funk_high_percussion: claveToSheet(),
					drop: (roll(drop.samples.length)).toString()
				},
				]

			case SectionType.Verso:
			case SectionType.Ponte:
				return [{
					funk_voice: generateSkippingNoteRhythmSheet([1, 0, 1, 0, 1, 0, 1, 0], funkVoice) + ' ' + generateSkippingNoteRhythmSheet([0, 0, 1, 0], funkVoice)
				},
				{
					funk_voice: generateSkippingNoteRhythmSheet([1, 0, 1, 0, 1, 0, 1, 0], funkVoice)
				},
				{
					funk_voice: generateSkippingNoteRhythmSheet(generateSheetGroove(8), funkVoice),
					funk_high_percussion: generateRhythmSheet(mutateSheetGroove(clave), funkHighPercussion)
				},
				{
					funk_voice: generateSkippingNoteRhythmSheet(mutateSheetGroove([1, 0, 0, 0, 1, 0, 0, 0]), funkVoice) + ' ' + generateSkippingNoteRhythmSheet([0, 0, 1, 0], funkVoice)
				},
				{
					funk_voice: generateSkippingNoteRhythmSheet(mutateSheetGroove([1, 0, 0, 0, 1, 0, 0, 0]), funkVoice)
				},
				{
					funk_loop: generateSkippingNoteRhythmSheet([1, 0, 0, 0, 0, 0, 0, 0,], funkLoop),
					drop: generateRhythmSheet([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,], drop),
					vibraslap: roll(vibraslap.samples.length) + ' '
				},
				{
					funk_high_percussion: generateRhythmSheet(funkKickGrooves[roll(funkKickGrooves.length - 1)], funkLoop),
					drop: generateRhythmSheet(funkKickGrooves[roll(funkKickGrooves.length - 1)], drop),
					vibraslap: roll(vibraslap.samples.length) + ' '
				},
				{
					funk_high_percussion: generateRhythmSheet(funkKickGrooves[roll(funkKickGrooves.length - 1)], funkLoop),
					drop: generateRhythmSheet(funkKickGrooves[roll(funkKickGrooves.length - 1)], drop),
				},
				{
					funk_kick: generateRhythmSheet(funkKickGrooves[roll(funkKickGrooves.length - 1)], funkKick),
					drop: roll(drop.samples.length) + ' ',
					vibraslap: roll(vibraslap.samples.length) + ' '
				},
				{
					funk_loop: roll(funkLoop.samples.length) + ' ',
					drop: roll(drop.samples.length) + ' ',
					triangle: generateRhythmSheet(mutateSheetGroove(generateSheetGroove(16)), triangle)
				},
				{
					funk_loop: generateRhythmSheet([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,], funkLoop),
					drop: generateRhythmSheet([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,], drop),
					...produceFunkArrangement(3)
				},
				produceFunkArrangement(5),
				{
					funk_high_percussion: claveToSheet(),
				},
				{
					funk_high_percussion: generateRhythmSheet([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,], funkHighPercussion),
				},
				{
					drop: roll(drop.samples.length) + ' '
				},
				{
					vibraslap: roll(vibraslap.samples.length) + ' '
				},
				{
					funk_high_percussion: generateRhythmSheet([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,], funkHighPercussion),
					drop: roll(drop.samples.length) + ' '
				},
				{
					funk_high_percussion: claveToSheet(),
					drop: roll(drop.samples.length) + ' '
				}
				]
		}
	}

	protected generateMelody(sectionType: SectionType): InstrumentSet[] {
		const clave = [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0]
		const full8thNote = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
		const highRegisterPiano = piano
		highRegisterPiano.centerOctave = 5
		const melodyFunkInstruments = [funkBrass, highRegisterPiano, stab, flute, harpsichord, dulcimer]

		const funkRaveSheets = [
			'c3 - - c3 - - c3 - - - d3 - d3 - - -',
			'c3 - - c3 - - c3 - - - d3 - - d3 - -',
			'c3 - - c3 - - c3 - - - c#3 - - c#3 - -',
			'c3 - - c3 - - c3 - - - - - - - - -',
			'c3 - - c3 - - c3 - - - - - c#3 - - -',
			'c3 - - f3 - - e3 - - - d#3 - d3 - - -',
			'c3 - - c3 - - c3 - - - d3 - c#3 - - -',
			'c3 - - c3 - - c3 - - - d#3 - c#3 - - -',
			'c3 - - c3 - - c3 - - - d#3 - b2 - - -',
			'g3 - - g3 - - g3 - - a3 - - g#3 - - -',
			'c3 - - c3 - - c3 - - - d3 - b2 - - -',
			'- - - c3 - - c3 - - - c#3 - c#3 - - -',
			'c4 - - g4 - - g4 - - - g4 - g#3 - - -',
			'c4 - - g4 - - g4 - - - - - g#3 - - -',
			'c5 - - g5 - - g5 - - - - - g#5 - - -',
			'c4 c3 - c4 c3  - c4 c4 c3 - c4 c3 - - -',
			'c4 c3 - c4 c3  - c4 c4 c3 - a3 a3 - - -',
			'c3 - - b2 - - c3 - - - b2 - b2 - - -',
			'c3 - - c3 - - c3 - - - c#3 - c#3 - - -',
			'- - - c3 - - c3 - - - c3 - c3 - - -',
			'- - - c3 - - c3 - - - - - c3 - - -',
			'- - - c3 - - c3 - - - - - c#3 - - -',
			'- - - c3 - - c3 - - - - - b3 - - -',
			`c3 - - - - - - - - - c3 - c3 - c3 -`,
			`c4 - - - - - - - - - c4 - c4 - c4 -`,
			`c4 - - - - - - - a3 - a3 - a3 - a3 -`,
			'c3 - - c#3 - - d#3 - - - c#3 - c3 - - -',
			'c3 - - c#3 - - d#3 - - - c#3 - c#3 - - -',
			'c4 - - c#4 - - c4 - - - c4 - b3 - - -',
		]

		const funkMelodySheets = [
			'c4 - - - - - c3 - d4 - c4 - d4 - d#4 - ',
			'd#4 - - - d#4 - d4 - g4 - - - g4 - - - ',
			'- - - - d#4 - d4 - g4 - g4 - g#4 - g#4 - ',
			'c4 - - - - - f4 - d#4 - d#4 - c#4 - c#4 - ',
			'c4 - - - - - d#4 - c#4 - c4 - a#3 - c#4 - ',
			'c4 - - - - - - - d#4 - - - c#4 - - -',
			'c4 - - - d4 - - - d#4 - - - d4 - - -',
			'c4 - - - d4 - - - c4 - - - d4 - - -',
			'c4 - - - d4 - - - c4 - - - d#4 - - -',
			'g4 - - - - - - - g4 - - - - - - -',
			'g4 - - - d#4 - - - g4 - - - d#4 - - -',
			'g4 - - - d#4 - - - f4 - - - c4 - - -',
			'c4 - - - g4 - f4 - d#4 - f4 - d#4 - c#4 - ',
			'- - - - g4 - - - d#4 - - - f4 - d#4 - ',
			'g4 - - - f4 - - - g4 - - - f4 - - -',
			'g4 - - - d#4 - - - d4 - - - c4 - - -',
			'g4 - d#4 - f4 - d#4 - d4 - - - c4 - - -',
			'g4 - - - f4 - - - d#4 - d#4 - d4 - c#4 -',
			'c4 - - c4 - - c4 - g4 - f4 - d#4 - d4 -',
			'g4 - g4 - g4 - g4 - g4 - g#4 - g4 - f4 -',
			'c4 - g4 - g4 - g4 - g4 - - - g4 - g#4 -',
			'f4 - f4 - f4 - f4 - f4 - f4 - f4 - f4 -',
			'g4 - f4 - d#4 - d4 - c4 - - - - - - -',
			'c4 - c4 - g#4 - g#4 - g4 - g4 - - - d4 -',
			'c4 - d4 - d#4 - d4 - c4 - d4 - d#4 - d4 - ',
			'- - - - - - - -  c4 - d4 - d#4 - d4 - ',
			'- - - - a3 - a3 -  a3 - a3 - a3 - a3 - ',
			'c4 - - - g4 - - - c4 - g4 - g4 - g4 - ',
			'c4 - d4 - c4 - d4 - c4 - d4 - c4 - d4 -',
			'c4 - d#4 - c4 - d#4 - c4 - d#4 - c4 - d#4 -',
			'c4 - c#4 - c4 - c#4 - c4 - c#4 - c4 - c#4 -',
			'c4 - - - g4 - - - f4 - - - g4 - - - ',
			'c4 - - - d4 - d#4 - d4 - d#4 - d4 - d#4 -',
			'- - - - g4 - - - g4 - - - - - - -',
			'- - - - d#4 - - - d4 - - - d#4 - - -',
			'- - - - d4 - - - d#4 - - - d4 - - -',
		]
		const chosenInstrument = melodyFunkInstruments[roll(melodyFunkInstruments.length) - 1]
		switch (sectionType) {
			case SectionType.Intro:
				if (roll(4) > 3) return [{ [chosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)] }]

				return [{
					flute: Style.parseNumbers(generateGapFillMelodySheet(mutateSheetGroove(clave)), flute, Minor, 3)
				},
				{
					[chosenInstrument.path]: Style.parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(clave)), chosenInstrument, Minor, 3),
				},
				{
					[chosenInstrument.path]: Style.parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(full8thNote)), chosenInstrument, Phrygian, 3),
				},
				{
					[chosenInstrument.path]: Style.parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(full8thNote)), chosenInstrument, Minor, 3),
				},
				{
					[chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
				},
				{
					[chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
				},
				{
					flute: funkMelodySheets[roll(funkRaveSheets.length - 1)]
				},
				{
					[chosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)]
				},
				{
					flute: '-'
				}
				];

			case SectionType.Refrao:

				return [{
					[chosenInstrument.path]: Style.parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(clave)), chosenInstrument, Minor, 3),
				},
				{
					[chosenInstrument.path]: Style.parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(full8thNote)), chosenInstrument, Phrygian, 3),
				},
				{
					[chosenInstrument.path]: Style.parseNumbers(generateAxialMelodySheet(mutateSheetGroove(full8thNote)), chosenInstrument, Minor, 3),
				},
				{
					[chosenInstrument.path]: Style.parseNumbers(generateLinearPatternMelodySheet([0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,]), chosenInstrument, Minor, 3),
				},
				{
					[chosenInstrument.path]: Style.parseNumbers(generateGapFillMelodySheet(mutateSheetGroove(full8thNote)), chosenInstrument, Minor, 3),
				},
				{
					[chosenInstrument.path]: Style.parseNumbers(generateLinearPatternMelodySheet([0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0]), chosenInstrument, Minor, 3),
				},
				{
					[chosenInstrument.path]: Style.parseNumbers(generateRandomNotes(16), chosenInstrument, Minor, 3),
				},
				{
					[chosenInstrument.path]: Style.parseNumbers(generateGapFillMelodySheet(mutateSheetGroove(clave)), chosenInstrument, Minor, 3),
				},
				{
					[chosenInstrument.path]: Style.parseNumbers(generateAxialMelodySheet(mutateSheetGroove(clave)), chosenInstrument, Phrygian, 3),
				},
				{
					[chosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)]
				},
				{
					[chosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)]
				},
				{
					stab: funkRaveSheets[roll(funkRaveSheets.length - 1)],
					[chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
				},
				{
					stab: funkRaveSheets[roll(funkRaveSheets.length - 1)],
					[chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
				},
				{
					[chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
				},
				{
					[chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
				},
				{
					[chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
				},
				{
					[chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
				},
				{
					[melodyFunkInstruments[roll(melodyFunkInstruments.length) - 1].path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
				},
				{
					[melodyFunkInstruments[roll(melodyFunkInstruments.length) - 1].path]: funkMelodySheets[roll(funkRaveSheets.length - 1)]
				},

				{
					[melodyFunkInstruments[roll(melodyFunkInstruments.length) - 1].path]: funkRaveSheets[roll(funkRaveSheets.length - 1)]
				},
				{
					stab: funkRaveSheets[roll(funkRaveSheets.length - 1)]
				},
				{
					funk_brass: funkRaveSheets[roll(funkRaveSheets.length - 1)]
				}

				];

			case SectionType.Verso:
				const verseChosenInstrument = melodyFunkInstruments[roll(melodyFunkInstruments.length) - 1]
				return [
					{ [verseChosenInstrument.path]: Style.parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(full8thNote)), verseChosenInstrument, Minor, 3) },
					{ [verseChosenInstrument.path]: Style.parseNumbers(generateAxialMelodySheet(mutateSheetGroove(full8thNote)), verseChosenInstrument, Minor, 3) },
					{ [verseChosenInstrument.path]: Style.parseNumbers(generateGapFillMelodySheet(mutateSheetGroove(full8thNote)), verseChosenInstrument, Minor, 3) },
					{ [verseChosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)] },
					{ [verseChosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)] },

					{ [verseChosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
					{ [verseChosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
					{ [verseChosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
					{ [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
					{ [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
					{ [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },


				]
			case SectionType.Ponte:
				const bridgeChosenInstrument = melodyFunkInstruments[roll(melodyFunkInstruments.length) - 1]
				return [
					{ [bridgeChosenInstrument.path]: Style.parseNumbers(generateLinearPatternMelodySheet(mutateSheetGroove(full8thNote)), bridgeChosenInstrument, Minor, 3) },
					{ [bridgeChosenInstrument.path]: Style.parseNumbers(generateAxialMelodySheet(mutateSheetGroove(full8thNote)), bridgeChosenInstrument, Minor, 3) },
					{ [bridgeChosenInstrument.path]: Style.parseNumbers(generateGapFillMelodySheet(mutateSheetGroove(full8thNote)), bridgeChosenInstrument, Minor, 3) },
					{ [bridgeChosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
					{ [bridgeChosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },
					{ [chosenInstrument.path]: funkMelodySheets[roll(funkRaveSheets.length - 1)] },

					{ [bridgeChosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)] },
					{ [bridgeChosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)] },
					{ [chosenInstrument.path]: funkRaveSheets[roll(funkRaveSheets.length - 1)] },

				];


		}
	}

	protected getNextProgressionCount(sectionType: SectionType): number {
		return 4;
	}

	protected getNextMeasureCount(sectionType: SectionType, progressionIndex: number, progressionCount: number): number {
		return 4;
	}
}
