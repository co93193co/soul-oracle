// Web Audio API 水晶磬與頌缽合成器 (免加載外部 MP3 檔案，零延遲且輕量)
class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // 播放 432 Hz 水晶磬音 (自然接地、放鬆、釋懷)
  public playSingingBowl432(duration = 4) {
    if (this.isMuted) return;
    this.playChime(432, duration, 0.22);
  }

  // 播放 528 Hz 奇蹟頻率 (DNA修復、愛、豐盛顯化)
  public playSingingBowl528(duration = 4.5) {
    if (this.isMuted) return;
    this.playChime(528, duration, 0.25);
  }

  // 清理之門專屬：柔和純淨和解磬音
  public playCleansingChime(freq = 432, duration = 3.5) {
    if (this.isMuted) return;
    this.playChime(freq, duration, 0.18);
  }

  // 微心跳音效 (Lub-Dub 兩聲平靜的心律共振)
  public playHeartbeat() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    this.triggerHeartPulse(now, 65, 0.12);
    this.triggerHeartPulse(now + 0.28, 55, 0.09);
  }

  // 撥動星塵輕脆微音
  public playSparkle() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const freqs = [880, 1174, 1318, 1760];
    const now = ctx.currentTime;
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.04, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  }

  private triggerHeartPulse(startTime: number, freq: number, gainLevel: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(30, startTime + 0.18);

    gain.gain.setValueAtTime(gainLevel, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.25);
  }

  private playChime(rootFreq: number, duration: number, volume: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // 基頻 + 泛音階 (模擬水晶缽的金屬/水晶泛音共鳴)
    const partials = [
      { freqRatio: 1.0, gainRatio: 1.0 },
      { freqRatio: 2.01, gainRatio: 0.35 },
      { freqRatio: 3.02, gainRatio: 0.15 },
    ];

    partials.forEach(({ freqRatio, gainRatio }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(rootFreq * freqRatio, now);

      // 柔和 Attack (0.15s) 與長 Decay
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume * gainRatio, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  }
}

export const sound = new SoundManager();
