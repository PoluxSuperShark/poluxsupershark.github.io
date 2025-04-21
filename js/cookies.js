/*
 * Système de gestion des préférences cookies — JavaScript vanilla
 * Créé par PoluxSuperShark 🦈 et L'une 91 💙
 * Permet à l'utilisateur de choisir ses préférences (essentiels, performance, pubs)
 * Sauvegarde les choix dans un cookie JSON valable 1 an
 * Chargement conditionnel des scripts tiers
 * Multilingue : Français 🇫🇷 / Anglais 🇬🇧
 */

(function () {
    // Constantes de configuration
    const COOKIE_NAME = 'userCookiePreferences'; // Nom du cookie de préférences
    const POLICY_URL = 'http://poluxsupershark.github.io/pages/legal/privacy.html'; // Lien vers la politique de confidentialité
    const EXPIRATION_DAYS = 365; // Durée de validité du cookie en jours

    // Détecter la langue du navigateur
    const LANG = navigator.language.startsWith('fr') ? 'fr' : 'en';

    // Textes multilingues pour l’interface
    const TEXTS = {
        fr: {
            banner: "Ce site utilise des cookies. Vous pouvez accepter tout ou gérer vos préférences.",
            manage: "Gérer mes préférences",
            acceptAll: "Tout accepter",
            save: "Enregistrer mes choix",
            cancel: "Annuler",
            essential: "Cookies essentiels (obligatoires)",
            performance: "Cookies de performance",
            ads: "Cookies publicitaires",
            policy: "Lire la politique de confidentialité"
        },
        en: {
            banner: "This site uses cookies. You can accept all or manage your preferences.",
            manage: "Manage my preferences",
            acceptAll: "Accept all",
            save: "Save my choices",
            cancel: "Cancel",
            essential: "Essential cookies (required)",
            performance: "Performance cookies",
            ads: "Advertising cookies",
            policy: "View the privacy policy"
        }
    };

    /**
     * Vérifie si l'utilisateur a déjà défini ses préférences
     * @returns {boolean}
     */
    function hasPreferences() {
        return document.cookie.includes(`${COOKIE_NAME}=`);
    }

    /**
     * Sauvegarde les préférences dans un cookie JSON
     * @param {Object} prefs - Préférences de l'utilisateur
     */
    function savePreferences(prefs) {
        const expires = new Date();
        expires.setTime(expires.getTime() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(prefs))};path=/;expires=${expires.toUTCString()}`;
    }

    /**
     * Récupère les préférences depuis le cookie
     * @returns {Object|null}
     */
    function getPreferences() {
        const match = document.cookie.match(`${COOKIE_NAME}=([^;]+)`);
        return match ? JSON.parse(decodeURIComponent(match[1])) : null;
    }

    /**
     * Affiche la bannière en bas de l'écran
     */
    function showBanner() {
        const container = document.createElement('div');
        container.style.cssText = `
            position:fixed;bottom:0;left:0;width:100%;padding:10px;
            background:#222;color:#fff;text-align:center;z-index:9999;
        `;
        container.innerHTML = `
            <span>${TEXTS[LANG].banner}</span>
            <button id="acceptAll">${TEXTS[LANG].acceptAll}</button>
            <button id="managePrefs">${TEXTS[LANG].manage}</button>
            <a href="${POLICY_URL}" target="_blank" style="margin-left:8px;color:#ddd">${TEXTS[LANG].policy}</a>
        `;
        document.body.appendChild(container);

        // Si l'utilisateur clique sur "Tout accepter"
        document.getElementById('acceptAll').onclick = () => {
            savePreferences({ essential: true, performance: true, ads: true });
            container.remove();
        };

        // Si l'utilisateur veut gérer ses préférences
        document.getElementById('managePrefs').onclick = () => {
            container.remove();
            showModal();
        };
    }

    /**
     * Affiche une modale avec les cases à cocher
     */
    function showModal() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position:fixed;top:0;left:0;width:100%;height:100%;
            background:rgba(0,0,0,0.5);z-index:10000;display:flex;justify-content:center;align-items:center;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background:#fff;color:#000;padding:20px;max-width:400px;
            border-radius:5px;box-shadow:0 0 15px rgba(0,0,0,0.3);
        `;

        // HTML de la modale avec cases à cocher
        modal.innerHTML = `
            <h3>${TEXTS[LANG].manage}</h3>
            <label><input type="checkbox" checked disabled /> ${TEXTS[LANG].essential}</label><br>
            <label><input id="perf" type="checkbox" /> ${TEXTS[LANG].performance}</label><br>
            <label><input id="ads" type="checkbox" /> ${TEXTS[LANG].ads}</label><br><br>
            <button id="savePrefs">${TEXTS[LANG].save}</button>
            <button id="cancelPrefs">${TEXTS[LANG].cancel}</button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Sauvegarder les choix de l'utilisateur
        document.getElementById('savePrefs').onclick = () => {
            const prefs = {
                essential: true,
                performance: document.getElementById('perf').checked,
                ads: document.getElementById('ads').checked
            };
            savePreferences(prefs);
            overlay.remove();
        };

        // Annuler sans enregistrer
        document.getElementById('cancelPrefs').onclick = () => overlay.remove();
    }

    /**
     * Charge dynamiquement les scripts selon les préférences
     */
    function loadAllowedScripts() {
        const prefs = getPreferences();

        // Exemple : Google Analytics
        if (prefs?.performance) {
            const ga = document.createElement('script');
            ga.src = "https://www.googletagmanager.com/gtag/js?id=UA-XXXXX-Y";
            ga.async = true;
            document.head.appendChild(ga);
        }

        // Exemple : Script de publicité
        if (prefs?.ads) {
            const adScript = document.createElement('script');
            adScript.src = "https://ads.example.com/tracker.js";
            adScript.async = true;
            document.head.appendChild(adScript);
        }
    }

    /**
     * Initialisation du système au chargement de la page
     */
    document.addEventListener('DOMContentLoaded', () => {
        if (!hasPreferences()) {
            showBanner(); // Si aucune préférence, afficher la bannière
        } else {
            loadAllowedScripts(); // Sinon charger les scripts autorisés
        }
    });

})();
