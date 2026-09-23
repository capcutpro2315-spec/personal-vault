// Voice Assistant Service wrapping Web Speech API with clean fallback simulation
export interface VoiceCommandResult {
  transcript: string;
  matchedCommand?: 'travel' | 'passport' | 'memories' | 'attention' | 'reminder' | 'unknown';
  suggestedAction?: string;
  targetRoute?: string;
}

export const voiceService = {
  /**
   * Checks if browser speech recognition is natively supported
   */
  isSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  },

  /**
   * Parses voice transcript to identify intent and target application route
   */
  parseVoiceCommand(transcript: string): VoiceCommandResult {
    const text = transcript.toLowerCase().trim();

    if (text.includes('trip') || text.includes('travel') || text.includes('goa')) {
      return {
        transcript,
        matchedCommand: 'travel',
        suggestedAction: 'Showing your Goa & Manali trips...',
        targetRoute: '/travel',
      };
    }

    if (text.includes('passport') || text.includes('expire') || text.includes('pan')) {
      return {
        transcript,
        matchedCommand: 'passport',
        suggestedAction: 'Checking identity document expiry dates...',
        targetRoute: '/vault',
      };
    }

    if (text.includes('memories') || text.includes('manali') || text.includes('photo')) {
      return {
        transcript,
        matchedCommand: 'memories',
        suggestedAction: 'Retrieving 18 memories for Manali...',
        targetRoute: '/timeline',
      };
    }

    if (text.includes('attention') || text.includes('expiring') || text.includes('insurance')) {
      return {
        transcript,
        matchedCommand: 'attention',
        suggestedAction: 'Highlighting documents requiring attention...',
        targetRoute: '/vault',
      };
    }

    if (text.includes('reminder') || text.includes('project') || text.includes('meeting')) {
      return {
        transcript,
        matchedCommand: 'reminder',
        suggestedAction: 'Adding reminder for Project Review...',
        targetRoute: '/dashboard',
      };
    }

    return {
      transcript,
      matchedCommand: 'unknown',
      suggestedAction: `Searching LifeVault for "${transcript}"...`,
    };
  },
};
