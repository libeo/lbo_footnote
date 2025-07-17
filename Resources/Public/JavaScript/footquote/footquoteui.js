import { Plugin, icons } from "@ckeditor/ckeditor5-core";
import { ButtonView, ContextualBalloon } from '@ckeditor/ckeditor5-ui';

import FormView from './footquoteview.js';
import getRangeText from './utils.js';
import initTranslations from "./lang/translations.js";

export default class FootquoteUI extends Plugin {
  static get requires() {
    return [ ContextualBalloon ];
  }

  init() {
    initTranslations();
    const editor = this.editor;
    const t = editor.locale.t

    // Create the balloon and the form view.
    this._balloon = this.editor.plugins.get( ContextualBalloon );
    this.formView = this._createFormView();

    editor.ui.componentFactory.add( 'footquote', () => {
      const button = new ButtonView();

      button.label = t( 'insertFootquote' );
      button.tooltip = true;
      button.withText = false;
      button.icon = icons.todoList

      // Show the UI on button click.
      this.listenTo( button, 'execute', () => {
        this._showUI();
      } );

      return button;
    } );
  }

  _createFormView() {
    const editor = this.editor;
    const formView = new FormView( editor.locale );

    // Execute the command after clicking the "Save" button.
    this.listenTo( formView, 'submit', () => {
      // Grab values from the footquote and title input fields.
      const value = {
        abbr: formView.abbrInputView.fieldView.element.value,
        title: formView.editor.getData()
      };
      editor.execute( 'addFootquote', value );

      // Hide the form view after submit.
      this._hideUI();
    } );

    // Hide the form view after clicking the "Cancel" button.
    this.listenTo( formView, 'cancel', () => {
      this._hideUI();
    } );

    formView.keystrokes.set( 'Esc', ( data, cancel ) => {
      this._hideUI();
      cancel();
    } );

    return formView;
  }

  _showUI() {
    const selection = this.editor.model.document.selection;

    // Check the value of the command.
    const commandValue = this.editor.commands.get( 'addFootquote' ).value;

    this._balloon.add( {
      view: this.formView,
      position: this._getBalloonPositionData()
    } );

    this.formView.editor
      ? this._setupUI()
      : this.formView._createRTE('editor-modal')
        .then((editor) => {
          this.formView.editor = editor
          this._setupUI()
        });
  }

  _setupUI() {
    const selection = this.editor.model.document.selection;

    // Check the value of the command.
    const commandValue = this.editor.commands.get( 'addFootquote' ).value;

    // Disable the input when the selection is not collapsed.
    this.formView.abbrInputView.isEnabled = selection.getFirstRange().isCollapsed;

    // Fill the form using the state (value) of the command.
    if ( commandValue ) {
      this.formView.abbrInputView.fieldView.value = commandValue.abbr;
      this.formView.editor.setData(commandValue.title);
    }
      // If the command has no value, put the currently selected text (not collapsed)
    // in the first field and empty the second in that case.
    else {
      const selectedText = getRangeText( selection.getFirstRange() );

      this.formView.abbrInputView.fieldView.value = selectedText;
      this.formView.editor.setData('');
    }

    this.formView.focus();
  }

  _hideUI() {
    // Clear the input field values and reset the form.
    this.formView.abbrInputView.fieldView.value = '';
    this.formView.editor.setData('');
    this.formView.element.reset();

    this._balloon.remove( this.formView );

    // Focus the editing view after inserting the footquote so the user can start typing the content
    // right away and keep the editor focused.
    this.editor.editing.view.focus();
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    let target = null;

    // Set a target position by converting view selection range to DOM
    target = () => view.domConverter.viewRangeToDom( viewDocument.selection.getFirstRange() );

    return {
      target
    };
  }
}
