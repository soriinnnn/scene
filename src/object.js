/*
 * Alumne: Sorin Chiperi Arnaut
 * Codi: u1987503
 */

class Object {
    #meshId;
    #shaderId;
    #textureId;
    #size;
    #position;
    #rotation;
    #scale;
    #color;

    constructor(mesh, shader, width, depth, height) {
        this.#meshId = mesh;
        this.#shaderId = shader;
        this.#textureId = -1;
        this.#size = [width, height, depth];
        this.#position = [0, 0, 0];
        this.#rotation = [0, 0, 0];
        this.#scale = [1, 1, 1];
        this.#color = [0, 0, 0];
    }

    modelMatrix() {
        const matrix = mat4.create();

        const rotX= mat4.create();
        const rotY = mat4.create();
        const rotZ = mat4.create();
        mat4.fromXRotation(rotX, this.#rotation[0]);
        mat4.fromYRotation(rotY, this.#rotation[1]);
        mat4.fromZRotation(rotZ, this.#rotation[2]);

        const rotation = mat4.create();
        mat4.multiply(rotation, rotY, rotZ);
        mat4.multiply(rotation, rotation, rotX);
        mat4.fromTranslation(matrix, this.#position);
        mat4.multiply(matrix, matrix, rotation);
        mat4.scale(matrix, matrix, this.#scale);

        return matrix;
    }

    position() {
        return this.#position;
    }

    rotation() {
        return this.#rotation;
    }

    scale() {
        return this.#scale;
    }

    color() {
        return this.#color;
    }

    mesh() {
        return this.#meshId;
    }

    shader() {
        return this.#shaderId;
    }

    texture() {
        return this.#textureId;
    }

    hasTexture() {
        return this.#textureId >= 0;
    }

    translate(dx, dy, dz) {
        this.#position[0] += dx;
        this.#position[1] += dy;
        this.#position[2] += dz;
    }

    translateX(distance) {
        this.#position[0] += distance;
    }

    translateY(distance) {
        this.#position[1] += distance;
    }

    translateZ(distance) {
        this.#position[2] += distance;
    }

    setPosition(x, y, z) {
        this.#position[0] = x;
        this.#position[1] = y;
        this.#position[2] = z;
    }

    rotate(dx, dy, dz) {
        this.#rotation[0] += dx;
        this.#rotation[1] += dy;
        this.#rotation[2] += dz;
    }

    rotateX(angle) {
        this.#rotation[0] += angle;
    }

    rotateY(angle) {
        this.#rotation[1] += angle;
    }

    rotateZ(angle) {
        this.#rotation[2] += angle;
    }

    setRotation(x, y, z) {
        this.#rotation[0] = x;
        this.#rotation[1] = y;
        this.#rotation[2] = z;
    }

    scaleUniform(factor) {
        this.#scale[0] *= factor;
        this.#scale[1] *= factor;
        this.#scale[2] *= factor;
    }

    setScale(x, y, z) {
        this.#scale[0] = x;
        this.#scale[1] = y;
        this.#scale[2] = z;
    }

    setColor(r, g, b) {
        this.#color = [r, g, b];
    }

    setShader(shader) {
        this.#shaderId = shader;
    }

    setTexture(textureId) {
        this.#textureId = textureId;
    }

}