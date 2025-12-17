/*
 * Alumne: Sorin Chiperi Arnaut
 * Codi: u1987503
 */

class Scene {
    static #DEFAULT_FPS_LIMIT = 60;
    static #MIN_FPS_LIMIT = 30;
    static #MAX_FPS_LIMIT = 240;
    static #PLAYER_SPAWNPOINT = [0.0, 1.0, -2.5];

    #fpsLimit;
    #frameIntervalMs;
    #lastFrameTimeMs;
    #isRunning;

    #graphics;
    #objectShader;
    #player;
    #objects;

    constructor(canvas) {
        this.#fpsLimit = Scene.#DEFAULT_FPS_LIMIT;
        this.#frameIntervalMs = this.#getFrameIntervalMs(this.#fpsLimit);
        this.#lastFrameTimeMs = 0;
        this.#isRunning = false;

        this.#graphics = new Renderer(canvas);
        this.#objectShader = this.#createShader("objectVertexShader", "objectFragmentShader");
        this.#player = new Player(
            new Camera(canvas),
            new InputManager(canvas)
        );
        this.#objects = [];
    }

    start() {
        if (this.#isRunning) {
            return;
        }


        this.#setupScene();
        this.#player.setPosition(
            Scene.#PLAYER_SPAWNPOINT[0],
            Scene.#PLAYER_SPAWNPOINT[1],
            Scene.#PLAYER_SPAWNPOINT[2]
        );

        this.#isRunning = true;
        this.#gameLoop();
    }

    setFrameLimit(limit) {
        if (limit < Scene.#MIN_FPS_LIMIT) limit = Scene.#MIN_FPS_LIMIT;
        else if (limit > Scene.#MAX_FPS_LIMIT) limit = Scene.#MAX_FPS_LIMIT;

        this.#fpsLimit = limit;
        this.#frameIntervalMs = this.#getFrameIntervalMs(this.#fpsLimit);
    }

    setSensitivity(value) {
        this.#player.setSensitivity(value);
    }

    setDrawMode(mode) {
        this.#graphics.setDrawMode(mode);
    }

    /* ------------------------------ FUNCIONS PRIVADES ------------------------------ */

    #gameLoop() {
        requestAnimationFrame((currentTimeMs) => {
            const deltaTimeMs = currentTimeMs - this.#lastFrameTimeMs;

            if (deltaTimeMs >= this.#frameIntervalMs) {
                this.#update(currentTimeMs);
                this.#render();
                this.#lastFrameTimeMs = currentTimeMs - (deltaTimeMs % this.#frameIntervalMs);
            }

            this.#gameLoop();
        });
    }

    #update(currentTimeMs) {
        const deltaTime = (currentTimeMs-this.#lastFrameTimeMs) / 1000;
        this.#player.update(deltaTime);
    }

    #render() {
        this.#graphics.clear();
        this.#graphics.drawObjects(this.#objects, this.#player.camera());
    }

    #createShader(vertex, fragment) {
        return this.#graphics.createProgram(
            document.getElementById(vertex).text,
            document.getElementById(fragment).text
        );
    }

    #getFrameIntervalMs(fpsLimit) {
        return 1000 / fpsLimit;
    }

    #setupScene() {
        let object;

        object = this.#createObject(kevin);
        object.setColor(0.5, 1.0, 0.5);
        object.setPosition(-1, 0, 0);
        object.setRotation(0, Math.PI, 0);
        this.#objects.push(object);

        object = this.#createObject(shrek_wazowski);
        object.setColor(0.5, 1.0, 0.5);
        object.setPosition(0, 0, 0);
        object.setRotation(0, Math.PI, 0);
        this.#objects.push(object);

        object = this.#createObject(draven);
        object.setColor(0.5, 1.0, 0.5);
        object.setPosition(1, 0, 0);
        object.setRotation(0, Math.PI, 0);
        this.#objects.push(object);
    }

    #createObject(model) {
        const mesh = this.#graphics.createMeshData(model);
        return new Object(mesh, this.#objectShader);
    }

}