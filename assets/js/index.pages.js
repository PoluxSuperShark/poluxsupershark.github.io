// AOS initialized
AOS.init({
    duration: 1000,
    once: true
});



// Liste des alertes avec un titre et un message
const alerts = [
/*  001  */   { title: "ElSombre",        content: "Un pédophile du nom de ElSombre est recherché par la police de PoluxSuperShark. Il est accusé également de drague sur la reine du serveur" },
/*  002  */   { title: "Dollar Group",    content: "La fin de la guerre entre les groupes Discord et PoluxSuperShark ont été actés le 06/02/2024 à 18h17." },
/*  003  */   { title: "Omniscients",     content: "Omniscients est actuellement recherché par la police pour harcèlement sur Discord" },
/*  004  */   { title: "L'une 91",        content: "Le prochain réseau de transports s'ouvrira le 14/02/2027 à L'une 91 City, annonce PoluxSuperShark" },
/*  005  */   { title: "L'une 91",        content: "Elle annonce également faire un dépôt de plainte contre ElSombre en raison de harcèlement et d'atteinte à l'article 49.3.2" },
/*  006  */   { title: "15hx",            content: "La 15hx recherchée par la police en raisons de harcèlement et de menaces." },
/*  007  */   { title: "Sky",             content: "400 personnes inquiètes après avoir vu leur pseudo changer sur Discord" },
/*  008  */   { title: "Polux / L'une 91",content: "Le couple emménagera d'ici juin 2025 ensemble, a annoncé Polux." },
];

// Obtenir des éléments
const titleElement = document.getElementById("alert-title");
const contentElement = document.getElementById("alert-content");

// Changer une alerte
function changeAlert() {
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];

    titleElement.classList.add("fade");
    contentElement.classList.add("fade");

    setTimeout(() => {
        titleElement.textContent = randomAlert.title;
        contentElement.textContent = randomAlert.content;

        titleElement.classList.remove("fade");
        contentElement.classList.remove("fade");
    }, 500); // Temps de transition (doit être égal au CSS)
}

// Changer l'alerte toutes les 15s
// et charger une alerte au chargement de la page
setInterval(changeAlert, 15000);
changeAlert();