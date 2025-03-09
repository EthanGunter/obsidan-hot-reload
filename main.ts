import { App, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, moment } from "obsidian";
import { watch, existsSync, type FSWatcher } from "fs";

const DEFAULT_SETTINGS = {
    rawPaths: "",
    paths: [] as string[]
};

export const PLUGIN_NAME = "Hot Reload";
export default class HotReloadPlugin extends Plugin {
    settings: typeof DEFAULT_SETTINGS;
    private watchers: FSWatcher[] = [];

    async onload() {
        await this.loadSettings();
        this.initializeWatchers();

        this.addSettingTab(new HotReloadSettingsTab(this.app, this));
    }

    private initializeWatchers() {
        this.clearWatchers();

        this.settings.paths.forEach(path => {
            try {
                const watcher = watch(path, (eventType, filename) => {
                    if (eventType === 'change') {
                        // Close watchers before reloading
                        this.clearWatchers();
                        // Add slight delay to ensure cleanup completes
                        setTimeout(() => {
                            (this.app as any).commands.executeCommandById('app:reload');
                        }, 100);
                    }
                });
                this.watchers.push(watcher);
            } catch (e) {
                console.error(`Hot Reload: Failed to watch path ${path}:`, e);
            }
        });
    }

    private clearWatchers() {
        this.watchers.forEach(watcher => {
            watcher.close()
        });
        this.watchers = [];
    }

    async loadSettings() {
        const loaded = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded);

        // Migrate old settings format
        if (loaded?.rawPaths && !loaded?.paths) {
            const { paths } = validatePathString(loaded.rawPaths);
            this.settings.paths = paths;
        }
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.initializeWatchers();
    }

    onunload() {
        this.clearWatchers();
    }
}


export class HotReloadSettingsTab extends PluginSettingTab {
    plugin: HotReloadPlugin;

    constructor(app: App, plugin: HotReloadPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        const watchFilepath = new Setting(containerEl)
            .setName("File(s) to watch")
            .setTooltip("Separate each with a comma. End with '/' to watch all files in a directory. End with '/*' to watch all files recursively")
            .setDesc(getWatchString(this.plugin))
            .addTextArea(textArea => {
                textArea
                    .setValue(this.plugin.settings.rawPaths)
                    .onChange(async value => {
                        const { paths, errors } = validatePathString(value);
                        if (errors && errors.length > 0) {
                            watchFilepath.setDesc(getWatchString(this.plugin) + "\n" + errors.map(x => `Error: ${x}`).join("\n"));
                        } else {
                            this.plugin.settings.rawPaths = value;
                            this.plugin.settings.paths = paths;

                            await this.plugin.saveSettings();

                            watchFilepath.setDesc(getWatchString(this.plugin));
                        }
                    });
            })
    }
}

declare global {
    interface Window {
        app?: any;
    }
}

function validatePathString(value: string): { paths: string[], errors?: string[] } {
    const paths = value.split(",").map(x => x.trim()).filter(x => x.length > 0);
    const errors: string[] = [];

    for (const path of paths) {
        if (!existsSync(path.replace("/*", "/"))) {
            errors.push(`Path does not exist: ${path}`);
        }
    }
    return { paths, errors: errors.length > 0 ? errors : undefined };
}

function getWatchString(plugin: HotReloadPlugin): string {
    return "Watching: " + plugin.settings.paths.join(" | ");
}
