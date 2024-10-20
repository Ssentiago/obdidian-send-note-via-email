import { Plugin, Menu, TAbstractFile, TFile, Notice } from 'obsidian';
import SettingsManager, { DefaultSettings } from '../settings/settingsManager';
import { SettingsTab } from '../settings/settings-tab';

export default class SendViaEmailPlugin extends Plugin {
    settingsManager!: SettingsManager;
    settings!: DefaultSettings;
    /**
     * Initializes the plugin.
     *
     * This method is called automatically by Obsidian when the plugin is loaded.
     *
     * It delegates the initialization to `initializeCore`.
     */
    async initializePlugin(): Promise<void> {
        await this.initializeCore();
        this.initializeEventSystem();
    }

    /**
     * Initializes the core of the plugin.
     *
     * This method is called automatically by `initializePlugin`.
     *
     * It initializes a new `SettingsManager` instance and assigns it to the `settingsManager` property.
     * It then loads the plugin settings using the `loadSettings` method of the `SettingsManager`.
     *
     * @returns A promise that resolves when the settings have been successfully loaded.
     */
    async initializeCore(): Promise<void> {
        this.settingsManager = new SettingsManager(this);
        await this.settingsManager.loadSettings();
        this.addSettingTab(new SettingsTab(this.app, this));
    }

    /**
     * Initializes the event system of the plugin.
     *
     * This method is called automatically by `initializePlugin`.
     *
     * It sets up an event listener on the `file-menu` event of the Obsidian app workspace.
     * When the event is triggered, it appends a new menu item to the menu.
     * The new menu item is titled 'Send via email' and has an envelope icon.
     * When the new menu item is clicked, it calls `sendViaEmail` with the file that triggered the event.
     */
    initializeEventSystem(): void {
        this.app.workspace.on(
            'file-menu',
            (menu: Menu, file: TAbstractFile) => {
                if (!(file instanceof TFile)) {
                    return;
                }
                if (file.extension !== 'md') {
                    return;
                }

                menu.addItem((item) => {
                    item.setTitle('Send via email')
                        .setIcon('mail')
                        .onClick(async () => {
                            await this.sendViaEmail(file);
                        });
                });
            }
        );
    }

    /**
     * Initializes the plugin when it is loaded.
     *
     * This method is called automatically by Obsidian when the plugin is loaded.
     */
    onload(): void {
        this.initializePlugin();
    }

    /**
     * Sends the content of a markdown file via email using the default mail client.
     *
     * @param file - The markdown file to be sent.
     * @returns A Promise that resolves when the email is triggered.
     */
    async sendViaEmail(file: TFile): Promise<void> {
        const MAX_SAFE_LENGTH = 16000;

        let content: string;
        try {
            content = await this.app.vault.cachedRead(file);
        } catch (err: any) {
            new Notice('Something went wrong while reading the file');
            return;
        }

        if (content.length > MAX_SAFE_LENGTH) {
            new Notice('The file is too large to be sent via email');
            return;
        }

        const mailtoLink = `mailto:${this.settings.defaultRecipient}?subject=${encodeURIComponent(file.name)}&body=${encodeURIComponent(content)}`;
        const a = document.createElement('a');
        a.href = mailtoLink;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}
