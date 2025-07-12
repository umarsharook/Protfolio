// Global variables
let scene, camera, renderer, heroScene, skillsScene;
let heroSpheres = [];
let skillsSpheres = [];
let animationId;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initHero3D();
    initSkills3D();
    initScrollAnimations();
    initContactForm();
    initSkillBars();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            scrollToSection(targetId);
            
            // Close mobile menu if open
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scroll function
function scrollToSection(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Hero 3D Scene
function initHero3D() {
    const container = document.getElementById('hero-3d');
    if (!container) return;

    // Scene setup
    heroScene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    heroScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    heroScene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x60a5fa, 1, 100);
    pointLight1.position.set(-10, 10, 10);
    heroScene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 1, 100);
    pointLight2.position.set(10, -10, -10);
    heroScene.add(pointLight2);

    // Create floating spheres
    createHeroSpheres();

    // Create floating cubes
    createFloatingCubes();

    // Camera position
    camera.position.z = 15;

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Start animation
    animateHero();
}

function createHeroSpheres() {
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    
    const sphereData = [
        { position: [-5, 3, 0], color: 0x60a5fa },
        { position: [5, -3, -3], color: 0xa855f7 },
        { position: [0, 0, -5], color: 0x06b6d4 }
    ];

    sphereData.forEach(data => {
        const material = new THREE.MeshPhongMaterial({ 
            color: data.color,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        
        const sphere = new THREE.Mesh(sphereGeometry, material);
        sphere.position.set(...data.position);
        heroSpheres.push(sphere);
        heroScene.add(sphere);
    });
}

function createFloatingCubes() {
    const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    
    for (let i = 0; i < 20; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
            transparent: true,
            opacity: 0.6
        });
        
        const cube = new THREE.Mesh(cubeGeometry, material);
        cube.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30
        );
        
        cube.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        heroScene.add(cube);
    }
}

function animateHero() {
    animationId = requestAnimationFrame(animateHero);
    
    const time = Date.now() * 0.001;
    
    // Animate spheres
    heroSpheres.forEach((sphere, index) => {
        sphere.rotation.x = time * 0.5;
        sphere.rotation.y = time * 0.3;
        sphere.position.y += Math.sin(time + index) * 0.01;
    });
    
    // Animate cubes
    heroScene.children.forEach(child => {
        if (child.geometry && child.geometry.type === 'BoxGeometry') {
            child.rotation.x += 0.01;
            child.rotation.y += 0.01;
        }
    });
    
    // Auto-rotate camera
    camera.position.x = Math.cos(time * 0.1) * 15;
    camera.position.z = Math.sin(time * 0.1) * 15;
    camera.lookAt(0, 0, 0);
    
    renderer.render(heroScene, camera);
}

// Skills 3D Scene
function initSkills3D() {
    const container = document.getElementById('skills-3d');
    if (!container) return;

    // Scene setup
    skillsScene = new THREE.Scene();
    const skillsCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const skillsRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    skillsRenderer.setSize(container.clientWidth, container.clientHeight);
    skillsRenderer.setClearColor(0x000000, 0);
    container.appendChild(skillsRenderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    skillsScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    skillsScene.add(directionalLight);

    // Create skill spheres
    const skillData = [
        { name: 'React', position: [-3, 2, 0], color: 0x61dafb },
        { name: 'Three.js', position: [3, 1, 0], color: 0xffffff },
        { name: 'Node.js', position: [0, -2, 2], color: 0x339933 },
        { name: 'Python', position: [-2, -1, -2], color: 0x3776ab },
        { name: 'WebGL', position: [2, 0, -1], color: 0x990000 }
    ];

    skillData.forEach(skill => {
        const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: skill.color,
            transparent: true,
            opacity: 0.8
        });
        
        const sphere = new THREE.Mesh(sphereGeometry, material);
        sphere.position.set(...skill.position);
        skillsSpheres.push(sphere);
        skillsScene.add(sphere);

        // Add text (simplified - in a real implementation you'd use TextGeometry)
        const textGeometry = new THREE.RingGeometry(0.1, 0.2, 8);
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.copy(sphere.position);
        textMesh.position.z += 1;
        skillsScene.add(textMesh);
    });

    skillsCamera.position.z = 8;

    // Animation loop for skills
    function animateSkills() {
        requestAnimationFrame(animateSkills);
        
        const time = Date.now() * 0.001;
        
        skillsSpheres.forEach((sphere, index) => {
            sphere.rotation.y = time * 0.5;
            sphere.position.y += Math.sin(time + index) * 0.005;
        });
        
        skillsCamera.position.x = Math.cos(time * 0.2) * 2;
        skillsCamera.lookAt(0, 0, 0);
        
        skillsRenderer.render(skillsScene, skillsCamera);
    }

    animateSkills();

    // Handle resize
    window.addEventListener('resize', () => {
        skillsCamera.aspect = container.clientWidth / container.clientHeight;
        skillsCamera.updateProjectionMatrix();
        skillsRenderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const animatedElements = document.querySelectorAll('.about-card, .project-card, .skill-item, .contact-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = targetWidth;
                }, 200);
                
                skillObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Contact form
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        // Simulate form submission
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Message sent successfully!');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Utility functions
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

// Mouse parallax effect
document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    
    // Apply subtle parallax to hero elements
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const translateX = mouseX * 10;
        const translateY = mouseY * 10;
        heroContent.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

// Add smooth scrolling to all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance optimization: Pause animations when not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    } else {
        // Resume animations
        if (heroScene && camera && renderer) {
            animateHero();
        }
    }
});