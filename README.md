# Christmas Tree Designer

A Progressive Web App to help you design and build a wooden Christmas tree made from stacked, rotatable wooden pieces.

🌐 **[Live Demo](https://YOUR_USERNAME.github.io/chistmas/)** (Replace with your actual GitHub username after deployment)

## Features

- **Interactive 3D Visualization**: View your tree design in real-time with React Three Fiber
  - Realistic angled cuts shown on each wooden piece
  - Full camera controls (rotate, pan, zoom)
  - Hover tooltips with piece dimensions
- **Precise Calculations**: Automatically calculates piece lengths, cut angles, and material requirements
- **Cut List Generation**: Get a detailed cut list with dimensions for each piece
- **Material Estimation**: Know exactly how many stock pieces you need to buy
- **View Modes**: Toggle between flat (aligned) and rotated (spiral/star) views
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **PWA Support**: Install the app on your device for offline access

## Technology Stack

- **Vite** - Fast build tool and dev server
- **React** - UI library
- **TypeScript** - Type-safe development
- **React Three Fiber** - 3D rendering with Three.js
- **Tailwind CSS** - Utility-first styling
- **Three.js** - 3D graphics library

## Getting Started

### Prerequisites

- Node.js 20.12 or higher
- npm 10.5 or higher

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

Build the app:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## How to Use

### 1. Input Stock Material Dimensions

Enter the dimensions of your wood stock material in millimeters:
- **Depth**: Front-to-back measurement (default: 90mm)
- **Height**: Thickness of the wood (default: 35mm)
- **Stock Length**: Length of material as sold (default: 2400mm)

### 2. Define Tree Dimensions

Specify your desired tree dimensions:
- **Base Width**: Width at the bottom of the tree (default: 600mm)
- **Target Height**: Desired height of the tree (default: 900mm)

### 3. View Your Design

- The 3D viewer shows your tree in real-time
- Use **View Controls** to toggle between flat and rotated views
- Adjust the **Rotation Angle** slider to see different configurations
- **Hover over pieces** in the 3D view to see their dimensions
- **Manual Cut Angle**: Toggle to override the calculated angle for fine-tuning

### 4. Get Your Cut List

The app provides:
- Number of pieces needed
- Exact dimensions for each piece
- Cut angles for all pieces
- Total stock material required
- Number of stock pieces to purchase

### 3D Viewer Controls

- **Rotate**: Left-click and drag
- **Pan**: Right-click and drag
- **Zoom**: Scroll wheel

## Tree Design Concept

The tree is constructed by:
1. Stacking rectangular wooden pieces vertically
2. Each piece has a center hole for a support rod
3. Pieces are cut at angles on both ends to create a triangular profile
4. Pieces get progressively shorter from bottom to top
5. Each piece can be rotated around the center rod to create various patterns

## Project Structure

```
├── public/              # Static assets
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service worker
│   └── tree-icon.svg   # App icon
├── src/
│   ├── components/      # React components
│   │   ├── InputForm.tsx
│   │   ├── TreeViewer3D.tsx
│   │   ├── TreePiece3D.tsx
│   │   ├── CutList.tsx
│   │   └── ViewControls.tsx
│   ├── utils/
│   │   └── treeCalculations.ts  # Geometry calculations
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Deployment

This project is configured for GitHub Pages deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions, or [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for a quick start guide.

**Quick deploy:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/chistmas.git
git push -u origin master
```

Then enable GitHub Pages in your repository settings (Settings → Pages → Source: GitHub Actions).

## License

This project is open source and available for personal and commercial use.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.
