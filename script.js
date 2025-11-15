// ===== GLOBAL VARIABLES & CONFIGURATION =====
const CONFIG = {
    soundEnabled: true,
    particlesEnabled: true,
    animationSpeed: 1,
    theme: 'cyan',
    volume: 0.5
};

// Canvas Elements
const particleCanvas = document.getElementById('particleCanvas');
const particleCtx = particleCanvas.getContext('2d');
const aiWaveform = document.getElementById('aiWaveform');
const aiWaveCtx = aiWaveform.getContext('2d');
const reactorCanvas = document.getElementById('reactorCanvas');
const reactorCtx = reactorCanvas.getContext('2d');
const holoCanvas = document.getElementById('holoCanvas');
const holoCtx = holoCanvas.getContext('2d');
const chartCanvas = document.getElementById('chartCanvas');
const chartCtx = chartCanvas.getContext('2d');
const mapCanvas = document.getElementById('mapCanvas');
const mapCtx = mapCanvas.getContext('2d');

// Animation Variables
let particles = [];
let audioData = [];
let reactorAngle = 0;
let holoRotation = 0;
let holoZoom = 1;
let chartData = [];
let autoRotateEnabled = false;
let systemStats = {
    cpu: 0,
    memory: 0,
    gpu: 0,
    network: 0
};

// Speech Recognition
let recognition = null;
let isListening = false;

// ===== INITIALIZATION =====
window.addEventListener('load', () => {
    initLoadingScreen();
    initCanvasSizes();
    initParticles();
    initDateTime();
    initWeather();
    initBattery();
    initSystemInfo();
    initEventListeners();
    initAI();
    initSpeechRecognition();
    
    // Start animations
    animateParticles();
    animateAIWaveform();
    animateReactor();
    animateHologram();
    animateChart();
    animateMap();
    
    // Auto updates
    setInterval(updateSystemStats, 2000);
    setInterval(updateReactorStats, 3000);
    setInterval(addRandomNotification, 20000);
    setInterval(updateProcessCount, 5000);
    
    // Resize handler
    window.addEventListener('resize', handleResize);
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    const loadingText = document.getElementById('loadingText');
    const loadingSteps = document.getElementById('loadingSteps');
    
    const steps = [
        'Initializing Core Systems...',
        'Loading Arc Reactor Modules...',
        'Connecting to JARVIS AI...',
        'Calibrating Holographic Display...',
        'Establishing Secure Connection...',
        'Loading Armor Protocols...',
        'Synchronizing Databases...',
        'Activating Security Systems...',
        'Running System Diagnostics...',
        'All Systems Operational'
    ];
    
    let progress = 0;
    let stepIndex = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 12 + 3;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                playSound('startup');
                showVoiceCommand('SYSTEMS INITIALIZED. WELCOME BACK, SIR.', 3000);
            }, 500);
        }
        
        // Update step
        if (stepIndex < steps.length - 1 && progress > (stepIndex + 1) * 10) {
            stepIndex++;
            loadingSteps.innerHTML = `<div class="loading-step">${steps[stepIndex]}</div>`;
        }
        
        loadingProgress.style.width = progress + '%';
        loadingText.textContent = Math.floor(progress) + '%';
    }, 200);
}

// ===== PARTICLE SYSTEM =====
function initParticles() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    
    const particleCount = 150;
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 0.5,
            color: `rgba(0, 255, 255, ${Math.random() * 0.5 + 0.2})`
        });
    }
}

function animateParticles() {
    if (!CONFIG.particlesEnabled) {
        particleCtx.fillStyle = 'rgba(5, 8, 20, 1)';
        particleCtx.fillRect(0, 0, particleCanvas.width, particleCanvas.height);
        requestAnimationFrame(animateParticles);
        return;
    }
    
    particleCtx.fillStyle = 'rgba(5, 8, 20, 0.05)';
    particleCtx.fillRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = particleCanvas.width;
        if (particle.x > particleCanvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = particleCanvas.height;
        if (particle.y > particleCanvas.height) particle.y = 0;
        
        // Draw particle
        particleCtx.beginPath();
        particleCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        particleCtx.fillStyle = particle.color;
        particleCtx.fill();
        
        // Connect nearby particles
        for (let j = index + 1; j < particles.length; j++) {
            const other = particles[j];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                particleCtx.beginPath();
                particleCtx.strokeStyle = `rgba(0, 255, 255, ${0.15 * (1 - distance / 120)})`;
                particleCtx.lineWidth = 0.5;
                particleCtx.moveTo(particle.x, particle.y);
                particleCtx.lineTo(other.x, other.y);
                particleCtx.stroke();
            }
        }
    });
    
    requestAnimationFrame(animateParticles);
}

// ===== AI WAVEFORM =====
function animateAIWaveform() {
    const width = aiWaveform.width;
    const height = aiWaveform.height;
    const centerY = height / 2;
    
    aiWaveCtx.clearRect(0, 0, width, height);
    
    // Create gradient
    const gradient = aiWaveCtx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.2)');
    gradient.addColorStop(0.5, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0.2)');
    
    // Draw multiple waveforms
    for (let wave = 0; wave < 3; wave++) {
        aiWaveCtx.beginPath();
        aiWaveCtx.strokeStyle = gradient;
        aiWaveCtx.lineWidth = 2 - wave * 0.5;
        
        for (let x = 0; x < width; x++) {
            const frequency = 0.02 + wave * 0.01;
            const amplitude = 20 - wave * 5;
            const offset = wave * Math.PI / 3;
            const y = centerY + Math.sin(x * frequency + Date.now() * 0.003 + offset) * amplitude * (0.5 + Math.random() * 0.5);
            
            if (x === 0) {
                aiWaveCtx.moveTo(x, y);
            } else {
                aiWaveCtx.lineTo(x, y);
            }
        }
        
        aiWaveCtx.stroke();
    }
    
    // Glow effect
    aiWaveCtx.shadowBlur = 15;
    aiWaveCtx.shadowColor = '#00ffff';
    
    requestAnimationFrame(animateAIWaveform);
}

// ===== ARC REACTOR ANIMATION =====
function animateReactor() {
    const width = reactorCanvas.width;
    const height = reactorCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    reactorCtx.clearRect(0, 0, width, height);
    
    // Rotating beams
    reactorAngle += 0.015 * CONFIG.animationSpeed;
    
    for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i + reactorAngle;
        const innerRadius = 40;
        const outerRadius = 90;
        
        const x1 = centerX + Math.cos(angle) * innerRadius;
        const y1 = centerY + Math.sin(angle) * innerRadius;
        const x2 = centerX + Math.cos(angle) * outerRadius;
        const y2 = centerY + Math.sin(angle) * outerRadius;
        
        const gradient = reactorCtx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, '#00ffff');
        gradient.addColorStop(0.7, 'rgba(0, 255, 255, 0.3)');
        gradient.addColorStop(1, 'transparent');
        
        reactorCtx.beginPath();
        reactorCtx.strokeStyle = gradient;
        reactorCtx.lineWidth = 2;
        reactorCtx.moveTo(x1, y1);
        reactorCtx.lineTo(x2, y2);
        reactorCtx.stroke();
    }
    
    // Rotating rings
    for (let i = 0; i < 3; i++) {
        const radius = 50 + i * 15;
        const rotation = reactorAngle * (1 + i * 0.3);
        
        reactorCtx.beginPath();
        reactorCtx.strokeStyle = `rgba(0, 255, 255, ${0.5 - i * 0.1})`;
        reactorCtx.lineWidth = 2;
        reactorCtx.setLineDash([10, 5]);
        reactorCtx.arc(centerX, centerY, radius, rotation, rotation + Math.PI * 1.5);
        reactorCtx.stroke();
        reactorCtx.setLineDash([]);
    }
    
    // Central core
    const coreGradient = reactorCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35);
    coreGradient.addColorStop(0, '#ffffff');
    coreGradient.addColorStop(0.3, '#00ffff');
    coreGradient.addColorStop(1, 'rgba(0, 255, 255, 0.2)');
    
    reactorCtx.beginPath();
    reactorCtx.fillStyle = coreGradient;
    reactorCtx.arc(centerX, centerY, 35, 0, Math.PI * 2);
    reactorCtx.fill();
    
    // Pulse rings
    const pulseRadius = 65 + Math.sin(Date.now() * 0.004) * 8;
    reactorCtx.beginPath();
    reactorCtx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
    reactorCtx.lineWidth = 2;
    reactorCtx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    reactorCtx.stroke();
    
    requestAnimationFrame(animateReactor);
}

// ===== HOLOGRAM ANIMATION =====
function animateHologram() {
    const width = holoCanvas.width;
    const height = holoCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    holoCtx.clearRect(0, 0, width, height);
    
    if (autoRotateEnabled) {
        holoRotation += 0.01 * CONFIG.animationSpeed;
    }
    
    // 3D Wireframe Suit/Cube
    const size = 80 * holoZoom;
    
    // Define vertices for a more complex shape (Iron Man helmet-like)
    const vertices = [
        // Front face
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
        // Back face
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        // Top points
        [0, 1.5, 0.5], [0, 1.5, -0.5]
    ];
    
    // Rotate and project vertices
    const rotatedVertices = vertices.map(v => {
        // Rotate around Y axis
        let x = v[0] * Math.cos(holoRotation) - v[2] * Math.sin(holoRotation);
        let z = v[0] * Math.sin(holoRotation) + v[2] * Math.cos(holoRotation);
        let y = v[1];
        
        // Rotate around X axis (slight tilt)
        const tiltAngle = Math.sin(Date.now() * 0.001) * 0.2;
        const tempY = y;
        y = y * Math.cos(tiltAngle) - z * Math.sin(tiltAngle);
        z = tempY * Math.sin(tiltAngle) + z * Math.cos(tiltAngle);
        
        // Project to 2D
        const perspective = 400;
        const scale = perspective / (perspective + z * size);
        
        return {
            x: centerX + x * size * scale,
            y: centerY + y * size * scale,
            z: z,
            scale: scale
        };
    });
    
    // Define edges
    const edges = [
        // Front face
        [0,1],[1,2],[2,3],[3,0],
        // Back face
        [4,5],[5,6],[6,7],[7,4],
        // Connecting edges
        [0,4],[1,5],[2,6],[3,7],
        // Top connections
        [2,8],[3,8],[6,9],[7,9],[8,9]
    ];
    
    // Draw edges (sorted by depth)
    const edgesWithDepth = edges.map(edge => ({
        edge,
        depth: (rotatedVertices[edge[0]].z + rotatedVertices[edge[1]].z) / 2
    }));
    
    edgesWithDepth.sort((a, b) => a.depth - b.depth);
    
    edgesWithDepth.forEach(({edge}) => {
        const v1 = rotatedVertices[edge[0]];
        const v2 = rotatedVertices[edge[1]];
        
        const opacity = (v1.z + v2.z) / 2;
        const gradient = holoCtx.createLinearGradient(v1.x, v1.y, v2.x, v2.y);
        gradient.addColorStop(0, `rgba(0, 255, 255, ${0.3 + opacity * 0.2})`);
        gradient.addColorStop(1, `rgba(0, 153, 255, ${0.3 + opacity * 0.2})`);
        
        holoCtx.beginPath();
        holoCtx.strokeStyle = gradient;
        holoCtx.lineWidth = 2;
        holoCtx.moveTo(v1.x, v1.y);
        holoCtx.lineTo(v2.x, v2.y);
        holoCtx.stroke();
    });
    
    // Draw vertices
    rotatedVertices.forEach((v, i) => {
        const size = 3 + v.scale * 2;
        holoCtx.beginPath();
        holoCtx.fillStyle = '#00ffff';
        holoCtx.shadowBlur = 10;
        holoCtx.shadowColor = '#00ffff';
        holoCtx.arc(v.x, v.y, size, 0, Math.PI * 2);
        holoCtx.fill();
        holoCtx.shadowBlur = 0;
    });
    
    // Update info display
    document.getElementById('rotationAngle').textContent = Math.floor((holoRotation % (Math.PI * 2)) * 180 / Math.PI) + '°';
    document.getElementById('zoomLevel').textContent = Math.floor(holoZoom * 100) + '%';
    
    requestAnimationFrame(animateHologram);
}

// ===== CHART ANIMATION =====
function animateChart() {
    const width = chartCanvas.width;
    const height = chartCanvas.height;
    const padding = 40;
    
    chartCtx.clearRect(0, 0, width, height);
    
    // Generate new data point
    if (chartData.length > 60) {
        chartData.shift();
    }
    chartData.push({
        value: 30 + Math.random() * 60,
        timestamp: Date.now()
    });
    
    // Draw grid
    chartCtx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    chartCtx.lineWidth = 1;
    
    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (height - padding * 2) * (i / 5);
        chartCtx.beginPath();
        chartCtx.moveTo(padding, y);
        chartCtx.lineTo(width - padding, y);
        chartCtx.stroke();
        
        // Y-axis labels
        chartCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        chartCtx.font = '10px monospace';
        chartCtx.fillText((100 - i * 20) + '%', 5, y + 4);
    }
    
    // Vertical lines
    for (let i = 0; i <= 6; i++) {
        const x = padding + (width - padding * 2) * (i / 6);
        chartCtx.beginPath();
        chartCtx.moveTo(x, padding);
        chartCtx.lineTo(x, height - padding);
        chartCtx.stroke();
    }
    
    // Draw chart line
    if (chartData.length > 1) {
        chartCtx.beginPath();
        chartCtx.strokeStyle = '#00ffff';
        chartCtx.lineWidth = 2;
        chartCtx.shadowBlur = 10;
        chartCtx.shadowColor = '#00ffff';
        
        const xStep = (width - padding * 2) / (chartData.length - 1);
        
        chartData.forEach((point, index) => {
            const x = padding + index * xStep;
            const y = height - padding - (point.value / 100) * (height - padding * 2);
            
            if (index === 0) {
                chartCtx.moveTo(x, y);
            } else {
                chartCtx.lineTo(x, y);
            }
        });
        
        chartCtx.stroke();
        chartCtx.shadowBlur = 0;
        
        // Fill area under line
        chartCtx.lineTo(width - padding, height - padding);
        chartCtx.lineTo(padding, height - padding);
        chartCtx.closePath();
        
        const gradient = chartCtx.createLinearGradient(0, padding, 0, height - padding);
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0.05)');
        chartCtx.fillStyle = gradient;
        chartCtx.fill();
    }
    
    requestAnimationFrame(animateChart);
}

// ===== MAP ANIMATION =====
function animateMap() {
    const width = mapCanvas.width;
    const height = mapCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    mapCtx.clearRect(0, 0, width, height);
    
    // Draw circular radar
    const maxRadius = Math.min(width, height) / 2 - 20;
    
    // Radar circles
    for (let i = 1; i <= 3; i++) {
        mapCtx.beginPath();
        mapCtx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
        mapCtx.lineWidth = 1;
        mapCtx.arc(centerX, centerY, maxRadius * (i / 3), 0, Math.PI * 2);
        mapCtx.stroke();
    }
    
    // Radar lines
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        mapCtx.beginPath();
        mapCtx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
        mapCtx.moveTo(centerX, centerY);
        mapCtx.lineTo(
            centerX + Math.cos(angle) * maxRadius,
            centerY + Math.sin(angle) * maxRadius
        );
        mapCtx.stroke();
    }
    
    // Scanning beam
    const scanAngle = (Date.now() * 0.002) % (Math.PI * 2);
    const gradient = mapCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
    gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)');
    gradient.addColorStop(1, 'transparent');
    
    mapCtx.beginPath();
    mapCtx.moveTo(centerX, centerY);
    mapCtx.arc(centerX, centerY, maxRadius, scanAngle, scanAngle + Math.PI / 4);
    mapCtx.closePath();
    mapCtx.fillStyle = gradient;
    mapCtx.fill();
    
    // Random blips
    for (let i = 0; i < 5; i++) {
        const blipAngle = Math.random() * Math.PI * 2;
        const blipRadius = Math.random() * maxRadius;
        const blipX = centerX + Math.cos(blipAngle) * blipRadius;
        const blipY = centerY + Math.sin(blipAngle) * blipRadius;
        
        mapCtx.beginPath();
        mapCtx.fillStyle = 'rgba(0, 255, 255, 0.6)';
        mapCtx.arc(blipX, blipY, 3, 0, Math.PI * 2);
        mapCtx.fill();
        
        // Blip ring
        mapCtx.beginPath();
        mapCtx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
        mapCtx.arc(blipX, blipY, 6 + Math.sin(Date.now() * 0.005 + i) * 2, 0, Math.PI * 2);
        mapCtx.stroke();
    }
    
    requestAnimationFrame(animateMap);
}

// ===== SYSTEM MONITOR =====
function updateSystemStats() {
    // Simulate realistic system stats
    systemStats.cpu = Math.min(100, Math.max(0, systemStats.cpu + (Math.random() - 0.5) * 20));
    systemStats.memory = Math.min(100, Math.max(0, systemStats.memory + (Math.random() - 0.5) * 15));
    systemStats.gpu = Math.min(100, Math.max(0, systemStats.gpu + (Math.random() - 0.5) * 25));
    systemStats.network = Math.min(100, Math.max(0, systemStats.network + (Math.random() - 0.5) * 30));
    
    updateProgressBar('.cpu-progress', systemStats.cpu, '#cpuValue', '%');
    updateProgressBar('.memory-progress', systemStats.memory, '#memoryValue', ' GB');
    updateProgressBar('.gpu-progress', systemStats.gpu, '#gpuValue', '%');
    updateProgressBar('.network-progress', systemStats.network, '#networkValue', ' Mbps');
    
    // Update memory details
    const totalMemory = 16;
    const usedMemory = (systemStats.memory / 100) * totalMemory;
    document.getElementById('memoryFree').textContent = (totalMemory - usedMemory).toFixed(1) + ' GB';
    
    // Update network speeds
    document.getElementById('downloadSpeed').textContent = (systemStats.network * 0.8).toFixed(1);
    document.getElementById('uploadSpeed').textContent = (systemStats.network * 0.4).toFixed(1);
}

function updateProgressBar(selector, value, valueId, unit) {
    const bar = document.querySelector(selector);
    const valueElement = document.getElementById(valueId);
    
    bar.style.width = value + '%';
    bar.setAttribute('data-value', value);
    
    if (valueElement) {
        if (unit === ' GB') {
            valueElement.textContent = ((value / 100) * 16).toFixed(1) + unit;
        } else {
            valueElement.textContent = Math.floor(value) + unit;
        }
    }
}

function updateReactorStats() {
    const power = (3.0 + Math.random() * 0.5).toFixed(1);
    const temp = (4400 + Math.random() * 200).toFixed(0);
    const efficiency = (99.5 + Math.random() * 0.5).toFixed(1);
    
    document.getElementById('reactorPower').textContent = power;
    document.getElementById('reactorTemp').textContent = temp;
    document.getElementById('reactorEfficiency').textContent = efficiency;
}

function updateProcessCount() {
    const current = parseInt(document.getElementById('processesValue').textContent.replace(/,/g, ''));
    const change = Math.floor(Math.random() * 100) - 50;
    const newValue = Math.max(1000, current + change);
    document.getElementById('processesValue').textContent = newValue.toLocaleString();
}

// ===== DATE TIME =====
function initDateTime() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function updateDateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'short',
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    document.getElementById('currentTime').textContent = timeString;
    document.getElementById('currentDate').textContent = dateString;
}

// ===== WEATHER =====
function initWeather() {
    // Simulate weather data (in production, use real API)
    const temps = [18, 22, 25, 28, 24, 20];
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Clear'];
    
    const temp = temps[Math.floor(Math.random() * temps.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    document.getElementById('weatherTemp').textContent = temp + '°C';
    document.getElementById('weatherDesc').textContent = condition;
}

// ===== BATTERY =====
function initBattery() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            updateBatteryStatus(battery);
            battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
            battery.addEventListener('chargingchange', () => updateBatteryStatus(battery));
        });
    } else {
        document.getElementById('batteryLevel').textContent = '100%';
    }
}

function updateBatteryStatus(battery) {
    const level = Math.floor(battery.level * 100);
    const batteryIcon = document.querySelector('.battery-status i');
    
    document.getElementById('batteryLevel').textContent = level + '%';
    
    if (battery.charging) {
        batteryIcon.className = 'fas fa-battery-bolt';
    } else if (level > 75) {
        batteryIcon.className = 'fas fa-battery-full';
    } else if (level > 50) {
        batteryIcon.className = 'fas fa-battery-three-quarters';
    } else if (level > 25) {
        batteryIcon.className = 'fas fa-battery-half';
    } else {
        batteryIcon.className = 'fas fa-battery-quarter';
    }
}

// ===== SYSTEM INFO =====
function initSystemInfo() {
    const browser = detectBrowser();
    document.getElementById('browserInfo').textContent = browser;
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        document.getElementById('connectionType').textContent = connection.effectiveType || 'Online';
    }
    
    // CPU info
    document.getElementById('cpuCores').textContent = navigator.hardwareConcurrency || '8';
    document.getElementById('cpuThreads').textContent = (navigator.hardwareConcurrency || 8) * 2;
}

function detectBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
    if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
    if (userAgent.indexOf('Safari') > -1) return 'Safari';
    if (userAgent.indexOf('Edge') > -1) return 'Edge';
    return 'Unknown Browser';
}

// ===== GEOLOCATION =====
function initLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                document.getElementById('locationText').textContent = 
                    `${position.coords.latitude.toFixed(2)}°N, ${position.coords.longitude.toFixed(2)}°E`;
            },
            error => {
                document.getElementById('locationText').textContent = 'Malibu, CA';
            }
        );
    } else {
        document.getElementById('locationText').textContent = 'Stark Tower, NY';
    }
}

// ===== AI ASSISTANT =====
function initAI() {
    const aiResponses = {
        status: [
            "All systems functioning at optimal capacity, sir.",
            "Everything is running smoothly. No anomalies detected.",
            "All systems are green. Operating at peak efficiency.",
        ],
        suit: [
            "Mark L armor is in standby mode, fully charged and ready for deployment.",
            "The suit is at 100% capacity. All systems are operational.",
            "Armor diagnostics complete. Ready for immediate deployment.",
        ],
        reactor: [
            "Arc Reactor operating at 3.2 gigawatts. All parameters normal.",
            "Reactor core temperature stable. Energy output optimal.",
            "Power systems functioning perfectly, sir.",
        ],
        security: [
            "No threats detected. All security protocols are active.",
            "Perimeter is secure. Surveillance systems online.",
            "Security status: All clear. Firewall at maximum strength.",
        ],
        weather: [
            "Current temperature is pleasant. Clear skies expected.",
            "Weather conditions are favorable for any operations.",
        ],
        greeting: [
            "Good evening, sir. How may I assist you today?",
            "Hello, Mr. Stark. All systems at your command.",
            "Welcome back, sir. Ready to assist.",
        ],
        time: [
            `The current time is ${new Date().toLocaleTimeString()}.`,
            `It is now ${new Date().toLocaleTimeString()}, sir.`,
        ],
        diagnostics: [
            "Running full system diagnostics... All systems operational.",
            "Diagnostic scan complete. No issues found.",
            "All subsystems checked. Everything is functioning normally.",
        ]
    };
    
    // Auto messages
    const autoMessages = [
        "All satellites online and transmitting.",
        "Backup systems verified and ready.",
        "Network security scan complete. No intrusions detected.",
        "Power distribution optimized.",
    ];
    
    let messageIndex = 0;
    setInterval(() => {
        if (Math.random() > 0.6) {
            addAIMessage(autoMessages[messageIndex % autoMessages.length]);
            messageIndex++;
        }
    }, 25000);
    
    window.aiResponses = aiResponses;
}

function addAIMessage(message) {
    const chatDiv = document.getElementById('aiChat');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message ai';
    messageDiv.innerHTML = `
        <div class="message-avatar">J</div>
        <div class="message-content">
            <span class="message-time">Just now</span>
            <p>${message}</p>
        </div>
    `;
    chatDiv.appendChild(messageDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;
    
    playSound('message');
}

function addUserMessage(message) {
    const chatDiv = document.getElementById('aiChat');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';
    messageDiv.innerHTML = `
        <div class="message-avatar">T</div>
        <div class="message-content">
            <span class="message-time">Just now</span>
            <p>${message}</p>
        </div>
    `;
    chatDiv.appendChild(messageDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

function handleAIInput() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    
    if (message) {
        addUserMessage(message);
        input.value = '';
        
        // Process and respond
        setTimeout(() => {
            const response = generateAIResponse(message);
            addAIMessage(response);
            showVoiceCommand(response, 3000);
        }, 800);
    }
}

function generateAIResponse(input) {
    const lowerInput = input.toLowerCase();
    const responses = window.aiResponses;
    
    if (lowerInput.includes('status') || lowerInput.includes('how')) {
        return responses.status[Math.floor(Math.random() * responses.status.length)];
    } else if (lowerInput.includes('suit') || lowerInput.includes('armor')) {
        return responses.suit[Math.floor(Math.random() * responses.suit.length)];
    } else if (lowerInput.includes('reactor') || lowerInput.includes('power')) {
        return responses.reactor[Math.floor(Math.random() * responses.reactor.length)];
    } else if (lowerInput.includes('threat') || lowerInput.includes('security')) {
        return responses.security[Math.floor(Math.random() * responses.security.length)];
    } else if (lowerInput.includes('weather')) {
        return responses.weather[Math.floor(Math.random() * responses.weather.length)];
    } else if (lowerInput.includes('time')) {
        return responses.time[Math.floor(Math.random() * responses.time.length)];
    } else if (lowerInput.includes('diagnostic')) {
        return responses.diagnostics[Math.floor(Math.random() * responses.diagnostics.length)];
    } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
        return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else {
        return "Command acknowledged. Processing request, sir.";
    }
}

// ===== SPEECH RECOGNITION =====
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('aiInput').value = transcript;
            handleAIInput();
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            stopListening();
        };
        
        recognition.onend = () => {
            stopListening();
        };
    }
}

function startListening() {
    if (recognition) {
        isListening = true;
        recognition.start();
        document.getElementById('aiStatus').textContent = 'LISTENING...';
        document.getElementById('aiVoiceInput').style.background = 'rgba(255, 0, 85, 0.4)';
        showVoiceCommand('LISTENING...', 5000);
        playSound('beep');
    }
}

function stopListening() {
    isListening = false;
    document.getElementById('aiStatus').textContent = 'READY';
    document.getElementById('aiVoiceInput').style.background = '';
}

// ===== VOICE COMMAND DISPLAY =====
function showVoiceCommand(text, duration = 2000) {
    const voiceCommand = document.getElementById('voiceCommand');
    const voiceText = document.getElementById('voiceText');
    voiceText.textContent = text;
    voiceCommand.classList.add('active');
    
    setTimeout(() => {
        voiceCommand.classList.remove('active');
    }, duration);
}

// ===== NOTIFICATIONS =====
function addRandomNotification() {
    const notifications = [
        { priority: 'low', icon: 'fa-check-circle', title: 'System Backup', message: 'Automated backup completed successfully', time: 'Just now' },
        { priority: 'medium', icon: 'fa-download', title: 'Update Available', message: 'New firmware available for Mark L suit', time: 'Just now' },
        { priority: 'low', icon: 'fa-shield-alt', title: 'Security Scan', message: 'Routine security scan completed', time: 'Just now' },
        { priority: 'medium', icon: 'fa-satellite', title: 'Satellite Connection', message: 'New satellite link established', time: 'Just now' },
        { priority: 'low', icon: 'fa-database', title: 'Data Sync', message: 'Cloud synchronization complete', time: 'Just now' },
    ];
    
    const notif = notifications[Math.floor(Math.random() * notifications.length)];
    addNotification(notif.priority, notif.icon, notif.title, notif.message, notif.time);
}

function addNotification(priority, icon, title, message, time) {
    const notifList = document.getElementById('notifList');
    
    const notifDiv = document.createElement('div');
    notifDiv.className = `notif-item priority-${priority}`;
    notifDiv.innerHTML = `
        <div class="notif-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="notif-content">
            <span class="notif-time">${time}</span>
            <p class="notif-title">${title}</p>
            <p class="notif-desc">${message}</p>
        </div>
    `;
    
    notifList.insertBefore(notifDiv, notifList.firstChild);
    
    // Update badge
    const badge = document.querySelector('.notif-badge');
    const currentCount = parseInt(badge.textContent);
    badge.textContent = currentCount + 1;
    
    // Remove if more than 10
    if (notifList.children.length > 10) {
        notifList.removeChild(notifList.lastChild);
    }
    
    playSound('notification');
}

// ===== CANVAS RESIZE =====
function initCanvasSizes() {
    aiWaveform.width = aiWaveform.offsetWidth;
    aiWaveform.height = aiWaveform.offsetHeight;
    reactorCanvas.width = reactorCanvas.offsetWidth;
    reactorCanvas.height = reactorCanvas.offsetHeight;
    holoCanvas.width = holoCanvas.offsetWidth;
    holoCanvas.height = holoCanvas.offsetHeight;
    chartCanvas.width = chartCanvas.offsetWidth;
    chartCanvas.height = chartCanvas.offsetHeight;
    mapCanvas.width = mapCanvas.offsetWidth;
    mapCanvas.height = mapCanvas.offsetHeight;
}

function handleResize() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    initCanvasSizes();
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // AI Input
    document.getElementById('aiSend').addEventListener('click', handleAIInput);
    document.getElementById('aiInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAIInput();
    });
    
    // Voice Input
    document.getElementById('aiVoiceInput').addEventListener('click', () => {
        if (!isListening) {
            startListening();
        } else {
            recognition.stop();
        }
    });
    
    document.getElementById('voiceBtn').addEventListener('click', () => {
        if (!isListening) {
            startListening();
        }
    });
    
    // AI Suggestions
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('aiInput').value = this.textContent;
            handleAIInput();
        });
    });
    
    // Reactor Controls
    document.getElementById('reactorBoost').addEventListener('click', () => {
        showVoiceCommand('BOOSTING REACTOR OUTPUT TO 150%', 2000);
        document.getElementById('reactorPower').textContent = '4.8';
        playSound('powerup');
        setTimeout(() => {
            document.getElementById('reactorPower').textContent = '3.2';
            addAIMessage('Reactor power normalized. Operating at standard capacity.');
        }, 4000);
    });
    
    document.getElementById('reactorStabilize').addEventListener('click', () => {
        showVoiceCommand('STABILIZING REACTOR CORE', 2000);
        playSound('beep');
        addAIMessage('Reactor stabilization complete. All parameters optimal.');
    });
    
    document.getElementById('reactorEmergency').addEventListener('click', () => {
        showVoiceCommand('EMERGENCY SHUTDOWN INITIATED', 2500);
        playSound('alert');
        addNotification('high', 'fa-exclamation-triangle', 'Emergency Protocol', 'Emergency shutdown sequence activated', 'Just now');
    });
    
    // Energy Sliders
    document.querySelectorAll('.energy-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            const percent = this.nextElementSibling;
            percent.textContent = this.value + '%';
        });
    });
    
    // System Refresh
    document.getElementById('refreshSystem').addEventListener('click', () => {
        showVoiceCommand('REFRESHING SYSTEM STATUS', 1500);
        updateSystemStats();
        playSound('beep');
    });
    
    // Hologram Controls
    document.getElementById('rotateLeft').addEventListener('click', () => {
        holoRotation -= 0.3;
        playSound('click');
    });
    
    document.getElementById('rotateRight').addEventListener('click', () => {
        holoRotation += 0.3;
        playSound('click');
    });
    
    document.getElementById('zoomIn').addEventListener('click', () => {
        holoZoom = Math.min(2, holoZoom + 0.1);
        playSound('click');
    });
    
    document.getElementById('zoomOut').addEventListener('click', () => {
        holoZoom = Math.max(0.5, holoZoom - 0.1);
        playSound('click');
    });
    
    document.getElementById('resetView').addEventListener('click', () => {
        holoRotation = 0;
        holoZoom = 1;
        autoRotateEnabled = false;
        document.getElementById('autoRotate').style.background = '';
        playSound('click');
    });
    
    document.getElementById('autoRotate').addEventListener('click', function() {
        autoRotateEnabled = !autoRotateEnabled;
        this.style.background = autoRotateEnabled ? 'var(--primary)' : '';
        this.style.color = autoRotateEnabled ? 'var(--dark)' : '';
        playSound('click');
    });
    
    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const tab = this.dataset.tab;
            showVoiceCommand(`SWITCHING TO ${tab.toUpperCase()} MODE`, 1500);
            document.getElementById('modelName').textContent = tab.toUpperCase();
            playSound('click');
        });
    });
    
    // Data Select
    document.getElementById('dataSelect').addEventListener('change', function() {
        showVoiceCommand(`LOADING ${this.value.toUpperCase()} DATA`, 1500);
        chartData = []; // Reset chart data
        playSound('click');
    });
    
    // Suit Actions
    document.getElementById('deploySuit').addEventListener('click', () => {
        showVoiceCommand('DEPLOYING MARK L ARMOR', 3000);
        playSound('deploy');
        addAIMessage('Suit deployment sequence initiated. ETA: 15 seconds.');
        animateSuitDeploy();
    });
    
    document.getElementById('runDiagnostics').addEventListener('click', () => {
        showVoiceCommand('RUNNING FULL DIAGNOSTICS', 3000);
        playSound('scan');
        runSuitDiagnostics();
    });
    
    // Quick Actions
    document.getElementById('deployDrones').addEventListener('click', function() {
        showVoiceCommand('DEPLOYING SURVEILLANCE DRONES', 2000);
        playSound('deploy');
        addAIMessage('12 drones deployed. Surveillance pattern alpha engaged.');
        this.querySelector('.action-status').textContent = 'ACTIVE';
        setTimeout(() => {
            this.querySelector('.action-status').textContent = 'READY';
        }, 5000);
    });
    
    document.getElementById('scanArea').addEventListener('click', () => {
        showVoiceCommand('INITIATING AREA SCAN', 2000);
        playSound('scan');
        addAIMessage('Scanning 10 kilometer radius. No threats detected.');
        addNotification('low', 'fa-radar', 'Area Scan', 'Perimeter scan completed. All clear.', 'Just now');
    });
    
    document.getElementById('activateShields').addEventListener('click', function() {
        const status = this.querySelector('.action-status');
        if (status.textContent === 'STANDBY') {
            showVoiceCommand('SHIELDS ACTIVATED', 2000);
            playSound('powerup');
            addAIMessage('Defense shields at maximum capacity. Force field active.');
            status.textContent = 'ACTIVE';
        } else {
            showVoiceCommand('SHIELDS DEACTIVATED', 2000);
            status.textContent = 'STANDBY';
        }
    });
    
    document.getElementById('emergencyProtocol').addEventListener('click', () => {
        showVoiceCommand('EMERGENCY PROTOCOL HOUSE PARTY INITIATED', 3000);
        playSound('alert');
        addAIMessage('All systems on high alert. House Party Protocol ready for deployment.');
        addNotification('high', 'fa-exclamation-triangle', 'Emergency Alert', 'House Party Protocol activated', 'Just now');
        triggerHouseParty();
    });
    
    document.getElementById('launchMission').addEventListener('click', () => {
        showVoiceCommand('MISSION LAUNCH SEQUENCE INITIATED', 2500);
        playSound('deploy');
        addAIMessage('Mission parameters loaded. All systems go for launch.');
    });
    
    document.getElementById('houseParty').addEventListener('click', () => {
        triggerHouseParty();
    });
    
    // Control Panel
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
    document.getElementById('screenCapture').addEventListener('click', captureScreen);
    document.getElementById('soundToggle').addEventListener('click', toggleSound);
    document.getElementById('themeToggle').addEventListener('click', cycleTheme);
    document.getElementById('settingsBtn').addEventListener('click', openSettings);
    
    // Settings Modal
    document.getElementById('closeSettings').addEventListener('click', closeSettings);
    document.getElementById('themeColor').addEventListener('change', changeThemeColor);
    document.getElementById('animSpeed').addEventListener('input', changeAnimSpeed);
    document.getElementById('enableParticles').addEventListener('change', toggleParticles);
    document.getElementById('enableSound').addEventListener('change', toggleSound);
    document.getElementById('volumeControl').addEventListener('input', changeVolume);
    
    // Clear Notifications
    document.getElementById('clearNotifs').addEventListener('click', () => {
        document.getElementById('notifList').innerHTML = '';
        document.querySelector('.notif-badge').textContent = '0';
        playSound('click');
    });
    
    // Panel Minimize
    document.querySelectorAll('.btn-minimize').forEach(btn => {
        btn.addEventListener('click', function() {
            const panel = this.closest('.panel');
            const body = panel.querySelector('.panel-body');
            body.style.display = body.style.display === 'none' ? 'block' : 'none';
            this.querySelector('i').className = body.style.display === 'none' ? 'fas fa-plus' : 'fas fa-minus';
            playSound('click');
        });
    });
}

// ===== SUIT ANIMATIONS =====
function animateSuitDeploy() {
    const parts = document.querySelectorAll('.suit-part');
    let delay = 0;
    
    parts.forEach(part => {
        setTimeout(() => {
            part.style.fill = 'rgba(0, 255, 255, 0.3)';
            setTimeout(() => {
                part.style.fill = 'none';
            }, 500);
        }, delay);
        delay += 200;
    });
    
    setTimeout(() => {
        addAIMessage('Suit deployment complete. All systems online.');
        document.querySelector('.suit-panel .panel-status').textContent = 'ACTIVE';
        document.querySelector('.suit-panel .panel-status').className = 'panel-status active';
    }, delay);
}

function runSuitDiagnostics() {
    const stats = document.querySelectorAll('.suit-stat .circular-progress');
    let i = 0;
    
    const interval = setInterval(() => {
        if (i < stats.length) {
            const value = 85 + Math.random() * 15;
            const degrees = (value / 100) * 360;
            stats[i].style.setProperty('--value', degrees + 'deg');
            stats[i].querySelector('span').textContent = Math.floor(value) + '%';
            playSound('beep');
            i++;
        } else {
            clearInterval(interval);
            addAIMessage('Diagnostics complete. All systems functioning within normal parameters.');
        }
    }, 500);
}

// ===== SPECIAL EFFECTS =====
function triggerHouseParty() {
    let count = 0;
    const colors = ['#ff0055', '#00ffff', '#00ff88', '#ffaa00', '#aa00ff'];
    
    const interval = setInterval(() => {
        const color = colors[count % colors.length];
        document.documentElement.style.setProperty('--primary', color);
        count++;
        
        if (count > 20) {
            clearInterval(interval);
            document.documentElement.style.setProperty('--primary', '#00ffff');
        }
    }, 200);
    
    playSound('party');
}

// ===== CONTROL PANEL FUNCTIONS =====
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        this.querySelector('i').className = 'fas fa-compress';
    } else {
        document.exitFullscreen();
        this.querySelector('i').className = 'fas fa-expand';
    }
    playSound('click');
}

function captureScreen() {
    showVoiceCommand('CAPTURING SCREEN', 2000);
    playSound('camera');
    addNotification('low', 'fa-camera', 'Screenshot', 'Screen captured successfully', 'Just now');
}

function toggleSound() {
    CONFIG.soundEnabled = !CONFIG.soundEnabled;
    const icon = document.querySelector('#soundToggle i');
    icon.className = CONFIG.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    document.getElementById('soundToggle').classList.toggle('active');
    // If sound just enabled, play the provided startup MP3.
    const audioEl = document.getElementById('soundEffect');
    try {
        if (CONFIG.soundEnabled) {
            // Use the filename provided by the user. If the file has spaces,
            // browsers handle it but it's safer to prefix with ./ and not modify name.
            audioEl.src = 'asset/mix_18s (audio-joiner.com).mp3';
            audioEl.volume = CONFIG.volume;
            audioEl.currentTime = 0;
            audioEl.play().catch(() => {
                // autoplay may be blocked on some browsers; fallback to oscillator click
                playSound('click');
            });
        } else {
            // If toggling sound off, stop any playing audio
            try { audioEl.pause(); audioEl.currentTime = 0; } catch (e) {}
        }
    } catch (e) {
        // If audio element missing or play fails, fallback to simple beep
        playSound('click');
    }
}

function cycleTheme() {
    const themes = ['cyan', 'red', 'green', 'purple'];
    const colors = {
        cyan: '#00ffff',
        red: '#ff0055',
        green: '#00ff88',
        purple: '#aa00ff'
    };
    
    const currentIndex = themes.indexOf(CONFIG.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    CONFIG.theme = themes[nextIndex];
    
    document.documentElement.style.setProperty('--primary', colors[CONFIG.theme]);
    playSound('click');
    showVoiceCommand(`THEME CHANGED TO ${CONFIG.theme.toUpperCase()}`, 1500);
}

function openSettings() {
    document.getElementById('settingsModal').classList.add('active');
    playSound('click');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
    playSound('click');
}

function changeThemeColor(e) {
    document.documentElement.style.setProperty('--primary', e.target.value);
}

function changeAnimSpeed(e) {
    CONFIG.animationSpeed = parseFloat(e.target.value);
}

function toggleParticles(e) {
    CONFIG.particlesEnabled = e.target.checked;
}

function changeVolume(e) {
    CONFIG.volume = e.target.value / 100;
}

// ===== SOUND EFFECTS =====
function playSound(type) {
    if (!CONFIG.soundEnabled) return;
    
    const sounds = {
        beep: [300, 0.1],
        click: [400, 0.05],
        notification: [500, 0.1],
        message: [450, 0.08],
        alert: [800, 0.2],
        powerup: [200, 0.3],
        deploy: [150, 0.4],
        scan: [600, 0.3],
        camera: [700, 0.1],
        party: [500, 0.5],
        startup: [400, 0.5]
    };
    
    if (sounds[type]) {
        const [frequency, duration] = sounds[type];
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(CONFIG.volume * 0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }
}

// ===== EASTER EGGS =====
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    if (konamiCode.length > konamiPattern.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        showVoiceCommand('KONAMI CODE ACTIVATED: HOUSE PARTY PROTOCOL', 3000);
        triggerHouseParty();
        addNotification('high', 'fa-bomb', 'Easter Egg', 'Konami Code activated! House Party mode enabled!', 'Just now');
        konamiCode = [];
    }
});

// Secret command: Type "JARVIS" anywhere
let secretInput = '';
document.addEventListener('keypress', (e) => {
    secretInput += e.key;
    if (secretInput.length > 6) {
        secretInput = secretInput.slice(-6);
    }
    
    if (secretInput.toLowerCase() === 'jarvis') {
        showVoiceCommand('YES, SIR? HOW MAY I ASSIST YOU?', 3000);
        addAIMessage('Did you call for me, sir? I am here and ready to assist.');
        playSound('startup');
        secretInput = '';
    }
});

// ===== CONSOLE EASTER EGG =====
console.log('%c╔═══════════════════════════════════════════════╗', 'color: #00ffff; font-weight: bold;');
console.log('%c║     STARK INDUSTRIES LAB SYSTEM V3.0         ║', 'color: #00ffff; font-weight: bold; font-size: 16px;');
console.log('%c╚═══════════════════════════════════════════════╝', 'color: #00ffff; font-weight: bold;');
console.log('%c⚡ System initialized successfully', 'color: #00ff88; font-size: 14px;');
console.log('%c🤖 JARVIS AI online and operational', 'color: #0099ff; font-size: 14px;');
console.log('%c🦾 Mark L Armor systems ready', 'color: #ff6b00; font-size: 14px;');
console.log('%c💡 Easter Eggs:', 'color: #ffaa00; font-size: 14px; font-weight: bold;');
console.log('%c   - Try the Konami Code: ↑↑↓↓←→←→BA', 'color: #ffaa00; font-size: 12px;');
console.log('%c   - Type "JARVIS" anywhere on the page', 'color: #ffaa00; font-size: 12px;');
console.log('%c   - Click "House Party" for a surprise!', 'color: #ffaa00; font-size: 12px;');
console.log('%c', 'padding: 20px; background: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'20\' fill=\'%2300ffff\' /%3E%3C/svg%3E") no-repeat center; background-size: contain;');

// Initialize location after everything else
setTimeout(initLocation, 1000);