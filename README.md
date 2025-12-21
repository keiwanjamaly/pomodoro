# 🍅 Juicy Pomodoro

[**Live Demo**](https://keiwanjamaly.github.io/pomodoro/)

A vibrant, focus-enhancing Pomodoro timer built with React and Vite. Stay in the flow with dynamic colors and a smooth timeline.

## ✨ Features

- **Dynamic Theming**: The background color shifts to match your current state (Focus, Short Break, Long Break).
- **Visual Timeline**: See your day's sessions at a glance with the `Timeline` component.
- **Progress Tracking**: A sleek `ProgressBar` keeps you aware of the remaining time.
- **Debug Mode**: Test your flows quickly with a built-in simulation mode.
- **Modern Stack**: Built with the latest React 19, Vite, and Vitest.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pomodoro.git
   cd pomodoro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 🛠️ Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run preview`: Preview the production build locally.
- `npm run test`: Run the test suite with Vitest.
- `npm run lint`: Run ESLint to check for code quality.

## � AI Code Review

This project includes an automated AI code review workflow powered by Gemini. It checks for:
- README completeness
- Code quality and best practices
- Test coverage

### Setup

To enable the AI review on your fork:
1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/).
2. Go to your repository settings on GitHub.
3. Navigate to **Secrets and variables** > **Actions**.
4. Create a new repository secret named `GEMINI_API_KEY` and paste your API key.

The workflow will automatically run on every push and pull request.

## �🧩 Project Structure

```
src/
├── components/      # UI Components (Timer, Timeline, etc.)
├── hooks/           # Custom hooks (usePomodoro logic)
├── App.jsx          # Main application layout
└── main.jsx         # Entry point
```

## 🧪 Testing

This project uses **Vitest** for unit testing. Run the tests to ensure everything is working as expected:

```bash
npm run test
```

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

MIT
