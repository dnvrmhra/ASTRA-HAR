import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const SpinningGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.3);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Earth Planet Group
    // Refined placement in the upper-center background behind mission panels
    const earthGroup = new THREE.Group();
    earthGroup.position.set(0.16, 0.22, 0);
    earthGroup.rotation.z = 0.38; // ~23.4° polar axial tilt
    earthGroup.rotation.x = 0.14;
    scene.add(earthGroup);

    // 3. Texture Loader for NASA Blue Marble Assets
    const textureLoader = new THREE.TextureLoader();
    const earthMap = textureLoader.load("/textures/earth_atmos_2048.jpg");
    const cloudMap = textureLoader.load("/textures/earth_clouds_1024.png");
    const specularMap = textureLoader.load("/textures/earth_specular_2048.jpg");
    const normalMap = textureLoader.load("/textures/earth_normal_2048.jpg");

    earthMap.colorSpace = THREE.SRGBColorSpace;
    cloudMap.colorSpace = THREE.SRGBColorSpace;

    // 4. Photorealistic Earth Sphere with Calibrated Physical Reflection
    const radius = 1.30;
    const sphereGeo = new THREE.SphereGeometry(radius, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthMap,
      specularMap: specularMap,
      specular: new THREE.Color(0x38bdf8),
      shininess: 24,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.65, 0.65),
      emissive: new THREE.Color(0x0a2244),
      emissiveIntensity: 0.18,
    });

    const earthMesh = new THREE.Mesh(sphereGeo, earthMat);
    earthGroup.add(earthMesh);

    // 5. Delicate Atmospheric Cloud Layer (soft opacity, natural drift)
    const cloudGeo = new THREE.SphereGeometry(radius * 1.012, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudMap,
      transparent: true,
      opacity: 0.44, // Enhanced cloud brightness and depth
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(cloudMesh);

    // 6. Subtle, Calibrated Rayleigh Atmospheric Scattering Halo (GLSL Fresnel)
    const atmosphereGeo = new THREE.SphereGeometry(radius * 1.08, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          // Luminous Rayleigh limb glow with smooth exponential falloff
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.8);
          vec3 atmosphereHaze = mix(vec3(0.02, 0.38, 0.90), vec3(0.50, 0.85, 1.0), intensity * 0.6);
          gl_FragColor = vec4(atmosphereHaze, 1.0) * intensity * 1.30;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });

    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphereMesh);

    // 7. Subtle Orbital Sensor Meridian Ring
    const ringGeo = new THREE.RingGeometry(radius * 1.15, radius * 1.158, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22, // Luminous aerospace meridian
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    earthGroup.add(ringMesh);

    // 8. Cinematic Lighting Setup - Enhanced Brightness & Visibility
    // Bright natural directional Sunlight
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(4.5, 2.5, 4.0);
    scene.add(sunLight);

    // Luminous horizon limb illumination
    const rimLight = new THREE.DirectionalLight(0x0284c7, 1.1);
    rimLight.position.set(-4.0, 1.8, -2.5);
    scene.add(rimLight);

    // Balanced cosmic space ambient shadow - rich celestial blue
    const ambientLight = new THREE.AmbientLight(0x102644, 0.52);
    scene.add(ambientLight);

    // 9. Smooth continuous 60fps rotation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      earthMesh.rotation.y += 0.0011;
      cloudMesh.rotation.y += 0.0014;
      ringMesh.rotation.z += 0.0006;
      renderer.render(scene, camera);
    };
    animate();

    // 10. Window resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // 11. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      cloudGeo.dispose();
      atmosphereGeo.dispose();
      ringGeo.dispose();
      earthMat.dispose();
      cloudMat.dispose();
      atmosphereMat.dispose();
      ringMat.dispose();
      earthMap.dispose();
      cloudMap.dispose();
      specularMap.dispose();
      normalMap.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none"
      style={{
        filter: "drop-shadow(0 0 25px rgba(2, 132, 199, 0.25))",
      }}
    />
  );
};
