/**
 * Affiche une bannière de consentement aux cookies en bas de la page
 * avec possibilité d'accepter ou de refuser les cookies.
 * Multilingue (fr/en) selon la langue du navigateur.
 */
(function (window) {

    // Si déjà défini, on ne réexécute pas le script
    if (!!window.cookieChoices) return window.cookieChoices;

    var document = window.document;
    var supportsTextContent = 'textContent' in document.body;

    // Nom du cookie utilisé pour stocker le consentement
    var cookieName = 'displayCookieConsent';

    // ID HTML des éléments
    var cookieConsentId = 'cookieChoiceInfo';
    var dismissLinkId = 'cookieChoiceDismiss';
    var rejectLinkId = 'cookieChoiceReject';

    /**
     * Définir le texte d'un élément HTML, compatible anciens navigateurs
     * @param {HTMLElement} element 
     * @param {string} text 
     */
    function _setElementText(element, text) {
        if (supportsTextContent) {
            element.textContent = text;
        } else {
            element.innerText = text;
        }
    }

    /**
     * Créer le texte de consentement affiché
     * @param {string} cookieText 
     * @returns {HTMLElement}
     */
    function _createConsentText(cookieText) {
        var consentText = document.createElement('span');
        _setElementText(consentText, cookieText);
        return consentText;
    }

    /**
     * Créer un lien avec callback (accepter/refuser)
     * @param {string} id 
     * @param {string} text 
     * @param {string} color 
     * @param {function} callback 
     * @returns {HTMLElement}
     */
    function _createLink(id, text, color, callback) {
        var link = document.createElement('a');
        _setElementText(link, text);
        link.id = id;
        link.href = '#';
        link.style.marginLeft = '8px';
        link.style.color = color;
        link.style.cursor = 'pointer';
        link.onclick = function (e) {
            e.preventDefault();
            callback();
        };
        return link;
    }

    /**
     * Créer le lien vers la politique de confidentialité
     * @param {string} linkText 
     * @param {string} linkHref 
     * @returns {HTMLElement}
     */
    function _createInformationLink(linkText, linkHref) {
        var infoLink = document.createElement('a');
        _setElementText(infoLink, linkText);
        infoLink.href = linkHref;
        infoLink.target = '_blank';
        infoLink.style.marginLeft = '8px';
        infoLink.style.color = '#FFFFFF';
        return infoLink;
    }

    /**
     * Sauvegarder le choix de l'utilisateur dans un cookie valable 1 an
     * @param {string} value 'accepted' ou 'rejected'
     */
    function _saveUserPreference(value) {
        var expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = cookieName + '=' + value + '; path=/; expires=' + expiryDate.toGMTString();
    }

    /**
     * Vérifie si l'utilisateur a déjà donné son consentement
     * @returns {boolean}
     */
    function _shouldDisplayConsent() {
        return !document.cookie.match(new RegExp(cookieName + '=([^;]+)'));
    }

    /**
     * Supprimer la bannière de consentement
     */
    function _removeCookieConsent() {
        var element = document.getElementById(cookieConsentId);
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    /**
     * Afficher la bannière de consentement
     * @param {string} cookieText Texte principal
     * @param {string} acceptText Texte du bouton "Accepter"
     * @param {string} rejectText Texte du bouton "Refuser"
     * @param {string} linkText Texte du lien vers la politique
     * @param {string} linkHref URL du lien politique
     */
    function _showCookieConsent(cookieText, acceptText, rejectText, linkText, linkHref) {
        if (!_shouldDisplayConsent()) return;

        // Création de la bannière
        var consentElement = document.createElement('div');
        consentElement.id = cookieConsentId;
        consentElement.setAttribute('role', 'alert');
        consentElement.setAttribute('aria-live', 'assertive');
        consentElement.style.cssText = `
            position:fixed; bottom:0; left:0; width:100%; z-index:1000;
            background-color:#333; color:#fff; font-size:14px; padding:10px; text-align:center;
        `;

        // Texte de consentement
        consentElement.appendChild(_createConsentText(cookieText));

        // Lien vers la politique
        if (linkText && linkHref) {
            consentElement.appendChild(_createInformationLink(linkText, linkHref));
        }

        // Bouton "Accepter"
        var acceptLink = _createLink(dismissLinkId, acceptText, '#0f0', function () {
            _saveUserPreference('accepted');
            _removeCookieConsent();
        });

        // Bouton "Refuser"
        var rejectLink = _createLink(rejectLinkId, rejectText, '#f00', function () {
            _saveUserPreference('rejected');
            _removeCookieConsent();
        });

        // Ajout des boutons à la bannière
        consentElement.appendChild(acceptLink);
        consentElement.appendChild(rejectLink);

        // Insertion dans la page
        document.body.appendChild(consentElement);
    }

    /**
     * Fonction publique pour afficher la bannière cookie
     * @param {*} cookieText 
     * @param {*} acceptText 
     * @param {*} rejectText 
     * @param {*} linkText 
     * @param {*} linkHref 
     */
    function showCookieConsentBar(cookieText, acceptText, rejectText, linkText, linkHref) {
        _showCookieConsent(cookieText, acceptText, rejectText, linkText, linkHref);
    }

    // Export des fonctions dans window
    window.cookieChoices = {
        showCookieConsentBar: showCookieConsentBar
    };

})(this);

/**
 * Initialisation de la bannière au chargement de la page
 */
document.addEventListener('DOMContentLoaded', function () {

    // Lien vers la politique de confidentialité
    const urlsite = 'http://poluxsupershark.github.io/pages/legal/privacy.html';

    // Messages en fonction de la langue
    const messages = {
        fr: {
            text: "Ce site utilise des cookies pour la collecte et le partage de données. En poursuivant votre navigation, vous acceptez l'utilisation des cookies.",
            accept: "Accepter",
            reject: "Refuser",
            policy: "Politique de confidentialité"
        },
        en: {
            text: "This site uses cookies to collect and share data. By continuing to browse, you agree to the use of cookies.",
            accept: "Accept",
            reject: "Reject",
            policy: "Privacy Policy"
        }
    };

    // Détection de la langue du navigateur
    const lang = navigator.language.startsWith('fr') ? 'fr' : 'en';

    // Affichage de la bannière avec les textes traduits
    cookieChoices.showCookieConsentBar(
        messages[lang].text,
        messages[lang].accept,
        messages[lang].reject,
        messages[lang].policy,
        urlsite
    );
});
