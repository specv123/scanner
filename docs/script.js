const scanner = document.getElementById('scanner');
const scanningMessage = document.getElementById('scanning-message');
const message = document.getElementById('message');
const access = document.getElementById('access');
const scanSound = document.getElementById('scan-sound');
const successSound = document.getElementById('success-sound');
const particles = document.getElementById('particles');
const energyWaves = document.getElementById('energy-waves');
const digitalRain = document.getElementById('digital-rain');

let scanningActive = false;
let particleInterval, waveInterval, rainInterval;

// Create floating particles
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 4 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    particles.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 5000);
}

// Create energy waves
function createEnergyWave() {
    const wave = document.createElement('div');
    wave.className = 'energy-wave';
    wave.style.left = Math.random() * 100 + '%';
    wave.style.top = Math.random() * 100 + '%';
    wave.style.animationDelay = Math.random() * 2 + 's';
    energyWaves.appendChild(wave);

    setTimeout(() => {
        wave.remove();
    }, 4000);
}

// Create digital rain
function createRainDrop() {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    drop.textContent = Math.random() > 0.5 ? '01' : '10';
    drop.style.left = Math.random() * 100 + '%';
    drop.style.animationDelay = Math.random() * 3 + 's';
    drop.style.animationDuration = (Math.random() * 2 + 2) + 's';
    digitalRain.appendChild(drop);

    setTimeout(() => {
        drop.remove();
    }, 4000);
}

// Start effects
function startEffects() {
    particleInterval = setInterval(createParticle, 200);
    waveInterval = setInterval(createEnergyWave, 1500);
    rainInterval = setInterval(createRainDrop, 300);
}

// Stop effects
function stopEffects() {
    clearInterval(particleInterval);
    clearInterval(waveInterval);
    clearInterval(rainInterval);
}

// Animate fingerprint paths on activation
function animateFingerprint() {
    const paths = scanner.querySelectorAll('.fingerprint path');
    paths.forEach((path, index) => {
        setTimeout(() => {
            path.style.stroke = '#00ccff';
            path.style.opacity = '1';
            path.style.filter = 'drop-shadow(0 0 5px #00ccff)';
        }, index * 100);
    });
}

// Set initial fingerprint state (bright)
function setInitialFingerprintState() {
    const paths = scanner.querySelectorAll('.fingerprint path');
    paths.forEach(path => {
        path.style.stroke = '#4a90e2';
        path.style.opacity = '1';
        path.style.filter = 'drop-shadow(0 0 10px rgba(74, 144, 226, 0.5))';
    });
}

// Reset scanning line animation
function resetScanLine() {
    const scanLine = scanner.querySelector('.scan-line');
    if (scanLine) {
        // Remove animation temporarily
        scanLine.style.animation = 'none';
        scanLine.style.top = '0';
        scanLine.style.opacity = '0';

        // Force reflow to reset the animation
        scanLine.offsetHeight;

        // Restore animation
        scanLine.style.animation = 'scan 3s infinite';
    }
}

// Stop scanning animation
function stopScanning() {
    scanningActive = false;

    // Remove scan line animation
    const scanLine = scanner.querySelector('.scan-line');
    if (scanLine) {
        scanLine.style.animation = 'none';
        scanLine.style.opacity = '0';
    }

    // Keep the active state but stop the scanning animation
    scanner.classList.add('active');
    scanner.classList.add('scanning-complete');

    // Stop background effects
    stopEffects();
}

// Start scanning sequence
function startScanning() {
    scanningActive = true;

    // 1) Sadece "SCANNING..." görünecek
    scanningMessage.classList.remove('hide');
    scanningMessage.classList.add('show');
    message.classList.remove('show');
    message.classList.add('hide');
    access.classList.remove('show');
    access.classList.add('hide');

    setInitialFingerprintState();
    resetScanLine();
    startEffects();

    scanSound.play().catch(() => { });
    scanner.classList.add('active');

    // 2) 1s sonra tarama biter:
    setTimeout(() => {
        if (!scanningActive) return;

        // "SCANNING..." gizle
        scanningMessage.classList.remove('show');
        scanningMessage.classList.add('hide');

        // 0.5s sonra fingerprint animasyonu + metinler
        setTimeout(() => {
            animateFingerprint();

            message.classList.remove('hide');
            message.classList.add('show');
            access.classList.remove('hide');
            access.classList.add('show');
            successSound.play().catch(() => { });

            // 1s sonra ikisi birlikte kaybolsun
            setTimeout(() => {
                stopScanning();
            }, 1000);

        }, 1000);

    }, 1000);
}

// Initialize the scanner on page load
document.addEventListener('DOMContentLoaded', () => {
    // Mesajları başlangıçta gizle
    scanningMessage.classList.add('hide');
    message.classList.add('hide');
    access.classList.add('hide');
    // Fingerprint ve scan-line başlangıcı
    setInitialFingerprintState();
    const line = scanner.querySelector('.scan-line');
    if (line) {
        line.style.animation = 'none';
        line.style.opacity = '0';
    }
});

// Add click interaction to start scanning
scanner.addEventListener('click', () => {
    if (scanningActive) return;
    startScanning();

});