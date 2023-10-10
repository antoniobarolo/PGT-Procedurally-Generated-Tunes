// interface Sample {
// 	index: number;
// 	path: string;
// 	color: string;
// 	buffer: AudioBuffer;
// }

class SampleSet {
	private static readonly samplePaths = ["accordion_a3", "accordion_a4", "accordion_a5", "accordion_a6", "accordion_b3", "accordion_b4", "accordion_b5", "accordion_c4", "accordion_c5", "accordion_c6", "accordion_d4", "accordion_d5", "accordion_d6", "accordion_e4", "accordion_e5", "accordion_e6", "accordion_f4", "accordion_f5", "accordion_f6", "accordion_g4", "accordion_g5", "accordion_g6",
		// "funkybass_a2", "funkybass_a3", "funkybass_a4", "funkybass_b2", "funkybass_b3", "funkybass_c3", "funkybass_c4", "funkybass_d3", "funkybass_d4", "funkybass_e3", "funkybass_e4", "funkybass_f3", "funkybass_f4", "funkybass_g3", "funkybass_g4",
		//percussion
		"ride/3", "hihat/1", "kick/1", "snare/1", "snare/2", "snare/3", "snare/4", "snare/5",
		"shaker/1", "shaker/2", "shaker/3", "shaker/4", "shaker/5",
		"triangle/1", "triangle/2", "triangle/3", "triangle/4",
		"xylo/a4", "xylo/a5", "xylo/b4", "xylo/c4", "xylo/c5", "xylo/d4", "xylo/d5", "xylo/e4", "xylo/e5", "xylo/f4", "xylo/f5", "xylo/g4", "xylo/g5",
		"zabumba/k1", "zabumba/k2", "zabumba/s",
		//piano
		//bass
		"piano/a2",
		"piano/a#2",
		"piano/b2",
		"piano/c3",
		"piano/c#3",
		"piano/d3",
		"piano/d#3",
		"piano/e3",
		"piano/f3",
		"piano/f#3",
		"piano/g3",
		"piano/g#3",
		"piano/a3",
		"piano/a#3",
		"piano/b3",
		"piano/c4",
		"piano/c#4",
		"piano/d4",
		"piano/d#4",
		"piano/e4",
		"piano/f4",
		"piano/f#4",
		"piano/g4",
		"piano/g#4",
		"piano/a4",
		"piano/a#4",
		"piano/b4",
		"piano/c5",
		"piano/c#5",
		"piano/d5",
		"piano/d#5",
		"piano/e5",
		"piano/f5",
		"piano/f#5",
		"piano/g5",
		"piano/g#5",
		"piano/a5",
		"piano/a#5",
		"piano/b5",
		"piano/c6",
		"piano/c#6",
		"piano/d6",
		"piano/d#6",
		"piano/e6",
		"piano/f6",
		"piano/f#6",
		"piano/g6",
		"piano/g#6",
		"piano/a6",

		//sax
		"sax/a3",
		"sax/a#3",
		"sax/b3",
		"sax/c4",
		"sax/c#4",
		"sax/d4",
		"sax/d#4",
		"sax/e4",
		"sax/f4",
		"sax/f#4",
		"sax/g4",
		"sax/g#4",
		"sax/a4",
		"sax/a#4",
		"sax/b4",
		"sax/c5",
		"sax/c#5",
		"sax/d5",
		"sax/d#5",
		"sax/e5",
		"sax/f5",
		"sax/f#5",
		"sax/g5",
		"sax/g#5",
		"sax/a5",
		"sax/a#5",
		"sax/b5",
		"sax/c6",

		//samba
		"tamborim/1", "tamborim/2", "tamborim/3", "tamborim/4",

		"surdo1/1", "surdo1/2", "surdo1/3", "surdo1/4",

		"surdo2/1", "surdo2/2", "surdo2/3", "surdo2/4",

		"surdo3/1", "surdo3/2", "surdo3/3", "surdo3/4",

		"ganza/1", "ganza/2", "ganza/3", "ganza/4",

		"caixa/1", "caixa/2", "caixa/3", "caixa/4", "caixa/5", "caixa/6", "caixa/7", "caixa/8", "caixa/9", "caixa/10", "caixa/11", "caixa/12", "caixa/13", "caixa/14", "caixa/15", "caixa/16",

		//bass
		"bass/a2",
		"bass/a#2",
		"bass/b2",
		"bass/c3",
		"bass/c#3",
		"bass/d3",
		"bass/d#3",
		"bass/e3",
		"bass/f3",
		"bass/f#3",
		"bass/g3",
		"bass/g#3",
		"bass/a3",
		"bass/a#3",
		"bass/b3",
		"bass/c4",
		"bass/c#4",
		"bass/d4",
		"bass/d#4",
		"bass/e4",
		"bass/f4",
		"bass/f#4",
		"bass/g4",
		"bass/g#4",
		"bass/a4",

		//funk stab
		"stab/a2",
		"stab/a#2",
		"stab/b2",
		"stab/c3",
		"stab/c#3",
		"stab/d3",
		"stab/d#3",
		"stab/e3",
		"stab/f3",
		"stab/f#3",
		"stab/g3",
		"stab/g#3",
		"stab/a3",
		"stab/a#3",
		"stab/b3",
		"stab/c4",
		"stab/c#4",
		"stab/d4",
		"stab/d#4",
		"stab/e4",
		"stab/f4",
		"stab/f#4",
		"stab/g4",
		"stab/g#4",
		"stab/a4",

		"dark_kick/1"
	];
	private static readonly sampleColors = ["#FFFF00", "#FFFA00", "#FFF400", "#FFEF00", "#FFEA00", "#FFE500", "#FFE000", "#FFDB00", "#FFD600", "#FFD100", "#FFCC00", "#FFC700", "#FFC200", "#FFBD00", "#FFB800", "#FFB300", "#FFAE00", "#FFA900", "#FFA400", "#FF9F00", "#FF9A00", "#FF9500",
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
	private static readonly samples = new Map<string, Sample>();

	private static async loadSample(index: number): Promise<void> {
		const path = SampleSet.samplePaths[index];
		const response = await fetch('samples/' + path.replace("#", "%23") + '.wav');
		const arrayBuffer = await response.arrayBuffer();
		const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);
		SampleSet.samples.set(path, {
			index,
			path,
			color: SampleSet.sampleColors[index],
			buffer: decodedAudio
		});
	}

	public static async loadSamples(): Promise<void> {
		const promises: Promise<void>[] = new Array(SampleSet.samplePaths.length);

		for (let i = 0; i < SampleSet.samplePaths.length; i++)
			promises[i] = SampleSet.loadSample(i);

		await Promise.all(promises);
	}

	public static getSample(name: string): Sample | undefined {
		return SampleSet.samples.get(name);
	}
}
