# 📺 TV9 Flappy Face

A fun twist on the classic Flappy Bird game featuring TV9 branding and custom audio from Challenging Star Darshan! Navigate through stacked TV9 logo obstacles while listening to entertaining audio clips.

## 🎮 Game Features

### Core Gameplay
- **Classic Flappy Bird mechanics** with a TV9 twist
- **Progressive difficulty** - Game speed increases as your score goes up
- **Custom face character** - Use your own face image as the player character
- **TV9 logo obstacles** - Navigate through stacked TV9 logo segments

### Audio Experience
- **Alternating jump sounds** - Two different audio clips play on alternating jumps
  - First jump: Challenging Star Darshan speech clip
  - Second jump: Custom audio clip
- **Crash sound effect** - Special Darshan crash audio plays when you hit an obstacle

### Visual Design
- **Clean, modern UI** with TV9 branding colors
- **Smooth animations** and transitions
- **Responsive design** that works on desktop and mobile
- **Dynamic speed effects** as difficulty increases

## 🚀 How to Play

1. **Start the game** by clicking/tapping or pressing the spacebar
2. **Jump** by pressing spacebar or tapping the screen
3. **Avoid the TV9 logo pipes** - navigate through the gaps
4. **Score points** by successfully passing through pipe gaps
5. **Challenge yourself** as the game gets faster with higher scores!

## 🛠️ Technical Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Custom game loop** with requestAnimationFrame
- **HTML5 Audio API** for sound effects

## 📁 Project Structure

```
tv9-flappy-face/
├── public/                     # Static assets
│   ├── image 22.png           # Player face image
│   ├── image 6.png            # TV9 logo
│   ├── Audio 2.mp3            # Jump sound 2
│   ├── darshan_crash_audio.mp3 # Crash sound
│   └── ಅಭಮನಗಳಗ ಪರತಯದ ಬದಧವದ ಹಳದ ಡ ಬಸ..! Challenging Star Darshan Speech In Hubli.mp3
├── components/
│   ├── Bird.tsx               # Player character component
│   └── Pipe.tsx               # Obstacle component
├── constants.ts               # Game configuration
├── types.ts                   # TypeScript type definitions
├── App.tsx                    # Main game component
└── index.tsx                  # Entry point
```

## 🎯 Game Mechanics

### Difficulty Progression
- **Speed increase**: Every 5 points, pipe movement speed increases by 30%
- **Spawn rate**: Pipes appear more frequently as score increases
- **Maximum challenge**: Game becomes significantly harder at higher scores

### Audio System
- **Alternating sounds**: Jump sounds alternate between two audio files
- **Crash feedback**: Immediate audio feedback when hitting obstacles
- **Reset on restart**: Audio sequence resets when starting a new game

## 🔧 Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tv9-flappy-face
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🚀 Deployment

This project is optimized for deployment on platforms like:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect it's a Vite project
3. Deploy with default settings

## 🎨 Customization

### Changing Assets
- Replace images in `/public/` folder
- Update file paths in `constants.ts` if needed
- Audio files should be in MP3 format for best compatibility

### Game Configuration
Edit `constants.ts` to modify:
- Game dimensions
- Physics (gravity, jump strength)
- Difficulty progression
- Visual settings

### Styling
- Uses Tailwind CSS classes
- Color scheme follows TV9 branding
- Responsive design included

## 🎵 Audio Assets

The game includes custom audio clips:
- **Darshan speech clip** - Plays on first jump and alternating jumps
- **Secondary audio** - Plays on alternating jumps  
- **Crash sound** - Plays when hitting obstacles

*Note: Audio files are included for entertainment purposes and may be subject to copyright.*

## 📱 Browser Compatibility

- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **Mobile browsers** with touch support
- **Audio autoplay** may be blocked by browser policies (user interaction required)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for entertainment purposes. Please respect any copyright restrictions on included audio/image assets.

## 🎬 Credits

- **Original Flappy Bird concept** by Dong Nguyen
- **TV9 branding** and logo usage
- **Audio clips** featuring Challenging Star Darshan
- Built with ❤️ for the TV9 community

---

*Enjoy playing TV9 Flappy Face! 🎮*
