/*
 * Alumne: Sorin Chiperi Arnaut
 * Codi: u1987503
 */

class Player {
    static #GRAVITY = -9.8;
    static #JUMP_FORCE = 5;

    #camera;
    #input;
    #cameraSensitivity;
    #speed;
    #playerHeight;
    #playerWidth;

    constructor(camera, input) {
        this.#camera = camera;
        this.#input = input;
        this.#cameraSensitivity = [1.0, 0.7];
        this.#speed = 2.0;
        this.#playerHeight = 0.5;
        this.#playerWidth = 0.5;
    }

    update(deltaTime) {
        this.#processInput(deltaTime);
    }

    position() {
        return this.#camera.position();
    }

    camera() {
        return this.#camera;
    }

    sensitivity() {
        return this.#cameraSensitivity[0];
    }

    setPosition(x, y, z) {
        this.#camera.setPosition(x, y, z);
    }

    setSensitivity(value) {
        this.#cameraSensitivity[0] = value;
        this.#cameraSensitivity[1] = value * 0.7;
    }

    /* ------------------------------ FUNCIONS PRIVADES ------------------------------ */

    #processInput(deltaTime) {
        this.#processKeyboard(deltaTime);
        this.#processMouse(deltaTime);
        this.#updatePlayerInfo();
    }

    #processMouse(deltaTime) {
        const moveDirection = this.#input.mouseMovement();

        this.#camera.rotateYaw(-moveDirection.x * this.#cameraSensitivity[0] * deltaTime);
        this.#camera.rotatePitch(-moveDirection.y * this.#cameraSensitivity[1] * deltaTime);
    }

    #processKeyboard(deltaTime) {
        const forward = this.#camera.getForwardVector();
        const right = this.#camera.getRightVector();
        let moveDirection = [0, 0, 0];

        if (this.#input.isKeyPressed(InputManager.MOVEMENT_KEYS[0]) && this.#camera.projectionType() === "perspective") {
            vec3.add(moveDirection, moveDirection, forward);
        }
        if (this.#input.isKeyPressed(InputManager.MOVEMENT_KEYS[1]) && this.#camera.projectionType() === "perspective") {
            vec3.subtract(moveDirection, moveDirection, forward);
        }
        if (this.#input.isKeyPressed(InputManager.MOVEMENT_KEYS[2])) {
            vec3.subtract(moveDirection, moveDirection, right);
        }
        if (this.#input.isKeyPressed(InputManager.MOVEMENT_KEYS[3])) {
            vec3.add(moveDirection, moveDirection, right);
        }

        vec3.normalize(moveDirection, moveDirection);
        vec3.scale(moveDirection, moveDirection, this.#speed * deltaTime);
        this.#camera.translate(
            moveDirection[0],
            moveDirection[1],
            moveDirection[2]
        );
    }

    #updatePlayerInfo() {
        const pos = this.position();
        document.getElementById("playerX").textContent = pos[0].toFixed(2);
        document.getElementById("playerY").textContent = pos[1].toFixed(2);
        document.getElementById("playerZ").textContent = pos[2].toFixed(2);
    }

}