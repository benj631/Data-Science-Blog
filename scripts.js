// scripts.js - 2025

function setupScrollFadeGradient(selector = ".gradient") {
    const gradient = document.querySelector(selector);
    if (!gradient) return;

    function updateOpacity() {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        gradient.style.opacity = 1 - 35 * scrollPercent; // fade out as you scroll down
    }

    window.addEventListener("scroll", updateOpacity);
    updateOpacity(); // initialize on load
}

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

function initializeTabs() {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.tab;

            // Remove active classes from all buttons and content
            tabButtons.forEach((btn) => btn.classList.remove("tab-button-active"));
            tabContents.forEach((content) => content.classList.remove("tab-content-active"));

            // Activate clicked button and corresponding content
            button.classList.add("tab-button-active");
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.classList.add("tab-content-active");
        });
    });
}

function setupCopyButtons() {
    document.querySelectorAll("pre.code").forEach((pre) => {
        const button = pre.querySelector(".copy-button");
        const code = pre.querySelector("code.block");

        if (!button || !code) return;

        // Store raw code text
        if (!pre.dataset.rawCode) pre.dataset.rawCode = code.textContent.trimEnd();

        const raw = pre.dataset.rawCode;
        const originalContent = button.innerHTML;

        // Prevent focus on mouse down
        button.addEventListener("pointerdown", (e) => e.preventDefault());

        button.addEventListener("click", () => {
            // Copy code to clipboard
            navigator.clipboard.writeText(raw).then(() => {
                button.innerText = "Copied!";
                setTimeout(() => (button.innerHTML = originalContent), 3000);
            });

            // Remove focus immediately to prevent scrolling
            button.blur();
        });
    });
}

function enableImageViewer() {
    document.querySelectorAll("img.viewable").forEach((img) => {
        img.style.cursor = "zoom-in";

        img.addEventListener("click", () => {
            // Find caption
            let captionText = "";
            const figure = img.closest("figure");
            if (figure) {
                const figcap = figure.querySelector("figcaption");
                if (figcap) captionText = figcap.textContent.trim();
            }
            if (!captionText) captionText = img.getAttribute("data-caption") || img.alt || "";

            // Overlay
            const overlay = document.createElement("div");
            overlay.id = "image-viewer-overlay";

            // Viewer container
            const viewer = document.createElement("div");
            viewer.id = "image-viewer";

            // Large image
            const largeImg = document.createElement("img");
            largeImg.src = img.src;
            largeImg.id = "image-viewer-img";

            // Caption
            if (captionText) {
                const caption = document.createElement("div");
                caption.id = "image-caption";
                caption.textContent = captionText;
                viewer.appendChild(caption);
            }

            viewer.appendChild(largeImg);
            overlay.appendChild(viewer);
            document.body.appendChild(overlay);

            // Scroll-to-zoom (zoom toward cursor)
            let scale = 1;
            let translateX = 0;
            let translateY = 0;

            largeImg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            let isDragging = false;
            let lastX, lastY;

            viewer.addEventListener("wheel", (e) => {
                e.preventDefault();

                const rect = largeImg.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                const percentX = (offsetX / rect.width) * 100;
                const percentY = (offsetY / rect.height) * 100;

                largeImg.style.transformOrigin = `${percentX}% ${percentY}%`;

                const delta = e.deltaY < 0 ? 1.1 : 0.9;
                scale = Math.min(Math.max(0.5, scale * delta), 5);

                largeImg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            });

            // Drag-to-pan
            largeImg.addEventListener("mousedown", (e) => {
                if (scale <= 1) return;
                isDragging = true;
                lastX = e.clientX;
                lastY = e.clientY;
                largeImg.style.cursor = "grabbing";
            });

            window.addEventListener("mousemove", (e) => {
                if (!isDragging) return;
                const dx = (e.clientX - lastX) / scale;
                const dy = (e.clientY - lastY) / scale;
                translateX += dx;
                translateY += dy;
                lastX = e.clientX;
                lastY = e.clientY;
                largeImg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            });

            window.addEventListener("mouseup", () => {
                isDragging = false;
                largeImg.style.cursor = "grab";
            });

            // Click overlay to close
            overlay.addEventListener("click", () => overlay.remove());
        });
    });
}

function main() {
    setupScrollFadeGradient();
    themeToggle();
    tocToggle();
    tocShutOnSelectLink();
    dedentCodeBlocks();

    injectLineNumbers();
    setupCodeClipboard();

    setScrollToTopButtonAppearOnScrollDown();

    setupCopyButtons();
    initializeTabs();
    enableImageViewer();
}

main();
