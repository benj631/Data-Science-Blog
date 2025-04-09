function themeToggle() {
    document.addEventListener("DOMContentLoaded", () => {
        const button = document.getElementById("theme-toggle");
        const body = document.body;

        // Check system preference, default to dark mode if no preference
        const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches;
        const defaultTheme = isLightMode ? "light-mode" : "dark-mode";

        // Load saved theme or default to system preference
        const savedTheme = localStorage.getItem("theme") || defaultTheme;
        body.classList.remove("light-mode", "dark-mode");
        body.classList.add(savedTheme);
        updateButtonIcons(savedTheme);

        // Toggle theme on button click
        button.addEventListener("click", () => {
            const newTheme = body.classList.contains("light-mode") ? "dark-mode" : "light-mode";
            body.classList.remove("light-mode", "dark-mode");
            body.classList.add(newTheme);
            localStorage.setItem("theme", newTheme);
            updateButtonIcons(newTheme);
        });

        function updateButtonIcons(theme) {
            const sunIcon = document.getElementById("sun-icon");
            const moonIcon = document.getElementById("moon-icon");
            const scrollButton = document.getElementById("jump-to-top-button");

            if (theme === "light-mode") {
                sunIcon.style.display = "none";
                moonIcon.style.display = "block";

                if (scrollButton) {
                    scrollButton.style.backgroundImage = "url('assets/svg/up-arrow-black.svg')";
                }
            } else {
                sunIcon.style.display = "block";
                moonIcon.style.display = "none";

                if (scrollButton) {
                    scrollButton.style.backgroundImage = "url('assets/svg/up-arrow-white.svg')";
                }
            }
        }
    });
}

function tocToggle() {
    document.getElementById("toggle-toc").addEventListener("click", function () {
        const toc = document.getElementById("table-of-contents");
        const button = document.getElementById("toggle-toc");

        if (toc.style.display === "none" || toc.style.display === "") {
            toc.style.display = "block"; // Show TOC
            button.classList.remove("toc-closed");
            button.classList.add("toc-open");
        } else {
            toc.style.display = "none"; // Hide TOC
            button.classList.remove("toc-open");
            button.classList.add("toc-closed");
        }
    });
}

function tocShutOnSelectLink() {
    document.addEventListener("DOMContentLoaded", function () {
        const tocLinks = document.querySelectorAll("#table-of-contents a");
        const toc = document.getElementById("table-of-contents");
        const toggleButton = document.getElementById("toggle-toc");

        tocLinks.forEach((link) => {
            link.addEventListener("click", () => {
                toc.style.display = "none";
                toggleButton.classList.remove("toc-open");
                toggleButton.classList.add("toc-closed");
            });
        });
    });
}

function setScrollToTopButtonAppearOnScrollDown() {
    document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("jump-to-top-button");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
          button.style.display = "block";
        } else {
          button.style.display = "none";
        }
      });

      button.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
}

function main() {
    themeToggle();
    tocToggle();
    tocShutOnSelectLink();
    setScrollToTopButtonAppearOnScrollDown();
}

main();
