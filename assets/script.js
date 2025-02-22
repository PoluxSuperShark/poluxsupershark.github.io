// Fonction pour obtenir l'âge de Reiko en fonction de l'année actuelle
function getAge() {
    const birthYear = 2006; // L'une 91 est née en 2006
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}

// Vérifier si c'est le 14 février
const today = new Date();
if (today.getMonth() === 1 && today.getDate() === 14) {  // Mois 1 = février (en JS, janvier est 0)
    const age = getAge();  // L'âge de L'une 91 cette année
    for (let i = 1; i <= age; i++) {
        console.log(`${i}. Joyeux anniversaire L'une 91 ! Je t'aime fort !`);
    }
}
