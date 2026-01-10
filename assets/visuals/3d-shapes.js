// 3D Visualization System for MyViralReach
class ThreeDVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.particles = null;
        this.network = null;
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = null;
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 15;
        this.camera.position.y = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
        
        // Add lights
        this.addLights();
        
        // Create network visualization
        this.createNetwork();
        
        // Create floating particles
        this.createParticles();
        
        // Create floating shapes
        this.createShapes();
        
        // Add orbit controls
        this.addControls();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation
        this.animate();
    }
    
    addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0x3B82F6, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Point light
        const pointLight = new THREE.PointLight(0x8B5CF6, 0.6, 100);
        pointLight.position.set(-5, -5, 5);
        this.scene.add(pointLight);
        
        // Hemisphere light
        const hemisphereLight = new THREE.HemisphereLight(0x3B82F6, 0xEC4899, 0.3);
        this.scene.add(hemisphereLight);
    }
    
    createNetwork() {
        this.network = new THREE.Group();
        
        // Create nodes
        const nodeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const nodeMaterial = new THREE.MeshPhongMaterial({
            color: 0x3B82F6,
            emissive: 0x3B82F6,
            emissiveIntensity: 0.2,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        
        const nodes = [];
        const nodeCount = 20;
        
        for (let i = 0; i < nodeCount; i++) {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            
            // Position nodes in a sphere
            const radius = 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            node.position.x = radius * Math.sin(phi) * Math.cos(theta);
            node.position.y = radius * Math.sin(phi) * Math.sin(theta);
            node.position.z = radius * Math.cos(phi);
            
            node.userData = {
                speed: Math.random() * 0.02 + 0.01,
                amplitude: Math.random() * 0.5 + 0.2,
                connections: []
            };
            
            nodes.push(node);
            this.network.add(node);
        }
        
        // Create connections
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x3B82F6,
            transparent: true,
            opacity: 0.3,
            linewidth: 1
        });
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = nodes[i].position.distanceTo(nodes[j].position);
                
                // Connect nodes that are close enough
                if (distance < 12 && Math.random() > 0.7) {
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                        nodes[i].position,
                        nodes[j].position
                    ]);
                    
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    this.network.add(line);
                    
                    nodes[i].userData.connections.push(j);
                    nodes[j].userData.connections.push(i);
                }
            }
        }
        
        this.scene.add(this.network);
    }
    
    createParticles() {
        this.particles = new THREE.Group();
        
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B5CF6,
            emissive: 0x8B5CF6,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.6
        });
        
        const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Random position in sphere
            const radius = 15;
            particle.position.x = (Math.random() - 0.5) * radius * 2;
            particle.position.y = (Math.random() - 0.5) * radius;
            particle.position.z = (Math.random() - 0.5) * radius;
            
            particle.userData = {
                speed: Math.random() * 0.02 + 0.005,
                amplitude: Math.random() * 0.3 + 0.1,
                originalY: particle.position.y
            };
            
            this.particles.add(particle);
        }
        
        this.scene.add(this.particles);
    }
    
    createShapes() {
        // Create floating geometric shapes
        const shapes = new THREE.Group();
        
        // Torus
        const torusGeometry = new THREE.TorusGeometry(3, 0.8, 16, 100);
        const torusMaterial = new THREE.MeshPhongMaterial({
            color: 0x3B82F6,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.set(-8, 0, 0);
        shapes.add(torus);
        
        // Icosahedron
        const icosaGeometry = new THREE.IcosahedronGeometry(2.5);
        const icosaMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B5CF6,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        const icosa = new THREE.Mesh(icosaGeometry, icosaMaterial);
        icosa.position.set(8, 0, 0);
        shapes.add(icosa);
        
        // Octahedron
        const octaGeometry = new THREE.OctahedronGeometry(2);
        const octaMaterial = new THREE.MeshPhongMaterial({
            color: 0xEC4899,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        const octa = new THREE.Mesh(octaGeometry, octaMaterial);
        octa.position.set(0, 5, -5);
        shapes.add(octa);
        
        this.scene.add(shapes);
        
        // Store shapes for animation
        this.shapes = shapes;
    }
    
    addControls() {
        // Add orbit controls for interactivity
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        
        // Set rotation limits
        this.controls.minPolarAngle = Math.PI / 4;
        this.controls.maxPolarAngle = Math.PI / 2;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update time
        const time = Date.now() * 0.001;
        
        // Animate network nodes
        if (this.network) {
            this.network.children.forEach((child, i) => {
                if (child instanceof THREE.Mesh && child.geometry.type === 'SphereGeometry') {
                    // Float up and down
                    child.position.y += Math.sin(time + i) * child.userData.speed;
                    
                    // Pulsate
                    const scale = 1 + Math.sin(time * 2 + i) * 0.1;
                    child.scale.set(scale, scale, scale);
                    
                    // Rotate
                    child.rotation.x += 0.01;
                    child.rotation.y += 0.01;
                }
            });
        }
        
        // Animate particles
        if (this.particles) {
            this.particles.children.forEach((particle, i) => {
                particle.position.y = particle.userData.originalY + 
                    Math.sin(time * particle.userData.speed * 10 + i) * particle.userData.amplitude;
                
                particle.rotation.x += 0.02;
                particle.rotation.y += 0.02;
            });
        }
        
        // Animate shapes
        if (this.shapes) {
            this.shapes.children.forEach((shape, i) => {
                shape.rotation.x += 0.005;
                shape.rotation.y += 0.005;
                shape.rotation.z += 0.002;
                
                // Float
                shape.position.y += Math.sin(time + i) * 0.01;
            });
        }
        
        // Update controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        if (!this.camera || !this.renderer || !this.container) return;
        
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    // Interactive methods
    highlightNode(nodeIndex) {
        if (!this.network || nodeIndex >= this.network.children.length) return;
        
        const node = this.network.children[nodeIndex];
        if (node instanceof THREE.Mesh) {
            // Store original material
            if (!node.userData.originalMaterial) {
                node.userData.originalMaterial = node.material.clone();
            }
            
            // Apply highlight material
            node.material = new THREE.MeshPhongMaterial({
                color: 0xEC4899,
                emissive: 0xEC4899,
                emissiveIntensity: 0.8,
                shininess: 100,
                transparent: true,
                opacity: 1
            });
            
            // Auto-revert after 2 seconds
            setTimeout(() => {
                if (node.userData.originalMaterial) {
                    node.material = node.userData.originalMaterial;
                }
            }, 2000);
        }
    }
    
    createDataFlow(startNode, endNode) {
        if (!this.network || startNode >= this.network.children.length || endNode >= this.network.children.length) {
            return;
        }
        
        const start = this.network.children[startNode];
        const end = this.network.children[endNode];
        
        if (!(start instanceof THREE.Mesh) || !(end instanceof THREE.Mesh)) return;
        
        // Create flowing particle
        const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: 0x10B981,
            emissive: 0x10B981,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(start.position);
        this.scene.add(particle);
        
        // Animate particle from start to end
        const startTime = Date.now();
        const duration = 2000; // 2 seconds
        
        const animateFlow = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Move particle along path
            particle.position.lerpVectors(start.position, end.position, progress);
            
            // Pulsate
            const scale = 1 + Math.sin(progress * Math.PI * 10) * 0.5;
            particle.scale.set(scale, scale, scale);
            
            if (progress < 1) {
                requestAnimationFrame(animateFlow);
            } else {
                // Remove particle when animation completes
                this.scene.remove(particle);
            }
        };
        
        animateFlow();
    }
    
    // Visual effects
    createExplosion(position, color = 0x3B82F6) {
        const particleCount = 50;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.05, 8, 8);
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(position);
            
            // Random velocity
            particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            );
            
            particle.userData.life = 1.0;
            particle.userData.decay = Math.random() * 0.02 + 0.01;
            
            this.scene.add(particle);
            particles.push(particle);
        }
        
        // Animate explosion
        const animateExplosion = () => {
            let allDead = true;
            
            particles.forEach(particle => {
                if (particle.userData.life > 0) {
                    allDead = false;
                    
                    // Update position
                    particle.position.add(particle.userData.velocity);
                    
                    // Apply gravity
                    particle.userData.velocity.y -= 0.001;
                    
                    // Update life
                    particle.userData.life -= particle.userData.decay;
                    particle.material.opacity = particle.userData.life * 0.8;
                    
                    // Shrink
                    const scale = particle.userData.life;
                    particle.scale.set(scale, scale, scale);
                }
            });
            
            if (!allDead) {
                requestAnimationFrame(animateExplosion);
            } else {
                // Remove all particles
                particles.forEach(particle => {
                    this.scene.remove(particle);
                });
            }
        };
        
        animateExplosion();
    }
    
    // Network growth animation
    growNetwork(newNodes = 5) {
        const nodeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const nodeMaterial = new THREE.MeshPhongMaterial({
            color: 0x3B82F6,
            emissive: 0x3B82F6,
            emissiveIntensity: 0.2,
            shininess: 100,
            transparent: true,
            opacity: 0
        });
        
        for (let i = 0; i < newNodes; i++) {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            
            // Position near existing nodes
            const existingNode = this.network.children[
                Math.floor(Math.random() * this.network.children.length)
            ];
            
            if (existingNode instanceof THREE.Mesh) {
                node.position.copy(existingNode.position);
                node.position.x += (Math.random() - 0.5) * 4;
                node.position.y += (Math.random() - 0.5) * 4;
                node.position.z += (Math.random() - 0.5) * 4;
            }
            
            node.userData = {
                speed: Math.random() * 0.02 + 0.01,
                amplitude: Math.random() * 0.5 + 0.2,
                connections: [],
                growProgress: 0
            };
            
            this.network.add(node);
            
            // Animate growth
            this.animateNodeGrowth(node);
        }
    }
    
    animateNodeGrowth(node) {
        const growDuration = 1000; // 1 second
        const startTime = Date.now();
        
        const grow = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / growDuration, 1);
            
            // Animate scale from 0 to 1
            const scale = progress;
            node.scale.set(scale, scale, scale);
            
            // Animate opacity
            node.material.opacity = progress * 0.8;
            
            if (progress < 1) {
                requestAnimationFrame(grow);
            }
        };
        
        grow();
    }
}

// Initialize 3D visualizer when page loads
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('threejs-container');
    if (container) {
        window.threeDVisualizer = new ThreeDVisualizer('threejs-container');
        
        // Add interactive controls if needed
        const interactiveControls = document.createElement('div');
        interactiveControls.className = 'visualizer-controls';
        interactiveControls.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 100;
        `;
        
        container.appendChild(interactiveControls);
        
        // Add control buttons
        const buttons = [
            { text: 'Grow Network', action: () => window.threeDVisualizer?.growNetwork() },
            { text: 'Explosion', action: () => window.threeDVisualizer?.createExplosion(
                new THREE.Vector3(0, 0, 0),
                0xEC4899
            ) },
            { text: 'Data Flow', action: () => window.threeDVisualizer?.createDataFlow(0, 5) }
        ];
        
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.textContent = button.text;
            btn.style.cssText = `
                background: rgba(59, 130, 246, 0.8);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            `;
            
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(59, 130, 246, 1)';
                btn.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(59, 130, 246, 0.8)';
                btn.style.transform = 'translateY(0)';
            });
            
            btn.addEventListener('click', button.action);
            
            interactiveControls.appendChild(btn);
        });
    }
});