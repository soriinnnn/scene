/*
 * Alumne: Sorin Chiperi Arnaut
 * Codi: u1987503
 */

function getNormal(result, normals, i) {
    let x = 0, y = 0, z = 1;

    if (i*3 + 2 < normals.length) {
        x = normals[i*3];
        y = normals[i*3 + 1];
        z = normals[i*3 + 2];
    }
    result.normals.push(x);
    result.normals.push(y);
    result.normals.push(z);
}

function getTexture(result, textures, i) {
    let x = 0, y = 0;

    if (i*2 + 1 < textures.length) {
        x = textures[i*2];
        y = textures[i*2 + 1];
    }
    result.textures.push(x);
    result.textures.push(y);
}

function getVertex(result, vertices, i) {
    let x = 0, y = 0, z = 0;

    if (i*3 + 2 < vertices.length) {
		x = vertices[i*3];
        y = vertices[i*3 + 1];
		z = vertices[i*3 + 2];
    }
    result.vertices.push(x);
    result.vertices.push(y);
    result.vertices.push(z);
}

function parseOBJ(text) {
    const result = {
        vertices: [],
        normals: [],
        textures: [],
        indices: []
    };

    const vertices = [];
    const normals = [];
    const textures = [];
    const faceMap = new Map();
    let index = 0;

    const lines = text.split(/\r?\n/);
    for (const line of lines) {
        if (!line || line.startsWith('#')) continue;

        const parts = line.split(" ");
        const type = parts[0];
		
		if (parts.length > 4) {
			parts.splice(4);
		}

        if (type === "v") {
            for (let i = 1; i < parts.length; i++) {
                vertices.push(parseFloat(parts[i]));
            }
        }
        else if (type === "vn") {
            for (let i = 1; i < parts.length; i++) {
                normals.push(parseFloat(parts[i]));
            }
        }
        else if (type === "vt") {
            for (let i = 1; i < parts.length; i++) {
                textures.push(parseFloat(parts[i]));
            }
        }
        else if (type === "f") {
            const indices = [];

            for (let i = 1; i < parts.length; i++) {
                const facePart = parts[i];

                if (!faceMap.has(facePart)) {
                    const faceComponents = facePart.split("/");
                    let vx, vt, vn;

                    vx = parseInt(faceComponents[0]) - 1;
                    if (faceComponents.length === 3) {
                        vt = parseInt(faceComponents[1]) - 1;
                        vn = parseInt(faceComponents[2]) - 1;
                    }
                    else {
                        vt = vx;
                        vn = vx;
                    }

                    getVertex(result, vertices, vx);
                    getTexture(result, textures, vt);
                    getNormal(result, normals, vn);

                    faceMap[facePart] = index;
                    index++;
                }

                indices.push(faceMap[facePart]);
            }

            if (indices.length >= 3) {
                for (let i = 1; i < indices.length-1; i++) {
                    result.indices.push(
                        indices[0],
                        indices[i],
                        indices[i+1]
                    );
                }
            }
        }
    }

    return result;
}

function convertObjToJson() {
    const output = document.getElementById("output");
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    const reader = new FileReader();

    if (!file) {
        alert("Selecciona un fitxer OBJ...");
        return;
    }

    reader.onload = () => {
        try {
            const text = reader.result;
            const data = parseOBJ(text);
            const json = JSON.stringify(data, null, 1);
            output.value = json;
        }
        catch (e) {
            console.error(e);
            alert("Error en la conversió...");
        }
    };
    reader.readAsText(file);
}

function copyResult() {
    const output = document.getElementById("output");

    if (!output.value) {
        alert("No hi ha cap JSON per copiar...");
        return;
    }

    navigator.clipboard.writeText(output.value);
}

function main() {
    const convertButton = document.getElementById("convertButton");
    const copyButton = document.getElementById("copyButton");

    convertButton.addEventListener("click", convertObjToJson);
    copyButton.addEventListener("click", copyResult);
}

document.addEventListener("DOMContentLoaded", main);