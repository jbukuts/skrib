# Welcome to Skrib (W.I.P)

Skrib is a web-based editor/previewer built specifically for Markdown.

There are many Markdown editors available currently and my main goal with this one is to allow for better user customization to make the writing experience more enjoyable. I want you to be able to customize settings based on not only the editor but also how the preview is displayed.

It is also installable as a PWA so you can also write offline if needed.

## File management

All files in Skrib are stored locally using the Origin Private File System ([OPFS](https://google.com)) and thus are real files store on your disk. They, however, are still subject to being lost if you clear all browsing data so do be careful.

Files **_do autosave_** while you're writing as well. No need to manually save when working on a document.

The file management logic is handled via a custom React hook I wrote. If you're interested in verifying the source code yourself it is accessible [here]().

## Technologies used

Skrib is built on top of these existing projects:

- React
- CodeMirror
- marked.js
- zustand

## Planned features

There's a lot I'd like to do with this project. Some features that are in the pipeline include:

- Syncing to GitHub Gists
- Executing code blocks in preview mode (for Python and JavaScript)
- Local file system access
- Custom user themes
- User-defined keybindings
- User-defined linting rules
- Possible user imported fonts

Be sure to star the repo and watch for future releases.

If there's a feature you're looking for that's not listed above feel free to open an issue in the repository and tag it as a `suggestion`.

## Found a bug?

Skrib is still in active development and thus bugs are prone to be found. Be mindful of this while using the application currently and if you encounter any feel free to open an issue in the [repo](https://github.com/jbukuts/skrib)

## Last thoughts

If you enjoy using Skrib and feel so inclined. It would be much appreciated. Though this editor was written I hope you find some utility. 

That's all. Enjoy writing!