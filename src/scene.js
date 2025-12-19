/*
 * Alumne: Sorin Chiperi Arnaut
 * Codi: u1987503
 */

class Scene {
    static #DEFAULT_FPS_LIMIT = 60;
    static #MIN_FPS_LIMIT = 30;
    static #MAX_FPS_LIMIT = 240;
    static #PLAYER_SPAWNPOINT = [0, 2.5, -7.5];

    #fpsLimit;
    #frameIntervalMs;
    #lastFrameTimeMs;
    #isRunning;

    #graphics;
    #objectShader;
    #toonShader;
    #player;
    #objects;
    #lights;

    constructor(canvas) {
        this.#fpsLimit = Scene.#DEFAULT_FPS_LIMIT;
        this.#frameIntervalMs = this.#getFrameIntervalMs(this.#fpsLimit);
        this.#lastFrameTimeMs = 0;
        this.#isRunning = false;

        this.#graphics = new Renderer(canvas);
        this.#objectShader = this.#createShader("objectVertexShader", "objectFragmentShader");
        this.#toonShader = this.#createShader("objectVertexShader", "toonFragmentShader");
        this.#player = new Player(
            new Camera(canvas),
            new InputManager(canvas)
        );
        this.#objects = [];
        this.#lights = this.#defaultLights();
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

    framerate() {
        return this.#fpsLimit;
    }

    sensitivity() {
        return this.#player.sensitivity();
    }

    drawMode() {
        return this.#graphics.getDrawMode();
    }

    textureScale() {
        return this.#graphics.getTextureScale();
    }

    light(index) {
        if (index < 0 || index >= Renderer.TOTAL_LIGHTS) {
            throw "Font de llum inexistent";
        }

        return this.#lights[index];
    }

    projectionType() {
        return this.#player.camera().projectionType();
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

    setShader(shader) {
        switch (shader) {
            case "DEFAULT":
                this.#changeObjectsShader(this.#objectShader);
                break;
            case "TOON":
                this.#changeObjectsShader(this.#toonShader);
                break;
            default:
                console.log("Programa de shader inexistent");
        }
    }

    setLight(lightData, index) {
        if (index < 0 || index >= Renderer.TOTAL_LIGHTS) {
            throw "Font de llum inexistent";
        }

        this.#lights[index] = lightData;
    }

    setProjectionType(type) {
        this.#player.camera().setProjectionType(type);

        if (type === "orthographic") {
            const pos = this.#player.position();
            this.#player.setPosition(
                pos[0],
                3,
                pos[2]
            );
        }
    }

    setTextureScale(scale) {
        this.#graphics.setTextureScale(scale);
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
        this.#graphics.drawObjects(this.#objects, this.#lights, this.#player.camera());
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

        object = this.#createObject(street);
        object.setPosition(0, -1, 0);
        object.setRotation(0, Math.PI, 0);
        object.setScale(2, 1, 1);
        object.setTexture(this.#graphics.createTexture("https://raw.githubusercontent.com/soriinnnn/scene/main/models/street/street.jpg"));
        this.#objects.push(object);

        object = this.#createObject(draven);
        object.setPosition(-3, 0.15, 0.5);
        object.setRotation(0, Math.PI, 0);
        object.setTexture(this.#graphics.createTexture("https://raw.githubusercontent.com/soriinnnn/scene/main/models/draven/draven.png"));
        this.#objects.push(object);

        object = this.#createObject(garen);
        object.setPosition(3, 0.15, 0.5);
        object.setRotation(0, Math.PI, 0);
        object.scaleUniform(0.01);
        object.setTexture(this.#graphics.createTexture("https://raw.githubusercontent.com/soriinnnn/scene/main/models/garen/garen.png"));
        this.#objects.push(object);

        object = this.#createObject(illaoi);
        object.setPosition(6, 0.15, 0.5);
        object.setRotation(0, Math.PI, 0);
        object.scaleUniform(0.015);
        object.setTexture(this.#graphics.createTexture("https://raw.githubusercontent.com/soriinnnn/scene/main/models/illaoi/illaoi.png"));
        this.#objects.push(object);

        object = this.#createObject(braum);
        object.setPosition(-6, 0.15, 0.5);
        object.setRotation(0, Math.PI, 0);
        object.scaleUniform(0.01);
        object.setTexture(this.#graphics.createTexture("https://raw.githubusercontent.com/soriinnnn/scene/main/models/braum/braum.png"));
        this.#objects.push(object);

        object = this.#createObject(gragas);
        object.setPosition(0, 0.15, 0.5);
        object.setRotation(0, Math.PI, 0);
        object.scaleUniform(0.01);
        object.setTexture(this.#graphics.createTexture("https://raw.githubusercontent.com/soriinnnn/scene/main/models/gragas/gragas.png"));
        this.#objects.push(object);

        object = this.#createObject(createSphere(0.5, 128));
        object.setPosition(0, 0, 0);
        object.setRotation(0, Math.PI/2, -Math.PI/3);
        object.scaleUniform(50);
        object.setTexture(this.#graphics.createTexture("https://raw.githubusercontent.com/soriinnnn/scene/main/src/textures/sky.jpg"));
        this.#objects.push(object);

        object = this.#createObject(createGroundCube());
        object.setPosition(0, -0.1, 0);
        object.scaleUniform(5);
        object.setTexture(this.#graphics.createTexture("https://raw.githubusercontent.com/soriinnnn/scene/main/src/textures/dirt.png"));
        this.#objects.push(object);

        object = this.#createObject(createSphere(0.25, 128));
        object.setPosition(5.4, 5, 7);
        object.setRotation(0, Math.PI/2, -Math.PI/3);
        object.setColor(1.0, 0.5, 0.1);
        this.#objects.push(object);

        object = this.#createObject(createSphere(0.5, 128));
        object.setPosition(-1, 8, 9);
        object.setRotation(-Math.PI/3, -Math.PI/4, -Math.PI);
        object.setColor(0.8, 0.9, 1.0);
        this.#objects.push(object);

        object = this.#createObject(createSphere(1, 128));
        object.setPosition(3, 10, 11);
        object.setRotation(-Math.PI/3, -Math.PI/2, -Math.PI);
        object.setColor(0.5, 0.9, 0.4);
        this.#objects.push(object);
    }

    #createObject(model) {
        const mesh = this.#graphics.createMeshData(model);
        return new Object(mesh, this.#objectShader);
    }

    #changeObjectsShader(shader) {
        this.#objects.forEach(object => {
            object.setShader(shader);
        });
    }

    #defaultLights() {
        return [
            {
                position: [5.4, 5.0, 7.0],
                la: [0.4, 0.35, 0.3],
                ld: [1.0, 0.85, 0.7],
                ls: [1.0, 0.95, 0.9],
                enabled: true,
                intensity: 1.0
            },
            {
                position: [-1.0, 8.0, 9.0],
                la: [0.15, 0.2, 0.3],
                ld: [0.9, 0.95, 1.0],
                ls: [1.0, 1.0, 1.0],
                enabled: true,
                intensity: 1.0
            },
            {
                position: [3.0, 10.0, 11.0],
                la: [0.2, 0.3, 0.15],
                ld: [0.55, 0.85, 0.45],
                ls: [0.75, 0.9, 0.65],
                enabled: true,
                intensity: 1.0
            }
        ];
    }

}