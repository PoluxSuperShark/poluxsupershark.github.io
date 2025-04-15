function openLinkTitanic() {
    const url = 'http://abtitanic.free.fr';
    const confirmation = confirm(
        'Vous allez quitter le site pour :\n' + url + '\nVoulez-vous continuer ?'
    );
    if (confirmation) {
        window.open(url, '_blank');
    }
}
