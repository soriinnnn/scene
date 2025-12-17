/*
 * Alumne: Sorin Chiperi Arnaut
 * Codi: u1987503
 */

class Renderer {
    #canvas;
    #context;
    #programs;
    #programCount;
    #meshData;
    #meshCount;
    #loadedProgram;
    #drawMode;
    #textures;          // Sense utilitzar...
    #textureCount;      // Sense utilitzar...

    constructor(canvas) {
        this.#canvas = canvas;
        this.#programs = [];
        this.#programCount = 0;
		this.#meshData = [];
		this.#meshCount = 0;
		this.#loadedProgram = -1;
		this.#textures = [];
		this.#textureCount = 0;

        this.#getWebGLContext();
        this.#drawMode = this.#context.TRIANGLES;
        this.#context.clearColor(1.0, 1.0, 1.0, 1.0);
        this.#context.viewport(0, 0, this.#canvas.width, this.#canvas.height);
        this.#context.enable(this.#context.DEPTH_TEST);
        this.#context.enable(this.#context.CULL_FACE);
    }
	
	createProgram(vertexSrc, fragmentSrc) {
		const program = this.#initShaderProgram(vertexSrc, fragmentSrc);
		
		this.#programs.push(program);
		this.#programCount++;
		
		return this.#programCount-1;
	}
	
	createMeshData(model) {
		const mesh = this.#initMeshData(model);
		
		this.#meshData.push(mesh);
		this.#meshCount++;
		
		return this.#meshCount-1;
	}

	clear() {
        this.#context.clear(this.#context.COLOR_BUFFER_BIT | this.#context.DEPTH_BUFFER_BIT);
	}

	setDrawMode(mode) {
	    switch (mode) {
            case "NORMAL":
                this.#drawMode = this.#context.TRIANGLES;
                break;
            case "WIREFRAME":
                this.#drawMode = this.#context.LINE_STRIP;
                break;
            default:
                console.log("Mode de dibuixat inexistent");
	    }
	}

    drawObjects(objects, camera) {
        const viewMatrix = camera.viewMatrix();
        const projectionMatrix = camera.projectionMatrix();
        const modelViewMatrix = mat4.create();

        objects.forEach(object => {
            const modelMatrix = object.modelMatrix();
            const normalMatrix = mat3.create();

            mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
            mat3.normalFromMat4(normalMatrix, modelMatrix);

            this.#useProgram(object.shader());
            this.#setObjectColor(object.color());
            this.#setModelViewMatrix(modelViewMatrix);
            this.#setNormalMatrix(normalMatrix);
            this.#setProjectionMatrix(projectionMatrix);
            this.#draw(object.mesh(), 3);
        });
    }

    /* ------------------------------ FUNCIONS PRIVADES ------------------------------ */

    #getOrthoProjectionMatrix(width, height) {
        return mat4.ortho(
            mat4.create(),
            -width/2,
            width/2,
            -height/2,
            height/2,
            -1.0,
            1.0
        );
    };

    #draw(mesh, dimensions) {
        this.#bindAttribute(
            this.#programs[this.#loadedProgram].vertexPositionAttr,
            this.#meshData[mesh].vertexBuffer,
            dimensions,
            this.#context.FLOAT
        );

        this.#bindAttribute(
            this.#programs[this.#loadedProgram].vertexNormalAttr,
            this.#meshData[mesh].normalBuffer,
            dimensions,
            this.#context.FLOAT
        );

        this.#bindAttribute(
            this.#programs[this.#loadedProgram].vertexTextureCoordsAttr,
            this.#meshData[mesh].textureBuffer,
            2,
            this.#context.FLOAT
        );

        this.#context.bindBuffer(
            this.#context.ELEMENT_ARRAY_BUFFER,
            this.#meshData[mesh].indexBuffer
        );

        this.#context.drawElements(
            this.#drawMode,
            this.#meshData[mesh].indexCount,
            this.#context.UNSIGNED_SHORT,
            0
        );
    }

    #setModelViewMatrix(matrix) {
        this.#context.uniformMatrix4fv(
            this.#programs[this.#loadedProgram].modelViewMatrix,
            false,
            matrix
        );
    }

    #setNormalMatrix(matrix) {
        this.#context.uniformMatrix3fv(
            this.#programs[this.#loadedProgram].normalMatrix,
            false,
            matrix
        );
    }

    #setProjectionMatrix(matrix) {
        this.#context.uniformMatrix4fv(
            this.#programs[this.#loadedProgram].projectionMatrix,
            false,
            matrix
        );
    }

    #setObjectColor(color) {
        this.#context.uniform3fv(
            this.#programs[this.#loadedProgram].objectColor,
            color
        );
    }

    #bindAttribute(attribute, buffer, size, type) {
        if (!buffer) {
            return;
        }

        this.#context.bindBuffer(this.#context.ARRAY_BUFFER, buffer);
        this.#context.vertexAttribPointer(
            attribute,
            size,
            type,
            false,
            0,
            0
        );
    }

	#initMeshData(model) {
		let vertexBuffer = null;
        let normalBuffer = null;
        let textureBuffer = null;
		let indexBuffer = null;
		const vertexCount = model.vertices.length;
		const indexCount = model.indices.length;

		vertexBuffer = this.#initBuffer(
            this.#context.ARRAY_BUFFER,
            new Float32Array(model.vertices),
            this.#context.STATIC_DRAW
        );

        if (model.normals !== undefined) {
            normalBuffer = this.#initBuffer(
                this.#context.ARRAY_BUFFER,
                new Float32Array(model.normals),
                this.#context.STATIC_DRAW
            );
        }

        if (model.textures !== undefined) {
            textureBuffer = this.#initBuffer(
                this.#context.ARRAY_BUFFER,
                new Float32Array(model.textures),
                this.#context.STATIC_DRAW
            );
        }

        indexBuffer = this.#initBuffer(
            this.#context.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(model.indices),
            this.#context.STATIC_DRAW
        );

		return {
			vertexBuffer,
            normalBuffer,
            textureBuffer,
			indexBuffer,
			vertexCount,
			indexCount
		};
	}
	
	#initBuffer(target, data, usage) {
		let buffer;
		
		buffer = this.#context.createBuffer();
		this.#context.bindBuffer(target, buffer);
		this.#context.bufferData(target, data, usage);
		
		return buffer;
	}

    #useProgram(index) {
        if (index < 0 || index >= this.#programCount) {
            throw "El programa de shaders no existeix";
        }
        else if (index === this.#loadedProgram) {
            return;
        }

        this.#context.useProgram(this.#programs[index]);
        if (this.#programs[index].vertexPositionAttr >= 0) this.#context.enableVertexAttribArray(this.#programs[index].vertexPositionAttr);
        if (this.#programs[index].vertexNormalAttr >= 0) this.#context.enableVertexAttribArray(this.#programs[index].vertexNormalAttr);
        if (this.#programs[index].vertexTextureCoordsAttr >= 0) this.#context.enableVertexAttribArray(this.#programs[index].vertexTextureCoordsAttr);
        this.#loadedProgram = index;
    }

    /**
     * Crea i compila un programa WebGL2.
     *
     * @param {string} vertexSrc codi font del vertex shader
     * @param {string} fragmentSrc codi font del fragment shader
     * @returns {WebGLProgram} el programa compilat
     */
    #initShaderProgram(vertexSrc, fragmentSrc) {
        let program;
        let vertexShader;
        let fragmentShader;

        vertexShader = this.#initShader(this.#context.VERTEX_SHADER, vertexSrc);
        fragmentShader = this.#initShader(this.#context.FRAGMENT_SHADER, fragmentSrc);

        program = this.#context.createProgram();
        this.#context.attachShader(program, vertexShader);
        this.#context.attachShader(program, fragmentShader);
        this.#context.linkProgram(program);
        if (!this.#context.getProgramParameter(program, this.#context.LINK_STATUS)) {
            throw this.#context.getProgramInfoLog(program);
        }

        this.#context.detachShader(program, vertexShader);
        this.#context.detachShader(program, fragmentShader);
        this.#context.deleteShader(vertexShader);
        this.#context.deleteShader(fragmentShader);

		program.vertexPositionAttr = this.#context.getAttribLocation(program, "vertexPosition");
        program.vertexNormalAttr = this.#context.getAttribLocation(program, "vertexNormal");
        program.vertexTextureCoordsAttr = this.#context.getAttribLocation(program, "vertexTextureCoords");

        program.vertexPositionAttr = this.#context.getAttribLocation(program, "vertexPosition");
        program.vertexNormalAttr = this.#context.getAttribLocation(program, "vertexNormal");
        program.vertexTextureCoordsAttr = this.#context.getAttribLocation(program, "vertexTextureCoords");
        program.modelViewMatrix = this.#context.getUniformLocation(program, "modelViewMatrix");
        program.projectionMatrix = this.#context.getUniformLocation(program, "projectionMatrix");
        program.normalMatrix = this.#context.getUniformLocation(program, "normalMatrix");
        program.objectColor = this.#context.getUniformLocation(program, "objectColor");

        return program;
    }

    /**
     * Crea i compila un shader WebGL2.
     * @param {number} type tipus de shader
     * @param {string} src codi font del shader
     * @returns {WebGLShader} el shader compilat
     */
    #initShader(type, src) {
        let shader;

        shader = this.#context.createShader(type);
        this.#context.shaderSource(shader, src);
        this.#context.compileShader(shader);
        if (!this.#context.getShaderParameter(shader, this.#context.COMPILE_STATUS)) {
            throw this.#context.getShaderInfoLog(shader);
        }

        return shader;
    }

    /**
     * Obté el context WebGL2 del canvas.
     * @returns {void}
     */
    #getWebGLContext() {
        this.#context = this.#canvas.getContext("webgl2");
        if (!this.#context) {
            throw "WebGL 2.0 no està disponible";
        }
    }

}