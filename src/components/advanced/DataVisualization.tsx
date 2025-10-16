'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import { BarChart3, TrendingUp, Users, Zap, Activity, Brain } from 'lucide-react'

interface DataPoint {
  label: string
  value: number
  color: string
  icon: React.ComponentType<any>
}

export function DataVisualization() {
  const [activeMetric, setActiveMetric] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const metrics: DataPoint[] = [
    { label: 'Response Time', value: 2.3, color: '#10B981', icon: Zap },
    { label: 'Satisfaction', value: 4.8, color: '#3B82F6', icon: TrendingUp },
    { label: 'Active Users', value: 1250, color: '#8B5CF6', icon: Users },
    { label: 'System Uptime', value: 99.9, color: '#F59E0B', icon: Activity },
    { label: 'AI Accuracy', value: 96.5, color: '#EF4444', icon: Brain },
    { label: 'Ticket Volume', value: 850, color: '#06B6D4', icon: BarChart3 }
  ]

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Auto-rotate metrics
  useEffect(() => {
    if (!isVisible) return
    
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isVisible, metrics.length])

  // Living Graph Component
  function LivingGraph({ data, color }: { data: number[], color: string }) {
    const maxValue = Math.max(...data)
    const minValue = Math.min(...data)
    const range = maxValue - minValue

    const path = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - minValue) / range) * 100
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')

    return (
      <div className="relative w-full h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d={path}
            stroke={color}
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {/* Animated dots */}
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - ((value - minValue) / range) * 100
            
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill={color}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              />
            )
          })}
        </svg>
      </div>
    )
  }

  // Pulse Waveform Component
  function PulseWaveform({ frequency = 1 }: { frequency?: number }) {
    return (
      <div className="relative w-full h-16 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 bg-gradient-to-t from-transparent to-cyan-400"
            style={{
              left: `${i * 5}%`,
              height: '100%'
            }}
            animate={{
              scaleY: [0.2, 1, 0.2],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1 / frequency,
              delay: i * 0.05,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    )
  }

  // Neural Activity Map
  function NeuralActivityMap() {
    const nodes = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: (i % 5) * 20 + 10,
      y: Math.floor(i / 5) * 20 + 10,
      active: Math.random() > 0.5
    }))

    return (
      <div className="relative w-full h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {nodes.map((node) => (
            <motion.circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r="2"
              fill="#8B5CF6"
              animate={{
                r: node.active ? [2, 4, 2] : 2,
                opacity: node.active ? [0.5, 1, 0.5] : 0.3
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
          
          {/* Connections */}
          {nodes.map((node, i) => {
            const connections = nodes.filter((_, j) => j !== i && Math.random() > 0.7)
            return connections.map((connection) => (
              <motion.line
                key={`${i}-${connection.id}`}
                x1={node.x}
                y1={node.y}
                x2={connection.x}
                y2={connection.y}
                stroke="#8B5CF6"
                strokeWidth="0.5"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: Math.random() * 2 }}
              />
            ))
          })}
        </svg>
      </div>
    )
  }

  // Quantum State Chart
  function QuantumStateChart() {
    const states = [
      { name: 'Superposition', probability: 0.4, color: '#3B82F6' },
      { name: 'Entanglement', probability: 0.3, color: '#8B5CF6' },
      { name: 'Collapse', probability: 0.2, color: '#EF4444' },
      { name: 'Coherence', probability: 0.1, color: '#10B981' }
    ]

    return (
      <div className="space-y-2">
        {states.map((state, index) => (
          <div key={state.name} className="flex items-center space-x-3">
            <div className="w-16 text-xs text-gray-400">{state.name}</div>
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: state.color }}
                initial={{ width: 0 }}
                animate={{ width: `${state.probability * 100}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </div>
            <div className="w-12 text-xs text-gray-400 text-right">
              {(state.probability * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Fractal Data Tree
  function FractalDataTree({ depth = 3, angle = 0, length = 30 }: { 
    depth?: number, 
    angle?: number, 
    length?: number 
  }) {
    if (depth === 0) return null

    const endX = Math.cos(angle) * length
    const endY = Math.sin(angle) * length

    return (
      <g>
        <motion.line
          x1="50"
          y1="50"
          x2={50 + endX}
          y2={50 + endY}
          stroke="#06B6D4"
          strokeWidth={depth}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: (3 - depth) * 0.3 }}
        />
        
        <FractalDataTree
          depth={depth - 1}
          angle={angle - Math.PI / 4}
          length={length * 0.7}
        />
        <FractalDataTree
          depth={depth - 1}
          angle={angle + Math.PI / 4}
          length={length * 0.7}
        />
      </g>
    )
  }

  return (
    <section ref={sectionRef} className="py-20 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Real-time Analytics
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Monitor your BSM platform performance with live data streams and intelligent insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Living Graphs */}
          <motion.div
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics</h3>
            <LivingGraph 
              data={[20, 35, 28, 45, 38, 52, 48, 65, 58, 72, 68, 85]} 
              color="#10B981" 
            />
          </motion.div>

          {/* Pulse Waveforms */}
          <motion.div
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">System Activity</h3>
            <PulseWaveform frequency={1.5} />
          </motion.div>

          {/* Neural Activity Map */}
          <motion.div
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">AI Neural Network</h3>
            <NeuralActivityMap />
          </motion.div>

          {/* Quantum State Chart */}
          <motion.div
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Quantum States</h3>
            <QuantumStateChart />
          </motion.div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className={`bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 cursor-pointer transition-all duration-300 ${
                activeMetric === index ? 'border-white/30 scale-105' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => setActiveMetric(index)}
            >
              <div className="flex items-center justify-between mb-4">
                <metric.icon className="h-8 w-8 text-white" />
                <motion.div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: metric.color }}
                  animate={{
                    scale: activeMetric === index ? [1, 1.5, 1] : 1,
                    opacity: activeMetric === index ? [0.5, 1, 0.5] : 0.5
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">
                  {typeof metric.value === 'number' && metric.value > 100 
                    ? metric.value.toLocaleString() 
                    : metric.value}
                  {typeof metric.value === 'number' && metric.value < 100 && metric.value > 1 
                    ? 's' 
                    : ''}
                  {typeof metric.value === 'number' && metric.value <= 1 
                    ? '%' 
                    : ''}
                </div>
                <div className="text-sm text-gray-400">{metric.label}</div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: metric.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(metric.value / 100) * 100}%` }}
                  transition={{ duration: 1, delay: 1.5 + index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fractal Data Tree */}
        <motion.div
          className="mt-16 bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            Data Architecture Visualization
          </h3>
          <div className="flex justify-center">
            <svg width="200" height="200" viewBox="0 0 100 100">
              <FractalDataTree />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  )
}







