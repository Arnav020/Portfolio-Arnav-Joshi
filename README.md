# ONYX — High-Performance Developer Portfolio

[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![3D with Three.js](https://img.shields.io/badge/Three.js-r160-black?style=for-the-badge&logo=three.js)](https://threejs.org)
[![Animated with Framer Motion](https://img.shields.io/badge/Framer_Motion-12-black?style=for-the-badge&logo=framer)](https://framer.com/motion)
[![Styled with Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-black?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

**ONYX** is a cinematic, interactive portfolio experience that merges a professional 3D workspace with a fully functional, macOS-inspired desktop environment. Designed for performance and visual excellence, it provides a seamless transition from a "Real World" 3D room into a "Digital World" OS.

---

## 🌌 High-Performance Experience

### 🎮 The 3D Room (Transition Layer)
The entry point is a high-fidelity 3D room built with **React Three Fiber**. 
- **Smooth Scroll Transition**: A hardware-accelerated lerp transition that zooms from the room view directly into the monitor screen.
- **Dynamic Monitor Sync**: The monitor in the 3D room renders a high-fidelity canvas texture that mirrors the OS layout, ensuring visual coherence during the entry animation.
- **Optimized Assets**: Uses standard Three.js primitives and baked textures to maintain high FPS across different hardware.

### 🖥️ OS ONYX (Desktop Layer)
A fully functional work environment that acts as the portfolio's main navigation system.
- **GPU-Accelerated Window Manager**: Draggable, focusable, and minimizable windows built with Framer Motion natively using `x/y` transforms to ensure zero lag.
- **Digital Rainfall Substratum**: A professional "Code Rain" background featuring meaningful engineering snippets (PyTorch, Go, React) with a top-heavy, cinematic linear fade.
- **Onyx Aesthetics**: A deep sapphire-obsidian theme with high-contrast widgets and sapphire-bordered windows for a premium developer feel.

---

## 🛠️ Tech Stack

- **Core**: Next.js 16 (App Router), TypeScript, React 19
- **3D Engine**: Three.js, React Three Fiber (R3F), @react-three/drei
- **Animation**: Framer Motion (Window management), GSAP (Fine-tuned UI transitions)
- **Styling**: Tailwind CSS, Vanilla CSS (Backdrop filters & Glassmorphism)
- **Integration**: GitHub API (Live stars/forks)
- **Fonts**: Geist Sans & Geist Mono (Vercel)

---

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router (Layouts & API Routes)
│   ├── api/github        # GitHub Repository stats proxy
│   └── page.tsx          # Main Entry Point (Coordination of 3D and OS)
├── components/
│   ├── desktop/          # OS ONYX System
│   │   ├── widgets/      # Clock and Now Playing widgets
│   │   ├── DesktopOS     # Main desktop container & Code Rain logic
│   │   └── WindowManager # Framer-motion powered drag & focus system
│   ├── three/            # 3D Environment Components
│   │   ├── RoomScene     # Main R3F Scene
│   │   └── Monitor       # High-fidelity monitor with synced texture
│   └── ui/               # Shared UI primitive components
├── data/                 # Project definitions & Resume metadata
├── hooks/                # Custom React hooks (Intersection Observer, Window logic)
├── lib/                  # Library utilities (GitHub API, formatters)
└── types/                # TypeScript interface definitions
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or pnpm

### Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Arnav020/Portfolio-Arnav-Joshi.git
   cd Portfolio-Arnav-Joshi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root:
   ```env
   GITHUB_TOKEN=your_github_personal_access_token
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Production Build**:
   ```bash
   npm run build
   ```

---

## 📈 Performance Optimizations

- **Layer Isolation**: All windows use `isolation: isolate` and `transform-gpu` to prevent browser re-paints during dragging.
- **Memoization**: Core components like `DraggableWindow` and `DesktopIcon` are wrapped in `React.memo` to eliminate unnecessary re-renders.
- **Static Generation**: The landing page is statically generated, with 3D elements suspended until the hydration phase.

---

## 🎨 Design Philosophy
The "ONYX" project is built on the **Blue-Onyx** aesthetic—a blend of cinematic darkness and technical vibrancy. 
- **Obsidian Foundations**: Backgrounds are `#02040a` to ensure maximum contrast for technical code.
- **Sapphire Accents**: All interactive elements (indicator pulses, progress bars, window borders) use a calibrated `#3b82f6` (Blue-500) palette.

---

## 📄 License
Designed and Developed by **Arnav Joshi**.
Specializing in AI/ML, Full Stack Development, and MLOps.
