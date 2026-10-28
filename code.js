const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const angle = document.getElementById("angle");
const refractive = document.getElementById("refractive");
const wavelength = document.getElementById("wavelength");
const medium = document.getElementById("medium");
const dispersionMode = document.getElementById("dispersionMode");
const phase = document.getElementById("phase");

const angleControl = document.getElementById("angleControl");
const mediumControl = document.getElementById("mediumControl");
const refractiveControl = document.getElementById("refractiveControl");
const wavelengthControl = document.getElementById("wavelengthControl");
const dispersionModeControl = document.getElementById("dispersionModeControl");
const phaseControl = document.getElementById("phaseControl");

const angleValue = document.getElementById("angleValue");
const nValue = document.getElementById("nValue");
const wavelengthValue = document.getElementById("wavelengthValue");
const phaseValue = document.getElementById("phaseValue");

const title = document.getElementById("title");
const formula = document.getElementById("formula");
const status = document.getElementById("status");
const description = document.getElementById("description");

let mode = "reflection";

function radians(value) {
    return value * Math.PI / 180;
}

function line(x1, y1, x2, y2, color, width = 4) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function arrow(x1, y1, x2, y2, color) {
    line(x1, y1, x2, y2, color);

    const a = Math.atan2(y2 - y1, x2 - x1);
    const size = 12;

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(x2, y2);

    ctx.lineTo(
        x2 - size * Math.cos(a - Math.PI / 6),
        y2 - size * Math.sin(a - Math.PI / 6)
    );

    ctx.lineTo(
        x2 - size * Math.cos(a + Math.PI / 6),
        y2 - size * Math.sin(a + Math.PI / 6)
    );

    ctx.closePath();
    ctx.fill();
}

function text(value, x, y, size = 15) {
    ctx.fillStyle = "#333";
    ctx.font = size + "px Arial";
    ctx.fillText(value, x, y);
}

function background() {
    const middle = canvas.height / 2;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "#f8fafc";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        middle
    );

    ctx.fillStyle = "#dff3ff";

    ctx.fillRect(
        0,
        middle,
        canvas.width,
        middle
    );

    line(
        0,
        middle,
        canvas.width,
        middle,
        "#475569",
        3
    );

    text("Среда 1", 20, 30);
    text("Среда 2", 20, canvas.height - 20);
}

function normal() {
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    ctx.setLineDash([8, 8]);

    line(
        x,
        25,
        x,
        canvas.height - 25,
        "#777",
        2
    );

    ctx.setLineDash([]);

    text(
        "Нормаль",
        x + 12,
        45
    );
}

function reflection(value) {

    background();
    normal();

    const x = canvas.width / 2;
    const y = canvas.height / 2;

    const a = radians(value);
    const length = 280;

    const startX =
        x - Math.sin(a) * length;

    const startY =
        y - Math.cos(a) * length;

    const endX =
        x + Math.sin(a) * length;

    const endY =
        y - Math.cos(a) * length;

    arrow(
        startX,
        startY,
        x,
        y,
        "#2563eb"
    );

    arrow(
        x,
        y,
        endX,
        endY,
        "#dc2626"
    );

    text(
        "Угол падения",
        35,
        105
    );

    text(
        value + "°",
        35,
        128,
        18
    );

    text(
        "Угол отражения",
        canvas.width - 165,
        105
    );

    text(
        value + "°",
        canvas.width - 165,
        128,
        18
    );
}

function refraction(value, n) {

    background();
    normal();

    const x = canvas.width / 2;
    const y = canvas.height / 2;

    const a = radians(value);
    const length = 280;

    const startX =
        x - Math.sin(a) * length;

    const startY =
        y - Math.cos(a) * length;

    arrow(
        startX,
        startY,
        x,
        y,
        "#2563eb"
    );

    const result =
        Math.sin(a) / n;

    if (result > 1) {
        return;
    }

    const b =
        Math.asin(result);

    const endX =
        x + Math.sin(b) * length;

    const endY =
        y + Math.cos(b) * length;

    arrow(
        x,
        y,
        endX,
        endY,
        "#16a34a"
    );

    text(
        "Угол падения",
        35,
        105
    );

    text(
        value + "°",
        35,
        128,
        18
    );

    text(
        "Угол преломления",
        canvas.width - 175,
        410
    );

    text(
        Math.round(
            b * 180 / Math.PI
        ) + "°",
        canvas.width - 175,
        435,
        18
    );
}

function totalReflection(value, n) {

    background();
    normal();

    const x = canvas.width / 2;
    const y = canvas.height / 2;

    const a = radians(value);
    const length = 280;

    const startX =
        x - Math.sin(a) * length;

    const startY =
        y + Math.cos(a) * length;

    arrow(
        startX,
        startY,
        x,
        y,
        "#2563eb"
    );

    const critical =
        Math.asin(1 / n) *
        180 / Math.PI;

    if (value > critical) {

        const endX =
            x + Math.sin(a) * length;

        const endY =
            y + Math.cos(a) * length;

        arrow(
            x,
            y,
            endX,
            endY,
            "#dc2626"
        );

        status.textContent =
            "Происходит полное внутреннее отражение.";

    } else {

        const result =
            Math.sin(a) * n;

        const b =
            Math.asin(
                Math.min(result, 1)
            );

        const endX =
            x + Math.sin(b) * length;

        const endY =
            y - Math.cos(b) * length;

        arrow(
            x,
            y,
            endX,
            endY,
            "#16a34a"
        );

        status.textContent =
            "Луч выходит во вторую среду.";
    }

    text(
        "Угол падения",
        35,
        105
    );

    text(
        value + "°",
        35,
        128,
        18
    );

    text(
        "Критический угол",
        canvas.width - 175,
        105
    );

    text(
        critical.toFixed(1) + "°",
        canvas.width - 175,
        128,
        18
    );
}

function wavelengthColor(value) {

    if (value < 450) {
        return "#6f00ff";
    }

    if (value < 490) {
        return "#174cff";
    }

    if (value < 510) {
        return "#00a8ff";
    }

    if (value < 570) {
        return "#00a83b";
    }

    if (value < 590) {
        return "#ffe600";
    }

    if (value < 630) {
        return "#ff8c00";
    }

    return "#e60000";
}

function drawPrism() {

    const prism = [
        { x: 330, y: 170 },
        { x: 330, y: 390 },
        { x: 530, y: 280 }
    ];

    ctx.fillStyle = "#e0f2fe";
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(
        prism[0].x,
        prism[0].y
    );

    ctx.lineTo(
        prism[1].x,
        prism[1].y
    );

    ctx.lineTo(
        prism[2].x,
        prism[2].y
    );

    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    text(
        "Призма",
        395,
        425,
        16
    );
}

function drawIncomingLight() {

    const centerY = 280;

    line(
        50,
        centerY,
        330,
        centerY,
        "#ffffff",
        14
    );

    line(
        50,
        centerY,
        330,
        centerY,
        "#333",
        2
    );

    text(
        "Свет",
        90,
        250,
        16
    );
}

function dispersionRay(value) {

    const centerX = 530;
    const centerY = 280;

    const minWavelength = 400;
    const maxWavelength = 700;

    const minDeviation = 12;
    const maxDeviation = 48;

    const position =
        (value - minWavelength) /
        (maxWavelength - minWavelength);

    const deviation =
        maxDeviation -
        position * (maxDeviation - minDeviation);

    const endX = 770;

    const endY =
        centerY - deviation;

    const color =
        wavelengthColor(value);

    arrow(
        centerX,
        centerY,
        endX,
        endY,
        color
    );

    return {
        endX,
        endY,
        color
    };
}

function dispersion(value) {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "#fafafa";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawPrism();
    drawIncomingLight();

    if (dispersionMode.value === "single") {

        const ray =
            dispersionRay(value);

        text(
            "Выходящий луч",
            625,
            ray.endY - 18,
            15
        );

        text(
            value + " нм",
            ray.endX - 25,
            ray.endY + 28,
            17
        );

    } else {

        const wavelengths = [
            400,
            450,
            500,
            550,
            600,
            650,
            700
        ];

        wavelengths.forEach(function(wave) {

            const ray =
                dispersionRay(wave);

            text(
                wave + " нм",
                ray.endX - 25,
                ray.endY + 20,
                12
            );
        });

        text(
            "Спектр",
            680,
            135,
            16
        );
    }

    text(
        "Длина волны",
        35,
        485,
        15
    );

    text(
        value + " нм",
        35,
        515,
        20
    );

    ctx.fillStyle =
        wavelengthColor(value);

    ctx.fillRect(
        180,
        495,
        100,
        25
    );
}

function drawWave(
    startX,
    startY,
    length,
    amplitude,
    waveLength,
    phaseValue,
    color
) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    ctx.beginPath();

    for (let x = 0; x <= length; x++) {

        const y =
            startY +
            amplitude *
            Math.sin(
                x / waveLength * Math.PI * 2 +
                radians(phaseValue)
            );

        if (x === 0) {
            ctx.moveTo(
                startX + x,
                y
            );
        } else {
            ctx.lineTo(
                startX + x,
                y
            );
        }
    }

    ctx.stroke();
}

function interference(value) {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "#fafafa";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const startX = 80;
    const length = 680;
    const waveLength = 75;
    const amplitude = 30;

    const upperY = 180;
    const lowerY = 280;
    const resultY = 410;

    drawWave(
        startX,
        upperY,
        length,
        amplitude,
        waveLength,
        0,
        "#2563eb"
    );

    drawWave(
        startX,
        lowerY,
        length,
        amplitude,
        waveLength,
        value,
        "#dc2626"
    );

    ctx.setLineDash([6, 6]);

    line(
        startX,
        resultY,
        startX + length,
        resultY,
        "#777",
        1
    );

    ctx.setLineDash([]);

    ctx.strokeStyle = "#16a34a";
    ctx.lineWidth = 3;

    ctx.beginPath();

    for (let x = 0; x <= length; x++) {

        const first =
            Math.sin(
                x / waveLength * Math.PI * 2
            );

        const second =
            Math.sin(
                x / waveLength * Math.PI * 2 +
                radians(value)
            );

        const result =
            (first + second) / 2;

        const y =
            resultY +
            result * 60;

        if (x === 0) {
            ctx.moveTo(
                startX + x,
                y
            );
        } else {
            ctx.lineTo(
                startX + x,
                y
            );
        }
    }

    ctx.stroke();

    text(
        "Волна 1",
        80,
        125,
        15
    );

    text(
        "Волна 2",
        80,
        330,
        15
    );

    text(
        "Результирующая волна",
        80,
        475,
        15
    );

    let phaseText;

    if (value === 0 || value === 360) {

        phaseText =
            "Волны совпадают по фазе. Наблюдается усиление.";

    } else if (value === 180) {

        phaseText =
            "Волны находятся в противофазе. Наблюдается ослабление.";

    } else {

        phaseText =
            "При промежуточном сдвиге фазы волны частично усиливают друг друга.";
    }

    status.textContent =
        phaseText;

    text(
        "Сдвиг фазы: " + value + "°",
        610,
        520,
        16
    );
}

function update() {

    const a = Number(angle.value);
    const n = Number(refractive.value);
    const wave = Number(wavelength.value);
    const phaseValueNumber = Number(phase.value);

    angleValue.textContent =
        a + "°";

    nValue.textContent =
        n.toFixed(2);

    wavelengthValue.textContent =
        wave + " нм";

    phaseValue.textContent =
        phaseValueNumber + "°";

    if (mode === "reflection") {

        title.textContent =
            "Отражение света";

        angleControl.style.display =
            "block";

        mediumControl.style.display =
            "none";

        refractiveControl.style.display =
            "none";

        wavelengthControl.style.display =
            "none";

        dispersionModeControl.style.display =
            "none";

        phaseControl.style.display =
            "none";

        formula.innerHTML =
            "<strong>Закон отражения</strong><br><br>" +
            "θ₁ = θ₂";

        status.textContent =
            "Луч отражается от поверхности.";

        description.textContent =
            "При отражении света угол падения равен " +
            "углу отражения. Это означает, что свет " +
            "отражается от поверхности под тем же углом, " +
            "под которым он падает. Измените угол падения " +
            "и наблюдайте, как изменяется направление " +
            "отражённого луча.";

        reflection(a);

    } else if (mode === "refraction") {

        title.textContent =
            "Преломление света";

        angleControl.style.display =
            "block";

        mediumControl.style.display =
            "block";

        refractiveControl.style.display =
            "none";

        wavelengthControl.style.display =
            "none";

        dispersionModeControl.style.display =
            "none";

        phaseControl.style.display =
            "none";

        formula.innerHTML =
            "<strong>Закон Снеллиуса</strong><br><br>" +
            "n₁ · sin(θ₁) = n₂ · sin(θ₂)";

        status.textContent =
            "Луч переходит во вторую среду.";

        description.textContent =
            "При переходе света из одной среды в другую " +
            "изменяется скорость его распространения, " +
            "из-за чего меняется и направление луча. " +
            "Чем больше показатель преломления второй среды, " +
            "тем сильнее луч отклоняется от нормали.";

        refraction(a, n);

    } else if (mode === "tir") {

        title.textContent =
            "Полное внутреннее отражение";

        angleControl.style.display =
            "block";

        mediumControl.style.display =
            "block";

        refractiveControl.style.display =
            "none";

        wavelengthControl.style.display =
            "none";

        dispersionModeControl.style.display =
            "none";

        phaseControl.style.display =
            "none";

        formula.innerHTML =
            "<strong>Критический угол</strong><br><br>" +
            "sin(θкр) = n₂ / n₁";

        const critical =
            Math.asin(1 / n) *
            180 / Math.PI;

        if (a < critical) {

            description.textContent =
                "Критический угол — это максимальный угол " +
                "падения, при котором свет ещё может выйти " +
                "из более оптически плотной среды в менее " +
                "плотную. При угле меньше критического луч " +
                "преломляется и выходит во вторую среду. " +
                "Сейчас угол падения меньше критического.";

        } else if (Math.abs(a - critical) < 0.5) {

            description.textContent =
                "Критический угол — это граница между " +
                "преломлением и полным внутренним отражением. " +
                "При критическом угле преломлённый луч " +
                "распространяется вдоль границы двух сред.";

        } else {

            description.textContent =
                "Критический угол — это максимальный угол " +
                "падения, при котором свет ещё может выйти " +
                "в менее оптически плотную среду. Если угол " +
                "падения становится больше критического, " +
                "преломлённый луч исчезает и происходит " +
                "полное внутреннее отражение.";
        }

        totalReflection(a, n);

    } else if (mode === "dispersion") {

        title.textContent =
            "Дисперсия света";

        angleControl.style.display =
            "none";

        mediumControl.style.display =
            "none";

        refractiveControl.style.display =
            "none";

        wavelengthControl.style.display =
            "block";

        dispersionModeControl.style.display =
            "block";

        phaseControl.style.display =
            "none";

        formula.innerHTML =
            "<strong>Дисперсия света</strong><br><br>" +
            "n = f(λ)";

        status.textContent =
            "Разные длины волн отклоняются на разные углы.";

        description.textContent =
            "Дисперсия — это зависимость показателя " +
            "преломления вещества от длины волны света. " +
            "Поэтому разные цвета в призме отклоняются " +
            "на разные углы. Короткие волны, например " +
            "фиолетовые, отклоняются сильнее, а длинные, " +
            "например красные, — слабее.";

        dispersion(wave);

    } else {

        title.textContent =
            "Интерференция света";

        angleControl.style.display =
            "none";

        mediumControl.style.display =
            "none";

        refractiveControl.style.display =
            "none";

        wavelengthControl.style.display =
            "none";

        dispersionModeControl.style.display =
            "none";

        phaseControl.style.display =
            "block";

        formula.innerHTML =
            "<strong>Интерференция</strong><br><br>" +
            "A = A₁ + A₂";

        description.textContent =
            "Интерференция возникает при наложении двух " +
            "или нескольких световых волн. В результате " +
            "их колебания складываются. Если волны совпадают " +
            "по фазе, они усиливают друг друга. Если находятся " +
            "в противофазе, они ослабляют друг друга.";

        interference(phaseValueNumber);
    }
}

medium.addEventListener(
    "change",
    function() {

        refractive.value =
            medium.value;

        update();
    }
);

angle.addEventListener(
    "input",
    update
);

refractive.addEventListener(
    "input",
    update
);

wavelength.addEventListener(
    "input",
    update
);

phase.addEventListener(
    "input",
    update
);

dispersionMode.addEventListener(
    "change",
    update
);

document
    .querySelectorAll(".tab")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(".tab")
                    .forEach(function(item) {
                        item.classList.remove("active");
                    });

                button.classList.add("active");

                mode =
                    button.dataset.mode;

                update();
            }
        );
    });

update();