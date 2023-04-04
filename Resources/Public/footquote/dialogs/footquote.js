// Our dialog definition.
CKEDITOR.dialog.add( 'footquoteDialog', function( editor ) {

	var lang = editor.lang.footquote
	return {

		// Basic properties of the dialog window: title, minimum size.
		title: lang.dialogTitle,
		minWidth: 400,
		minHeight: 200,

		// Dialog window content definition.
		contents: [
			{
				// Definition of the Basic Settings dialog tab (page).
				id: 'tab-basic',
				label: lang.dialogTitle,

				// The tab content.
				elements: [
					{
						// Text input field for the footquote text.
						type: 'text',
						id: 'footquote',
						label: lang.footquote,

						// Called by the main setupContent method call on dialog initialization.
						setup: function( element ) {
							content = element.getText();
							if (content === 'note') {
								content = '';
							}
							this.setValue( content );
						},

						// Called by the main commitContent method call on dialog confirmation.
						commit: function( element ) {
							content = this.getValue();
							if ((!content || content.length === 0 )) {
								content = 'note';
							}
							element.setText(content);
						}
					},
					{
						// Text input field for the footquote content (explanation).
						type: 'textarea',
						onShow : ckeditorAddToTextarea,
						id: 'content',
						label: lang.footquoteDescription,

						// Require the content attribute to be enabled.
						requiredContent: 'footquote[content]',
						validate: notEmptyValidator(lang.explanationCannotBeEmpty),

						// Called by the main setupContent method call on dialog initialization.
						setup: function( element ) {
							content = element.getAttribute( "content" ).replace(/<br\s*[\/]?>/gi, '\n');
							this.setValue(content);
						},

						// Called by the main commitContent method call on dialog confirmation.
						commit: function( element ) {
							var instance = getInstanceTextarea();
							if(instance){
								content = CKEDITOR.instances[instance].getData().replace(/[\n\r]/g, '<br>').replace(/"/g, "'").replace(/<p>/g, "").replace(/<\/p>/g, "");
							}
							element.setAttribute( "content", content);
						}
					}
				]
			}


		],

		// Invoked when the dialog is loaded.
		onShow: function() {

			// Get the selection from the editor.
			var selection = editor.getSelection();

			// Get the element at the start of the selection.
			var element = selection.getStartElement();

			// Get the <footquote> element closest to the selection, if it exists.
			if ( element )
				element = element.getAscendant( 'footquote', true );

			// Create a new <footquote> element if it does not exist.
			if ( !element || element.getName() !== 'footquote' ) {
				element = editor.document.createElement( 'footquote' );

				// Flag the insertion mode for later use.
				this.insertMode = true;
			}
			else
				this.insertMode = false;

			// Store the reference to the <footquote> element in an internal property, for later use.
			this.element = element;

			// Invoke the setup methods of all dialog window elements, so they can load the element attributes.
			if ( !this.insertMode )
				this.setupContent( this.element );
		},

		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function() {

			// The context of this function is the dialog object itself.
			// http://docs.ckeditor.com/ckeditor4/docs/#!/api/CKEDITOR.dialog
			var dialog = this;

			// Create a new <footquote> element.
			var footquote = this.element;

			// Invoke the commit methods of all dialog window elements, so the <footquote> element gets modified.
			this.commitContent( footquote );

			// Finally, if in insert mode, insert the element into the editor at the caret position.
			if ( this.insertMode )
				editor.insertElement( footquote );
		}
	};

	// Add CKEditor on textarea "Description"
	function ckeditorAddToTextarea() {
		var textareaDialog = $(".cke_dialog_body").find("textarea").attr("id");
		var instance = getInstanceTextarea();

		// Destroy the instance if it exists
		if(instance){
			CKEDITOR.instances[instance].destroy(true);
		}

		// Recreate instance
		CKEDITOR.replace(textareaDialog, {
			toolbarGroups: [
				{ name: 'links', groups: [ 'links' ] }
			],
			stylesSet: [],
			extraPlugins : 'typo3link',
			height: '100px',
			width: '396px',
			removeButtons :'Anchor'
		});

		// Get the new instance name and use Browserlink
		instance = getInstanceTextarea();
		CKEDITOR.instances[instance].config.typo3link = editor.config.typo3link;}
});



// Custom validation on CKEditor textarea
function notEmptyValidator(msg) {
	return function () {
		var content = "";
		var instance = getInstanceTextarea();
		if(instance){
			content = CKEDITOR.instances[instance].getData();
		}
		if( !content ){
			return msg;
		}
	};
}

// Get ID of the textarea instances
function getInstanceTextarea(){
	var textareaDialog = $(".cke_dialog_body").find("textarea").attr("id");
	var instance = "";
	for(var i in CKEDITOR.instances) {
		if(CKEDITOR.instances[i].name == textareaDialog){
			instance = i;
		}
	}
	return instance;
}
