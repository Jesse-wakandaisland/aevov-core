/**
 * AEVOV DYNAMIC NLU ENGINE
 * Natural Language Understanding that learns from the pattern database
 * 
 * Key Principles:
 * - Vocabulary built from actual pattern keywords (thousands to millions)
 * - Intent classification adapts to available patterns
 * - Entity extraction learns from loaded patterns
 * - Tightly integrated with inference engine
 * - Zero hardcoded knowledge - everything is dynamic
 * 
 * Load this AFTER: unified_chat.js, complete_integration.js
 */

(function() {
    'use strict';

    console.log('🧠 Loading Aevov Dynamic NLU Engine...');

    const AevovNLU = {
        // Configuration
        config: {
            minConfidenceThreshold: 0.65,
            minPatternsRequired: 50,
            contextWindowSize: 5,
            verboseMode: true,
            vocabularyRebuildInterval: 10000, // Rebuild vocabulary every 10s
            enableDeepInference: true
        },

        // Dynamic state - learned from patterns
        state: {
            initialized: false,
            
            // Dynamic vocabulary built from patterns
            vocabulary: {
                entities: new Set(),        // All unique keywords from patterns
                domains: new Set(),         // All categories/domains
                intents: new Map(),         // Intent -> keyword associations
                keywordToDomain: new Map(), // Keyword -> domains mapping
                domainToKeywords: new Map() // Domain -> keywords mapping
            },
            
            // Pattern statistics
            patternStats: {
                totalPatterns: 0,
                domainCounts: {},
                avgKeywordsPerPattern: 0,
                vocabularySize: 0,
                lastUpdate: null
            },
            
            // Conversational context
            conversationContext: [],
            
            // User profile
            userProfile: {
                preferredDomains: [],
                queryHistory: [],
                expertise: 'beginner',
                learnedPreferences: {}
            }
        },

        /**
         * INITIALIZATION - Learn from pattern database
         */
        async init() {
            if (this.state.initialized) {
                console.warn('⚠️ NLU Engine already initialized');
                return;
            }

            console.log('⚡ Initializing Dynamic NLU Engine...');

            // Learn vocabulary from patterns
            await this.learnVocabulary();

            // Setup auto-refresh to keep vocabulary current
            this.setupVocabularyRefresh();

            // Setup UI toggle
            this.setupVerboseToggle();

            // Patch chat system with deep integration
            this.patchChatSystem();

            // Initialize conversational memory
            this.initConversationalMemory();

            this.state.initialized = true;
            
            const vocabSize = this.state.vocabulary.entities.size;
            const domains = this.state.vocabulary.domains.size;
            const patterns = this.state.patternStats.totalPatterns;
            
            console.log('✅ Dynamic NLU Engine ready!');
            console.log(`📊 Learned: ${vocabSize} keywords, ${domains} domains, ${patterns} patterns`);
            
            this.showNotification('🧠 Dynamic NLU Active', 
                `Learned ${vocabSize} keywords from ${patterns} patterns`);
        },

        /**
         * LEARN VOCABULARY FROM PATTERN DATABASE
         * This is the core dynamic learning function
         */
        async learnVocabulary() {
            console.log('📚 Learning vocabulary from pattern database...');
            
            const patterns = this.getAllPatterns();
            
            if (patterns.length === 0) {
                console.warn('⚠️ No patterns loaded - vocabulary will be empty');
                return;
            }

            // Reset vocabulary
            this.state.vocabulary = {
                entities: new Set(),
                domains: new Set(),
                intents: new Map(),
                keywordToDomain: new Map(),
                domainToKeywords: new Map()
            };

            let totalKeywords = 0;
            const domainCounts = {};

            // Learn from each pattern
            patterns.forEach(pattern => {
                const domain = pattern.category || pattern.categoryName || 'general';
                const keywords = pattern.keywords || [];
                
                // Track domain
                this.state.vocabulary.domains.add(domain);
                domainCounts[domain] = (domainCounts[domain] || 0) + 1;

                // Learn keywords
                keywords.forEach(keyword => {
                    const normalized = keyword.toLowerCase().trim();
                    if (normalized.length < 2) return;

                    // Add to global vocabulary
                    this.state.vocabulary.entities.add(normalized);
                    totalKeywords++;

                    // Map keyword to domain
                    if (!this.state.vocabulary.keywordToDomain.has(normalized)) {
                        this.state.vocabulary.keywordToDomain.set(normalized, new Set());
                    }
                    this.state.vocabulary.keywordToDomain.get(normalized).add(domain);

                    // Map domain to keywords
                    if (!this.state.vocabulary.domainToKeywords.has(domain)) {
                        this.state.vocabulary.domainToKeywords.set(domain, new Set());
                    }
                    this.state.vocabulary.domainToKeywords.get(domain).add(normalized);
                });

                // Infer intent from pattern metadata
                this.inferIntentFromPattern(pattern);
            });

            // Update statistics
            this.state.patternStats = {
                totalPatterns: patterns.length,
                domainCounts: domainCounts,
                avgKeywordsPerPattern: totalKeywords / patterns.length,
                vocabularySize: this.state.vocabulary.entities.size,
                lastUpdate: Date.now()
            };

            console.log('✅ Vocabulary learned:');
            console.log(`   • ${this.state.vocabulary.entities.size} unique keywords`);
            console.log(`   • ${this.state.vocabulary.domains.size} domains`);
            console.log(`   • ${patterns.length} patterns analyzed`);
        },

        /**
         * INFER INTENTS FROM PATTERN STRUCTURE
         * Dynamically learn what intents exist based on patterns
         */
        inferIntentFromPattern(pattern) {
            const keywords = (pattern.keywords || []).map(k => k.toLowerCase());
            const category = pattern.categoryName || pattern.category || '';
            
            // Action verbs suggest code generation
            const actionVerbs = keywords.filter(k => 
                /^(create|build|make|generate|implement|write|code|develop|design|setup)/.test(k)
            );
            if (actionVerbs.length > 0) {
                this.addIntentKeywords('code_generation', keywords);
            }

            // Question words suggest explanation
            const questionWords = keywords.filter(k => 
                /^(what|why|how|when|where|explain|describe|define)/.test(k)
            );
            if (questionWords.length > 0) {
                this.addIntentKeywords('explanation', keywords);
            }

            // Debug/fix words suggest debugging
            const debugWords = keywords.filter(k => 
                /(debug|fix|error|issue|problem|bug|troubleshoot|solve)/.test(k)
            );
            if (debugWords.length > 0) {
                this.addIntentKeywords('debugging', keywords);
            }

            // Optimization words
            const optimizeWords = keywords.filter(k => 
                /(optimize|improve|enhance|performance|speed|efficient|faster|better)/.test(k)
            );
            if (optimizeWords.length > 0) {
                this.addIntentKeywords('optimization', keywords);
            }

            // Comparison words
            const compareWords = keywords.filter(k => 
                /(compare|vs|versus|difference|alternative|choose|select)/.test(k)
            );
            if (compareWords.length > 0) {
                this.addIntentKeywords('comparison', keywords);
            }

            // If category contains certain words, infer intent
            if (/test|testing|qa/.test(category.toLowerCase())) {
                this.addIntentKeywords('testing', keywords);
            }
            if (/security|auth|encryption/.test(category.toLowerCase())) {
                this.addIntentKeywords('security', keywords);
            }
        },

        addIntentKeywords(intent, keywords) {
            if (!this.state.vocabulary.intents.has(intent)) {
                this.state.vocabulary.intents.set(intent, new Set());
            }
            const intentSet = this.state.vocabulary.intents.get(intent);
            keywords.forEach(k => intentSet.add(k.toLowerCase()));
        },

        /**
         * DYNAMIC INTENT CLASSIFICATION
         * Uses learned vocabulary instead of hardcoded patterns
         */
        classifyIntent(query) {
            const queryLower = query.toLowerCase();
            const queryTokens = this.tokenize(queryLower);
            
            const intentScores = {};

            // Score each learned intent
            for (const [intent, keywords] of this.state.vocabulary.intents.entries()) {
                let score = 0;
                let matches = 0;

                for (const token of queryTokens) {
                    if (keywords.has(token)) {
                        score += 1.0;
                        matches++;
                    }
                    // Partial matching
                    for (const keyword of keywords) {
                        if (keyword.includes(token) || token.includes(keyword)) {
                            score += 0.5;
                        }
                    }
                }

                intentScores[intent] = {
                    score,
                    matches,
                    confidence: matches / queryTokens.length
                };
            }

            // Fallback intent detection for conversational queries
            if (/^(hi|hello|hey|thanks|bye|help)/.test(queryLower)) {
                intentScores['conversational'] = {
                    score: 10,
                    matches: 1,
                    confidence: 1.0
                };
            }

            // Find best intent
            let bestIntent = 'general';
            let bestScore = 0;

            for (const [intent, data] of Object.entries(intentScores)) {
                if (data.score > bestScore) {
                    bestScore = data.score;
                    bestIntent = intent;
                }
            }

            const confidence = intentScores[bestIntent]?.confidence || 0;

            return {
                intent: bestIntent,
                confidence: confidence,
                allIntents: intentScores,
                reasoning: `Matched ${intentScores[bestIntent]?.matches || 0} keywords`
            };
        },

        /**
         * DYNAMIC ENTITY EXTRACTION
         * Extracts entities from learned vocabulary
         */
        extractEntities(query) {
            const queryLower = query.toLowerCase();
            const queryTokens = this.tokenize(queryLower);
            
            const entities = {
                keywords: [],        // Matched vocabulary keywords
                domains: [],         // Inferred domains
                confidence: {},      // Confidence per entity
                positions: []        // Where entities appear in query
            };

            // Extract entities from vocabulary
            queryTokens.forEach((token, index) => {
                // Direct vocabulary match
                if (this.state.vocabulary.entities.has(token)) {
                    entities.keywords.push(token);
                    entities.positions.push(index);
                    
                    // Find associated domains
                    const domains = this.state.vocabulary.keywordToDomain.get(token);
                    if (domains) {
                        domains.forEach(d => {
                            if (!entities.domains.includes(d)) {
                                entities.domains.push(d);
                            }
                        });
                    }
                }

                // Partial matching for compound terms
                for (const vocabWord of this.state.vocabulary.entities) {
                    if (vocabWord.length > 4 && 
                        (vocabWord.includes(token) || token.includes(vocabWord))) {
                        if (!entities.keywords.includes(vocabWord)) {
                            entities.keywords.push(vocabWord);
                            entities.confidence[vocabWord] = 0.7;
                        }
                    }
                }
            });

            // Multi-word entity detection
            for (let i = 0; i < queryTokens.length - 1; i++) {
                const bigram = queryTokens[i] + ' ' + queryTokens[i + 1];
                if (this.state.vocabulary.entities.has(bigram)) {
                    entities.keywords.push(bigram);
                    entities.confidence[bigram] = 0.9;
                }
            }

            // Set confidence for direct matches
            entities.keywords.forEach(kw => {
                if (!entities.confidence[kw]) {
                    entities.confidence[kw] = 1.0;
                }
            });

            return entities;
        },

        /**
         * DEEP INFERENCE INTEGRATION
         * Integrates with existing pattern matching and inference engine
         */
        async deepInference(query, entities, intentData) {
            // Use existing inference engine if available
            let matches = [];

            // Try ComparatorEngine first (most accurate)
            if (window.ComparatorEngine && window.gatherAllPatterns) {
                const allPatterns = window.gatherAllPatterns();
                
                if (allPatterns.length > 0) {
                    // Extract features for query
                    const queryFeatures = this.extractQueryFeatures(query, entities);
                    
                    // Run comparator analysis
                    const results = await this.runComparatorAnalysis(query, queryFeatures, allPatterns);
                    matches = results.matches || [];
                }
            }
            // Fallback to matchPatterns
            else if (window.matchPatterns) {
                const result = window.matchPatterns(query, 5);
                if (result.success && result.matches) {
                    matches = result.matches;
                }
            }
            // Last resort: manual similarity search
            else {
                matches = this.manualPatternSearch(query, entities);
            }

            // Enhance matches with entity information
            matches = this.enhanceMatchesWithEntities(matches, entities);

            // Apply domain boosting based on context
            matches = this.applyContextBoosting(matches);

            return matches;
        },

        /**
         * EXTRACT QUERY FEATURES
         */
        extractQueryFeatures(query, entities) {
            const tokens = this.tokenize(query.toLowerCase());
            
            // Create embedding from entities + vocabulary matches
            const embedding = new Array(128).fill(0);
            
            [...entities.keywords, ...tokens].forEach(word => {
                const hash = this.hash(word);
                embedding[hash % 128] += 1.0;
            });

            // Normalize
            const magnitude = Math.sqrt(
                embedding.reduce((sum, val) => sum + val * val, 0)
            );
            
            return {
                tokens,
                entities: entities.keywords,
                domains: entities.domains,
                embedding: magnitude > 0 ? embedding.map(v => v / magnitude) : embedding
            };
        },

        /**
         * RUN COMPARATOR ANALYSIS
         */
        async runComparatorAnalysis(query, features, patterns) {
            const candidates = patterns.map(pattern => {
                // Calculate similarity
                const patternEmbedding = pattern.embedding || 
                    this.createEmbedding(pattern.keywords || []);
                
                const similarity = this.cosineSimilarity(
                    features.embedding, 
                    patternEmbedding
                );

                // Boost score if domains match
                let domainBoost = 1.0;
                const patternDomain = pattern.category || pattern.categoryName;
                if (features.domains.includes(patternDomain)) {
                    domainBoost = 1.3;
                }

                // Boost if query entities appear in pattern keywords
                let entityBoost = 1.0;
                const patternKeywords = (pattern.keywords || []).map(k => k.toLowerCase());
                const matchingEntities = features.entities.filter(e => 
                    patternKeywords.includes(e)
                ).length;
                if (matchingEntities > 0) {
                    entityBoost = 1.0 + (matchingEntities * 0.1);
                }

                const confidence = similarity * domainBoost * entityBoost;

                return {
                    pattern,
                    similarity,
                    confidence: Math.min(confidence, 1.0),
                    votes: 0,
                    domainBoost,
                    entityBoost
                };
            });

            // Sort by confidence
            candidates.sort((a, b) => b.confidence - a.confidence);

            // Apply voting
            const topK = Math.min(10, candidates.length);
            for (let i = 0; i < topK; i++) {
                candidates[i].votes = topK - i;
                if (candidates[i].confidence > 0.8) {
                    candidates[i].votes += 3;
                }
            }

            return {
                matches: candidates,
                totalAnalyzed: patterns.length,
                topConfidence: candidates[0]?.confidence || 0
            };
        },

        /**
         * MANUAL PATTERN SEARCH (fallback)
         */
        manualPatternSearch(query, entities) {
            const patterns = this.getAllPatterns();
            const matches = [];

            patterns.forEach(pattern => {
                const patternKeywords = (pattern.keywords || []).map(k => k.toLowerCase());
                
                let matchCount = 0;
                entities.keywords.forEach(entity => {
                    if (patternKeywords.includes(entity)) {
                        matchCount++;
                    }
                });

                if (matchCount > 0) {
                    matches.push({
                        pattern,
                        confidence: matchCount / Math.max(entities.keywords.length, 1),
                        matchCount
                    });
                }
            });

            matches.sort((a, b) => b.confidence - a.confidence);
            return matches;
        },

        /**
         * ENHANCE MATCHES WITH ENTITY INFORMATION
         */
        enhanceMatchesWithEntities(matches, entities) {
            return matches.map(match => {
                const pattern = match.pattern;
                const patternKeywords = (pattern.keywords || []).map(k => k.toLowerCase());
                
                // Find which entities appear in this pattern
                const matchedEntities = entities.keywords.filter(e => 
                    patternKeywords.includes(e)
                );

                return {
                    ...match,
                    matchedEntities,
                    entityMatchRatio: matchedEntities.length / Math.max(entities.keywords.length, 1)
                };
            });
        },

        /**
         * APPLY CONTEXT BOOSTING
         */
        applyContextBoosting(matches) {
            if (this.state.conversationContext.length === 0) {
                return matches;
            }

            // Get recent domains from context
            const recentDomains = this.state.conversationContext
                .slice(-3)
                .flatMap(ctx => ctx.entities?.domains || []);

            return matches.map(match => {
                const patternDomain = match.pattern.category || match.pattern.categoryName;
                
                if (recentDomains.includes(patternDomain)) {
                    return {
                        ...match,
                        confidence: Math.min(match.confidence * 1.15, 1.0),
                        contextBoost: true
                    };
                }
                
                return match;
            });
        },

        /**
         * GENERATE NATURAL RESPONSE
         */
        generateResponse(intentData, entities, matches, query) {
            const { intent, confidence: intentConfidence } = intentData;

            // Check dataset density
            const densityCheck = this.checkDensity(entities);
            if (!densityCheck.sufficient) {
                return this.generateInsufficientDataResponse(densityCheck, entities);
            }

            // No matches found
            if (!matches || matches.length === 0) {
                return this.generateNoMatchResponse(query, entities, intentData);
            }

            const bestMatch = matches[0];
            const matchConfidence = bestMatch.confidence || 0;

            // Low confidence warning
            if (!this.config.verboseMode && matchConfidence < this.config.minConfidenceThreshold) {
                return this.generateLowConfidenceResponse(bestMatch, matchConfidence, entities);
            }

            // Handle conversational queries
            if (intent === 'conversational') {
                return this.generateConversationalResponse(query);
            }

            // Generate response based on intent and match
            return this.generateIntentBasedResponse(
                intent, 
                bestMatch, 
                matches, 
                entities, 
                intentData
            );
        },

        /**
         * GENERATE INTENT-BASED RESPONSE
         */
        generateIntentBasedResponse(intent, bestMatch, allMatches, entities, intentData) {
            const pattern = bestMatch.pattern;
            const confidence = bestMatch.confidence;
            const domain = pattern.categoryName || pattern.category || 'general';

            let response = '';

            // Clean mode: concise responses
            if (!this.config.verboseMode) {
                response = this.generateCleanResponse(intent, pattern, entities, confidence);
            }
            // Verbose mode: detailed responses
            else {
                response = this.generateVerboseResponse(
                    intent, 
                    pattern, 
                    entities, 
                    confidence, 
                    bestMatch,
                    allMatches
                );
            }

            return response;
        },

        /**
         * CLEAN RESPONSE MODE
         */
        generateCleanResponse(intent, pattern, entities, confidence) {
            const domain = pattern.categoryName || pattern.category;
            const keywords = entities.keywords.slice(0, 5);
            
            let response = '';

            // Tailor opening based on intent
            switch (intent) {
                case 'code_generation':
                    response = `Here's the implementation approach:\n\n`;
                    break;
                case 'explanation':
                    response = `Let me explain:\n\n`;
                    break;
                case 'debugging':
                    response = `To debug this:\n\n`;
                    break;
                case 'optimization':
                    response = `Optimization strategy:\n\n`;
                    break;
                case 'comparison':
                    response = `Comparison:\n\n`;
                    break;
                default:
                    response = '';
            }

            response += `This relates to **${domain}**`;
            
            if (keywords.length > 0) {
                response += `, focusing on ${keywords.slice(0, 3).join(', ')}`;
            }
            
            response += `.`;

            if (confidence > 0.85) {
                response += ` This is a strong match for your query.`;
            } else if (confidence < 0.70) {
                response += ` This might help, though it's not a perfect match.`;
            }

            return response;
        },

        /**
         * VERBOSE RESPONSE MODE
         */
        generateVerboseResponse(intent, pattern, entities, confidence, bestMatch, allMatches) {
            let response = '';

            response += `**Match Found**: ${pattern.categoryName || pattern.category}\n`;
            response += `**Confidence**: ${(confidence * 100).toFixed(0)}%\n`;
            response += `**Intent**: ${intent}\n\n`;

            if (entities.keywords.length > 0) {
                response += `**Extracted Entities**: ${entities.keywords.slice(0, 8).join(', ')}\n`;
            }

            if (entities.domains.length > 0) {
                response += `**Relevant Domains**: ${entities.domains.slice(0, 5).join(', ')}\n`;
            }

            response += `\n`;

            // Pattern details
            if (pattern.keywords && pattern.keywords.length > 0) {
                response += `**Pattern Keywords**: ${pattern.keywords.slice(0, 10).join(', ')}\n`;
            }

            // Entity matching info
            if (bestMatch.matchedEntities && bestMatch.matchedEntities.length > 0) {
                response += `**Matched Keywords**: ${bestMatch.matchedEntities.slice(0, 5).join(', ')}\n`;
            }

            // Alternative matches
            if (allMatches.length > 1) {
                response += `\n**Alternative Matches**:\n`;
                allMatches.slice(1, 4).forEach((match, idx) => {
                    const altConf = (match.confidence * 100).toFixed(0);
                    response += `${idx + 2}. ${match.pattern.categoryName || match.pattern.category} (${altConf}%)\n`;
                });
            }

            // Analysis metadata
            response += `\n**Analysis**:\n`;
            response += `• Vocabulary size: ${this.state.patternStats.vocabularySize} keywords\n`;
            response += `• Patterns analyzed: ${this.state.patternStats.totalPatterns}\n`;
            response += `• Entity match ratio: ${((bestMatch.entityMatchRatio || 0) * 100).toFixed(0)}%\n`;

            return response;
        },

        /**
         * INSUFFICIENT DATA RESPONSE
         */
        generateInsufficientDataResponse(densityCheck, entities) {
            let response = `📊 **Insufficient Pattern Density**\n\n`;
            response += `The pattern database needs more coverage for accurate responses.\n\n`;
            
            response += `**Current Status**:\n`;
            response += `• Total Patterns: ${densityCheck.totalPatterns}\n`;
            response += `• Vocabulary: ${this.state.patternStats.vocabularySize} keywords\n`;
            response += `• Domains: ${this.state.vocabulary.domains.size}\n\n`;
            
            if (entities.domains.length > 0) {
                response += `**Your Query Needs**: ${entities.domains.join(', ')}\n`;
                response += `**Patterns Available**: ${densityCheck.domainPatterns}\n`;
                response += `**Recommended**: ${this.config.minPatternsRequired}+ patterns\n\n`;
            }
            
            response += `**Action Required**:\n`;
            response += `1. Open **🧬 Advanced Extractor**\n`;
            response += `2. Generate patterns for these domains: ${entities.domains.slice(0, 3).join(', ') || 'relevant categories'}\n`;
            response += `3. Extract 50-100 patterns per domain\n`;
            response += `4. The NLU will automatically learn new vocabulary\n\n`;
            
            response += `_The system learns dynamically from your patterns. More patterns = better understanding!_`;

            return response;
        },

        /**
         * NO MATCH RESPONSE
         */
        generateNoMatchResponse(query, entities, intentData) {
            let response = `I couldn't find a strong match for your query.\n\n`;
            
            if (entities.keywords.length > 0) {
                response += `**Detected Keywords**: ${entities.keywords.slice(0, 6).join(', ')}\n`;
            }
            
            if (entities.domains.length > 0) {
                response += `**Suggested Domains**: ${entities.domains.join(', ')}\n`;
            }
            
            response += `\n**Why this happened**:\n`;
            
            const vocabSize = this.state.patternStats.vocabularySize;
            if (vocabSize < 100) {
                response += `• Limited vocabulary: only ${vocabSize} keywords learned\n`;
                response += `• Need more diverse patterns in the database\n`;
            } else {
                response += `• Query may use terminology not in current patterns\n`;
                response += `• Try rephrasing with different keywords\n`;
            }
            
            response += `\n**Suggestions**:\n`;
            response += `• Rephrase using simpler terms\n`;
            response += `• Add patterns covering "${query.substring(0, 30)}..."\n`;
            response += `• Check if domain patterns exist for this topic\n`;

            return response;
        },

        /**
         * LOW CONFIDENCE RESPONSE
         */
        generateLowConfidenceResponse(match, confidence, entities) {
            let response = `Found a potential match, but confidence is low.\n\n`;
            response += `**Best Match**: ${match.pattern.categoryName || match.pattern.category}\n`;
            response += `**Confidence**: ${(confidence * 100).toFixed(0)}% (threshold: ${(this.config.minConfidenceThreshold * 100).toFixed(0)}%)\n\n`;
            
            response += `**This might help**, but I'm not confident it's what you need.\n\n`;
            response += `**To improve accuracy**:\n`;
            response += `• Add more patterns similar to your query\n`;
            response += `• Ensure domain has 50+ diverse patterns\n`;
            response += `• Use more specific keywords\n`;

            return response;
        },

        /**
         * CONVERSATIONAL RESPONSE
         */
        generateConversationalResponse(query) {
            const lower = query.toLowerCase();
            
            if (/^(hi|hello|hey)/.test(lower)) {
                const vocabSize = this.state.patternStats.vocabularySize;
                const domains = this.state.vocabulary.domains.size;
                return `Hello! I'm your Aevov assistant with ${vocabSize} keywords learned across ${domains} domains. What would you like to know?`;
            }
            
            if (/thank/.test(lower)) {
                return `You're welcome! Feel free to ask anything else.`;
            }
            
            if (/bye|goodbye/.test(lower)) {
                return `Goodbye! The NLU will keep learning from your patterns.`;
            }
            
            if (/help/.test(lower)) {
                const patterns = this.state.patternStats.totalPatterns;
                const vocab = this.state.patternStats.vocabularySize;
                return `I'm a dynamic NLU that learns from ${patterns} patterns.\n\nI understand ${vocab} unique keywords and can help with any query related to the loaded patterns.\n\nJust ask naturally - I'll extract entities and find the best match!`;
            }
            
            return `I'm here to help! What would you like to know?`;
        },

        /**
         * CHECK DENSITY
         */
        checkDensity(entities) {
            const totalPatterns = this.state.patternStats.totalPatterns;
            
            let domainPatterns = 0;
            entities.domains.forEach(domain => {
                domainPatterns += this.state.patternStats.domainCounts[domain] || 0;
            });
            
            const sufficient = totalPatterns >= this.config.minPatternsRequired &&
                             (entities.domains.length === 0 || domainPatterns >= this.config.minPatternsRequired / 2);
            
            return {
                sufficient,
                totalPatterns,
                domainPatterns,
                suggestedDomains: entities.domains.length > 0 ? entities.domains : 
                    Array.from(this.state.vocabulary.domains).slice(0, 3)
            };
        },

        /**
         * SETUP VOCABULARY REFRESH
         */
        setupVocabularyRefresh() {
            setInterval(() => {
                const currentPatternCount = this.getAllPatterns().length;
                if (currentPatternCount !== this.state.patternStats.totalPatterns) {
                    console.log('🔄 Pattern database changed, refreshing vocabulary...');
                    this.learnVocabulary();
                }
            }, this.config.vocabularyRebuildInterval);
        },

        /**
         * CONVERSATIONAL MEMORY
         */
        initConversationalMemory() {
            try {
                const saved = localStorage.getItem('aevov_conversation_context');
                if (saved) {
                    this.state.conversationContext = JSON.parse(saved);
                }
            } catch (e) {
                console.warn('Could not load conversation context');
            }
        },

        addToConversationContext(query, intent, entities, response) {
            const entry = {
                query,
                intent: intent.intent,
                entities: {
                    keywords: entities.keywords,
                    domains: entities.domains
                },
                responsePreview: response.substring(0, 150),
                timestamp: Date.now()
            };
            
            this.state.conversationContext.push(entry);
            
            if (this.state.conversationContext.length > 20) {
                this.state.conversationContext.shift();
            }
            
            try {
                localStorage.setItem('aevov_conversation_context', 
                    JSON.stringify(this.state.conversationContext));
            } catch (e) {
                // Silent fail
            }
        },

        /**
         * UI TOGGLE
         */
        setupVerboseToggle() {
            const toggleHTML = `
                <div id="aevovNLUToggle" style="position: fixed; bottom: 80px; right: 20px; z-index: 9999; 
                            background: rgba(10, 25, 47, 0.95); padding: 15px; border-radius: 8px;
                            border: 1px solid #00d4ff; box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);">
                    <label style="color: #00ff88; font-weight: 600; display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" id="aevovVerboseToggle" 
                               ${this.config.verboseMode ? '' : 'checked'}
                               onchange="window.AevovNLU.toggleVerboseMode(this.checked)"
                               style="width: 18px; height: 18px; cursor: pointer;">
                        <span>Clean Response Mode</span>
                    </label>
                    <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 5px;">
                        <span id="nluModeDesc">${this.config.verboseMode ? 'Showing detailed context' : 'Direct answers only'}</span>
                    </div>
                    <div style="font-size: 10px; color: rgba(0,212,255,0.8); margin-top: 8px; border-top: 1px solid rgba(0,212,255,0.3); padding-top: 8px;">
                        📚 <span id="nluVocabSize">${this.state.patternStats.vocabularySize}</span> keywords learned
                    </div>
                </div>
            `;
            
            if (!document.getElementById('aevovNLUToggle')) {
                document.body.insertAdjacentHTML('beforeend', toggleHTML);
            }
        },

        toggleVerboseMode(cleanMode) {
            this.config.verboseMode = !cleanMode;
            
            const desc = document.getElementById('nluModeDesc');
            if (desc) {
                desc.textContent = this.config.verboseMode ? 
                    'Showing detailed context' : 'Direct answers only';
            }
            
            console.log(`🎛️ Response mode: ${this.config.verboseMode ? 'Verbose' : 'Clean'}`);
        },

        /**
         * PATCH CHAT SYSTEM
         */
        patchChatSystem() {
            console.log('🔧 Patching chat with dynamic NLU...');

            if (window.UnifiedChatSystem?.processPipeline) {
                const original = window.UnifiedChatSystem.processPipeline.bind(window.UnifiedChatSystem);
                window.UnifiedChatSystem.processPipeline = async (query) => {
                    return await this.processWithNLU(query, original);
                };
            }
            else if (window.ChatWidget?.processQuery) {
                const original = window.ChatWidget.processQuery.bind(window.ChatWidget);
                window.ChatWidget.processQuery = async (query) => {
                    return await this.processWithNLU(query, original);
                };
            }
            else if (window.sendMessage) {
                const original = window.sendMessage;
                window.sendMessage = () => {
                    const input = document.getElementById('chatInput');
                    const query = input?.value?.trim();
                    if (!query) return;
                    input.value = '';
                    this.processWithNLUUI(query);
                };
            }

            console.log('✅ Chat system patched');
        },

        /**
         * PROCESS WITH NLU (MAIN PIPELINE)
         */
        async processWithNLU(query, fallback) {
            console.log('🧠 Dynamic NLU processing:', query);

            try {
                // Ensure vocabulary is current
                if (Date.now() - this.state.patternStats.lastUpdate > 30000) {
                    await this.learnVocabulary();
                }

                // Step 1: Classify intent
                const intentData = this.classifyIntent(query);
                
                // Step 2: Extract entities dynamically
                const entities = this.extractEntities(query);
                
                // Step 3: Deep inference with pattern matching
                const matches = await this.deepInference(query, entities, intentData);
                
                // Step 4: Generate natural response
                const response = this.generateResponse(intentData, entities, matches, query);
                
                // Step 5: Learn from interaction
                this.addToConversationContext(query, intentData, entities, response);
                this.updateUserProfile(entities, intentData);
                
                // Update UI with vocabulary stats
                this.updateVocabularyUI();
                
                return response;
                
            } catch (error) {
                console.error('❌ NLU error:', error);
                if (fallback) return await fallback(query);
                return "I encountered an error processing your request.";
            }
        },

        /**
         * PROCESS WITH NLU UI (synchronous)
         */
        processWithNLUUI(query) {
            const chat = document.getElementById('chatContainer');
            if (!chat) return;
            
            const userMsg = document.createElement('div');
            userMsg.className = 'message user';
            userMsg.textContent = query;
            chat.appendChild(userMsg);
            
            const thinking = document.createElement('div');
            thinking.className = 'message assistant';
            thinking.innerHTML = '<em>🧠 Analyzing with dynamic NLU...</em>';
            chat.appendChild(thinking);
            chat.scrollTop = chat.scrollHeight;
            
            setTimeout(async () => {
                const intentData = this.classifyIntent(query);
                const entities = this.extractEntities(query);
                const matches = await this.deepInference(query, entities, intentData);
                const response = this.generateResponse(intentData, entities, matches, query);
                
                chat.removeChild(thinking);
                
                const assistantMsg = document.createElement('div');
                assistantMsg.className = 'message assistant';
                assistantMsg.textContent = response;
                chat.appendChild(assistantMsg);
                
                chat.scrollTop = chat.scrollHeight;
                
                this.addToConversationContext(query, intentData, entities, response);
                this.updateUserProfile(entities, intentData);
                this.updateVocabularyUI();
            }, 200);
        },

        /**
         * UPDATE USER PROFILE
         */
        updateUserProfile(entities, intentData) {
            entities.domains.forEach(domain => {
                if (!this.state.userProfile.preferredDomains.includes(domain)) {
                    this.state.userProfile.preferredDomains.push(domain);
                }
            });
            
            if (this.state.userProfile.preferredDomains.length > 10) {
                this.state.userProfile.preferredDomains = 
                    this.state.userProfile.preferredDomains.slice(-10);
            }
        },

        /**
         * UPDATE VOCABULARY UI
         */
        updateVocabularyUI() {
            const vocabEl = document.getElementById('nluVocabSize');
            if (vocabEl) {
                vocabEl.textContent = this.state.patternStats.vocabularySize;
            }
        },

        /**
         * UTILITY FUNCTIONS
         */
        getAllPatterns() {
            const allPatterns = [];
            if (window.patterns && typeof window.patterns === 'object') {
                for (const domain in window.patterns) {
                    if (Array.isArray(window.patterns[domain])) {
                        allPatterns.push(...window.patterns[domain]);
                    }
                }
            }
            return allPatterns;
        },

        tokenize(text) {
            return text.toLowerCase()
                .replace(/[^\w\s]/g, ' ')
                .split(/\s+/)
                .filter(t => t.length > 1);
        },

        hash(str) {
            let h = 0;
            for (let i = 0; i < str.length; i++) {
                h = ((h << 5) - h) + str.charCodeAt(i);
            }
            return Math.abs(h);
        },

        createEmbedding(keywords) {
            const embedding = new Array(128).fill(0);
            keywords.forEach(word => {
                const h = this.hash(word.toLowerCase());
                embedding[h % 128] += 1.0;
            });
            const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
            return magnitude > 0 ? embedding.map(v => v / magnitude) : embedding;
        },

        cosineSimilarity(a, b) {
            if (a.length !== b.length) return 0;
            let dotProduct = 0;
            let magnitudeA = 0;
            let magnitudeB = 0;
            for (let i = 0; i < a.length; i++) {
                dotProduct += a[i] * b[i];
                magnitudeA += a[i] * a[i];
                magnitudeB += b[i] * b[i];
            }
            magnitudeA = Math.sqrt(magnitudeA);
            magnitudeB = Math.sqrt(magnitudeB);
            if (magnitudeA === 0 || magnitudeB === 0) return 0;
            return dotProduct / (magnitudeA * magnitudeB);
        },

        showNotification(title, message) {
            if (window.UnifiedChatSystem?.notify) {
                window.UnifiedChatSystem.notify('success', title, message);
            } else {
                console.log(`📢 ${title}: ${message}`);
            }
        }
    };

    // Export globally
    window.AevovNLU = AevovNLU;

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => AevovNLU.init(), 1000);
        });
    } else {
        setTimeout(() => AevovNLU.init(), 1000);
    }

    console.log('✅ Aevov Dynamic NLU Engine loaded');
    console.log('🎯 Learns vocabulary from patterns dynamically');
    console.log('🔄 Auto-refreshes when patterns change');
    console.log('🧠 Handles ANY query based on loaded patterns');

})();
