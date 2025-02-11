if ("Notification" in window) {
    if (Notification.permission === "granted") {
        afficherNotification("Bienvenu", "Tu peux commencer à explorer les notifications !");
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                afficherNotification("Bienvenu", "Explore mon site Web");
            }
        });
    }
}

function afficherNotification(titre, corps) {
    if (Notification.permission === "granted") {
        const notification = new Notification(titre, {
            body: corps,
            icon: "/favicon.png",
        });

        notification.onclick = function () {
            window.open("https://poluxsupershark.github.io");
        };
    }
}
