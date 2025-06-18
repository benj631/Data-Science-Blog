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

function dedentCodeBlocks() {
    document.querySelectorAll('code.block > script[type="text/plain"]').forEach((script) => {
        const code = script.parentElement;
        const raw = script.textContent;
        const lines = raw.split("\n");

        // Remove leading/trailing empty lines
        while (lines[0]?.trim() === "") lines.shift();
        while (lines[lines.length - 1]?.trim() === "") lines.pop();

        // Find smallest indent across non-empty lines
        const indentLengths = lines.filter((line) => line.trim() !== "").map((line) => line.match(/^[\t ]*/)[0].length);
        const minIndent = Math.min(...indentLengths);

        // Remove the common indent from each line
        const cleaned = lines.map((line) => line.slice(minIndent)).join("\n");

        script.remove();
        code.textContent = cleaned;
    });
}

function injectLineNumbers() {
    document.querySelectorAll("pre.code code.block").forEach((code) => {
        const pre = code.closest("pre.code");
        if (!pre) return;

        // Store original code if not already saved
        if (!pre.dataset.rawCode) {
            pre.dataset.rawCode = code.textContent.trimEnd();
        }

        // Inject line numbers
        const lines = pre.dataset.rawCode.split("\n");
        code.innerHTML = lines
            .map((line, i) => `<span class="code-line"><span class="line-number">${i + 1}.</span> ${line}</span>`)
            .join("\n");
    });
}

function setupCodeClipboard() {
    document.querySelectorAll("pre.code").forEach((pre) => {
        const button = pre.querySelector(".copy-button");
        const raw = pre.dataset.rawCode;

        if (!button || !raw) return;

        const originalContent = button.innerHTML;

        // Block focus *before* it happens (more reliable than blur)
        button.addEventListener("pointerdown", (e) => e.preventDefault());

        button.addEventListener("click", () => {
            navigator.clipboard.writeText(raw).then(() => {
                button.innerText = "Copied!";
                setTimeout(() => {
                    button.innerHTML = originalContent;
                }, 3000);
            });
        });
    });
}

/* Really does nothing. */
function preventAutoScrollOnClick() {
    button.addEventListener("click", () => {
        // Prevent scroll from focus
        button.blur();

        navigator.clipboard.writeText(raw).then(() => {
            const originalContent = button.innerHTML;
            button.textContent = "Copied!";
            button.classList.add("copied");

            setTimeout(() => {
                button.innerHTML = originalContent;
                button.classList.remove("copied");
            }, 3000);
        });
    });
}

function main() {
    themeToggle();
    tocToggle();
    tocShutOnSelectLink();
    dedentCodeBlocks();

    injectLineNumbers();
    setupCodeClipboard();

    setScrollToTopButtonAppearOnScrollDown();

    preventAutoScrollOnClick();
    setupCodeToggles();
}

main();
