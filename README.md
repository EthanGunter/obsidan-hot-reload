# Hot Reload Plugin for Obsidian

Automatically reload Obsidian when specific files or directories change. 
Essential for plugin developers and theme designers needing instant feedback.

## Features
- 🕵️ Watch individual files or entire directories
- 🔄 Automatic app reload on changes
- ⚙️ Simple path configuration

## Installation
1. Install via Obsidian's Community Plugins browser
2. Open plugin settings (⚙️ > Hot Reload)
3. Add paths to watch (comma-separated):
   - `main.js` - watch specific file
   - `src/` - watch directory (non-recursive)
   - `styles/*` - recursive glob pattern
4. Get to work!

## File System Access
This plugin monitors files outside your Obsidian vault and requires direct filesystem access. This access is read-only, and no file will ever be modified by this plugin.

## License
MIT - See [LICENSE](./LICENSE)

---

🐛 [Report Issues](https://github.com/ethan-gunter/obsidian-hot-reload/issues)
