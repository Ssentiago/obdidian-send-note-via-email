# Send Note via Email

This Obsidian plugin allows you to quickly send your notes as emails directly from the Obsidian interface.

## Installation

### Community Plugins (Recommended, not approved yet)
1. Open Obsidian Settings → Community plugins
2. Disable Safe mode
3. Click Browse community plugins
4. Search for "Send Note via Email"
5. Click Install
6. Once installed, enable the plugin

### Manual Installation
1. Download the latest release from the Releases section of the GitHub repository.
2. Extract the plugin folder from the zip to your vault's plugins folder: `<vault>/.obsidian/plugins/`
   Note: Create the `plugins` folder if it doesn't exist.
3. Enable the plugin in Obsidian settings (Settings → Community plugins)

## Usage

1. Right-click on a markdown note in Obsidian.
2. Select the `Send via email` menu item.
3. This will open your default mail application with:
    - Recipient: The default recipient (configurable in plugin settings)
    - Subject: The note's name
    - Body: The note's content

## Settings

You can configure the default recipient email address in the plugin settings:
1. Go to Settings → Community plugins
2. Find "Send Note via Email" in the list
3. Click on the gear icon to open plugin settings
4. Enter the default recipient email address

## Note Size Limit

Please note that there's a size limit of approximately 16,000 characters for notes that can be sent via this plugin. This limit is in place to ensure smooth performance and compatibility with most email clients.

## Feedback and Issues

If you encounter any problems or have suggestions for improvements, please file an issue on the GitHub repository.
