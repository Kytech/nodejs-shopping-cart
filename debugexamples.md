# Debug Config Examples and Information

This page describes the different debug config files and their various functions. Additionally, it contains an overview of the example configs and what they do as well, with certain points to remember when using or modifying then yourself.

## Table of Contents/Quick Links

Instead of trying to sift through this whole file for what you are looking for, these links will make your life easier! Most of these sections are small, so you should be able to just find what you are looking for from here fairly easily.

**Table of Contents:**

- [Debug Config Examples and Information](#debug-config-examples-and-information)
  - [Table of Contents/Quick Links](#table-of-contentsquick-links)
  - [Template/Example Debug Config Directory Listing](#templateexample-debug-config-directory-listing)
  - [Auto-attach for Server-Side](#auto-attach-for-server-side)
    - [A word on Debugging Chrome/Client-side when using auto-attach for server debug](#a-word-on-debugging-chromeclient-side-when-using-auto-attach-for-server-debug)
  - [Environment Variables in Debug Terminals](#environment-variables-in-debug-terminals)
  - [Quick word on tasks](#quick-word-on-tasks)
    - [Task/NPM script launch shortcut keybindings](#tasknpm-script-launch-shortcut-keybindings)
  - [Debug configuration Examples](#debug-configuration-examples)
    - [General recommendations](#general-recommendations)
    - [Server-Side debug profiles](#server-side-debug-profiles)
    - [Client-Side/Chrome debug profiles](#client-sidechrome-debug-profiles)
      - [Chrome attach config](#chrome-attach-config)
      - [Persisting Settings and Extensions in Debug Chrome Browser with launch config](#persisting-settings-and-extensions-in-debug-chrome-browser-with-launch-config)
    - [Client/Server Combined Debug Config](#clientserver-combined-debug-config)
      - [Using auto-attach for server](#using-auto-attach-for-server)
      - [Launch.json entry for both client and server](#launchjson-entry-for-both-client-and-server)
  - [Advanced Live-Edit Debug Config](#advanced-live-edit-debug-config)
    - [Server-side setup](#server-side-setup)
    - [Client-side setup](#client-side-setup)
    - [Caveats/Limitations](#caveatslimitations)
  - [Final Notes](#final-notes)
    - [Further Reading/Helpful References](#further-readinghelpful-references)

## Template/Example Debug Config Directory Listing

A listing of debug config file locations in this repository and their purpose. These files can be used as templates and references as you configure your own debug settings.

- [.vscode](/.vscode) folder - Workspace-specific settings/configuration files. These files are not always committed to a repository since some of these depend on the user environment/personal preferences.
  - [launch.json](/.vscode/launch.json) - Main debug profile config for the workspace.
  - [tasks.json](/.vscode/tasks.json) - Configure/customize command-line tasks (ex. NPM scripts) to be run from VSCode's terminal menu, as commands that are executed before/after a debug session is launched, or even tasks that run as the workspace is opened.
  - [settings.json](/.vscode/settings.json) - Apply VSCode settings for this workspace only/override user-level settings for this workspace only. This repo uses this file as a way to specify environment variables for the integrated terminal of VSCode for debugging since it will apply to anything running in a VSCode integrated terminal. Additionally, it configures this workspace's auto-attach behavior. Auto-attach will be touched on below.
- [user-level-configs](/user-level-configs) folder - Recommended configurations to apply on a user-level to provide for an out-of-the-box debugging experience for many of the organization's projects with little to no additional configuration. The contents of these files will need to be copied into your editor's global config files of the same name.
  - [settings.json](/user-level-configs/settings.json) - Settings to add to your user preferences to handle some of the most common setups you will encounter. Also enables auto-attach to any node process in the integrated terminal that is launched with `--inspect` or `--inspect-brk`. The `launch` property in this file is provided if you prefer having `launch.json` entries over auto-attach. If you prefer auto-attach, you will probably want to leave out the `launch` property from this file.
  - [tasks.json](/user-level-configs/tasks.json) - Global task to add on a user-level that allows use of [this specific config setup](#using-auto-attach-for-server) if the workflow it is involved in is used frequently. If the workflow this task uses is only used in certain workspaces, it should be defined in those workspaces' `.vscode/tasks.json` file instead.
  - [keybindings.json](/user-level-configs/keybindings.json) - Some handy keyboard bindings for launching common npm tasks in VSCode.
- [debug-templates](/debug-templates) folder - Template `launch.json` config files to reference if you need to setup your own debug configs in a workspace's `launch.json` file. Some of these will work right out of the box, most may need a little bit of modification. Properties that are only used in some cases will be commented out and will have a note along with them explaining their usage. See [Debug configuration Examples](#debug-configuration-examples) for more info on these templates.

## Auto-attach for Server-Side

By far the easiest way to get started debugging node.js projects in VSCode is to enable the auto-attach setting or to use the Javascript Debug console (which can be launched using the `F1` command palette or using `ctrl+alt+j` if you use my [keybindings.json](/user-level-configs/keybindings.json) file). The Javascript Debug Console will automatically attach to any node.js process launched in it and start debugging it.

A similar behavior, but within any integrated terminal can be configured with the auto-attach setting. The auto-attach setting can be configured in several different ways. The option I recommend in your global [settings.json](/user-level-configs/settings.json) is to configure `"debug.javascript.autoAttachFilter"` to the value `"onlyWithFlag"` so that node processes in VSCode's integrated terminal will only be auto-attached to for debugging if the program was launched with the debug command line flag(s). This can also be set on a per-workspace level by setting this option in the workspace-level settings file, [.vscode/settings.json](/.vscode/settings.json), just like with almost any other setting in VSCode. I would recommend experimenting with the different values of this option to find what suits you personally. After you have configured this setting once, you can quickly change it by clicking the `Auto Attach` button in the status bar at the very bottom of the VSCode window.

The auto-attach workflow works best when a `debug` script is specified in `package.json`, similar to this repo's [package.json](/package.json).

### A word on Debugging Chrome/Client-side when using auto-attach for server debug

All chrome debug profiles require a `launch.json` entry, even when using auto-attach for the server-side. See the notes below on [Chrome debug configs](#client-sidechrome-debug-profiles) for more info on this. You can still configure a simultaneous client/server debug session if you have auto-attach enabled without setting up a profile for the server as well. See [Client/Server Combined Debug Config](#using-auto-attach-for-server) for details.

## Environment Variables in Debug Terminals

Using the user-level and workspace-level `terminal.integrated.env.<OS Name>` (where OS Name is either windows, linux, or macos, the setting only affecting the specific OS) setting allows you to set environment variables for all debug profiles that specify the `"console": "integratedTerminal"` option (Which I strongly recommend setting for node.js `launch.json` debug configs), VSCode tasks, and any command you issue in the VSCode integrated terminal. My use of the [.vscode/settings.json](/.vscode/settings.json) file in this repo is to primarily set environment variables I use personally to debug for this workspace only. This is especially useful if you want to keep debug-only env variables separate from your regular `.env` variables if you use that to configure your app. You can also override any user-level defined env variables that are defined by configuring them in the `.vscode/settings.json` file. I recommend setting the `NODE_ENV` variable to `development` in your user-level config, as I have done in my [example user-level settings](/user-level-configs/settings.json) since having this set to development by default can help prevent accidentally triggering events on real production systems/users. You can still override this for specific debug tasks or workspaces as needed.

## Quick word on tasks

Tasks provide a convenient way to provide shortcuts and customizations to specific command-line tasks that you may use often. This is particularly useful if you prefer an auto-attach workflow. VSCode will by default register a task for each NPM script. You can customize parameters for this task by clicking on the gear icon in the top right of a task when selecting a task from the `Terminal -> Run Task...` menu. This creates a `tasks.json` entry for that npm script similar to the first one listed in the [.vscode/tasks.json](/.vscode/tasks.json) file. The first task in that file is an example of this type of task config, but it specifies a custom environment variable to set for that task using the `env` property while specifying the default working directory that npm should run in. If your `package.json` file is not at the root folder of VSCode's workspace, you'll want to set the `cwd` property to the path of your `package.json` file so that it mirrors the behavior that happens when running the npm script directly from the terminal.

### Task/NPM script launch shortcut keybindings

The [keybindings.json](/user-level-configs/keybindings.json) file included in this repo defines several keybindings for npm script task shortcuts. If you add this to code's keybindings by typing `F1` and typing `Preferences: Open Keyboard Shortcuts (JSON)`, you will gain the following shortcut key combinations to quickly launch common npm scripts:

- `ctrl+alt+n s` - Shortcut for `npm run start`
- `ctrl+alt+n d` - Shortcut for `npm run debug`
- `ctrl+alt+n n` - Shortcut for `npm run nodemon`

These key combinations will respect any customizations made when customizing a npm task in `tasks.json` as mentioned above.

You may also find these as a helpful template for creating additional shortcut combinations for other npm scripts. Just copy the config and replace the script name preceded by `npm: ` with the script you would like to launch with your shortcut.

## Debug configuration Examples

This section gives a brief outline of the different debug config examples provided in this repo to use as templates for your own debug configurations. Commented out entries in a debug profile template are only used in specific scenarios and are often followed by a note explaining their use.

Because of how powerful auto-attach is, you will likely only need to actually configure a `launch.json` file if you need/want a bit more control or have more complex needs than auto-attach and setting integrated terminal environment variables can provide. Additionally, if you want to use Chrome to debug alongside/linked to VSCode, you will need a `launch.json` config for the Chrome debugging features, which are discussed below.

Any launch-type debug profiles (as opposed to attach profiles) can be used to just launch a program without debugging it by selecting the profile in the debug pane, then clicking on `Run -> Run Without Debugging` in the menu bar or by using the key combination of `ctrl+F5`

### General recommendations

It's generally a good idea to have a `debug` npm script in your `package.json`. See this repo's [package.json](/package.json) for an example.

I would strongly recommend setting up all your node.js debug profiles to use the `"console": "integratedTerminal"` option. I find that it generally works best, especially if you're using packages or tools such as `chalk` and `nodemon`. This does not apply and is not applicable for chrome client-side debug profiles. If your package.json is not at the root of your VSCode workspace, you will want to set the `cwd` property as well. The examples I provide assume the directory structure common in the organization.

You can also set environment variables for a debug profile by specifying the `env` property.

If you find yourself wanting to not have to go through the effort of setting up a server `launch.json` config even if you prefer this method over auto-attach, you can add the `launch` property from this repo's [suggested user-level settings](/user-level-configs/settings.json) to your user-level settings. It is setup to handle most setups used by this organization and will make these debug profiles visible in all workspaces without further configuration.

### Server-Side debug profiles

Below is a list of example profiles with a description and link to their location in this repo.

- [Node - Attach](/debug-templates/node-attach.json) - Attach to a running node.js process that was started with `--inspect` or `--inspect-brk`. Can also be used to reattach to a process that was auto-attached, but then detached from.
- [NPM - Debug](/debug-templates/npm-debug-script.json) - Launch entry that starts debugging using `npm run debug`. Usually requires no modification or possibly setting the `cwd` property like most of these do.
  - **Note:** When in a `launch.json` file, by using the add configuration button in the bottom right or by using intellisense, you can also setup a debug config for a script other than `debug` that is usually launched using `npm` and it should have a very similar debug config.
  - A similar config should be able to debug a regular `start` npm script by just altering the script name in the `runtimeArgs` property from this example.
- [Nodemon](/debug-templates/nodemon.json) - Useful if the project you are working on does not have a npm script for nodemon in development. Requires that nodemon be installed globally. Will also need to configure which file is the main entry point of the server app.
- [Standalone Script](/debug-templates/standalone-node-script.json) - Best used if you need to debug a script that doesn't have an entry as an npm script and you want a `launch.json` debug entry for it. `program` and `cwd` will need to be modified. You'll probably want `cwd` to be the directory of package.json if you want it to behave like it was ran by NPM.

### Client-Side/Chrome debug profiles

Chrome debug profiles are actually pretty straightforward. The [example in this repo](/debug-templates/chrome-launch.json) for a launch workflow, when used with only the un-commented properties will only need the `webRoot` property set to where the static files root is on disk and to have the `url` port modified as needed. `cleanUp` can be set to either `onlyTab` or `wholeBrowser` depending on if you want the whole debug browser to close when you stop debugging or if you just want the initial tab to close.

If you would like to try using a different chromium-based browser, you can set the `runtimeExecutable` property of [the example above](/debug-templates/chrome-launch.json) to the path to the executable for that chromium-based browser.

#### Chrome attach config

An attach config can be added very easily by using the add configuration button that shows up in the bottom right when editing `launch.json` or by using intellisense. You just have to start Chrome with the proper command line flags to enable debugging before you can attach to it.

#### Persisting Settings and Extensions in Debug Chrome Browser with launch config

By default, the Chrome browser launched by VSCode will store it's settings and extensions in a temporary directory. This is necessary due to the way Chrome spawns and manages process groups. If you want these extensions and settings to persist, (ex. say you want to have the postman interceptor extension available when debugging through Chrome and VSCode) you can tell Chrome where it should store it's settings and extensions. You can do this by specifying the following in the `runtimeArgs` property of a Chrome debug launch config:

```json
"runtimeArgs": ["--user-data-dir=c:\\path\\to\\chrome\\debug\\folder\\profile"]
```

You can use one directory for all debug configs, or you can use separate directories for different projects depending on your preference.

After making this adjustment to the chrome launch config, you can relaunch the debug session and install any desired extensions from the Chrome Web Store and they will persist.

### Client/Server Combined Debug Config

VSCode supports multi-session debug profiles, allowing you to simultaneously debug both the client and server at the same time.

If you already have the server process attached for debugging (ex. VSCode auto-attached to it when you launched it since you are using auto-attach), you can start your Chrome debug profile at any time and VSCode will let you debug both the client and server at the same time.

Additionally, you can make a launch config that will start both the client and server in one of two ways depending on your preference:

#### Using auto-attach for server

If you are using auto-attach to debug the server (not using a `launch.json` entry as discussed in [Server-Side debug profiles](#server-side-debug-profiles)), make a copy of your Chrome client-side launch profile, but add the following to the config: `"preLaunchTask": "npm: debug"`. Rename this new config as you see fit. Next, add the [task defined in the user-level configs](/user-level-configs/tasks.json) of this repo to either your user-level `tasks.json` if you use this workflow frequently, or add it to your workspace's `.vscode/tasks.json`. (User-level tasks can be opened through the `F1` menu and searching for user-level tasks. If you are prompted about task type, just select anything and then replace the output with the task in the file. Should only happen first time)

If your new config fails to launch the server, you'll need make sure you move this task to your `.vscode/tasks.json` file if it's not already there. Modify the task as needed and change the `label` property to something else (ex. `start server`). Change the `preLaunchTask` to match the new task label.

**Note:** This method will not work unless auto-attach setting is set to at least `onlyWithFlag` (see [Auto-Attach](#auto-attach-for-server-side)) and a npm `debug` script that specifies `--inspect` or `--inspect-brk` exists in `package.json`. If a `debug` npm script does not exist, the task in the above example can be modified to launch node/nodemon with the desired inspect flag. This modified script should have a different label and be placed in `.vscode/tasks.json`

#### Launch.json entry for both client and server

If you have a launch.json entry for both the client and server entries, (using a `launch.json` entry as discussed in [Server-Side debug profiles](#server-side-debug-profiles)), you can add a compound configuration for debugging both the client and server at the same time. See the [compound debug config example](/debug-templates/client-and-server-compound.json) file for details on how to do this.

## Advanced Live-Edit Debug Config

Using one of the features in Chrome Dev Tools combined with nodemon on the server side allows for a development/testing experience that can allow you to make changes to the codebase with an almost fully "live" experience where changes will take effect as soon as you save the changes in the file without needing to reload the client/browser.

This setup addresses the problem of "I want to see how this change in the client-side code affects the page, but if I reload the page to load the new client-side code, I'll loose some state changes/form fields/other dynamic changes that I'll have to fill out/setup/trigger again". This setup allows you to edit the client-side files and then the next time you hit the modified lines of code, it will be executed by the browser, all without needing to reload the page. For server-side requests that have modified files, nodemon handles this since the next response from the server after the change is saved will use the new code. This setup gives you about as close to a "live code editing" experience as possible. There are just a few caveats that don't make it 100% live, which I will detail at the end of this section.

### Server-side setup

Just make sure the server-side is running under nodemon, either through a `launch.json` config (whether global nodemon or from a npm script) or by directly invoking the server in debug mode with nodemon from the terminal. Really, all that matters is that the server is running under nodemon when you're debugging.

### Client-side setup

Ensure that you have either a launch or attach Chrome debug profile setup in your `launch.json` so that you can debug the client-side code using Chrome linked with VSCode.

**Note:** If your Chrome debug profile is a launch type (like the examples provided in this repo), I would recommend setting up your Chrome debug profile to persist your settings and extensions by following the adjustments in [this section](#persisting-settings-and-extensions-in-debug-chrome-browser-with-launch-config) so that you don't have to periodically reconfigure the chrome-side settings for this feature to work properly.

Next, ensure that the server side is running and launch/start your chrome debug profile. In your debugging Chrome instance, open up Chrome dev tools by hitting `F12`, `ctrl+shift+i`, or by right-clicking and selecting `inspect`. Next, click on the `Sources` tab.

![Chrome Dev Tools Live Setup Step 1](/data/chromedev-live-1.png?raw=true 'Sources Tab - Chrome Dev Tools')

Click on the `Filesystem` tab below the main dev tools tabs to display the following panel:

![Chrome Dev Tools Live Setup Step 2](/data/chromedev-live-2.png?raw=true 'Filesystem Sub-tab - Chrome Dev Tools')

Click on the plus icon to add a folder to the Chrome workspace.

![Chrome Dev Tools Live Setup Step 3](/data/chromedev-live-3.png?raw=true 'Add folder to workspace - Chrome Dev Tools')

Select the directory that contains the root folder of the static files for your website/webapp. Chrome may prompt you for permission to access this directory. Click on allow. Some files will link immediately, which will be indicated by a green dot on their icon. If none are showing a green dot, refresh the webpage.

Chrome has now linked your machine's local copy to the version that the server process provides it. This will be indicated by a green dot on the file in the sources pane. You can now edit the linked files in VSCode or even from within Chrome's sources tab to make changes that will take effect whenever that line of code is next executed by the browser as long as Chrome dev tools is open when the edits are made. No reload is needed for the file changes to take effect.

**Tip:** To save edits made in Chrome dev tool's sources view, just use the `ctrl+s` keyboard shortcut. These edits will immediately show in VSCode on saving. If you make these live client-side edits in Chrome's sources view, you won't have to worry about accidentally closing dev tools.

If the green dot disappears from a file or does not appear on a file that is part of the page that you are currently viewing, the connection may not be working and might require a page reload or removing and re-adding the folder using the steps above. If the file that is not showing a green dot is one that is generated by a template, Chrome will not be able to link to it for this type of live client-side editing since the contents are dynamically filled-in/altered by the server.

Please note that editing client-side files in this way has a certain caveat/consideration to take in mind concerning how it affects breakpoints. See [this caveat/limitation](#debug-caveat) below for details.

**Note:** If you are using an attach `launch.json` configuration for your Chrome debug, you should be able to add additional folders from different projects without conflicts. However, if Chrome is not able to link the files when using an attach configuration when multiple folders are added from different projects, you will have to right-click and remove any folders not used in the specific project from Chrome's `Filesystem` sources pane.

### Caveats/Limitations

The following is a list of limitations that make this not quite a true "live" editing experience.

- HTML created by a template engine on the server will not be able to link in this way as far as I am aware. These edits will require that the server restart (ex. with nodemon) and that the client reload the page for those types of edits to display on the client-side. If you want to test some slight html changes before editing the template, you can use Chrome's `Elements` pane in the inspector/dev tools to modify the html in the browser's current session.
- <a name="debug-caveat"></a>Editing a client-side file without a page reload will unbind all breakpoints set in VSCode for client-side files until you refresh the page. As such, if you need to set breakpoints in a file you are live editing, set the breakpoints using the `sources` pane in Chrome dev tools. The VSCode debug console and debug controls will still work as usual.
  - A good way to make this less of a gotcha is to do any dynamic "live" client-side edits using the Chrome sources view, also setting breakpoints for that modified code in chrome's dev tools.
  - Think of it in terms of Chrome is the only one that "sees" live client-side edits.
  - I like to use Chrome-side breakpoints for when I "live edit" and VSCode client side breakpoints for when I want to step through and examine the whole client-server communication or if I don't want/need to do "live editing" on the client-side.
- Live edited code will only be reflected in the browser's behavior when it is next executed. If an edited piece of code is in a scope that is only executed when the page is first loaded, you will have to reload the page. If it is code that is triggered by a function/event, it will reflect next time that function or event is triggered.
- If an edit to a client-side file is made in VSCode with Chrome dev tools closed, Chrome may loose the "live connection", requiring a page reload.
  - To avoid this, either:
    - Keep Chrome dev tools open the entire time
    - Make your live client-side edits in the Chrome dev tools `sources` pane.

## Final Notes

There's a lot of power in these debug tools that can really enhance your debug workflow. This guide contains a good amount of info, but it's just the tip of the iceberg of what can be done when combining Chrome dev tools and VSCode's debugging tools. Experiment a bit yourself. You may find something not written here that may enhance your workflow.

For any of the debug/task config files, VSCode's intellisense (`ctrl+space`) is super helpful. It will show you available options and even provide info about what each of them do as you modify these example configs for your use.

### Further Reading/Helpful References

- [Debugging in VSCode](https://code.visualstudio.com/docs/editor/debugging)
- [Debugging Node.js in VSCode](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)
- [VSCode tasks Documentation](https://code.visualstudio.com/docs/editor/tasks)
- [Chrome Dev Tools Documentation](https://developers.google.com/web/tools/chrome-devtools)
- Debugging with Chrome in VSCode
  - [Original Chrome Debug Extension Docs](https://github.com/microsoft/vscode-chrome-debug) (extension is now part of VSCode by default)
  - [VSCode Javascript Debugger Github](https://github.com/microsoft/vscode-js-debug)
