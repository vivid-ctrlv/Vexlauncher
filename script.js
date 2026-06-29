// Copy IP Address Utility
window.copyIp = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Server network address copied to clipboard!");
    }).catch(err => {
        console.error("Failed to copy address: ", err);
    });
}

// Live Real-Time Client and Hub Search Filter
window.filterClients = function() {
    let input = document.getElementById('clientSearch').value.toLowerCase();
    let grid = document.getElementById('clientsGrid');
    let cards = grid.getElementsByClassName('card');

    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].getElementsByTagName('h2')[0] ? cards[i].getElementsByTagName('h2')[0].innerText.toLowerCase() : '';
        let desc = cards[i].getElementsByTagName('p')[0] ? cards[i].getElementsByTagName('p')[0].innerText.toLowerCase() : '';
        
        if (title.includes(input) || desc.includes(input)) {
            cards[i].style.display = "flex";
        } else {
            cards[i].style.display = "none";
        }
    }
}

// Local Cache Friends Base Core
let friendsList = JSON.parse(localStorage.getItem('vexCleanFriendsList')) || [];

window.addFriend = function() {
    let nameInput = document.getElementById('friendNameInput');
    let username = nameInput.value.trim();
    
    if (username === "") return;
    if (friendsList.includes(username)) {
        alert("This player username profile is already on your list!");
        return;
    }
    
    friendsList.push(username);
    localStorage.setItem('vexCleanFriendsList', JSON.stringify(friendsList));
    nameInput.value = "";
    renderFriends();
}

window.removeFriend = function(index) {
    friendsList.splice(index, 1);
    localStorage.setItem('vexCleanFriendsList', JSON.stringify(friendsList));
    renderFriends();
}

function renderFriends() {
    let container = document.getElementById('friendListContainer');
    let countSpan = document.getElementById('friendCount');
    if(!container || !countSpan) return;
    
    container.innerHTML = "";
    countSpan.innerText = friendsList.length;
    
    if (friendsList.length === 0) {
        container.innerHTML = "<p style='color: #6b7280; font-size: 0.9rem;'>No squad players added yet. Drop a name tag above to keep track of your friends!</p>";
        return;
    }
    
    friendsList.forEach((friend, idx) => {
        let element = document.createElement('div');
        element.className = "friend-tag";
        element.innerHTML = `
            <div style="display:flex; align-items:center; gap:0.5rem;">
                <div class="indicator"></div>
                <span>${friend}</span>
            </div>
            <button class="remove-friend-btn" onclick="removeFriend(${idx})">×</button>
        `;
        container.appendChild(element);
    });
}

// --- COSMETICS ENGINE ---
let currentFXMode = 'cubes'; 
let chromaRGBActive = false;
let particlesActive = true;
let rgbHue = 0;

window.setTheme = function(themeId, colorHex) {
    if(chromaRGBActive) toggleRGBChroma();
    document.documentElement.style.setProperty('--accent-color', colorHex);
    
    if (event && event.currentTarget) {
        let parentRow = event.currentTarget.parentNode;
        let siblings = parentRow.getElementsByClassName('theme-btn');
        for (let btn of siblings) {
            btn.classList.remove('active');
            btn.style.boxShadow = "none";
            btn.style.borderColor = "#2d334a";
        }
        event.currentTarget.classList.add('active');
        event.currentTarget.style.boxShadow = `0 0 10px ${colorHex}`;
        event.currentTarget.style.borderColor = colorHex;
    }
}

window.toggleRGBChroma = function() {
    chromaRGBActive = !chromaRGBActive;
    let btn = document.getElementById('rgbToggleBtn');
    if (chromaRGBActive) {
        btn.innerText = "ON";
        btn.classList.add('toggled');
    } else {
        btn.innerText = "OFF";
        btn.classList.remove('toggled');
        document.documentElement.style.setProperty('--accent-color', '#6366f1');
    }
}

window.setBackgroundFX = function(mode) {
    currentFXMode = mode;
    if (event && event.currentTarget) {
        let parentRow = event.currentTarget.parentNode;
        let siblings = parentRow.getElementsByClassName('theme-btn');
        for (let btn of siblings) {
            btn.classList.remove('active');
        }
        event.currentTarget.classList.add('active');
    }
}

window.toggleParticles = function() {
    particlesActive = !particlesActive;
    let btn = document.getElementById('particleToggleBtn');
    if (particlesActive) {
        btn.innerText = "ON";
        btn.classList.add('toggled');
    } else {
        btn.innerText = "OFF";
        btn.classList.remove('toggled');
    }
}

// Particle System Initialization
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let mouseParticles = [];
let ambientStars = [];

function resizeCanvas() {
    if(!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initAmbientStars();
}
window.addEventListener('resize', resizeCanvas);

function initAmbientStars() {
    ambientStars = [];
    for (let i = 0; i < 75; i++) {
        ambientStars.push({
            x: Math.random() * (canvas.width || window.innerWidth),
            y: Math.random() * (canvas.height || window.innerHeight),
            size: Math.random() * 2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            alpha: Math.random()
        });
    }
}

class MouseParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
        this.color = color;
        this.alpha = 1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.02;
        if (this.size > 0.1) this.size -= 0.04;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}

window.addEventListener('mousemove', (e) => {
    if (!particlesActive || !canvas) return;
    let accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    for (let i = 0; i < 2; i++) {
        mouseParticles.push(new MouseParticle(e.clientX, e.clientY, accentColor));
    }
});

let cubeTick = 0;
function drawBackgroundEngine() {
    let accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    
    if (currentFXMode === 'cubes') {
        cubeTick += 0.3;
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 0.25;
        let spacing = 60;
        ctx.save();
        ctx.globalAlpha = 0.07;
        
        for (let x = 0; x < canvas.width; x += spacing) {
            for (let y = 0; y < canvas.height; y += spacing) {
                let wave = Math.sin((x + cubeTick) * 0.01) * Math.cos((y + cubeTick) * 0.01) * 8;
                ctx.strokeRect(x + wave, y + wave, 25, 25);
            }
        }
        ctx.restore();
    } 
    else if (currentFXMode === 'stars') {
        ctx.save();
        ambientStars.forEach(star => {
            star.alpha += star.twinkleSpeed;
            if (star.alpha > 1 || star.alpha < 0) star.twinkleSpeed = -star.twinkleSpeed;
            ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }
}

function coreRenderLoop() {
    if(!canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (chromaRGBActive) {
        rgbHue = (rgbHue + 1) % 360;
        let chromaHexColor = `hsl(${rgbHue}, 75%, 60%)`;
        document.documentElement.style.setProperty('--accent-color', chromaHexColor);
    }
    
    drawBackgroundEngine();
    
    for (let i = 0; i < mouseParticles.length; i++) {
        mouseParticles[i].update();
        mouseParticles[i].draw();
        if (mouseParticles[i].alpha <= 0 || mouseParticles[i].size <= 0) {
            mouseParticles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(coreRenderLoop);
}

// Initial Runtime Loading Hook
document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    renderFriends();
    coreRenderLoop();
});
