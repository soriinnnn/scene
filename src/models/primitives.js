function createCircle(segments = 32) {
    const vertexs = [0.0, 0.0]; // Centre.
    const textureCoords = [0.5, 0.5];
    const indexs = [];

    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = Math.cos(angle) * 0.5;
        const y = Math.sin(angle) * 0.5;

        vertexs.push(x, y);
        textureCoords.push(0.5 + x, 0.5 + y);
    }

    for (let i = 0; i < segments; i++) {
        indexs.push(0, i+1, i+2);
    }

    return {vertexs, textureCoords, indices: indexs};
}

function createGroundCube(width = 10.0, depth = 10.0, height = 0.1) {
    const w = width / 2;
    const d = depth / 2;
    const h = height / 2;

    const vertices = [
        // Cara inferior.
       -w, -h, -d,
        w, -h, -d,
        w, -h,  d,
       -w, -h,  d,

        // Cara superior.
       -w,  h, -d,
        w,  h, -d,
        w,  h,  d,
       -w,  h,  d,
    ];

    const normals = [
        // Cara inferior.
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,

        // Cara superior.
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
    ];

    const textures = [
        // Cara inferior.
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Cara superior.
        0.0, 0.0,
        10.0, 0.0,
        10.0, 10.0,
        0.0, 10.0,
    ];

    const indices = [
        // Cara superior (Y+).
        4, 7, 6, 6, 5, 4,

        // Cara inferior (Y-).
        0, 1, 2, 2, 3, 0,

        // Cara frontal (Z+).
        3, 2, 6, 6, 7, 3,

        // Cara posterior (Z-).
        1, 0, 4, 4, 5, 1,

        // Cara dreta (X+).
        2, 1, 5, 5, 6, 2,

        // Cara esquerra (X-).
        0, 3, 7, 7, 4, 0,
    ];

    return {
        vertices,
        normals,
        textures,
        indices
    };
}

function createSphere(radius = 0.5, segments = 16) {
    const vertices = [];
    const normals = [];
    const textures = [];
    const indices = [];

    for (let lat = 0; lat <= segments; lat++) {
        const theta = lat * Math.PI / segments;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let lon = 0; lon <= segments; lon++) {
            const phi = lon * 2 * Math.PI / segments;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = cosPhi * sinTheta;
            const y = cosTheta;
            const z = sinPhi * sinTheta;

            vertices.push(radius * x, radius * y, radius * z);
            normals.push(x, y, z);
            textures.push(lon / segments, lat / segments);
        }
    }

    for (let lat = 0; lat < segments; lat++) {
        for (let lon = 0; lon < segments; lon++) {
            const first = lat * (segments + 1) + lon;
            const second = first + segments + 1;

            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
    }

    return {
        vertices,
        normals,
        textures,
        indices
    };
}