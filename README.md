# Hot Reload Plugin for Obsidian

Automatically reload Obsidian when specific files or directories change. 
Essential for plugin developers and theme designers needing instant feedback.

## Features
- 🕵️ Watch individual files or entire directories
- 🔄 Automatic app reload on changes
- 🧹 Memory-safe watcher cleanup
- ⚙️ Simple path configuration

## Installation
1. Install via Obsidian's Community Plugins browser
2. Open plugin settings (⚙️ > Hot Reload)
3. Add paths to watch (comma-separated):
   - `main.js` - watch specific file
   - `src/` - watch directory (non-recursive)
   - `styles/*` - recursive glob pattern
4. Get to work!

## License
MIT - See [LICENSE](./LICENSE)

---

🐛 [Report Issues](https://github.com/ethan-gunter/obsidian-hot-reload/issues)
