document.addEventListener("DOMContentLoaded", function(event) {

  var componentManager;
  var workingNote, clientData;
  var lastValue, lastUUID;
  var editor;
  var ignoreTextChange = false;
  var initialLoad = true;
  var cachedTextWidths = {};

  function loadComponentManager() {
    var permissions = [{name: "stream-context-item"}]
    componentManager = new ComponentManager(permissions, function(){
      // on ready
      var platform = componentManager.platform;
      if (platform) {
        document.body.classList.add(platform);
      }

      // only use CodeMirror selection color if we're not on mobile.
      editor.setOption("styleSelectedText", !componentManager.isMobile);
    });

    componentManager.streamContextItem((note) => {
      onReceivedNote(note);
    });
  }

  function save() {
    if(workingNote) {
      // Be sure to capture this object as a variable, as this.note may be reassigned in `streamContextItem`, so by the time
      // you modify it in the presave block, it may not be the same object anymore, so the presave values will not be applied to
      // the right object, and it will save incorrectly.
      let note = workingNote;

      componentManager.saveItemWithPresave(note, () => {
        lastValue = editor.getValue();
        note.content.text = lastValue;
        note.clientData = clientData;

        // clear previews
        note.content.preview_plain = null;
        note.content.preview_html = null;
      });
    }
  }

  function onReceivedNote(note) {
    if(note.uuid !== lastUUID) {
      // Note changed, reset last values
      lastValue = null;
      initialLoad = true;
      lastUUID = note.uuid;
    }

    workingNote = note;

    // Only update UI on non-metadata updates.
    if(note.isMetadataUpdate) {
      return;
    }

    clientData = note.clientData;

    if(editor) {
      if(note.content.text !== lastValue) {
        ignoreTextChange = true;
        editor.getDoc().setValue(workingNote.content.text);
        ignoreTextChange = false;
      }

      if(initialLoad) {
        initialLoad = false;
        editor.getDoc().clearHistory();
      }
    }
  }

  function cacheTextWidth(string) {
    if (string.length == 0) {
      return 0;
    }

    if (cachedTextWidths.hasOwnProperty(string)) {
      return cachedTextWidths[string] || 0;
    }

    var anchor = document.createElement('span');
    anchor.appendChild(document.createTextNode(string));

    var pre = document.createElement('pre');
    pre.className = "CodeMirror-line-like";
    pre.appendChild(anchor);

    var measure = editor.display.measure;
    for (let count = measure.childNodes.length; count > 0; --count)
        measure.removeChild(measure.firstChild);

    measure.appendChild(pre);

    var rect = anchor.getBoundingClientRect();
    var width = (rect.right - rect.left);
    cachedTextWidths[string] = width;
    return width || 0;
  }

  function loadEditor() {
    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
      mode: "indent_text",
      lineWrapping: true,
      extraKeys: {"Alt-F": "findPersistent"}
    });
    editor.setSize("100%", "100%");

    editor.on("change", function(){
      if(ignoreTextChange) {return;}
      save();
    });

    var basePadding = 4;
    editor.on("renderLine", function(cm, line, elt) {
      // Show continued list/qoute lines aligned to start of text rather
      // than first non-space char.
      var leadingSpaceListBulletsQuotes = /^[*+->\s]*/;
      var leading = (leadingSpaceListBulletsQuotes.exec(line.text) || [""])[0];
      var off = cacheTextWidth(leading);

      elt.style.textIndent = "-" + off + "px";
      elt.style.paddingLeft = (basePadding + off) + "px";
    });
    editor.refresh();
  }

  loadEditor();
  loadComponentManager();
});
