"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry'
import { Text } from "troika-three-text"

interface OptimizationSurfaceProps {
  irr: number
  progress: number
}

export function OptimizationSurface({ irr, progress }: OptimizationSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    surface: THREE.Mesh
    label: any
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Setup with transparent background
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    })
    
    renderer.setClearColor(0x000000, 0) // Transparent background
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Create 3D surface geometry
    const gridSize = 50
    const geometry = new ParametricGeometry((u, v, target) => {
      const x = (u - 0.5) * 20
      const z = (v - 0.5) * 20
      target.set(x, 0, z)
    }, gridSize, gridSize)

    // Create wireframe material with gradient effect
    const material = new THREE.ShaderMaterial({
      wireframe: true,
      transparent: true,
      uniforms: {
        time: { value: 0 },
        progress: { value: progress / 100 },
        color1: { value: new THREE.Color(0x2563eb) }, // Blue
        color2: { value: new THREE.Color(0x10b981) }  // Green
      },
      vertexShader: `
        uniform float time;
        uniform float progress;
        varying float vHeight;
        
        void main() {
          vec3 pos = position;
          float x = pos.x;
          float z = pos.z;
          
          // Create multiple evolving peaks
          float y = sin(x * 0.5 + time) * cos(z * 0.5 + time) * 2.0 * progress
            + sin(x * 0.3 - time * 0.7) * cos(z * 0.3 + time * 0.8) * 1.5 * progress
            + sin(x * 0.2 + time * 1.1) * cos(z * 0.2 - time * 0.9) * progress;
          
          // Add a dominant peak that grows with progress
          float centralPeak = 3.0 * progress * exp(
            -0.1 * (x * x + z * z)
          );
          y += centralPeak;
          
          pos.y = y;
          vHeight = y;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying float vHeight;
        
        void main() {
          vec3 color = mix(color1, color2, (vHeight + 2.0) / 4.0);
          gl_FragColor = vec4(color, 0.6);
        }
      `
    })

    const surface = new THREE.Mesh(geometry, material)
    surface.rotation.x = -Math.PI / 3 // Tilt for better view

    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Create IRR label with better visibility
    const label = new Text()
    label.text = `IRR: ${irr.toFixed(2)}%`
    label.fontSize = 1
    label.color = 0xffffff
    label.outlineWidth = 0.1
    label.outlineColor = 0x000000
    label.sync()
    scene.add(label)

    // Position camera for better view
    camera.position.set(15, 15, 15)
    camera.lookAt(0, 0, 0)

    // Add everything to scene
    scene.add(surface)
    
    sceneRef.current = { scene, camera, renderer, surface, label }

    // Animation loop
    let frameId: number
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      
      if (!sceneRef.current) return

      const { surface, renderer, scene, camera } = sceneRef.current
      const material = surface.material as THREE.ShaderMaterial
      
      // Update time uniform for animation
      material.uniforms.time.value = Date.now() * 0.001
      material.uniforms.progress.value = progress / 100

      // Rotate camera slowly around the scene
      const radius = 20
      const speed = 0.0002
      camera.position.x = Math.cos(Date.now() * speed) * radius
      camera.position.z = Math.sin(Date.now() * speed) * radius
      camera.position.y = 15
      camera.lookAt(0, 0, 0)

      // Update label position to follow highest point
      const highPoint = new THREE.Vector3(0, 3 * progress / 100, 0)
      highPoint.y += 1 // Offset above the surface
      label.position.copy(highPoint)
      label.text = `IRR: ${irr.toFixed(2)}%`
      label.sync()

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId)
      renderer.dispose()
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [irr, progress])

  return <div ref={containerRef} className="w-full h-[280px]" />
} 