/**
 * 헤더 없는 16-bit mono PCM 청크를 도착하는 대로 재생하는 Web Audio 플레이어.
 * /tts/stream 응답처럼 "생성 속도 > 재생 속도"인 스트림을 가정하고,
 * 각 청크를 AudioBuffer로 만들어 이전 버퍼 끝 시각에 이어 붙여 스케줄링한다.
 */
export type PcmStreamPlayer = {
  /** PCM 청크를 재생 큐에 추가한다. 첫 호출 시 재생이 시작된다. */
  feed: (chunk: Uint8Array) => void;
  /** 더 이상 청크가 없음을 알린다. 예약된 오디오가 끝나면 finished가 resolve된다. */
  end: () => void;
  /** 즉시 재생을 멈추고 리소스를 정리한다. */
  stop: () => void;
  /** 재생이 자연 종료(end 이후 소진)되거나 stop()으로 중단되면 resolve. */
  finished: Promise<void>;
};

export function createPcmStreamPlayer(sampleRate: number): PcmStreamPlayer {
  let ctx: AudioContext | null = null;
  let nextTime = 0;
  let carry: Uint8Array | null = null; // 청크 경계에서 잘린 홀수 바이트 이월
  let ended = false;
  let stopped = false;
  let pendingSources = 0;
  let resolveFinished!: () => void;
  const finished = new Promise<void>((r) => {
    resolveFinished = r;
  });
  const active = new Set<AudioBufferSourceNode>();

  const cleanup = () => {
    active.clear();
    const c = ctx;
    ctx = null;
    if (c && c.state !== "closed") void c.close().catch(() => {});
    resolveFinished();
  };

  const maybeFinish = () => {
    if (!stopped && ended && pendingSources === 0) cleanup();
  };

  return {
    feed(chunk: Uint8Array) {
      if (stopped || ended || chunk.length === 0) return;

      let bytes = chunk;
      if (carry) {
        const merged = new Uint8Array(carry.length + chunk.length);
        merged.set(carry);
        merged.set(chunk, carry.length);
        bytes = merged;
        carry = null;
      }
      const usable = bytes.length - (bytes.length % 2);
      if (usable === 0) {
        carry = bytes;
        return;
      }
      if (usable < bytes.length) carry = bytes.slice(usable);

      if (!ctx) {
        ctx = new AudioContext({ sampleRate });
        if (ctx.state === "suspended") void ctx.resume().catch(() => {});
        nextTime = 0;
      }

      const samples = new Int16Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + usable));
      const floats = new Float32Array(samples.length);
      for (let i = 0; i < samples.length; i++) floats[i] = samples[i] / 32768;

      const buffer = ctx.createBuffer(1, floats.length, sampleRate);
      buffer.copyToChannel(floats, 0);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      pendingSources++;
      active.add(source);
      source.onended = () => {
        active.delete(source);
        pendingSources--;
        maybeFinish();
      };
      // 첫 청크는 약간의 여유를 두고 시작해 스케줄 지연으로 인한 앞부분 잘림을 막는다.
      nextTime = Math.max(ctx.currentTime + 0.08, nextTime);
      source.start(nextTime);
      nextTime += buffer.duration;
    },
    end() {
      if (stopped || ended) return;
      ended = true;
      maybeFinish();
    },
    stop() {
      if (stopped) return;
      stopped = true;
      for (const s of active) {
        try {
          s.onended = null;
          s.stop();
        } catch {
          // 이미 종료된 소스는 무시
        }
      }
      cleanup();
    },
    finished,
  };
}
