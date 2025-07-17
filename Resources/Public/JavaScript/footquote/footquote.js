import { Plugin } from "@ckeditor/ckeditor5-core";
import FootquoteEditing from './footquoteediting.js';
import FootquoteUI from './footquoteui.js';

export class Footquote extends Plugin {
  static get requires() {
    return [ FootquoteEditing, FootquoteUI ];
  }
}
