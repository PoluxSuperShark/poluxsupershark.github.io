if ("Notification" in window) {
    if (Notification.permission === "granted") {
        console.log("Notifications are allowed.");
        setInterval(notifyTime, 3600000); // Notify every hour
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Permission granted!");
                setInterval(notifyTime, 3600000); // Notify every hour
            }
        });
    }
}

function showNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, {
            body: body,
            icon: "https://poluxsupershark.github.io/assets/favicon.png",
        });
    }
}

function notifyTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

    showNotification("Current Time", `It's ${timeString}`);
}
