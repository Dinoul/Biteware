document.addEventListener("DOMContentLoaded", () => {
    const entryScreen = document.getElementById("entry-screen");
    const bgAudio = document.getElementById("bg-audio");
    const verifyBtn = document.getElementById("verify-btn");
    const discordInput = document.getElementById("discord-id-input");

    // Click anywhere on entry screen to hide it
    if (entryScreen) {
        entryScreen.addEventListener("click", () => {
            entryScreen.style.opacity = "0";
            setTimeout(() => {
                entryScreen.style.display = "none";
            }, 500);

            if (bgAudio) {
                bgAudio.play().catch(() => {
                    console.log("Audio autoplay restricted by browser.");
                });
            }
        });
    }

    // Discord ID Verification Handler
    if (verifyBtn && discordInput) {
        verifyBtn.addEventListener("click", () => {
            const discordId = discordInput.value.trim();
            if (!discordId) {
                alert("Please enter a valid Discord ID.");
                return;
            }
            
            // Example fetching profile avatar or info via Discord ID API
            document.getElementById("preview-username").textContent = `User (${discordId})`;
            alert("Discord ID submitted for verification!");
        });
    }
});
