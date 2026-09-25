// ============================================
// ELEMENTOS
// ============================================

const hero =
    document.querySelector(".hero");

const binaryContainer =
    document.getElementById("binaryContainer");



// ============================================
// CONFIGURAÇÕES
// ============================================

let binaryDigits = [];

let digitPositions = [];

let mouseX = 0;

let mouseY = 0;

let animationFrame = null;

let currentColumns = 0;

let currentRows = 0;

let resizeTimer;



// ============================================
// DEFINIR TAMANHO DA MATRIZ
// ============================================

function getGridSize() {

    // Celular
    if (window.innerWidth <= 576) {

        return {
            columns: 18,
            rows: 28
        };

    }


    // Tablet
    if (window.innerWidth <= 991) {

        return {
            columns: 26,
            rows: 24
        };

    }


    // Desktop
    return {
        columns: 36,
        rows: 22
    };

}



// ============================================
// CRIAR OS NÚMEROS BINÁRIOS
// ============================================

function createBinaryGrid() {

    const grid =
        getGridSize();


    /*
        Evita recriar os números se
        o tamanho da matriz não mudou.
    */

    if (
        currentColumns === grid.columns &&
        currentRows === grid.rows &&
        binaryDigits.length > 0
    ) {

        updateDigitPositions();

        return;

    }


    currentColumns =
        grid.columns;

    currentRows =
        grid.rows;


    const quantidade =
        grid.columns * grid.rows;


    binaryContainer.innerHTML = "";


    binaryContainer.style.setProperty(
        "--binary-columns",
        grid.columns
    );


    binaryContainer.style.setProperty(
        "--binary-rows",
        grid.rows
    );


    const fragment =
        document.createDocumentFragment();


    for (
        let i = 0;
        i < quantidade;
        i++
    ) {

        const digit =
            document.createElement("span");


        digit.classList.add(
            "binary-digit"
        );


        digit.textContent =
            Math.random() > 0.5
                ? "1"
                : "0";


        fragment.appendChild(
            digit
        );

    }


    binaryContainer.appendChild(
        fragment
    );


    binaryDigits =
        Array.from(
            binaryContainer.querySelectorAll(
                ".binary-digit"
            )
        );


    requestAnimationFrame(
        updateDigitPositions
    );

}



// ============================================
// PEGAR POSIÇÃO DOS NÚMEROS
// ============================================

function updateDigitPositions() {

    digitPositions =
        binaryDigits.map(
            (digit) => {

                const rect =
                    digit.getBoundingClientRect();


                return {

                    x:
                        rect.left +
                        rect.width / 2,

                    y:
                        rect.top +
                        rect.height / 2

                };

            }
        );

}



// ============================================
// RESETAR UM NÚMERO
// ============================================

function resetDigit(digit) {

    digit.style.color =
        "#8b5cf6";


    digit.style.opacity =
        "0.72";


    digit.style.transform =
        "scale(1)";


    digit.style.textShadow =
        "none";

}



// ============================================
// RESETAR TODOS
// ============================================

function resetAllDigits() {

    binaryDigits.forEach(
        (digit) => {

            resetDigit(
                digit
            );

        }
    );

}



// ============================================
// EFEITO DO CURSOR
// ============================================

function updateBinaryEffect() {

    animationFrame = null;


    /*
        Alcance menor em dispositivos
        menores.
    */

    const alcance =
        window.innerWidth <= 576
            ? 140
            : 220;


    binaryDigits.forEach(
        (digit, index) => {

            const position =
                digitPositions[index];


            if (!position) {
                return;
            }


            const distanciaX =
                mouseX - position.x;


            const distanciaY =
                mouseY - position.y;


            const distancia =
                Math.hypot(
                    distanciaX,
                    distanciaY
                );


            /*
                Se o número estiver
                dentro da área do cursor.
            */

            if (distancia < alcance) {

                const intensidade =
                    1 -
                    distancia /
                    alcance;


                /*
                    Quanto mais próximo,
                    mais claro fica.
                */

                digit.style.color =
                    `rgb(
                        ${
                            139 +
                            intensidade * 57
                        },
                        ${
                            92 +
                            intensidade * 89
                        },
                        ${
                            246 +
                            intensidade * 7
                        }
                    )`;


                digit.style.opacity =
                    String(
                        0.72 +
                        intensidade *
                        0.28
                    );


                digit.style.transform =
                    `scale(${
                        1 +
                        intensidade *
                        0.75
                    })`;


                digit.style.textShadow =
                    `
                        0 0 ${
                            5 +
                            intensidade *
                            17
                        }px
                        rgba(
                            139,
                            92,
                            246,
                            ${
                                0.35 +
                                intensidade *
                                0.65
                            }
                        )
                    `;

            } else {

                resetDigit(
                    digit
                );

            }

        }
    );

}



// ============================================
// MOVIMENTO DO MOUSE NO HERO
// ============================================

if (
    hero &&
    binaryContainer
) {

    createBinaryGrid();


    hero.addEventListener(
        "mousemove",
        (event) => {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;


            /*
                requestAnimationFrame evita
                executar centenas de vezes
                por segundo sem necessidade.
            */

            if (!animationFrame) {

                animationFrame =
                    requestAnimationFrame(
                        updateBinaryEffect
                    );

            }

        }
    );



    // Quando sair do Hero

    hero.addEventListener(
        "mouseleave",
        () => {

            if (animationFrame) {

                cancelAnimationFrame(
                    animationFrame
                );


                animationFrame = null;

            }


            resetAllDigits();

        }
    );

}



// ============================================
// RESPONSIVIDADE
// ============================================

window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        /*
            Pequeno debounce para não
            reconstruir a matriz centenas
            de vezes durante o resize.
        */

        resizeTimer =
            setTimeout(
                () => {

                    createBinaryGrid();

                    requestAnimationFrame(
                        updateDigitPositions
                    );

                },
                150
            );

    }
);



// ============================================
// RECALCULAR POSIÇÃO AO ROLAR
// ============================================

window.addEventListener(
    "scroll",
    () => {

        /*
            Só precisamos recalcular se o
            Hero estiver próximo da tela.
        */

        const heroRect =
            hero?.getBoundingClientRect();


        if (!heroRect) {
            return;
        }


        if (
            heroRect.bottom > 0 &&
            heroRect.top <
                window.innerHeight
        ) {

            updateDigitPositions();

        }

    },
    {
        passive: true
    }
);