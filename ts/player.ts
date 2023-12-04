class Player {
	private nextTime: number;
	private samplePosition: Map<number, number>;
	public visualizer: Visualizer | null;

	public constructor() {
		this.nextTime = -1;
		this.samplePosition = new Map<number, number>();
		this.visualizer = null;
	}

	public playSample(sample: Sample, time: number, onlyPreparePosition: boolean): void {
		if (!sample) return

		if (!onlyPreparePosition) {
			const source = audioContext.createBufferSource();
			source.buffer = sample.buffer;
			source.connect(gainNode);
			gainNode.connect(audioContext.destination);
			source.start(time);
		}

		if (this.visualizer) {
			let xIndex = this.samplePosition.get(sample.index);
			if (xIndex === undefined) {
				xIndex = this.samplePosition.size;
				this.samplePosition.set(sample.index, xIndex);
			}

			if (!onlyPreparePosition)
				this.visualizer.playSample(sample, time, xIndex, this.samplePosition.size);
		}
	}

	public playSection(section: Section, onlyPreparePosition: boolean): void {
		if (onlyPreparePosition) {
			section.play(this, 0, onlyPreparePosition);
			return;
		}

		const currentTime = audioContext.currentTime;

		if (this.nextTime < 0)
			audioContext.resume().catch(console.error);

		const startTime = ((this.nextTime < currentTime) ? (currentTime + 0.075) : this.nextTime);

		this.nextTime = startTime + section.duration;

		section.play(this, startTime, onlyPreparePosition);
	}
}
