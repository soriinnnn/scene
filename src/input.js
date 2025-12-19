/*
 * Alumne: Sorin Chiperi Arnaut
 * Codi: u1987503
 */

class InputManager {
    static MOVEMENT_KEYS = ["w", "s", "a", "d"];

    #pressedKeys;
    #canvasFocus;
    #deltaX;
    #deltaY;

    constructor(canvas) {
        this.#pressedKeys = new Set();
        this.#canvasFocus = false;
        this.#deltaX = 0;
        this.#deltaY = 0;
        this.#setupListeners(canvas);
    }

    isKeyPressed(key) {
        return this.#pressedKeys.has(key);
    }

    mouseMovement() {
        const moveDirection = {
            x: this.#deltaX,
            y: this.#deltaY
        };
        this.#deltaX = 0;
        this.#deltaY = 0;

        return moveDirection;
    }

    /* ------------------------------ FUNCIONS PRIVADES ------------------------------ */

    #setupListeners(canvas) {
        this.#setupKeyboardListeners();
        this.#setupMouseListeners(canvas);
    }

    #setupKeyboardListeners() {
        document.addEventListener("keydown", (event) => {
            const key = event.key.toLowerCase();
            if (this.isKeyPressed(key) || !this.#canvasFocus) {
                return;
            }
            this.#pressedKeys.add(key);
        });

        document.addEventListener("keyup", (event) => {
            const key = event.key.toLowerCase();
            this.#pressedKeys.delete(key);
        });
    }

    #setupMouseListeners(canvas) {
        canvas.addEventListener("click", async () => {
            try {
                await canvas.requestPointerLock();
            }
            catch (error) {
                console.log("Bloqueig del ratolí cancel·lat");
            }
        });

        document.addEventListener("pointerlockchange", () => {
            this.#canvasFocus = (document.pointerLockElement === canvas);

            if (!this.#canvasFocus) {
                this.#pressedKeys.clear();
            }
        });

        document.addEventListener("mousemove", (event) => {
            if (!this.#canvasFocus) {
                return;
            }

            this.#deltaX = event.movementX;
            this.#deltaY = event.movementY;
        });
    }
}