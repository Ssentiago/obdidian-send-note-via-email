import {
    Plugin,
    Menu,
    TAbstractFile,
    TFile,
    Notice,
    normalizePath,
} from 'obsidian';
import SettingsManager, { DefaultSettings } from '../settings/settingsManager';
import { SettingsTab } from '../settings/settings-tab';
import showdown from 'showdown';

export default class SendViaEmailPlugin extends Plugin {
    settingsManager!: SettingsManager;
    settings!: DefaultSettings;
    converter = new showdown.Converter();
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
                menu.addItem((item) => [
                    item
                        .setTitle('Send via email as HTML')
                        .setIcon('mail')
                        .onClick(async () => {
                            await this.sendViaEmail(file, true);
                        }),
                ]);
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
     * @param asHtml - Whether to send the content as HTML or plain text.
     * @returns A Promise that resolves when the email is triggered.
     */
    async sendViaEmail(file: TFile, asHtml = false): Promise<void> {
        const WARNING_LENGTH = 100000;
        const MAX_LENGTH = 500000;

        let content: string;
        try {
            content = await this.app.vault.cachedRead(file);
        } catch (err: any) {
            new Notice('Something went wrong while reading the file');
            return;
        }

        if (content.length > MAX_LENGTH) {
            new Notice(
                'The file is too large to be sent via email. But file link is copied to clipboard, you can attach it manually.'
            );
            this.attachFIleLinkToClipboard(file);
            return;
        }

        if (content.length > WARNING_LENGTH) {
            new Notice(
                'Warning: large file size may cause issues with some email clients'
            );
        }

        if (asHtml) {
            content = this.converter.makeHtml(content);
        }

        const defaultRecipient = this.settings.defaultRecipient;
        const subject = file.basename;
        const body = content.trim() ? content : '';

        const mailtoLink = `mailto:${defaultRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        const a = document.createElement('a');
        a.href = mailtoLink;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    /**
     * Attaches a file link to the clipboard.
     *
     * @param file - The file for which the link is to be attached.
     */
    private attachFIleLinkToClipboard(file: TFile): void {
        const basePath = this.app.vault.adapter.basePath;
        const relativePath = file.path;

        const fullPath = normalizePath(`${basePath}/${relativePath}`);
        navigator.clipboard
            .writeText(fullPath)
            .then(() => {
                new Notice('File link copied to clipboard');
            })
            .catch((err) => {
                console.error(err);
                new Notice('Failed to copy file link to clipboard');
            });
    }
}
