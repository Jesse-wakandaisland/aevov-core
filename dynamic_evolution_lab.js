/**
 * DYNAMIC PATTERN EVOLUTION LAB
 * Same category/subcategory system as Advanced Extractor
 */

(function() {
    'use strict';

    const DynamicEvolutionLab = {
        // Use same hierarchy as Advanced Extractor
        categoryHierarchy: null,

        init() {
            // Wait for Advanced Extractor to load its hierarchy
            if (window.AdvancedPatternExtractor?.categoryHierarchy) {
                this.categoryHierarchy = window.AdvancedPatternExtractor.categoryHierarchy;
                this.injectDynamicUI();
            } else {
                setTimeout(() => this.init(), 500);
            }
        },

        injectDynamicUI() {
            const evolutionSection = document.querySelector('.section h2:contains("Pattern Evolution Lab")');
            if (!evolutionSection?.parentElement) return;

            const dynamicUI = `
                <div id="dynamicEvolutionControls" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: white; margin: 0 0 15px 0;">🔬 Dynamic Evolution Controls</h3>

                    <!-- Parent Category -->
                    <div style="margin-bottom: 15px;">
                        <label style="color: white; display: block; margin-bottom: 5px;">Parent Domain</label>
                        <select id="evolutionParentCategory" onchange="window.DynamicEvolutionLab.updateSubcategories()" style="
                            width: 100%;
                            padding: 10px;
                            border: none;
                            border-radius: 6px;
                            font-size: 14px;
                        ">
                            <option value="">Select Parent Domain...</option>
                        </select>
                    </div>

                    <!-- Subcategory (Multi-select) -->
                    <div style="margin-bottom: 15px;">
                        <label style="color: white; display: block; margin-bottom: 5px;">Target Subcategories (Multi-select)</label>
                        <select id="evolutionSubcategories" multiple style="
                            width: 100%;
                            padding: 10px;
                            border: none;
                            border-radius: 6px;
                            font-size: 14px;
                            min-height: 120px;
                        ">
                            <option value="all">All Subcategories</option>
                        </select>
                    </div>

                    <!-- Evolution Strategy -->
                    <div style="margin-bottom: 15px;">
                        <label style="color: white; display: block; margin-bottom: 5px;">Evolution Strategy</label>
                        <select id="evolutionStrategy" style="
                            width: 100%;
                            padding: 10px;
                            border: none;
                            border-radius: 6px;
                            font-size: 14px;
                        ">
                            <option value="similarity">Similarity Clustering (Fast)</option>
                            <option value="genetic">Genetic Evolution (Balanced)</option>
                            <option value="hybrid" selected>Hybrid Synthesis (Best Quality)</option>
                            <option value="radical">Radical Mutation (Experimental)</option>
                            <option value="armsquare">ARMsquare Reasoning (Native AI)</option>
                        </select>
                    </div>

                    <!-- Iterations -->
                    <div style="margin-bottom: 15px;">
                        <label style="color: white; display: block; margin-bottom: 5px;">Evolution Iterations</label>
                        <input type="number" id="evolutionIterations" min="1" max="1000" value="50" style="
                            width: 100%;
                            padding: 10px;
                            border: none;
                            border-radius: 6px;
                            font-size: 14px;
                        ">
                    </div>

                    <!-- Model Name -->
                    <div style="margin-bottom: 15px;">
                        <label style="color: white; display: block; margin-bottom: 5px;">Output Model Name</label>
                        <input type="text" id="evolutionModelName" placeholder="evolved-model-v1" style="
                            width: 100%;
                            padding: 10px;
                            border: none;
                            border-radius: 6px;
                            font-size: 14px;
                        ">
                    </div>

                    <!-- Start Button -->
                    <button onclick="window.DynamicEvolutionLab.startEvolution()" style="
                        width: 100%;
                        padding: 15px;
                        background: linear-gradient(135deg, #00d4ff 0%, #3a47d5 100%);
                        border: none;
                        color: white;
                        font-weight: 600;
                        font-size: 16px;
                        border-radius: 6px;
                        cursor: pointer;
                    ">
                        🧬 Start Pattern Evolution → Create .aev Model
                    </button>

                    <!-- Progress -->
                    <div id="evolutionProgress" style="display: none; margin-top: 15px;">
                        <div style="background: rgba(0,0,0,0.3); height: 8px; border-radius: 4px; overflow: hidden;">
                            <div id="evolutionProgressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #00ff88, #00d4ff); transition: width 0.3s;"></div>
                        </div>
                        <div id="evolutionStatus" style="color: white; margin-top: 10px; font-size: 13px;"></div>
                    </div>
                </div>
            `;

            evolutionSection.parentElement.insertAdjacentHTML('beforeend', dynamicUI);

            // Populate parent categories
            this.populateParentCategories();

            console.log('✅ Dynamic Evolution Lab injected');
        },

        populateParentCategories() {
            const select = document.getElementById('evolutionParentCategory');
            if (!select || !this.categoryHierarchy) return;

            Object.keys(this.categoryHierarchy).forEach(key => {
                const category = this.categoryHierarchy[key];
                const option = document.createElement('option');
                option.value = key;
                option.textContent = `${category.icon} ${category.name}`;
                select.appendChild(option);
            });
        },

        updateSubcategories() {
            const parentSelect = document.getElementById('evolutionParentCategory');
            const subSelect = document.getElementById('evolutionSubcategories');
            
            if (!parentSelect || !subSelect) return;

            const parentKey = parentSelect.value;
            subSelect.innerHTML = '<option value="all">All Subcategories</option>';

            if (!parentKey || !this.categoryHierarchy[parentKey]) return;

            const parent = this.categoryHierarchy[parentKey];
            
            Object.keys(parent.children || {}).forEach(key => {
                const sub = parent.children[key];
                const option = document.createElement('option');
                option.value = key;
                option.textContent = sub.name;
                subSelect.appendChild(option);
            });
        },

        async startEvolution() {
            const parentKey = document.getElementById('evolutionParentCategory').value;
            const subSelects = document.getElementById('evolutionSubcategories');
            const strategy = document.getElementById('evolutionStrategy').value;
            const iterations = parseInt(document.getElementById('evolutionIterations').value);
            const modelName = document.getElementById('evolutionModelName').value || 'evolved-model';

            if (!parentKey) {
                alert('Please select a parent domain');
                return;
            }

            // Get selected subcategories
            const selectedSubs = Array.from(subSelects.selectedOptions).map(o => o.value);
            const subcategories = selectedSubs.includes('all') ? 
                Object.keys(this.categoryHierarchy[parentKey].children || {}) :
                selectedSubs;

            if (subcategories.length === 0) {
                alert('Please select at least one subcategory');
                return;
            }

            // Show progress
            document.getElementById('evolutionProgress').style.display = 'block';
            const progressBar = document.getElementById('evolutionProgressBar');
            const status = document.getElementById('evolutionStatus');

            status.textContent = 'Gathering patterns...';
            progressBar.style.width = '10%';

            // Gather patterns from selected categories
            const patterns = [];
            for (const subKey of subcategories) {
                const categoryPatterns = window.advancedPatterns?.[subKey] || 
                                       window.patterns?.[subKey] || [];
                patterns.push(...categoryPatterns);
            }

            if (patterns.length === 0) {
                alert('No patterns found in selected categories. Extract patterns first.');
                document.getElementById('evolutionProgress').style.display = 'none';
                return;
            }

            status.textContent = `Evolving ${patterns.length} patterns...`;
            progressBar.style.width = '50%';

            // Apply evolution strategy
            let evolved;
            if (strategy === 'armsquare' && window.ARMsquareReasoning) {
                evolved = window.ARMsquareReasoning.applyReasoning(patterns);
            } else {
                // Basic evolution simulation
                evolved = patterns.map((p, i) => ({
                    ...p,
                    id: `evolved_${p.id}_${i}`,
                    evolved: true,
                    evolution_strategy: strategy,
                    evolution_iteration: iterations,
                    confidence: Math.min((p.confidence || 0.9) * 1.1, 0.99)
                }));
            }

            status.textContent = 'Creating .aev model...';
            progressBar.style.width = '80%';

            // Create .aev model
            const model = {
                format: 'aev',
                version: '2.0',
                protocol: strategy === 'armsquare' ? 'armsquare-reasoning' : 'pattern-evolution',
                model_name: modelName,
                created_at: new Date().toISOString(),
                evolution: {
                    parent_domain: parentKey,
                    subcategories: subcategories,
                    strategy: strategy,
                    iterations: iterations,
                    source_patterns: patterns.length,
                    evolved_patterns: evolved.length
                },
                patterns: evolved,
                metadata: {
                    total_patterns: evolved.length,
                    avg_confidence: evolved.reduce((sum, p) => sum + (p.confidence || 0), 0) / evolved.length,
                    domains: subcategories.length
                }
            };

            // Save and download
            if (window.NeuroArchitect) {
                window.NeuroArchitect.state.models.push(model);
                window.NeuroArchitect.saveModels();
            }

            this.downloadModel(model);

            status.textContent = `✅ Created ${modelName}.aev with ${evolved.length} evolved patterns`;
            progressBar.style.width = '100%';

            setTimeout(() => {
                document.getElementById('evolutionProgress').style.display = 'none';
            }, 3000);
        },

        downloadModel(model) {
            const json = JSON.stringify(model, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${model.model_name}.aev`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    // Initialize when libraries are ready
    window.addEventListener('libraries-loaded', () => {
        DynamicEvolutionLab.init();
    });

    // Or try now
    DynamicEvolutionLab.init();

    window.DynamicEvolutionLab = DynamicEvolutionLab;

})();
