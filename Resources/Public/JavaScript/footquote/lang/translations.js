export default function initTranslations() {
    // Make sure that the global object is defined. If not, define it.
    window.CKEDITOR_TRANSLATIONS = window.CKEDITOR_TRANSLATIONS || {};

    // Make sure that the dictionary for french translations exist.
    window.CKEDITOR_TRANSLATIONS[ 'fr' ] = window.CKEDITOR_TRANSLATIONS[ 'fr' ] || {};
    window.CKEDITOR_TRANSLATIONS[ 'fr' ].dictionary =  window.CKEDITOR_TRANSLATIONS[ 'fr' ].dictionary || {};

    // Make sure that the dictionary for english translations exist.
    window.CKEDITOR_TRANSLATIONS[ 'en' ] = window.CKEDITOR_TRANSLATIONS[ 'en' ] || {};
    window.CKEDITOR_TRANSLATIONS[ 'en' ].dictionary =  window.CKEDITOR_TRANSLATIONS[ 'en' ].dictionary || {};

    // Extend the dictionary for french translations with your translations:
    Object.assign( window.CKEDITOR_TRANSLATIONS[ 'fr' ].dictionary, {
        'insertFootquote': 'Insérer une note de bas de page',
        'footquote': 'Note de bas de page',
        'footquoteDescription': 'Description',
        'explanationCannotBeEmpty': 'Le champ « Description » ne peut rester vide.',
        'dialogTitle': 'Note de bas de page',
        'editFootquote': 'Modifier la note de bas de page',
        'Save': 'Sauvegarder',
        'Cancel': 'Annuler',
        'Link': 'Lien'
    } );

    // Extend the dictionary for english translations with your translations:
    Object.assign( window.CKEDITOR_TRANSLATIONS[ 'en' ].dictionary, {
        'insertFootquote': 'Insert footquote',
        'footquote': 'Footquote',
        'footquoteDescription': 'Description',
        'explanationCannotBeEmpty': 'Description cannot be empty',
        'dialogTitle': 'Footquote',
        'editFootquote': 'Edit footquote',
    } );
}
