import { PluginSettingTab, Setting, App } from 'obsidian';
import SendViaEmailPlugin from '../core/send-via-email-plugin';

export class SettingsTab extends PluginSettingTab {
    private readonly plugin!: SendViaEmailPlugin;
    constructor(app: App, plugin: SendViaEmailPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): any {
        const { containerEl } = this;

        new Setting(containerEl)
            .setName('Default recipient')
            .addText((input) => {
                input.inputEl.type = 'email';
                input.setValue(this.plugin.settings.defaultRecipient);
                input.onChange(async (value) => {
                    this.plugin.settings.defaultRecipient = value;
                    await this.plugin.settingsManager.saveSettings();
                });
            });
    }
}
