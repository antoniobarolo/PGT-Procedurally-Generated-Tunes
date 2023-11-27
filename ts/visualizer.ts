interface VisualizerSample {
	sample: Sample,
	time: number,
	xIndex: number
}

class Visualizer {
	private readonly samples: VisualizerSample[];
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private canvasWidth: number;
	private canvasHeight: number;
	private boundUpdateDisplay: any;
	private maxInstrumentCount: number;

	public constructor() {
		this.samples = [];
		this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
		this.canvasWidth = 800 * devicePixelRatio;
		this.canvasHeight = 400 * devicePixelRatio;
		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;
		this.canvas.style.maxWidth = "100%";
		this.canvas.style.width = "800px";
		this.canvas.style.height = "400px";
		this.context = this.canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D;
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		this.maxInstrumentCount = 1;

		this.boundUpdateDisplay = this.updateDisplay.bind(this);

		requestAnimationFrame(this.boundUpdateDisplay);
	}

	private updateDisplay() {
		requestAnimationFrame(this.boundUpdateDisplay);

		const samples = this.samples;
		const context = this.context;
		const canvasWidth = this.canvasWidth;
		const canvasHeight = this.canvasHeight;

		context.clearRect(0, 0, canvasWidth, canvasHeight);

		const currentTime = audioContext.currentTime;
		const currentTimeLimitBottom = currentTime - 0.1;
		const currentTimeLimitTop = currentTime + 4;

		for (let i = samples.length - 1; i >= 0; i--) {
			const sample = samples[i];

			if (sample.time < currentTimeLimitBottom) {
				samples.splice(i, 1);
				continue;
			}

			if (sample.time > currentTimeLimitTop) {
				continue;
			}

			const y = canvasHeight - (canvasHeight * (sample.time - currentTime) / 4);
			context.fillStyle = sample.sample.color;
			context.fillRect(14 + (canvasWidth - 28) * (sample.xIndex / this.maxInstrumentCount), y - 28, 14, 28);
		}
	}

	public playSample(sample: Sample, time: number, xIndex: number, maxInstrumentCount: number): void {
		if (this.maxInstrumentCount < maxInstrumentCount)
			this.maxInstrumentCount = maxInstrumentCount;

		this.samples.push({
			sample,
			time,
			xIndex
		});
	}
}

player.visualizer = new Visualizer();
