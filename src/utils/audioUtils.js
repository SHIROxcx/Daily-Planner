/**
 * Audio utility for playing notification sound effects
 */
// Audio context for Web Audio API (for creating tones)
let audioContext = null;
/**
 * Initialize or get the audio context
 */
const getAudioContext = () => {
    if (!audioContext) {
        try {
            // Handle both standard and webkit-prefixed versions
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioContext = new AudioContextClass();
            }
        }
        catch (error) {
            console.error("Failed to initialize audio context:", error);
        }
    }
    return audioContext;
};
/**
 * Play a simple beep/tone using Web Audio API
 * Fallback for when audio files aren't available
 */
const playTone = (frequency, duration, volume = 0.3) => {
    return new Promise((resolve) => {
        try {
            const context = getAudioContext();
            if (!context) {
                console.warn("Audio context not available");
                resolve();
                return;
            }
            // Resume audio context if suspended (required by browser autoplay policy)
            if (context.state === "suspended") {
                context.resume();
            }
            const now = context.currentTime;
            const endTime = now + duration / 1000;
            // Create oscillator for tone
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.frequency.value = frequency;
            oscillator.type = "sine";
            // Envelope: fade in and out
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(volume, now + 0.01);
            gain.gain.linearRampToValueAtTime(0, endTime);
            oscillator.start(now);
            oscillator.stop(endTime);
            // Resolve after tone completes
            setTimeout(() => resolve(), duration);
        }
        catch (error) {
            console.error("Error playing tone:", error);
            resolve();
        }
    });
};
/**
 * Play a reminder notification sound
 * Creates a pleasant ascending tone pattern
 */
const playReminderSound = async (isMuted) => {
    if (isMuted)
        return;
    try {
        // Play a sequence of tones: 523Hz -> 659Hz -> 784Hz (C5 -> E5 -> G5)
        await playTone(523, 150, 0.3);
        await new Promise((resolve) => setTimeout(resolve, 50));
        await playTone(659, 150, 0.3);
        await new Promise((resolve) => setTimeout(resolve, 50));
        await playTone(784, 150, 0.3);
    }
    catch (error) {
        console.error("Error playing reminder sound:", error);
    }
};
/**
 * Play a success notification sound
 * Creates a happy two-tone pattern
 */
const playSuccessSound = async (isMuted) => {
    if (isMuted)
        return;
    try {
        // Play a success pattern: 659Hz -> 1047Hz (E5 -> C6)
        await playTone(659, 200, 0.25);
        await new Promise((resolve) => setTimeout(resolve, 100));
        await playTone(1047, 400, 0.25);
    }
    catch (error) {
        console.error("Error playing success sound:", error);
    }
};
/**
 * Play a warning notification sound
 * Creates an alert tone pattern
 */
const playWarningSound = async (isMuted) => {
    if (isMuted)
        return;
    try {
        // Play a warning pattern: 659Hz twice
        await playTone(659, 100, 0.3);
        await new Promise((resolve) => setTimeout(resolve, 50));
        await playTone(659, 100, 0.3);
        await new Promise((resolve) => setTimeout(resolve, 50));
        await playTone(659, 100, 0.3);
    }
    catch (error) {
        console.error("Error playing warning sound:", error);
    }
};
/**
 * Play an error notification sound
 * Creates a descending tone pattern
 */
const playErrorSound = async (isMuted) => {
    if (isMuted)
        return;
    try {
        // Play an error pattern: 392Hz -> 330Hz (G4 -> E4)
        await playTone(392, 150, 0.25);
        await new Promise((resolve) => setTimeout(resolve, 50));
        await playTone(330, 150, 0.25);
    }
    catch (error) {
        console.error("Error playing error sound:", error);
    }
};
/**
 * Play notification sound based on type
 */
export const playNotificationSound = async (soundType, isMuted = false) => {
    switch (soundType) {
        case "reminder":
            return playReminderSound(isMuted);
        case "success":
            return playSuccessSound(isMuted);
        case "warning":
            return playWarningSound(isMuted);
        case "error":
            return playErrorSound(isMuted);
        default:
            return playReminderSound(isMuted);
    }
};
/**
 * Check if audio is supported in the browser
 */
export const isAudioSupported = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    return !!AudioContextClass;
};
/**
 * Stop any currently playing audio
 */
export const stopAudio = () => {
    if (audioContext && audioContext.state === "running") {
        // We can't directly stop oscillators without references,
        // but we can reduce volume or close the context
        // For now, this is mainly a placeholder for future enhancement
    }
};
