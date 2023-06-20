interface Sample {
	index: number;
	path: string;
	color: string;
	buffer: AudioBuffer;
}

class SampleSet {
	private static readonly samplePaths = ["accordion_a3","accordion_a4","accordion_a5","accordion_a6","accordion_b3","accordion_b4","accordion_b5","accordion_c4","accordion_c5","accordion_c6","accordion_d4","accordion_d5","accordion_d6","accordion_e4","accordion_e5","accordion_e6","accordion_f4","accordion_f5","accordion_f6","accordion_g4","accordion_g5","accordion_g6","funkybass_a2","funkybass_a3","funkybass_a4","funkybass_b2","funkybass_b3","funkybass_c3","funkybass_c4","funkybass_d3","funkybass_d4","funkybass_e3","funkybass_e4","funkybass_f3","funkybass_f4","funkybass_g3","funkybass_g4","hihat","kick","snare","triangle","triangle_1","triangle_2","triangle_3","xylo_a4","xylo_a5","xylo_b4","xylo_c4","xylo_c5","xylo_d4","xylo_d5","xylo_e4","xylo_e5","xylo_f4","xylo_f5","xylo_g4","xylo_g5","zabumba_k1","zabumba_k2","zabumba_s"];
	private static readonly sampleColors = ["#FFFF00", "#FFFA00", "#FFF400", "#FFEF00", "#FFEA00", "#FFE500", "#FFE000", "#FFDB00", "#FFD600", "#FFD100", "#FFCC00", "#FFC700", "#FFC200", "#FFBD00", "#FFB800", "#FFB300", "#FFAE00", "#FFA900", "#FFA400", "#FF9F00", "#FF9A00", "#FF9500",
	"#191970", "#22227A", "#2B2B84", "#34348E", "#3D3D98", "#4646A2", "#4F4FAC", "#5858B6", "#6161C0", "#6A6ACA", "#7373D4", "#7C7CDE", "#8585E8", "#8E8EF2", "#9797FC",
	"#0ff","#00f","#f0f",
	"#C0C0C0", "#C9C9C9", "#D2D2D2", "#DBDBDB",
	"#ADFF2F", "#B5FF2C", "#BEFF29", "#C6FF26", "#CEFF23", "#D7FF20", "#DFFF1D", "#E7FF1A", "#F0FF17", "#F8FF14", "#FFFF11", "#FFFF0E", "#FFFF0B",
	"#8B4513", "#A0522D", "#CD853F"];
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
