import {ButtonView, View, FocusCycler, LabeledFieldView, createLabeledInputText, submitHandler} from "@ckeditor/ckeditor5-ui";
import {FocusTracker, KeystrokeHandler} from "@ckeditor/ckeditor5-utils";
import {ClassicEditor} from '@ckeditor/ckeditor5-editor-classic'
import {Link} from '@ckeditor/ckeditor5-link'
import {Paragraph} from '@ckeditor/ckeditor5-paragraph'

export default class FormView extends View {
  constructor( locale ) {
    super( locale );
    const t = locale.t

    this.focusTracker = new FocusTracker();
    this.keystrokes = new KeystrokeHandler();

    this.abbrInputView = this._createInput( t( 'footquote' ) );
    this.titleInputView = this._createRTEView( locale, t( 'footquoteDescription' ));

    this.saveButtonView = this._createButton( t( 'Save' ) );

    // Submit type of the button will trigger the submit event on entire form when clicked
    // (see submitHandler() in render() below).
    this.saveButtonView.type = 'submit';

    this.cancelButtonView = this._createButton( t( 'Cancel' ) );

    // Delegate ButtonView#execute to FormView#cancel.
    this.cancelButtonView.delegate( 'execute' ).to( this, 'cancel' );

    this.childViews = this.createCollection( [
      this.abbrInputView,
      this.titleInputView,
      this.saveButtonView,
      this.cancelButtonView
    ] );

    this._focusCycler = new FocusCycler( {
      focusables: this.childViews,
      focusTracker: this.focusTracker,
      keystrokeHandler: this.keystrokes,
      actions: {
        // Navigate form fields backwards using the Shift + Tab keystroke.
        focusPrevious: 'shift + tab',

        // Navigate form fields forwards using the Tab key.
        focusNext: 'tab'
      }
    } );

    this.setTemplate( {
      tag: 'form',
      attributes: {
        class: [ 'ck', 'ck-footquote-form' ],
        style: 'padding:20px;'
      },
      children: this.childViews
    } );
  }

  render() {
    super.render();

    submitHandler( {
      view: this
    } );

    this.childViews._items.forEach( view => {
      // Register the view in the focus tracker.
      this.focusTracker.add( view.element );
    } );

    // Start listening for the keystrokes coming from #element.
    this.keystrokes.listenTo( this.element );
  }

  destroy() {
    super.destroy();

    this.focusTracker.destroy();
    this.keystrokes.destroy();
  }

  focus() {
    // If the footquote text field is enabled, focus it straight away to allow the user to type.
    if ( this.abbrInputView.isEnabled ) {
      this.abbrInputView.focus();
    }
    // Focus the footquote title field if the former is disabled.
    else {
      this.editor.focus();
    }
  }

  _createInput( label ) {
    const labeledInput = new LabeledFieldView( this.locale, createLabeledInputText );

    labeledInput.label = label;

    return labeledInput;
  }

  _createRTEView( locale, label ) {
    const view = new View(locale);
    view.setTemplate({
      tag: 'div',
      children: [
        {
          tag: 'label',
          children: [
            {
              text: label
            },
          ],
        },
        {
          tag: 'div',
          attributes: {
            id: 'editor-modal',
          }
        }
      ]
    })

    return view;
  }

  _createRTE( elementId ) {
    return ClassicEditor.create(document.querySelector(`#${elementId}`), {
      licenseKey: 'GPL',
      plugins: [Link, Paragraph],
      toolbar: ['link']
    })
      .catch(error => {
        console.error(error.stack);
      })
  }

  _createButton( label ) {
    const button = new ButtonView();

    button.set({
      label,
      tooltip: true,
      withText: true
    } );

    return button;
  }
}
