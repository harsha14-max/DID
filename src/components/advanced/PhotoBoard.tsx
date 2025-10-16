'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, 
  Image as ImageIcon, 
  Download, 
  Share2, 
  Heart, 
  Eye,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface Photo {
  id: number
  title: string
  description: string
  image: string
  category: string
  likes: number
  views: number
}

export function PhotoBoard() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)
  const [isGridHovered, setIsGridHovered] = useState(false)

  const photos: Photo[] = [
    {
      id: 1,
      title: "Dashboard Overview",
      description: "Main dashboard showing real-time analytics and key metrics",
      image: "/api/placeholder/400/300",
      category: "Dashboard",
      likes: 42,
      views: 128
    },
    {
      id: 2,
      title: "Customer Portal",
      description: "User-friendly interface for customer interactions",
      image: "/api/placeholder/400/300",
      category: "Portal",
      likes: 38,
      views: 95
    },
    {
      id: 3,
      title: "Analytics Dashboard",
      description: "Advanced data visualization and reporting tools",
      image: "/api/placeholder/400/300",
      category: "Analytics",
      likes: 56,
      views: 203
    },
    {
      id: 4,
      title: "Mobile Interface",
      description: "Responsive design for mobile devices",
      image: "/api/placeholder/400/300",
      category: "Mobile",
      likes: 29,
      views: 87
    },
    {
      id: 5,
      title: "Admin Panel",
      description: "Comprehensive admin controls and settings",
      image: "/api/placeholder/400/300",
      category: "Admin",
      likes: 67,
      views: 156
    },
    {
      id: 6,
      title: "Workflow Builder",
      description: "Visual workflow creation and automation tools",
      image: "/api/placeholder/400/300",
      category: "Workflow",
      likes: 73,
      views: 189
    }
  ]

  const categories = ["All", "Dashboard", "Portal", "Analytics", "Mobile", "Admin", "Workflow"]
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredPhotos = activeCategory === "All" 
    ? photos 
    : photos.filter(photo => photo.category === activeCategory)

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Platform Showcase
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our platform through stunning visuals and interactive demos
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{
                y: [0, -2, 2, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2 + Math.random() * 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 15px 35px rgba(139, 92, 246, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Photo Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          onMouseEnter={() => setIsGridHovered(true)}
          onMouseLeave={() => setIsGridHovered(false)}
        >
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="group relative bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{
                y: [0, -3, 3, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5
              }}
              whileHover={{ 
                scale: 1.15,
                y: -15,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
                zIndex: 20
              }}
              onHoverStart={() => setHoveredPhoto(photo.id)}
              onHoverEnd={() => setHoveredPhoto(null)}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-16 w-16 text-blue-400/60 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">{photo.title}</p>
                  </div>
                </div>

                {/* Hover Overlay */}
                <motion.div
                  className="absolute inset-0 bg-black/60 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredPhoto === photo.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex gap-4">
                    <motion.button
                      className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all duration-300"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <Eye className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all duration-300"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <Download className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all duration-300"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <Share2 className="h-5 w-5" />
                    </motion.button>
                  </div>
                </motion.div>

                {/* Category Badge */}
                <motion.div
                  className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: hoveredPhoto === photo.id ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {photo.category}
                </motion.div>

                {/* Like Button */}
                <motion.button
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <Heart className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  {photo.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {photo.description}
                </p>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {photo.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {photo.views}
                    </span>
                  </div>
                  <motion.button
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    View Details →
                  </motion.button>
                </div>
              </div>

              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0"
                animate={{ opacity: hoveredPhoto === photo.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ background: 'linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)' }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Photo Modal */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                className="relative max-w-4xl max-h-[90vh] bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <motion.button
                  className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedPhoto(null)}
                >
                  <X className="h-5 w-5" />
                </motion.button>

                {/* Image */}
                <div className="relative h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-24 w-24 text-blue-400/60 mx-auto mb-4" />
                    <p className="text-lg text-gray-300">{selectedPhoto.title}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">{selectedPhoto.title}</h2>
                  <p className="text-gray-300 mb-6">{selectedPhoto.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-gray-400">
                      <span className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        {selectedPhoto.likes} likes
                      </span>
                      <span className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        {selectedPhoto.views} views
                      </span>
                    </div>
                    
                    <div className="flex gap-3">
                      <motion.button
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Download
                      </motion.button>
                      <motion.button
                        className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Share
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
