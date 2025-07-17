import { Plugin } from "@ckeditor/ckeditor5-core";
import FootquoteCommand from './footquotecommand.js';

export default class FootquoteEditing extends Plugin {
  init() {
    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add(
      'addFootquote', new FootquoteCommand( this.editor )
    );
  }
  _defineSchema() {
    const schema = this.editor.model.schema;

    // Extend the text node's schema to accept the footquote attribute.
    schema.extend( '$text', {
      allowAttributes: [ 'footquote' ]
    } );
  }
  _defineConverters() {
    const conversion = this.editor.conversion;

    // Conversion from a model attribute to a view element
    conversion.for( 'downcast' ).attributeToElement( {
      model: 'footquote',

      // Callback function provides access to the model attribute value
      // and the DowncastWriter
      view: ( modelAttributeValue, conversionApi ) => {
        const { writer } = conversionApi;
        return writer.createAttributeElement( 'footquote', {
          content: modelAttributeValue
        } );
      }
    } );

    // Conversion from a view element to a model attribute
    conversion.for( 'upcast' ).elementToAttribute( {
      view: {
        name: 'footquote',
        attributes: [ 'content' ]
      },
      model: {
        key: 'footquote',

        // Callback function provides access to the view element
        value: viewElement => {
          const title = viewElement.getAttribute( 'content' );
          return title;
        }
      }
    } );
  }
}
