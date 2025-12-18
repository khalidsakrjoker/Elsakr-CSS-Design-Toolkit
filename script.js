/**
 * Elsakr CSS Design Toolkit
 * 5 design tools in one
 */

class CSSDesignToolkit {
    constructor() {
        this.currentTool = 'palette';
        this.init();
    }

    init() {
        this.bindTabs();
        this.initPalette();
        this.initShadow();
        this.initRadius();
        this.initGlass();
        this.initAnimation();
    }

    // ========== Tab Navigation ==========
    bindTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.dataset.tool;
                this.switchTool(tool);
            });
        });
    }

    switchTool(tool) {
        this.currentTool = tool;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.dataset.tool === tool) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show/hide sections
        document.querySelectorAll('.tool-section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(`tool-${tool}`).classList.remove('hidden');
    }

    // ========== Tool 1: Color Palette ==========
    initPalette() {
        this.paletteHarmony = 'complementary';
        
        const baseColor = document.getElementById('paletteBaseColor');
        const baseHex = document.getElementById('paletteBaseHex');
        
        baseColor.addEventListener('input', (e) => {
            baseHex.value = e.target.value;
            this.generatePalette();
        });
        
        baseHex.addEventListener('input', (e) => {
            let val = e.target.value;
            if (!val.startsWith('#')) val = '#' + val;
            if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                baseColor.value = val;
                this.generatePalette();
            }
        });
        
        document.querySelectorAll('.harmony-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.harmony-btn').forEach(b => {
                    b.classList.remove('active', 'bg-blue-500', 'text-white');
                    b.classList.add('bg-dark-input', 'text-slate-400');
                });
                btn.classList.add('active', 'bg-blue-500', 'text-white');
                btn.classList.remove('bg-dark-input', 'text-slate-400');
                this.paletteHarmony = btn.dataset.harmony;
                this.generatePalette();
            });
        });
        
        document.getElementById('paletteCopy').addEventListener('click', () => {
            this.copyToClipboard(document.getElementById('paletteCode').textContent, 'paletteCopy');
        });
        
        this.generatePalette();
    }

    generatePalette() {
        const base = document.getElementById('paletteBaseColor').value;
        const colors = this.getHarmonyColors(base, this.paletteHarmony);
        
        // Update preview
        const preview = document.getElementById('palettePreview');
        preview.innerHTML = colors.map((color, i) => `
            <div class="rounded-lg cursor-pointer hover:scale-105 transition-transform relative group" 
                 style="background: ${color}" 
                 onclick="navigator.clipboard.writeText('${color}')">
                <span class="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/80 bg-black/50 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">${color}</span>
            </div>
        `).join('');
        
        // Update code
        const code = `:root {
${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}
}`;
        document.getElementById('paletteCode').textContent = code;
    }

    getHarmonyColors(hex, harmony) {
        const hsl = this.hexToHsl(hex);
        let colors = [hex];
        
        switch (harmony) {
            case 'complementary':
                colors.push(this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 90)));
                colors.push(this.hslToHex((hsl.h + 180) % 360, hsl.s, Math.max(hsl.l - 15, 10)));
                colors.push(this.hslToHex(hsl.h, Math.max(hsl.s - 20, 10), hsl.l));
                break;
            case 'analogous':
                colors.push(this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex((hsl.h - 60 + 360) % 360, hsl.s, hsl.l));
                break;
            case 'triadic':
                colors.push(this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 90)));
                colors.push(this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 10)));
                break;
            case 'split':
                colors.push(this.hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex(hsl.h, Math.min(hsl.s + 10, 100), hsl.l));
                colors.push(this.hslToHex(hsl.h, Math.max(hsl.s - 20, 10), hsl.l));
                break;
            case 'tetradic':
                colors.push(this.hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 15, 10)));
                break;
            case 'monochromatic':
                colors.push(this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 95)));
                colors.push(this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 5)));
                colors.push(this.hslToHex(hsl.h, Math.max(hsl.s - 30, 10), hsl.l));
                colors.push(this.hslToHex(hsl.h, Math.min(hsl.s + 20, 100), Math.max(hsl.l - 30, 10)));
                break;
        }
        
        return colors;
    }

    // ========== Tool 2: Box Shadow ==========
    initShadow() {
        const inputs = ['shadowX', 'shadowY', 'shadowBlur', 'shadowSpread', 'shadowOpacity'];
        
        inputs.forEach(id => {
            const el = document.getElementById(id);
            el.addEventListener('input', () => {
                document.getElementById(id + 'Val').textContent = 
                    id === 'shadowOpacity' ? el.value + '%' : el.value + 'px';
                this.updateShadow();
            });
        });
        
        document.getElementById('shadowColor').addEventListener('input', () => this.updateShadow());
        document.getElementById('shadowInset').addEventListener('change', () => this.updateShadow());
        
        document.getElementById('shadowCopy').addEventListener('click', () => {
            this.copyToClipboard(document.getElementById('shadowCode').textContent, 'shadowCopy');
        });
        
        this.updateShadow();
    }

    updateShadow() {
        const x = document.getElementById('shadowX').value;
        const y = document.getElementById('shadowY').value;
        const blur = document.getElementById('shadowBlur').value;
        const spread = document.getElementById('shadowSpread').value;
        const color = document.getElementById('shadowColor').value;
        const opacity = document.getElementById('shadowOpacity').value / 100;
        const inset = document.getElementById('shadowInset').checked;
        
        const rgba = this.hexToRgba(color, opacity);
        const shadow = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
        
        document.getElementById('shadowPreview').style.boxShadow = shadow;
        document.getElementById('shadowCode').textContent = `box-shadow: ${shadow};`;
    }

    // ========== Tool 3: Border Radius ==========
    initRadius() {
        const inputs = ['radiusTL', 'radiusTR', 'radiusBR', 'radiusBL'];
        const linked = document.getElementById('radiusLink');
        
        inputs.forEach(id => {
            const el = document.getElementById(id);
            el.addEventListener('input', () => {
                document.getElementById(id + 'Val').textContent = el.value + 'px';
                
                if (linked.checked) {
                    inputs.forEach(otherId => {
                        if (otherId !== id) {
                            document.getElementById(otherId).value = el.value;
                            document.getElementById(otherId + 'Val').textContent = el.value + 'px';
                        }
                    });
                }
                
                this.updateRadius();
            });
        });
        
        document.getElementById('radiusCopy').addEventListener('click', () => {
            this.copyToClipboard(document.getElementById('radiusCode').textContent, 'radiusCopy');
        });
        
        this.updateRadius();
    }

    updateRadius() {
        const tl = document.getElementById('radiusTL').value;
        const tr = document.getElementById('radiusTR').value;
        const br = document.getElementById('radiusBR').value;
        const bl = document.getElementById('radiusBL').value;
        
        const radius = `${tl}px ${tr}px ${br}px ${bl}px`;
        
        document.getElementById('radiusPreview').style.borderRadius = radius;
        document.getElementById('radiusCode').textContent = `border-radius: ${radius};`;
    }

    // ========== Tool 4: Glassmorphism ==========
    initGlass() {
        const inputs = ['glassBlur', 'glassOpacity', 'glassBorder', 'glassRadius'];
        
        inputs.forEach(id => {
            const el = document.getElementById(id);
            el.addEventListener('input', () => {
                const suffix = id === 'glassOpacity' || id === 'glassBorder' ? '%' : 'px';
                document.getElementById(id + 'Val').textContent = el.value + suffix;
                this.updateGlass();
            });
        });
        
        document.getElementById('glassColor').addEventListener('input', () => this.updateGlass());
        
        document.getElementById('glassCopy').addEventListener('click', () => {
            this.copyToClipboard(document.getElementById('glassCode').textContent, 'glassCopy');
        });
        
        this.updateGlass();
    }

    updateGlass() {
        const blur = document.getElementById('glassBlur').value;
        const opacity = document.getElementById('glassOpacity').value / 100;
        const borderOpacity = document.getElementById('glassBorder').value / 100;
        const radius = document.getElementById('glassRadius').value;
        const color = document.getElementById('glassColor').value;
        
        const rgb = this.hexToRgb(color);
        const bg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        const border = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity})`;
        
        const preview = document.getElementById('glassPreview');
        preview.style.background = bg;
        preview.style.backdropFilter = `blur(${blur}px)`;
        preview.style.webkitBackdropFilter = `blur(${blur}px)`;
        preview.style.border = `1px solid ${border}`;
        preview.style.borderRadius = `${radius}px`;
        
        const code = `.glass {
  background: ${bg};
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border: 1px solid ${border};
  border-radius: ${radius}px;
}`;
        document.getElementById('glassCode').textContent = code;
    }

    // ========== Tool 5: Animation ==========
    initAnimation() {
        this.animationType = 'bounce';
        this.animationStyles = null;
        
        document.querySelectorAll('.anim-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.anim-btn').forEach(b => {
                    b.classList.remove('active', 'bg-blue-500', 'text-white');
                    b.classList.add('bg-dark-input', 'text-slate-400');
                });
                btn.classList.add('active', 'bg-blue-500', 'text-white');
                btn.classList.remove('bg-dark-input', 'text-slate-400');
                this.animationType = btn.dataset.anim;
                this.updateAnimation();
            });
        });
        
        ['animDuration', 'animTiming', 'animIteration', 'animDirection'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                if (id === 'animDuration') {
                    document.getElementById('animDurationVal').textContent = 
                        document.getElementById(id).value + 's';
                }
                this.updateAnimation();
            });
            document.getElementById(id).addEventListener('change', () => this.updateAnimation());
        });
        
        document.getElementById('animCopy').addEventListener('click', () => {
            this.copyToClipboard(document.getElementById('animCode').textContent, 'animCopy');
        });
        
        this.updateAnimation();
    }

    updateAnimation() {
        const duration = document.getElementById('animDuration').value;
        const timing = document.getElementById('animTiming').value;
        const iteration = document.getElementById('animIteration').value;
        const direction = document.getElementById('animDirection').value;
        
        const keyframes = this.getKeyframes(this.animationType);
        const animName = `elsakr-${this.animationType}`;
        
        // Remove old style
        if (this.animationStyles) {
            this.animationStyles.remove();
        }
        
        // Create new style
        this.animationStyles = document.createElement('style');
        this.animationStyles.textContent = `
            @keyframes ${animName} {
                ${keyframes}
            }
        `;
        document.head.appendChild(this.animationStyles);
        
        const preview = document.getElementById('animPreview');
        preview.style.animation = `${animName} ${duration}s ${timing} ${iteration} ${direction}`;
        
        const code = `@keyframes ${animName} {
${keyframes.split('\n').map(l => '  ' + l).join('\n')}
}

.element {
  animation: ${animName} ${duration}s ${timing} ${iteration} ${direction};
}`;
        document.getElementById('animCode').textContent = code;
    }

    getKeyframes(type) {
        const keyframes = {
            bounce: `0%, 100% { transform: translateY(0); }
50% { transform: translateY(-20px); }`,
            pulse: `0%, 100% { transform: scale(1); opacity: 1; }
50% { transform: scale(1.1); opacity: 0.8; }`,
            shake: `0%, 100% { transform: translateX(0); }
25% { transform: translateX(-10px); }
75% { transform: translateX(10px); }`,
            fade: `0% { opacity: 0; }
100% { opacity: 1; }`,
            slide: `0% { transform: translateX(-100%); opacity: 0; }
100% { transform: translateX(0); opacity: 1; }`,
            rotate: `0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }`
        };
        return keyframes[type] || keyframes.bounce;
    }

    // ========== Utility Functions ==========
    hexToHsl(hex) {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;
        
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    hexToRgba(hex, alpha) {
        const { r, g, b } = this.hexToRgb(hex);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    copyToClipboard(text, btnId) {
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById(btnId);
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            btn.classList.add('bg-emerald-500');
            btn.classList.remove('bg-blue-500');
            
            setTimeout(() => {
                btn.textContent = original;
                btn.classList.remove('bg-emerald-500');
                btn.classList.add('bg-blue-500');
            }, 2000);
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new CSSDesignToolkit();
});
