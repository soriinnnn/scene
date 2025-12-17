/*
 * Alumne: Sorin Chiperi Arnaut
 * Codi: u1987503
 */

class Camera {
    #eye;
    #yaw;
    #pitch;
    #aspect;
    #fov;
    #near;
    #far;

    constructor(canvas) {
        this.#eye = [0, 0, 0];
        this.#yaw = 0.0;
        this.#pitch = 0.0;
        this.#aspect = canvas.width / canvas.height;
        this.#fov = this.#degreesToRadians(45);
        this.#near = 0.1;
        this.#far = 100.0;
    }

    viewMatrix() {
        let forwardVec;
        let rightVec;
        let upVec;
        let target;

        forwardVec = this.getForwardVector();
        rightVec = this.getRightVector();
        upVec = vec3.cross(vec3.create(), rightVec, forwardVec);
        target = vec3.add(vec3.create(), this.#eye, forwardVec);

        return mat4.lookAt(
            mat4.create(),
            this.#eye,
            target,
            upVec
        );
    }

    projectionMatrix() {
        return mat4.perspective(
            mat4.create(),
            this.#fov,
            this.#aspect,
            this.#near,
            this.#far
        );
    }

    position() {
        return this.#eye;
    }

    translate(x, y, z) {
        this.#eye[0] += x;
        this.#eye[1] += y;
        this.#eye[2] += z;
    }

    setPosition(x, y, z) {
        this.#eye[0] = x;
        this.#eye[1] = y;
        this.#eye[2] = z;
    }

    rotatePitch(angle) {
        this.#pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.#pitch+angle));
    }

    rotateYaw(angle) {
        this.#yaw += angle;
    }

    setRotation(yaw, pitch) {
        this.#yaw = yaw;
        this.#pitch = pitch;
    }

    getForwardVector() {
        return [
            Math.sin(this.#yaw) * Math.cos(this.#pitch),
            Math.sin(this.#pitch),
            Math.cos(this.#yaw) * Math.cos(this.#pitch)
        ];
    }

    getRightVector() {
        return [
            Math.sin(this.#yaw - Math.PI/2),
            0,
            Math.cos(this.#yaw - Math.PI/2)
        ];
    }

    /* ------------------------------ FUNCIONS PRIVADES ------------------------------ */

    #degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    #radiansToDegrees(radians) {
        return radians * 180 / Math.PI;
    }

}