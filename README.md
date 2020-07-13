## Standard Notes Nimble Editor

A simple text editor for the [Standard Notes](https://standardnotes.org/) app, based off a clone of the [Indent Editor](https://github.com/MaxLap/standard-notes-indent-editor) (v1.4.3). — please see that project for a fuller description of the underlying editor. The Nimble editor adds the following:

- Colored headings (utilizing the `--sn-stylekit-info-color` from the current theme).
- a slight increase in lineheight for blank lines
- enumerated list entry continuation: when entering an enumerated list, upon hitting `enter`, the next line will preserve indentation level and auto-increment the list-item number. (note: moving, deleting, removing list items will **not** result in any kind of automatic re-numbering). This now includes integer numbered lists, or lists with single-letter designates.
- language names may follow the opening triple backticks of a code block.

You can try out the [editor demo](https://sn-nimble-editor.netlify.app/demo.html) in your browser.

### Installing in Standard Notes

In the Standard Notes app (web app or desktop), hit the "Extension" button (lower left), then hit the "Import Extension" button of the pop-up (lower right) and paste this link: https://listed.to/p/8qMJ0HifX7 into the input field and hit Enter.  Confirm the install, and close the extensions pop-up and the `SN Nimble Editor` should be available in the list of editors.

### Self hosting or dev

The repo is a [darcs](http://darcs.net/) repo, so you can clone it with darcs, or just download a zip of the repo from [sn-nimble-editor sources zip](https://hub.darcs.net/jandrew/sn-nimble-editor/dist). Instructions for installing, building and testing are the same as outlined at the [Indent Editor](https://github.com/MaxLap/standard-notes-indent-editor) site.