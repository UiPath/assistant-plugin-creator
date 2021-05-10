This repository can be used as a starting point for developing custom widgets for UiPath Assistant using Angular 9.
The project is an Angular library that contains the implementation of a sample widget that interacts with UiPath processes and saves its configuration in a local file.

## Developing your widget

1. Run `npm i`. For npm 7 or higher, use the `--legacy-peer-deps` flag.
2. `npm run watch`. This will rebuild the widget every time a project file is saved.
3. Find the `UiPathAssistant` folder in your [UiPath `Studio` / `Robot` install location](https://docs.uipath.com/installation-and-upgrade/docs/studio-install-studio).
4. Close the Assistant if it is opened.
5. Provide the path to your widget `.js` output to Assistant by running `UiPath.Assistant.exe` with the `--debug` and `--dev-widget` flags (e.g. `UiPath.Assistant.exe --debug --dev-widget=C:\Users\...\Desktop\assistant-plugin-creator\dist\sample-widget\bundles\sample-widget.umd.js`; The path may not contain spaces).
6. You should see a new Assistant red tab that hosts your main widget component. The tab is always visible in dev mode, even if enabling `isTabHidden`.
7. You may open dev tools via `Ctrl+Shift+I`.
8. By default, the Assistant will read the sibling `sample-widget.umd.js.map` source map file and allow typescript debugging.

## Widget API

`@uipath/widget.sdk` exports reusable components and the APIs (such as `RobotService`) for interacting with UiPath Assistant. You may use `ApiService` to get access to Orchestrator. Do not import from `@uipath/agent.sdk`, as it exposes unstable APIs.

When creating widgets at runtime, UiPath Assistant, is looking for a `MainComponent` that is exported by a `MainModule` (for each widget). Make sure you add them to `projects\sample-widget\src\public-api.ts`. You may also expose metadata about the widget (such as title, description and icon for its tab in Assistant) via the functions or constants found in `projects\sample-widget\src\lib\widget-metadata.ts`.

To force a package into the final bundle, add it to the `bundledDependencies` array in `projects/sample-widget/package.json`. If you get the error `<module>, required by <widget> was not found` when the widget is loading, you probably forgot to do this.

You may want to use `WidgetAppState.language$` and `WidgetAppState.theme$` if you need to react to those changes.

### Localization

Starting with Assistant 21.4.x, i18n is supported via [ngx-translate](https://github.com/ngx-translate/core). `WidgetTranslationPipe` can be used to translate the keys found in `projects/sample-widge/src/lib/i18n`. The fallback language is `en`.

## Building a widget

1. Run `ng build --prod`
2. The output is `dist\sample-widget\bundles\sample-widget.umd.js` (or the minified version)
3. Rename the output file. Each unpacked widget is uniquely identified by the file name.

## Packing a widget

Assistant widgets can be bundled into nuget packges that can be published to nuget feeds and then installed into Assistant. To bundle a widget, simply build the widget, write the appropriate metadata to the `widget.nuspec` file and run `npm run pack`. If not running on Windows, you need a .NET compiler (such as [Mono](https://www.mono-project.com/download/stable/)) to run nuget.exe.

## Installing/updating a widget

Widgets can be installed locally by a simple drag and drop of the output (`sample-widget.umd.js`) onto the main window of a running UiPath Assistant. Widgets are saved to `%APPDATA%/UiPath/widgets`.


## Changelog

The changelog for `@uipath/widget.sdk` can be found [here](https://www.npmjs.com/package/@uipath/widget.sdk).

## License

You can use the contents of this repository/package subject to your license agreement with UiPath for the UiPath Platform.
