/**
 * Copyright (c) 2014-2018, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 *
 * Basic sample plugin inserting footquote elements into the CKEditor editing area.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/ckeditor4/docs/#!/guide/plugin_sdk_sample_1
 */

// Register the plugin within the editor.
CKEDITOR.plugins.add( 'footquote', {

	// Register the icons.
	icons: 'footquote',
	// languages
	lang: 'en,fr',

	// The plugin initialization logic goes inside this method.
	init: function( editor ) {

		// Define an editor command that opens our dialog window.
		editor.addCommand( 'footquote', new CKEDITOR.dialogCommand( 'footquoteDialog', {

			// Allow the footquote tag with an optional title attribute.
			allowedContent: 'footquote[title,id]',

			// Require the footquote tag to be allowed for the feature to work.
			requiredContent: 'footquote',

			// Prefer footquote over acronym. Transform acronym elements into footquote elements.
			contentForms: [
				'footquote',
				'acronym'
			]
		} ) );

		// Create a toolbar button that executes the above command.
		editor.ui.addButton( 'Footquote', {

			// The text part of the button (if available) and the tooltip.
			label: editor.lang.footquote.insertFootquote,

			// The command to execute on click.
			command: 'footquote',

			// The button placement in the toolbar (toolbar group name).
			toolbar: 'insert'
		});

		if ( editor.contextMenu ) {

			// Add a context menu group with the Edit Footquote item.
			editor.addMenuGroup( 'footquoteGroup' );
			editor.addMenuItem( 'footquoteItem', {
				label: editor.lang.footquote.editFootquote,
				icon: this.path + 'icons/footquote.png',
				command: 'footquote',
				group: 'footquoteGroup'
			});

			editor.contextMenu.addListener( function( element ) {
				if ( element.getAscendant( 'footquote', true ) ) {
					return { footquoteItem: CKEDITOR.TRISTATE_OFF };
				}
			});
		}

		// Register our dialog file -- this.path is the plugin folder path.
		CKEDITOR.dialog.add( 'footquoteDialog', this.path + 'dialogs/footquote.js' );
	}
});
