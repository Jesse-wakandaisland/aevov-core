/**
 * SUPERNOVA SPEECH INTERACTION FIX
 * Resolves conflicts between speech plugin and Supernova voice system
 * Ensures proper event handling and speech synthesis coordination
 */

(function() {
    'use strict';

    console.log('🔧 Loading Supernova Speech Interaction Fix...');

    const SupernovaSpeechFix = {
        state: {
            speechQueue: [],
            isSpeaking: false,
            isListening: false,
            supernovaLocked: false
        },

        config: {
            prioritizeSupernovaVoice: true,
            enableQueueing: true,
            maxQueueSize: 10,
            interruptOnNewInput: false
        },

        init() {
            console.log('⚡ Initializing Supernova Speech Fix...');

            this.patchSpeechSynthesis();
            this.setupEventCoordination();
            this.fixConflictingListeners();
            this.createSpeechCoordinator();

            console.log('✅ Supernova speech interaction fixed');
        },

        patchSpeechSynthesis() {
            const originalSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
            const self = this;

            window.speechSynthesis.speak = function(utterance) {
                if (self.state.supernovaLocked) {
                    console.log('🚫 Speech blocked - Supernova is speaking');
                    if (self.config.enableQueueing && self.state.speechQueue.length < self.config.maxQueueSize) {
                        self.state.speechQueue.push(utterance);
                    }
                    return;
                }

                if (window.SupernovaSpeech && self.config.prioritizeSupernovaVoice) {
                    const text = utterance.text;
                    self.speakViaSupernova(text);
                } else {
                    originalSpeak(utterance);
                }
            };

            utterance.addEventListener('end', () => {
                self.state.isSpeaking = false;
                self.processQueue();
            });

            console.log('✓ Speech synthesis patched');
        },

        speakViaSupernova(text) {
            if (!window.SupernovaSpeech) {
                console.warn('⚠️ Supernova speech system not available');
                return;
            }

            this.state.isSpeaking = true;
            this.state.supernovaLocked = true;

            const cleanText = text
                .replace(/[*_#`]/g, '')
                .replace(/\n\n/g, '. ')
                .trim();

            console.log('🌟 Speaking via Supernova:', cleanText.substring(0, 50) + '...');

            window.SupernovaSpeech.start(cleanText, 5);

            const estimatedDuration = (cleanText.length / 15) * 1000;
            
            setTimeout(() => {
                this.state.isSpeaking = false;
                this.state.supernovaLocked = false;
                this.processQueue();
            }, estimatedDuration);
        },

        processQueue() {
            if (this.state.speechQueue.length === 0 || this.state.isSpeaking) {
                return;
            }

            const next = this.state.speechQueue.shift();
            if (next instanceof SpeechSynthesisUtterance) {
                window.speechSynthesis.speak(next);
            } else if (typeof next === 'string') {
                this.speakViaSupernova(next);
            }
        },

        setupEventCoordination() {
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            const self = this;

            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (type === 'start' && this === window.speechSynthesis) {
                    const wrappedListener = function(e) {
                        if (!self.state.supernovaLocked) {
                            listener.call(this, e);
                        }
                    };
                    return originalAddEventListener.call(this, type, wrappedListener, options);
                }
                return originalAddEventListener.call(this, type, listener, options);
            };

            console.log('✓ Event coordination setup');
        },

        fixConflictingListeners() {
            if (window.AevovSupernova) {
                const originalSpeak = window.AevovSupernova.speak;
                const self = this;

                window.AevovSupernova.speak = function(text) {
                    if (self.state.isSpeaking && !self.config.interruptOnNewInput) {
                        console.log('🔄 Queueing Aevov speech');
                        self.state.speechQueue.push(text);
                        return;
                    }

                    if (window.SupernovaSpeech && window.SupernovaSpeech.stop) {
                        window.SupernovaSpeech.stop();
                    }

                    self.speakViaSupernova(text);
                };

                console.log('✓ AevovSupernova.speak patched');
            }

            document.addEventListener('click', (e) => {
                if (e.target.closest('#supernova-character')) {
                    if (this.state.isSpeaking && this.config.interruptOnNewInput) {
                        this.stopAllSpeech();
                    }
                }
            });

            console.log('✓ Conflicting listeners fixed');
        },

        stopAllSpeech() {
            if (window.SupernovaSpeech && window.SupernovaSpeech.stop) {
                window.SupernovaSpeech.stop();
            }

            window.speechSynthesis.cancel();

            this.state.isSpeaking = false;
            this.state.supernovaLocked = false;
            this.state.speechQueue = [];

            console.log('🛑 All speech stopped');
        },

        createSpeechCoordinator() {
            window.SupernovaSpeechCoordinator = {
                speak: (text, priority = false) => {
                    if (priority) {
                        this.stopAllSpeech();
                        this.speakViaSupernova(text);
                    } else {
                        if (this.state.isSpeaking) {
                            this.state.speechQueue.push(text);
                        } else {
                            this.speakViaSupernova(text);
                        }
                    }
                },

                stop: () => {
                    this.stopAllSpeech();
                },

                clearQueue: () => {
                    this.state.speechQueue = [];
                    console.log('🗑️ Speech queue cleared');
                },

                getStatus: () => ({
                    isSpeaking: this.state.isSpeaking,
                    isListening: this.state.isListening,
                    queueLength: this.state.speechQueue.length,
                    supernovaLocked: this.state.supernovaLocked
                }),

                setConfig: (config) => {
                    Object.assign(this.config, config);
                    console.log('⚙️ Config updated:', this.config);
                }
            };

            console.log('✓ Speech coordinator created');
        },

        fixVoiceRecognitionConflicts() {
            if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
                return;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const originalStart = SpeechRecognition.prototype.start;
            const self = this;

            SpeechRecognition.prototype.start = function() {
                if (self.state.isSpeaking) {
                    console.log('⏳ Delaying voice recognition until speech finishes');
                    const checkInterval = setInterval(() => {
                        if (!self.state.isSpeaking) {
                            clearInterval(checkInterval);
                            originalStart.call(this);
                        }
                    }, 100);
                } else {
                    self.state.isListening = true;
                    originalStart.call(this);
                }
            };

            console.log('✓ Voice recognition conflicts fixed');
        }
    };

    window.SupernovaSpeechFix = SupernovaSpeechFix;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => SupernovaSpeechFix.init(), 1000);
        });
    } else {
        setTimeout(() => SupernovaSpeechFix.init(), 1000);
    }

    console.log('✅ Supernova Speech Fix loaded');
    console.log('🎤 Use window.SupernovaSpeechCoordinator for coordinated speech');

})();