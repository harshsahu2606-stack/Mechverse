"use client";

/**
 * ExplosionSoundEngine
 * High-fidelity, cinematic procedural sound synthesis for 3D CAD mechanical explosion & assembly.
 * Built using the Web Audio API with zero external file dependencies, zero latency, and real-time kinematic pitch tracking.
 */

class ExplosionSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private continuousOsc: OscillatorNode | null = null;
  private continuousGain: GainNode | null = null;
  private continuousFilter: BiquadFilterNode | null = null;
  private noiseNode: AudioNode | null = null;
  private lastLevel: number = 0;
  private lastTime: number = 0;
  private scrubTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopContinuousScrub();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Cinematic Explosion Burst Sound
   * Plays when entering Exploded view or clicking 100%
   * Layers:
   * 1. Sub-bass cinematic impact & decompression boom (120Hz -> 38Hz)
   * 2. Pneumatic air-release whoosh (filtered white noise sweep)
   * 3. Precision mechanical servo expansion whir
   * 4. High-Q metallic resonance shimmer
   */
  public playCinematicExplode(intensity: number = 1.0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const dur = 1.4;

    // Master bus with gentle compressor to give punchy Hollywood feel
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, now);
    compressor.knee.setValueAtTime(10, now);
    compressor.ratio.setValueAtTime(6, now);
    compressor.attack.setValueAtTime(0.003, now);
    compressor.release.setValueAtTime(0.25, now);
    compressor.connect(ctx.destination);

    // ================= LAYER 1: Deep Cinematic Sub-Bass Impact =================
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(130, now);
    subOsc.frequency.exponentialRampToValueAtTime(36, now + 0.55);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.55 * intensity, now + 0.04);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    subOsc.connect(subGain);
    subGain.connect(compressor);
    subOsc.start(now);
    subOsc.stop(now + dur);

    // ================= LAYER 2: Pneumatic Air-Release Whoosh =================
    const bufferSize = ctx.sampleRate * dur;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.Q.setValueAtTime(1.8, now);
    noiseFilter.frequency.setValueAtTime(350, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(2400, now + 0.35);
    noiseFilter.frequency.exponentialRampToValueAtTime(800, now + dur);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.28 * intensity, now + 0.06);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.9);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(compressor);
    whiteNoise.start(now);
    whiteNoise.stop(now + dur);

    // ================= LAYER 3: Dual Harmonic Mechanical Servo Swell =================
    const servo1 = ctx.createOscillator();
    const servo2 = ctx.createOscillator();
    const servoGain = ctx.createGain();

    servo1.type = "triangle";
    servo2.type = "sawtooth";

    // Chord: Root and Fifth expanding upward
    servo1.frequency.setValueAtTime(220, now);
    servo1.frequency.exponentialRampToValueAtTime(540, now + 0.5);

    servo2.frequency.setValueAtTime(330, now);
    servo2.frequency.exponentialRampToValueAtTime(810, now + 0.5);

    const servoFilter = ctx.createBiquadFilter();
    servoFilter.type = "lowpass";
    servoFilter.frequency.setValueAtTime(900, now);
    servoFilter.frequency.exponentialRampToValueAtTime(2600, now + 0.4);

    servoGain.gain.setValueAtTime(0.001, now);
    servoGain.gain.linearRampToValueAtTime(0.18 * intensity, now + 0.08);
    servoGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    servo1.connect(servoFilter);
    servo2.connect(servoFilter);
    servoFilter.connect(servoGain);
    servoGain.connect(compressor);

    servo1.start(now);
    servo2.start(now);
    servo1.stop(now + 0.9);
    servo2.stop(now + 0.9);

    // ================= LAYER 4: High Metallic Shimmer & Clamps =================
    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chimeOsc.type = "sine";
    chimeOsc.frequency.setValueAtTime(3200, now + 0.05);
    chimeOsc.frequency.exponentialRampToValueAtTime(4600, now + 0.4);

    chimeGain.gain.setValueAtTime(0.001, now);
    chimeGain.gain.setValueAtTime(0.001, now + 0.04);
    chimeGain.gain.linearRampToValueAtTime(0.08 * intensity, now + 0.08);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(compressor);
    chimeOsc.start(now + 0.04);
    chimeOsc.stop(now + 0.65);
  }

  /**
   * Satisfying Heavy Magnetic Latch & Mechanical Docking Sound
   * Plays when snapping back to 0% (Assembled)
   */
  public playMechanicalLatch() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Sharp precision transient "snap"
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = "triangle";
    snapOsc.frequency.setValueAtTime(1400, now);
    snapOsc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    snapGain.gain.setValueAtTime(0.4, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapOsc.start(now);
    snapOsc.stop(now + 0.06);

    // 2. Heavy hydraulic & magnetic lock thud
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = "sine";
    thudOsc.frequency.setValueAtTime(180, now);
    thudOsc.frequency.exponentialRampToValueAtTime(42, now + 0.22);

    thudGain.gain.setValueAtTime(0.5, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    thudOsc.connect(thudGain);
    thudGain.connect(ctx.destination);
    thudOsc.start(now);
    thudOsc.stop(now + 0.38);

    // 3. Metallic ring resonance
    const ringOsc = ctx.createOscillator();
    const ringGain = ctx.createGain();
    ringOsc.type = "sine";
    ringOsc.frequency.setValueAtTime(880, now);
    ringOsc.frequency.exponentialRampToValueAtTime(620, now + 0.25);

    ringGain.gain.setValueAtTime(0.12, now);
    ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    ringOsc.connect(ringGain);
    ringGain.connect(ctx.destination);
    ringOsc.start(now);
    ringOsc.stop(now + 0.3);
  }

  /**
   * Real-time Slider Scrub Sound
   * Modulates sound smoothly as the user drags the explosion slider.
   * Pitch and intensity adapt in real time to the explosion percentage and drag velocity.
   */
  public onSliderChange(currentLevel: number) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const deltaLevel = currentLevel - this.lastLevel;
    const absDelta = Math.abs(deltaLevel);

    // If suddenly snapped to 0, trigger the heavy magnetic latch
    if (currentLevel === 0 && this.lastLevel > 0.05) {
      this.playMechanicalLatch();
      this.stopContinuousScrub();
      this.lastLevel = 0;
      return;
    }

    // Ensure continuous synth is running
    if (!this.continuousOsc) {
      this.startContinuousScrub(currentLevel);
    }

    if (this.continuousOsc && this.continuousGain && this.continuousFilter) {
      // Calculate target frequency: 180Hz (assembled) -> 580Hz (fully exploded)
      const targetFreq = 180 + currentLevel * 400 + (deltaLevel > 0 ? 40 : -20);
      this.continuousOsc.frequency.cancelScheduledValues(now);
      this.continuousOsc.frequency.setTargetAtTime(targetFreq, now, 0.04);

      // Filter cutoff opens up as parts expand
      const targetCutoff = 450 + currentLevel * 1800;
      this.continuousFilter.frequency.cancelScheduledValues(now);
      this.continuousFilter.frequency.setTargetAtTime(targetCutoff, now, 0.05);

      // Volume correlates with how fast the user is moving the slider
      const targetGain = Math.min(0.24, Math.max(0.04, absDelta * 8));
      this.continuousGain.gain.cancelScheduledValues(now);
      this.continuousGain.gain.setTargetAtTime(targetGain, now, 0.03);

      // Clear any pending fade out
      if (this.scrubTimeout) clearTimeout(this.scrubTimeout);
      this.scrubTimeout = setTimeout(() => {
        this.fadeContinuousScrub();
      }, 140);
    }

    this.lastLevel = currentLevel;
  }

  private startContinuousScrub(level: number) {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    this.continuousOsc = ctx.createOscillator();
    this.continuousGain = ctx.createGain();
    this.continuousFilter = ctx.createBiquadFilter();

    // Warm triangle-saw tooth hybrid tone for mechanical rail hum
    this.continuousOsc.type = "triangle";
    this.continuousOsc.frequency.setValueAtTime(180 + level * 400, now);

    this.continuousFilter.type = "lowpass";
    this.continuousFilter.frequency.setValueAtTime(450 + level * 1800, now);
    this.continuousFilter.Q.setValueAtTime(2.5, now);

    this.continuousGain.gain.setValueAtTime(0.001, now);
    this.continuousGain.gain.linearRampToValueAtTime(0.12, now + 0.04);

    this.continuousOsc.connect(this.continuousFilter);
    this.continuousFilter.connect(this.continuousGain);
    this.continuousGain.connect(ctx.destination);

    this.continuousOsc.start(now);
  }

  private fadeContinuousScrub() {
    if (!this.continuousGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.continuousGain.gain.cancelScheduledValues(now);
    this.continuousGain.gain.setTargetAtTime(0.0001, now, 0.08);

    setTimeout(() => {
      this.stopContinuousScrub();
    }, 150);
  }

  private stopContinuousScrub() {
    if (this.continuousOsc) {
      try {
        this.continuousOsc.stop();
        this.continuousOsc.disconnect();
      } catch (_) {}
      this.continuousOsc = null;
    }
    if (this.continuousGain) {
      try {
        this.continuousGain.disconnect();
      } catch (_) {}
      this.continuousGain = null;
    }
    if (this.continuousFilter) {
      try {
        this.continuousFilter.disconnect();
      } catch (_) {}
      this.continuousFilter = null;
    }
  }
}

// Singleton audio engine instance
export const explosionAudio = new ExplosionSoundEngine();
