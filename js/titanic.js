/**
 * Fonction pour ouvrir l'URL du site de
 * http://abtitanic.free.fr
 * Fichier depuis : poluxsupershark.github.io/pages/about/titanic.html
 */
function openLinkTitanic() {
    // Définir l'URL dans une variable
    const url = 'http://abtitanic.free.fr';
    // Alerter l'utilisateur qu'il quitte le site
    const confirmation = confirm(
        'Vous allez quitter le site pour :\n' + url + '\nVoulez-vous continuer ?'
    );
    // Si le prompt a été confirmé
    if (confirmation) {
        window.open(url, '_blank');
    }
}
