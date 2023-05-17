class Player {
	private nextTime: number;

	public constructor() {
		this.nextTime = -1;
	}

	public playSample(sample: AudioBuffer, time: number): void {
		const source = audioContext.createBufferSource();
		source.buffer = sample;
		source.connect(audioContext.destination);
		source.start(time);
	}

	public playSection(section: Section): void {
		const currentTime = audioContext.currentTime;

		if (this.nextTime < 0)
			audioContext.resume().catch(console.error);

		const startTime = ((this.nextTime < currentTime) ? (currentTime + 0.075) : this.nextTime);

		this.nextTime = startTime + section.duration;

		section.play(this, startTime);
	}
}
