export const BLOG_POSTS = [
  {
    id: "scalable-ai-deep-learning-production",
    title: "Building Scalable AI Systems: From PyTorch Research to Production Microservices",
    slug: "scalable-ai-deep-learning-production",
    excerpt: "A deep dive into bridging the gap between deep learning experimental notebooks and resilient, low-latency production APIs with model quantization, ONNX runtime, and asynchronous queueing.",
    content: `Machine learning research often focuses on maximizing accuracy metrics like Top-1 accuracy, BLEU score, or mAP. However, deploying these models into production architectures introduces a fundamentally different set of engineering challenges: inference latency, memory footprint, cold starts, concurrency, and graceful degradation.

### 1. The Bottlenecks of Naive Model Serving
When deploying complex PyTorch models via standard REST frameworks (e.g. synchronous Flask or Django), server worker threads quickly block on GPU/CPU compute, leading to catastrophic queue saturation under burst traffic.

Key strategies to combat this include:
- **Asynchronous Task Workers**: Decoupling incoming request ingestion from model inference using Celery, Redis Streams, or RabbitMQ.
- **Dynamic Batching**: Grouping individual inference requests over micro-time windows (e.g., 5-10ms) to maximize GPU tensor parallelization.

### 2. Weight Quantization and ONNX Graph Optimization
Exporting standard models to ONNX (Open Neural Network Exchange) combined with FP16/INT8 post-training quantization yields drastic speedups:
- Reduced memory bandwidth pressure by up to 4x.
- 2.5x to 3.8x throughput increase on modern inference engines like TensorRT or ONNX Runtime.

### 3. Real-Time Observability and Drift Detection
A production model is only as reliable as its ongoing data distribution monitoring. Implementing KS-tests (Kolmogorov-Smirnov) and population stability indexes (PSI) on incoming embeddings enables automated alerts before performance degrades in production.`,
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    category: "AI & Machine Learning",
    tags: ["PyTorch", "ONNX", "System Design", "Cloud AI"],
    date: "Aug 2024",
    readTime: "6 min read",
    author: "Arup Das",
    color: "#8a5cf6",
    featured: true
  },
  {
    id: "modern-frontend-micro-interactions-3d",
    title: "Cinematic Web Engineering: Blending 3D Canvas, GSAP, and Modern React",
    slug: "modern-frontend-micro-interactions-3d",
    excerpt: "Exploring architectural patterns for building 60 FPS interactive web applications utilizing Spline 3D, GSAP ScrollTrigger, and hardware-accelerated Framer Motion pipelines.",
    content: `Modern web experiences have evolved far beyond static document layouts. Today's users expect tactile interfaces with physical depth, ambient illumination, and buttery smooth 60fps animations.

### 1. Isolating Heavy 3D Canvas Renders
3D viewports (such as Spline and Three.js canvases) demand careful GPU memory management and CPU-offloading. Key optimization rules:
- **Viewport Intersection Pausing**: Toggling render loops off when the canvas scrolls outside the active viewport.
- **Asset Pre-warming**: Initializing WebGL textures during low-priority browser idle callbacks (\`requestIdleCallback\`).

### 2. Coordinating Scroll-Driven Timelines
By synchronizing GSAP \`ScrollTrigger\` with CSS hardware-accelerated transforms (\`translate3d\`, \`will-change\`), we can craft seamless scroll-driven narratives without causing layout thrashing or dropped frames.

### 3. Glassmorphism and Layered Compositing
Using multi-layered backdrop filters (\`backdrop-filter: blur(16px)\`) with fine border glow gradients creates a luxury aesthetic while preserving contrast and accessible typography across all screen resolutions.`,
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    category: "Full Stack & Web",
    tags: ["React", "WebGL", "Spline", "GSAP", "UI/UX"],
    date: "Jul 2024",
    readTime: "5 min read",
    author: "Arup Das",
    color: "#00f2fe",
    featured: true
  },
  {
    id: "creative-engineer-photography-uiux",
    title: "The Creative Engineer: How Visual Storytelling & Photography Elevate UI Design",
    slug: "creative-engineer-photography-uiux",
    excerpt: "Why understanding composition, color grading, focal depth, and visual hierarchy from photography transforms software engineering and digital product craftsmanship.",
    content: `Engineering is often viewed through the lens of pure logic, algorithms, and computational efficiency. However, the most memorable software products are crafted where engineering rigor converges with artistic intuition.

### 1. Compositional Flow and Golden Ratios in Layouts
In cinematography and street photography, framing guides the observer's eye directly to the focal subject. In web applications, the same principles dictate typographic scaling, negative space distribution, and CTA prominence.

### 2. Color Theory: Beyond Default Palettes
Harmonious color palettes rely on complementary temperatures and luminance curves. Instead of harsh saturated primaries, modern digital interfaces benefit from curated HSL tailored scales, subtle ambient light bounce, and dark-mode depth layering.

### 3. Micro-Storytelling in Product Experiences
Every user interaction—from hovering a button to loading a dataset—is a micro-narrative. When crafted with intentional easing curves and subtle tactile feedback, digital software feels alive and responsive.`,
    coverImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    category: "Photography & Creativity",
    tags: ["Photography", "Visual Design", "Creative Direction", "UI/UX"],
    date: "Jun 2024",
    readTime: "4 min read",
    author: "Arup Das",
    color: "#f472b6",
    featured: true
  },
  {
    id: "edge-ai-android-neural-networks",
    title: "Edge Intelligence: Deploying Optimized Neural Networks on Android Devices",
    slug: "edge-ai-android-neural-networks",
    excerpt: "Step-by-step techniques for converting vision and NLP models to TensorFlow Lite and ExecuTorch for offline on-device inference with minimal battery consumption.",
    content: `Privacy-first computing and offline reliability make edge AI on mobile devices a critical frontier. Deploying intelligent models directly to mobile silicon minimizes cloud API costs while delivering zero-latency user interactions.

### 1. Converting Models with TensorFlow Lite (TFLite)
Transforming standard PyTorch and Keras models to TFLite format requires careful layer mapping and kernel validation. Leveraging GPU and NNAPI delegates allows Android apps to tap directly into mobile neural processing units (NPUs).

### 2. Managing Memory Constraints on Mobile
Mobile applications must operate strictly within OS-enforced memory heaps. Techniques like memory-mapped file loading (\`ByteBuffer\`) ensure instant model startup without ballooning JVM heap memory.

### 3. Real-Time Edge Computer Vision Pipeline
Integrating CameraX image analysis streams with non-blocking coroutines ensures a steady 30 FPS camera preview while running object detection and classification in parallel background workers.`,
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    category: "Mobile & Edge AI",
    tags: ["Android", "Kotlin", "TFLite", "Edge AI"],
    date: "May 2024",
    readTime: "5 min read",
    author: "Arup Das",
    color: "#10b981",
    featured: false
  },
  {
    id: "multimodal-llm-code-analysis",
    title: "Autonomous Code Intelligence: Designing Multimodal Assistants with AST Parsing",
    slug: "multimodal-llm-code-analysis",
    excerpt: "Architecting intelligent code translation and analysis pipelines by combining Abstract Syntax Tree (AST) tokenization with large language models.",
    content: `Large language models excel at natural language synthesis, but applying them to software translation demands strict structural and grammatical correctness.

### 1. Beyond Pure Text Generation
Pure token-based generation frequently hallucinate invalid variable scopes or broken AST dependencies. By feeding structural grammar rules alongside prompt context, code generation systems achieve vastly higher first-pass compilation rates.

### 2. Context-Aware Cross-Language Translation
Translating idioms from dynamic languages like Python to strongly typed compiled targets like C++ or Java requires tracking type inference and memory management semantics throughout the syntax tree.

### 3. Interactive Code Explanation Interfaces
Presenting translated code alongside interactive AST node breakdowns and time-complexity breakdowns creates an engaging educational tool for developers and engineering students.`,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    category: "AI & Machine Learning",
    tags: ["NLP", "LLMs", "AST", "Compilers", "Research"],
    date: "Apr 2024",
    readTime: "6 min read",
    author: "Arup Das",
    color: "#fbbf24",
    featured: false
  }
];

export const BLOG_CATEGORIES = [
  "All",
  "AI & Machine Learning",
  "Full Stack & Web",
  "Photography & Creativity",
  "Mobile & Edge AI"
];
