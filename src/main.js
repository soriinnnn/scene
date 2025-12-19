
/*
 * Alumne: Sorin Chiperi Arnaut
 * Codi: u1987503
 */

const mat4 = glMatrix.mat4;
const mat3 = glMatrix.mat3;
const vec3 = glMatrix.vec3;

let scene = null;
let currentLight = null;

function startScene() {
    const canvas = document.getElementById("gameCanvas");
    scene = new Scene(canvas);
    scene.start();
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

function changeTextureScale(event) {
    const scaleValue = document.getElementById("scaleValue");
    const value = parseFloat(event.target.value);
    scaleValue.textContent = value.toFixed(1);
    scene.setTextureScale(value);
}

function setupProceduralTextureSettings() {
    const scaleSlider = document.getElementById("scaleSlider");
	const scaleValue = document.getElementById("scaleValue");

    scaleValue.textContent = scene.textureScale().toFixed(1);
    scaleSlider.addEventListener("input", changeTextureScale);
    scaleSlider.disabled = false;
}

function rgbToHex(r, g, b) {
    const toHex = (n) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [
        parseInt(result[1], 16) / 255.0,
        parseInt(result[2], 16) / 255.0,
        parseInt(result[3], 16) / 255.0
    ];
}

function updateLight() {
    const laRgb = hexToRgb(document.getElementById("lightLa").value);
    const ldRgb = hexToRgb(document.getElementById("lightLd").value);
    const lsRgb = hexToRgb(document.getElementById("lightLs").value);

    const lightData = {
        position: [
            parseFloat(document.getElementById("lightPosX").value) || 0,
            parseFloat(document.getElementById("lightPosY").value) || 0,
            parseFloat(document.getElementById("lightPosZ").value) || 0
        ],
        la: laRgb,
        ld: ldRgb,
        ls: lsRgb,
        enabled: document.getElementById("lightEnabled").checked,
        intensity: parseFloat(document.getElementById("lightIntensity").value) || 0
    };

    scene.setLight(lightData, currentLight);
}

function loadLightValues() {
    const light = scene.light(currentLight);

    document.getElementById("lightEnabled").checked = light.enabled;
    document.getElementById("lightPosX").value = light.position[0];
    document.getElementById("lightPosY").value = light.position[1];
    document.getElementById("lightPosZ").value = light.position[2];
    document.getElementById("lightLa").value = rgbToHex(light.la[0], light.la[1], light.la[2]);
    document.getElementById("lightLd").value = rgbToHex(light.ld[0], light.ld[1], light.ld[2]);
    document.getElementById("lightLs").value = rgbToHex(light.ls[0], light.ls[1], light.ls[2]);
    document.getElementById("lightIntensity").value = light.intensity;
    document.getElementById("lightIntensityValue").textContent = light.intensity.toFixed(1);
}

function setupLightSettings() {
    const lightSelector = document.getElementById("lightSelector");
    const lightEnabled = document.getElementById("lightEnabled");
    const lightPosX = document.getElementById("lightPosX");
    const lightPosY = document.getElementById("lightPosY");
    const lightPosZ = document.getElementById("lightPosZ");
    const lightLa = document.getElementById("lightLa");
    const lightLd = document.getElementById("lightLd");
    const lightLs = document.getElementById("lightLs");
    const lightIntensity = document.getElementById("lightIntensity");

    currentLight = 0;
    loadLightValues();
    lightSelector.addEventListener("change", (e) => {
        currentLight = parseInt(e.target.value);
        loadLightValues();
    });
    lightEnabled.addEventListener("change", updateLight);
    lightPosX.addEventListener("input", updateLight);
    lightPosY.addEventListener("input", updateLight);
    lightPosZ.addEventListener("input", updateLight);
    lightLa.addEventListener("input", updateLight);
    lightLd.addEventListener("input", updateLight);
    lightLs.addEventListener("input", updateLight);
    lightIntensity.addEventListener("input", (e) => {
        document.getElementById("lightIntensityValue").textContent = parseFloat(e.target.value).toFixed(1);
        updateLight();
    });

    lightSelector.disabled = false;
    lightEnabled.disabled = false;
    lightPosX.disabled = false;
    lightPosY.disabled = false;
    lightPosZ.disabled = false;
    lightLa.disabled = false;
    lightLd.disabled = false;
    lightLs.disabled = false;
    lightIntensity.disabled = false;
}

function updateRenderingMode() {
    const solid = document.getElementById("modeSolid").checked;
    const wireframe = document.getElementById("modeWireframe").checked;

    if (solid) {
        scene.setDrawMode("SOLID");
    }
    else if (wireframe) {
        scene.setDrawMode("WIREFRAME");
    }
}

function setupRenderingModeSettings() {
    const solidButton = document.getElementById("modeSolid");
    const wireframeButton = document.getElementById("modeWireframe");

    solidButton.addEventListener("input", updateRenderingMode);
    wireframeButton.addEventListener("input", updateRenderingMode);

    solidButton.disabled = false;
    wireframeButton.disabled = false;
}

function updateShader() {
    const defaultShader = document.getElementById("defaultShader").checked;
    const toonShader = document.getElementById("toonShader").checked;

    if (defaultShader) {
        scene.setShader("DEFAULT");
    }
    else if (toonShader) {
        scene.setShader("TOON");
    }
}

function updateProjection() {
    const perspective = document.getElementById("projectionPerspective").checked;

    if (scene) {
        if (perspective) {
            scene.setProjectionType("perspective");
        } else {
            scene.setProjectionType("orthographic");
        }
    }
}

function setupProjectionSettings() {
    const perspectiveButton = document.getElementById("projectionPerspective");
    const orthographicButton = document.getElementById("projectionOrthographic");

    perspectiveButton.addEventListener("input", updateProjection);
    orthographicButton.addEventListener("input", updateProjection);

    perspectiveButton.disabled = false;
    orthographicButton.disabled = false;
}

function setupShaderSettings() {
    const defaultShader = document.getElementById("defaultShader");
    const toonShader = document.getElementById("toonShader");

    defaultShader.addEventListener("input", updateShader);
    toonShader.addEventListener("input", updateShader);

    defaultShader.disabled = false;
    toonShader.disabled = false;
}

function setupSensitivitySettings() {
    const sensitivitySlider = document.getElementById("sensitivitySlider");
	const sensitivityValue = document.getElementById("sensitivityValue");
	
	sensitivityValue.textContent = scene.sensitivity().toFixed(1);
    sensitivitySlider.addEventListener("input", changeSensitivity);
    sensitivitySlider.disabled = false;
}

function setupFramerateSettings() {
    const framerateSlider = document.getElementById("framerateSlider");
	const framerateValue = document.getElementById("framerateValue");
	
	framerateValue.textContent = scene.framerate().toFixed();
    framerateSlider.addEventListener("input", changeFramerate);
    framerateSlider.disabled = false;
}

function main() {
    startScene();
    setupFramerateSettings();
    setupSensitivitySettings();
    setupShaderSettings();
    setupRenderingModeSettings();
    setupProjectionSettings();
    setupLightSettings();
    setupProceduralTextureSettings();
}

document.addEventListener("DOMContentLoaded", main);