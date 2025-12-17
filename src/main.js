
/*
 * Alumne: Sorin Chiperi Arnaut
 * Codi: u1987503
 */

const mat4 = glMatrix.mat4;
const mat3 = glMatrix.mat3;
const vec3 = glMatrix.vec3;

let scene = null;

function startGame() {
    const sensitivitySlider = document.getElementById("sensitivitySlider");
    const framerateSlider = document.getElementById("framerateSlider");

    sensitivitySlider.disabled = false;
    framerateSlider.disabled = false;

    const canvas = document.getElementById("gameCanvas");
    scene = new Scene(canvas);
    scene.start();
}

function setupButtons() {
}

function changeSensitivity(event) {
    const sensitivityValue = document.getElementById("sensitivityValue");
    const value = parseFloat(event.target.value);
    sensitivityValue.textContent = value.toFixed(1);
    scene.setSensitivity(value);
}

function changeFramerate(event) {
    const framerateValue = document.getElementById("framerateValue");
    const value = parseInt(event.target.value);
    framerateValue.textContent = value.toFixed();
    scene.setFrameLimit(value);
}

function setupSliders() {
    const sensitivitySlider = document.getElementById("sensitivitySlider");
    const framerateSlider = document.getElementById("framerateSlider");

    sensitivitySlider.addEventListener("input", changeSensitivity);
    framerateSlider.addEventListener("input", changeFramerate);
}

function main() {
    setupButtons();
    setupSliders();
    startGame();
}

document.addEventListener("DOMContentLoaded", main);