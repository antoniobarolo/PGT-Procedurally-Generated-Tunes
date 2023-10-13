class Instrument {
    public path: string
    public samples: string[]
    public centerOctave?: number | null
    public color: string
    public role: MeasureCategory

    constructor(path: string, samples: string[], centerOctave: number | null, color: string, role: MeasureCategory) {
        this.path = path;
        this.samples = samples;
        this.centerOctave = centerOctave;
        this.color = color;
        this.role = role;
    }
}
