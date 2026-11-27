import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  name: 'GroupTab',
  description:
    'Group tab is a keyboard driven tab manager to allow you to manage multi page workflows with ease.',
  version: '1.0.0',
  manifest_version: 3,
  minimum_chrome_version: '116',
  icons: {
    '16': 'img/icon_black.png',
    '32': 'img/icon_black.png',
    '48': 'img/icon_black.png',
    '128': 'img/icon_black.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/icon_black.png',
  },
  options_page: 'options.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/content/index.ts'],
    },
  ],
  commands: {
    _execute_action: {
      suggested_key: {
        default: 'Ctrl+Shift+G',
        mac: 'Command+Shift+G',
      },
      description: 'Open the GroupTabs popup',
    },
  },
  permissions: ['tabGroups', 'tabs', 'storage', 'unlimitedStorage'],
})
