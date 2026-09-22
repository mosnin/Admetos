export function button01(scope = document) {
    const staggerDelay = 0.01;


    scope.querySelectorAll('[data-btn-01="stagger"]').forEach((el) => {
        const text = el.textContent.trim();
        el.innerHTML = "";
        let charIndex = 0;


        text.split(/\s+/).forEach((word, i) => {
            if (i > 0) {
                const spaceEl = document.createElement("span");
                spaceEl.className = "word-space";
                spaceEl.textContent = " ";
                spaceEl.setAttribute("aria-hidden", "true");
                el.appendChild(spaceEl);
            }
            const wordEl = document.createElement("span");
            wordEl.className = "span-wrapper";


            [...word].forEach((char) => {
                const charEl = document.createElement("span");
                charEl.className = "span-text";
                charEl.textContent = char;
                charEl.style.transitionDelay = `${charIndex * staggerDelay}s`;
                wordEl.appendChild(charEl);
                charIndex++;
            });


            el.appendChild(wordEl);
        });
    });
}


