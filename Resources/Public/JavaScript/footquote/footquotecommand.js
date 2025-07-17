import { Command } from '@ckeditor/ckeditor5-core';
import { findAttributeRange } from '@ckeditor/ckeditor5-typing';
import { toMap } from '@ckeditor/ckeditor5-utils';
import getRangeText from './utils.js';

export default class FootquoteCommand extends Command {
  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const firstRange = selection.getFirstRange();

    // When the selection is collapsed, the command has a value if the caret is in an footquote.
    if ( firstRange.isCollapsed ) {
      if ( selection.hasAttribute( 'footquote' ) ) {
        const attributeValue = selection.getAttribute( 'footquote' );

        // Find the entire range containing the footquote under the caret position.
        const footquoteRange = findAttributeRange( selection.getFirstPosition(), 'footquote', attributeValue, model );

        this.value = {
          abbr: getRangeText( footquoteRange ),
          title: attributeValue,
          range: footquoteRange
        };
      } else {
        this.value = null;
      }
    }
      // When the selection is not collapsed, the command has a value if the selection contains a subset of a single footquote
    // or an entire footquote.
    else {
      if ( selection.hasAttribute( 'footquote' ) ) {
        const attributeValue = selection.getAttribute( 'footquote' );

        // Find the entire range containing the footquote under the caret position.
        const footquoteRange = findAttributeRange( selection.getFirstPosition(), 'footquote', attributeValue, model );

        if ( footquoteRange.containsRange( firstRange, true ) ) {
          this.value = {
            abbr: getRangeText( firstRange ),
            title: attributeValue,
            range: firstRange
          };
        } else {
          this.value = null;
        }
      } else {
        this.value = null;
      }
    }

    // The command is enabled when the "footquote" attribute can be set on the current model selection.
    this.isEnabled = model.schema.checkAttributeInSelection( selection, 'footquote' );
  }

  execute( { abbr, title } ) {
    const model = this.editor.model;
    const selection = model.document.selection;

    model.change( writer => {
      // If selection is collapsed then update the selected footquote or insert a new one at the place of caret.
      if ( selection.isCollapsed ) {
        // When a collapsed selection is inside text with the "footquote" attribute, update its text and title.
        if ( this.value ) {
          const { end: positionAfter } = model.insertContent(
            writer.createText( abbr, { footquote: title } ),
            this.value.range
          );
          // Put the selection at the end of the inserted footquote.
          writer.setSelection( positionAfter );
        }
          // If the collapsed selection is not in an existing footquote, insert a text node with the "footquote" attribute
          // in place of the caret. Because the selection is collapsed, the attribute value will be used as a data for text.
        // If the footquote is empty, do not do anything.
        else if ( abbr !== '' ) {
          const firstPosition = selection.getFirstPosition();

          // Collect all attributes of the user selection (could be "bold", "italic", etc.)
          const attributes = toMap( selection.getAttributes() );

          // Put the new attribute to the map of attributes.
          attributes.set( 'footquote', title );

          // Inject the new text node with the footquote text with all selection attributes.
          const { end: positionAfter } = model.insertContent( writer.createText( abbr, attributes ), firstPosition );

          // Put the selection at the end of the inserted footquote. Using an end of a range returned from
          // insertContent() just in case nodes with the same attributes were merged.
          writer.setSelection( positionAfter );
        }

        // Remove the "footquote" attribute from the selection. It stops adding a new content into the footquote
        // if the user starts to type.
        writer.removeSelectionAttribute( 'footquote' );
      } else {
        // If the selection has non-collapsed ranges, change the attribute on nodes inside those ranges
        // omitting nodes where the "footquote" attribute is disallowed.
        const ranges = model.schema.getValidRanges( selection.getRanges(), 'footquote' );

        for ( const range of ranges ) {
          writer.setAttribute( 'footquote', title, range );
        }
      }
    } );
  }
}
