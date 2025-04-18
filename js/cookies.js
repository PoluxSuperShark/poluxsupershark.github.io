/*
 Copyright 2014 Google Inc. All rights reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/


/**
 * Exécuter le code au chargement de la page
 */
(function (window) {   

    // Si le cookie n'est pas défini
    if (!!window.cookieChoices) {
        return window.cookieChoices;
    }

    var document = window.document; // Docs
    // ! IE8 ne supporte pas textContent, donc nous devons utiliser fallback pour innerText.
    var supportsTextContent = 'textContent' in document.body;

    var cookieChoices = (function () {

        // Information du cookie
        var cookieName = 'displayCookieConsent';
        var cookieConsentId = 'cookieChoiceInfo';
        var dismissLinkId = 'cookieChoiceDismiss';

        /**
         * Fonction pour créer la bannière
         * @param {*} cookieText 
         * @param {*} dismissText 
         * @param {*} linkText 
         * @param {*} linkHref 
         * @returns 
         */
        function _createHeaderElement(cookieText, dismissText, linkText, linkHref) {

            // Styles de la modale
            var butterBarStyles = 'position:fixed;width:100%;background-color:#CC0066;color:#FFFFFF;' +
                'font-size:12px; margin:0; left:0; bottom:0; padding:4px;z-index:1000;text-align:center;';

            // Elément de cookie
            var cookieConsentElement = document.createElement('div');
            cookieConsentElement.id = cookieConsentId;
            cookieConsentElement.style.cssText = butterBarStyles;
            cookieConsentElement.appendChild(_createConsentText(cookieText));

            // Liens dans la modale
            if (!!linkText && !!linkHref) {
                cookieConsentElement.appendChild(_createInformationLink(linkText, linkHref));
            }

            cookieConsentElement.appendChild(_createDismissLink(dismissText)); // Gestion d'ignorence de la modale
            
            return cookieConsentElement; // Retourner la bannière à l'utilisateur
        }

        /**
         * Fonction pour créer les contenus de la modale
         * @param {*} cookieText 
         * @param {*} dismissText 
         * @param {*} linkText 
         * @param {*} linkHref 
         * @returns 
         */
        function _createDialogElement(cookieText, dismissText, linkText, linkHref) {
            var glassStyle = 'position:fixed;width:100%;height:100%;z-index:999;' +
                'top:0;left:0;opacity:0.5;filter:alpha(opacity=50);' +
                'background-color:#ccc;';
            var dialogStyle = 'z-index:1000;position:fixed;left:50%;top:50%';
            var contentStyle = 'position:relative;left:-50%;margin-top:-25%;' +
                'background-color:#fff;padding:20px;box-shadow:4px 4px 25px #888;';

            // Element cookies
            var cookieConsentElement = document.createElement('div');
            cookieConsentElement.id = cookieConsentId;

            // Panel
            var glassPanel = document.createElement('div');
            glassPanel.style.cssText = glassStyle;

            // Créer le contenu
            var content = document.createElement('div');
            content.style.cssText = contentStyle;

            // Variable de la modale
            var dialog = document.createElement('div');
            dialog.style.cssText = dialogStyle;

            // Mise en page
            var dismissLink = _createDismissLink(dismissText);
            dismissLink.style.display = 'block';
            dismissLink.style.textAlign = 'right';
            dismissLink.style.marginTop = '8px';

            // Création de la modale
            content.appendChild(_createConsentText(cookieText));
            if (!!linkText && !!linkHref) {
                content.appendChild(_createInformationLink(linkText, linkHref));
            }
            content.appendChild(dismissLink);
            dialog.appendChild(content);
            cookieConsentElement.appendChild(glassPanel);
            cookieConsentElement.appendChild(dialog);
            return cookieConsentElement;
        }

        // Afficher le texte dans la modale
        function _setElementText(element, text) {
            if (supportsTextContent) {
                element.textContent = text;
            } else {
                element.innerText = text;
            }
        }

        // Texte de la modale
        function _createConsentText(cookieText) {
            var consentText = document.createElement('span');
            _setElementText(consentText, cookieText);
            return consentText;
        }

        /**
         * Ignorence des cookies
         * Liens d'information
         */

        // Créer un lien d'ignorence de cookies
        function _createDismissLink(dismissText) {
            var dismissLink = document.createElement('a');
            _setElementText(dismissLink, dismissText);
            dismissLink.id = dismissLinkId;
            dismissLink.href = '#';
            dismissLink.style.marginLeft = '8px';
            dismissLink.style.color = '#FFFFFF'; // Lien de l'info en blanc
            return dismissLink;
        }

        // Créer un lien d'information de cookies
        function _createInformationLink(linkText, linkHref) {
            var infoLink = document.createElement('a');
            _setElementText(infoLink, linkText);
            infoLink.href = linkHref;
            infoLink.target = '_blank'; // Vide
            infoLink.style.marginLeft = '8px';
            infoLink.style.color = '#FFFFFF'; // Lien de l'info en blanc
            return infoLink;
        }

        // Gestion des liens des cookies
        function _dismissLinkClick() {
            _saveUserPreference();
            _removeCookieConsent();
            return false; // Retourne faux une fois cliqué
        }

        /**
         * Montrer la modale
         * @param {*} cookieText 
         * @param {*} dismissText 
         * @param {*} linkText 
         * @param {*} linkHref 
         * @param {*} isDialog 
         */
        function _showCookieConsent(cookieText, dismissText, linkText, linkHref, isDialog) {
            if (_shouldDisplayConsent()) {
                _removeCookieConsent();
                var consentElement = (isDialog) ?
                    _createDialogElement(cookieText, dismissText, linkText, linkHref) :
                    _createHeaderElement(cookieText, dismissText, linkText, linkHref);
                var fragment = document.createDocumentFragment();
                fragment.appendChild(consentElement);
                document.body.appendChild(fragment.cloneNode(true));
                document.getElementById(dismissLinkId).onclick = _dismissLinkClick;
            }
        }

        // Montrer la barre des cookies
        function showCookieConsentBar(cookieText, dismissText, linkText, linkHref) {
            _showCookieConsent(cookieText, dismissText, linkText, linkHref, false);
        }

        // Montrer la modale des cookies
        function showCookieConsentDialog(cookieText, dismissText, linkText, linkHref) {
            _showCookieConsent(cookieText, dismissText, linkText, linkHref, true);
        }

        // Supprimer le consentement des cookies
        function _removeCookieConsent() {
            var cookieChoiceElement = document.getElementById(cookieConsentId);
            if (cookieChoiceElement != null) {
                cookieChoiceElement.parentNode.removeChild(cookieChoiceElement);
            }
        }

        // Sauvegarder les préférences pour 1 an
        function _saveUserPreference() {
            var expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            document.cookie = cookieName + '=y; path=/; expires=' + expiryDate.toGMTString();
            // NomCookie =y | Chemin=/ | Expiration=1year (GMT)
        }


        // Afficher l'en-tête si le cookie n'est pas crée
        function _shouldDisplayConsent() {
            return !document.cookie.match(new RegExp(cookieName + '=([^;]+)'));
        }

        // Exporter la fonction
        var exports = {};
        exports.showCookieConsentBar = showCookieConsentBar;
        exports.showCookieConsentDialog = showCookieConsentDialog;
        return exports;

    })();

    window.cookieChoices = cookieChoices;
    return cookieChoices; // Retourner le choix des cookies

    

})(this); // L'exécuter

// Afficher la bannière de cookies si l'utilisateur n'a pas encore donné son consentement
document.addEventListener('DOMContentLoaded', function () {
    
    // Lien de la politique vie privée
    const urlsite = 'http://poluxsupershark.github.io/pages/legal/privacy.html';

    /**
     * Messages en Français ou en anglais
     */
    const messages = {
        fr: {
            text: "Ce site utilise des cookies pour la collecte et le partage de données. En poursuivant votre navigation, vous acceptez l'utilisation des cookies.",
            dismiss: "Accepter et continuer",
            policy: "Politique de confidentialité"
        },
        en: {
            text: "This site uses cookies to collect and share data. By continuing to browse, you agree to the use of cookies.",
            dismiss: "Accept and continue",
            policy: "Privacy Policy"
        }
    };

    // Détection de la langue
    const lang = navigator.language.startsWith('fr') ? 'fr' : 'en';

    // Afficher la bannière en fonction de la langue
    cookieChoices.showCookieConsentBar(
        messages[lang].text,
        messages[lang].dismiss,
        messages[lang].policy,
        urlsite /**
            http://poluxsupershark.github.io/pages/legal/privacy.html
        */
    );

});
