This repository can be used as a starting point for developing custom widgets for Agent Desktop using Angular 9.
The project is an Angular library that contains the implementation of a sample widget that interacts with UiPath processes and saves its configuration in a local file.

## Developing widgets

`@uipath/widget.sdk` exports reusable components and the APIs (such as `RobotService`) for interacting with Agent Desktop. Do not import from `@uipath/agent.sdk` as it exposes unstable APIs.

When creating widgets at runtime, Agent Desktop, is looking for a `MainComponent` in each widget bundle. Make sure you add it to `projects\sample-widget\src\public-api.ts`.

To force a package into the final bundle, add it to the `bundledDependencies` array in `projects/sample-widget/package.json`. If you get the error `<module>, required by <plugin> was not found` when the widget is loading, you probably forgot to do this.

You may want to use `WidgetAppState.language$` and `WidgetAppState.theme$` if you need to react to those changes.

## Building a widget

1. Run `npm i`
2. Run `ng build --prod`
3. The output is `dist\sample-widget\bundles\sample-widget.umd.js` (or the minified version)
4. Rename the output file. Each plugin is uniquely identified by the file name.

## Installing/updating a widget

1. Drag and drop the output onto the main window of a running Agent Desktop. Widgets are saved to `%APPDATA%/UiPath/widgets`. When updating styles, you may need to restart Agent Desktop.

## Debugging

1. Install the widget.
1. Start Agent desktop with the --debug flag.
2. Open dev tools with Ctrl+Shift+I.

## Disclaimer

You can use the contents of this repository/package subject to your license agreement with UiPath for the UiPath Platform.
