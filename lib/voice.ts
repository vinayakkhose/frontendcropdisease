/**
 * Voice Guidance Utilities
 */

export class VoiceGuide {
  private synth: SpeechSynthesis | null = null

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis
    }
  }

  speak(text: string, lang: string = 'en-US') {
    if (!this.synth) {
      console.warn('Speech synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    this.synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    this.synth.speak(utterance)
  }

  stop() {
    if (this.synth) {
      this.synth.cancel()
    }
  }

  isSupported(): boolean {
    return this.synth !== null
  }
}

export const voiceGuide = new VoiceGuide()
