interface Sample {
	index: number;
	path: string;
	color: string;
	buffer: AudioBuffer;
}

class SampleSet {
	private static readonly samplePaths = ["accordion_a3", "accordion_a4", "accordion_a5", "accordion_a6", "accordion_b3", "accordion_b4", "accordion_b5", "accordion_c4", "accordion_c5", "accordion_c6", "accordion_d4", "accordion_d5", "accordion_d6", "accordion_e4", "accordion_e5", "accordion_e6", "accordion_f4", "accordion_f5", "accordion_f6", "accordion_g4", "accordion_g5", "accordion_g6", "funkybass_a2", "funkybass_a3", "funkybass_a4", "funkybass_b2", "funkybass_b3", "funkybass_c3", "funkybass_c4", "funkybass_d3", "funkybass_d4", "funkybass_e3", "funkybass_e4", "funkybass_f3", "funkybass_f4", "funkybass_g3", "funkybass_g4",
		//percussion
		"ride_3", "hihat_1", "kick_1", "snare", "snare_1", "snare_2", "snare_3", "snare_4", "shaker_1", "shaker_2", "shaker_3", "shaker_4", "shaker_5",
		"triangle", "triangle_1", "triangle_2", "triangle_3", "xylo_a4", "xylo_a5", "xylo_b4", "xylo_c4", "xylo_c5", "xylo_d4", "xylo_d5", "xylo_e4", "xylo_e5", "xylo_f4", "xylo_f5", "xylo_g4", "xylo_g5", "zabumba_k1", "zabumba_k2", "zabumba_s",
		//piano
		"piano_c2", "piano_d2", "piano_e2", "piano_f2", "piano_g2", "piano_a2", "piano_b2",
		"piano_c3", "piano_d3", "piano_e3", "piano_f3", "piano_g3", "piano_a3", "piano_b3",
		"piano_c4", "piano_d4", "piano_e4", "piano_f4", "piano_g4", "piano_a4", "piano_b4",
		"piano_c5", "piano_d5", "piano_e5", "piano_f5", "piano_g5", "piano_a5", "piano_b5",
		"piano_c6", "piano_d6", "piano_e6", "piano_f6", "piano_g6", "piano_a6", "piano_b6",
		"piano_c7",
		//sax
		"sax_c3", "sax_d3", "sax_eb3", "sax_e3", "sax_f3", "sax_g3", "sax_a3", "sax_b3",
		"sax_c4", "sax_d4", "sax_eb4", "sax_e4", "sax_f4", "sax_g4", "sax_a4", "sax_b4",
		"sax_c5", "sax_d5", "sax_eb5", "sax_e5", "sax_f5", "sax_g5", "sax_a5", "sax_b5",
		"sax_c6"

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
