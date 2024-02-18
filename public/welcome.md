# Welcome

Skrib is a web-based editor/previewer built specifically for Markdown.

There are many Markdown editors available currently and my main goal with this one is to allow for better user customization to make the writing experience more enjoyable. I want you to be able to customize settings based on not only the editor but also how the preview is displayed.

It is also installable as a PWA so you can also write offline if needed.

## File management

All files in Skrib are stored locally using the Origin Private File System ([OPFS](https://google.com)) and thus are real files stored on the disk. Unlike normal files on your computer they aren't directly accessible via the file explorer but rather allocated via the File System API of the browser. Because of this they are still subject to being lost if you clear all browsing data so do be careful.

Files **_will_ autosave** while you're writing as well. No need to manually save when working on a document.

The file management logic is handled via a custom React hook I wrote. If you're interested in verifying the source code yourself it is accessible [here]().

### Naming conventions

The OPFS does not allow for files and folders at the same directory level to be named the same. Though I am not sure of the exact reasoning for this my assumption is that since the `removeEntry` function for `FileSystemDirectoryHandle` objects acts on both folders and files this creates an issue where it can't create a distinction between the two.

To circumvent this I simply append every file created/renamed with `.md` under the hood. I also opted to disallow file/folder names to contain anything but alphanumeric characters, a hyphen, or an underscore.

_TL;DR Files will be appended with `.md` always, you can only name files/folders with alphanumeric characters, a hyphen, or an underscore_

### Renaming files/folders

Currently the OPFS has no support for renaming files or folders natively. There is a [current proposal]() to implement the feature, however, as of now (Feb 2024) it has yet to be added. In spite of this I have gerryrigged the ability to rename files by:

- Getting the original file text
- Creating a new file at the specified path
- Writing the original text to the new file
- Deleting the original file

> Note: If any of these actions fail. The final action will not occur to ensure you lose no data

This is all fine and dandy for singular files. But applying the same approach to folders creates a serious problem as this would require the movement of all a folder's children into a new folder. Which would require recursively parsing the original folder and moving files individually and rebuilding the structure. Because this approach seemed prone to accidents and slow I've opted to implement it behind a user setting.

One day, I hope that OPFS has a native and safer solution, but for the time being the option is there and the deletion of your data won't occur unless the copying action itself succeeds first.

Theoretically I could overcomplicate the design by having all files at the root level and instead pretend there are real folders with some weird custom logic. But that creates it's own jank that isn't really maintainable and could lead to insane file name lengths (which might have a limited length) depending on your folder structure.

I'd much rather hold out hope for improvement to the OPFS to be made and have the UI of the application mirror the real state of the file system.

_TL;DR Files **are** renamable, Folders **probably should not be** but the option is there for completeness_

## User settings

User settings are maintained between sessions via the the `localStorage` API.

## Technologies used

Skrib is built on top of these existing projects:

- `codemirror` - code editor
- `unified` - preview generation
  - with `remark` and `rehype` - customizability of ouput
- `zustand` - global state managment
- `@mui/base` - UI elements
- `react-contexify` - context menus
- `usehooks` - hooks I didn't want to write
- `fontsource` - fonts

...and various [others](https://github.com/jbukuts/skrib/blob/main/package.json)

## Planned features

There's a lot I'd like to do with this project. Some features that are in the pipeline include:

- Syncing to GitHub Gists
- Executing code blocks in preview mode (for Python and JavaScript)
- Local file system access
- Custom user themes
- Best practice linting
- Possible user imported fonts

Be sure to star the repo and watch for future releases.

If there's a feature you're looking for that's not listed above feel free to open an [issue](https://github.com/jbukuts/skrib/issues) in the repository and tag it as a `suggestion`.

## Found a bug?

Skrib is still in active development and thus bugs are prone to be found. Be mindful of this while using the application currently and if you encounter any feel free to open an issue in the [repo](https://github.com/jbukuts/skrib/issues) and tag it as a `user bug`.
