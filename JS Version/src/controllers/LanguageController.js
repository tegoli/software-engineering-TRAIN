export class LanguageController {
    changeLanguage() { console.log('Cambio lingua'); }
    requestLanguage() { return 'ITA'; }
    selectLanguage(lang) { console.log(`Lingua selezionata: ${lang}`); }
    revertToOriginal(lang) { console.log(`Ripristino a ${lang}`); }
    updateLanguage(lang) { console.log(`Lingua aggiornata a ${lang}`); }
    savePreference(lang) { console.log(`Preferenza salvata: ${lang}`); }
    noData() { return false; }
    showErrorMessage(message) { console.error(message); }
}