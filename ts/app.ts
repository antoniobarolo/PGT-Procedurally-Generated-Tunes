class Player {
	private nextGrooveTime: number;

	public constructor() {
		this.nextGrooveTime = -1;
	}

	public playSample(sample: AudioBuffer, time: number): void {
		const source = ctx.createBufferSource();
		source.buffer = sample;
		source.connect(ctx.destination);
		source.start(time);
	}

	public playGroove(groove: Groove): void {
		const currentTime = ctx.currentTime;
		const startTime = ((this.nextGrooveTime < currentTime) ? currentTime : this.nextGrooveTime);

		this.nextGrooveTime = startTime + groove.duration;

		groove.play(this, startTime);
	}
}

class SampleSet {
	private static readonly samplePaths = ['kick', 'snare', 'hihat',
		'xylo_a4', 'xylo_c5', 'xylo_d5', 'xylo_e5', 'xylo_g5', 'xylo_a5',
		'funkybass_a2', 'funkybass_b2', 'funkybass_c3', 'funkybass_d3', 'funkybass_e3', 'funkybass_f3', 'funkybass_g3',
		'funkybass_a3', 'funkybass_b3', 'funkybass_c4', 'funkybass_d4', 'funkybass_e4', 'funkybass_f4', 'funkybass_g4', 'funkybass_a4',
	];
	private static readonly samples =
		new Map<string, AudioBuffer>();

	private static async loadSample(path: string): Promise<void> {
		const response = await fetch('samples/' + path + '.wav');
		const arrayBuffer = await response.arrayBuffer();
		const decodedAudio = await ctx.decodeAudioData(arrayBuffer);
		SampleSet.samples.set(path, decodedAudio);
	}

	public static async loadSamples(): Promise<void> {
		const promises: Promise<void>[] = new Array(SampleSet.samplePaths.length);

		for (let i = 0; i < SampleSet.samplePaths.length; i++)
			promises[i] = SampleSet.loadSample(SampleSet.samplePaths[i]);

		await Promise.all(promises);
	}

	public static getSample(name: string): AudioBuffer {
		return SampleSet.samples.get(name) as AudioBuffer;
	}
}

interface GrooveTrack {
	sampleName: string;
	sample: AudioBuffer;
	sheet: string;
}

class Groove {

	public readonly bpm: number;
	public readonly beatDuration: number;
	public readonly duration: number;
	private readonly tracks: GrooveTrack[];

	public constructor(bpm: number, notes: { [key: string]: string }) {
		this.bpm = bpm;
		// Assuming 120 BPM (120 = 0.5)
		this.beatDuration = 30 / bpm;

		this.tracks = [];

		let maxLength = 0;

		for (let note in notes) {
			const sample = SampleSet.getSample(note);
			if (!sample)
				throw new Error("Unknown sample: " + note);

			const sheet = notes[note];
			if (maxLength < sheet.length)
				maxLength = sheet.length;

			this.tracks.push({
				sampleName: note,
				sample,
				sheet
			});
		}

		this.duration = this.beatDuration * maxLength;
	}

	public play(player: Player, startTime: number): void {
		for (let i = 0; i < this.tracks.length; i++) {
			const track = this.tracks[i];

			for (let j = 0; j < track.sheet.length; j++) {
				if (track.sheet[j] == '1')
					player.playSample(track.sample, startTime + (j * this.beatDuration));
			}
		}
	}
}

const ctx = new AudioContext();
const player = new Player();

let forro: Groove, rock: Groove, powermetal: Groove, xylo1: Groove, xylo2: Groove, xylo3: Groove, xylo4: Groove

async function setup(): Promise<void> {
	try {
		await SampleSet.loadSamples();
	} catch (ex: any) {
		console.error("Error loading the samples: " + (ex.message || ex));
		return;
	}

	forro = new Groove(190, {
		kick: '10010001',
		snare: '00010010',
		hihat: '10011101'
	});

	rock = new Groove(190, {
		kick: '10001000',
		snare: '00100010',
		hihat: '11111111'
	});

	powermetal = new Groove(380, {
		kick: '10001100',
		snare: '00100010',
		hihat: '10001000'
	});

	xylo1 = new Groove(200, {
		kick: '1010101010101111',
		xylo_a4: '1011011010110000',
		xylo_e5: '0000000000001010'
	});

	xylo2 = new Groove(200, {
		kick: '1010101010101111',
		xylo_a4: '0001000010110010',
		xylo_c5: '0010000010001101',
		xylo_e5: '1100001010110000'
	});

	xylo3 = new Groove(200, {
		kick: '1000000010010010',
		xylo_a4: '1000000010010010',
		xylo_c5: '0000000000000010',
		xylo_e5: '0000100000010000',
		xylo_a5: '0000000010000000'
	});

	xylo4 = new Groove(200, {
		kick: '1111011111110111',
		hihat: '1000100010001010',
		xylo_c5: '100100100000101',
		xylo_e5: '000000001001010'
	});


}

function xyloSong() {
	player.playGroove(xylo1)
	player.playGroove(xylo1)

	player.playGroove(xylo2)
	player.playGroove(xylo2)

	player.playGroove(xylo1)
	player.playGroove(xylo1)
	player.playGroove(xylo1)

	player.playGroove(xylo3)

	player.playGroove(xylo4)
	player.playGroove(xylo4)
	player.playGroove(xylo4)
	player.playGroove(xylo1)

	player.playGroove(xylo4)
	player.playGroove(xylo4)
	player.playGroove(xylo4)
	player.playGroove(xylo1)
}

function rngGroove() {
	let length = 32

	function roll() {
		return (Math.floor(Math.random() * Math.pow(2, 8)) >>> 0).toString(2);
	}

	let groove = new Groove(200, {
		kick: roll(),
		hihat: roll(),
		snare: roll(),
		xylo_a4: roll(),
		xylo_c5: roll(),
		xylo_e5: roll(),
		xylo_g5: roll(),
		xylo_a5: roll(),
	})

	console.log(groove)
	return groove
}

function makeSong() {
	let a = rngGroove()
	let b = rngGroove()
	let c = rngGroove()

	for (let i = 0; i < 4; i++) {
		player.playGroove(a)
	}
	for (let i = 0; i < 4; i++) {
		player.playGroove(b)
	}
	for (let i = 0; i < 2; i++) {
		player.playGroove(a)
	}
	for (let i = 0; i < 2; i++) {
		player.playGroove(b)
	}
	for (let i = 0; i < 4; i++) {
		player.playGroove(c)
	}
	for (let i = 0; i < 4; i++) {
		player.playGroove(b)
	}

}

setup();

const forr = new Forro();
const teste = forr.generateSession(SessionType.Intro);
debugger;
