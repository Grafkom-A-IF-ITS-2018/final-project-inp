'use strict'

class RenderController {
    constructor(scene, menuController) {
        this._renderEngine = new THREE.WebGLRenderer();
        this._renderEngine.setPixelRatio( window.devicePixelRatio );
        this._renderEngine.vr.enabled = true;
        document.body.appendChild( WEBVR.createButton( this._renderEngine ) );
        this._scene = scene;
        this._camera = scene.camera;

        this._scene.sceneElement.appendChild(this._renderEngine.domElement)

        this._controller = this._renderEngine.vr.getController(0);
        this._scene.add(this._controller);

        window.addEventListener( 'vrdisplaypointerrestricted', onPointerRestricted, false );
		window.addEventListener( 'vrdisplaypointerunrestricted', onPointerUnrestricted, false );

        this.setFrame();
        
        this.render = this.render.bind(this);

        this.render();

        this.frameEvent = new CustomEvent('frame');

        this.menuController = menuController;
    }

    render() {
        this._renderEngine.setAnimationLoop(()=>{
            document.dispatchEvent(this.frameEvent);
            TWEEN.update();
            this.menuController.updateUserInterface();
            this._renderEngine.render(this._scene, this._camera);
        })
    }

    setFrame() {
        let framecontainer = document.getElementById('solar-system');
        this._renderEngine.setSize(window.innerWidth, window.innerHeight);

        if (framecontainer) {
            framecontainer.appendChild(this._renderEngine.domElement);
        } else {
            document.body.appendChild(this._renderEngine.domElement);
        }
    }
}

function onPointerRestricted() {

    var pointerLockElement = renderer.domElement;
    if ( pointerLockElement && typeof ( pointerLockElement.requestPointerLock ) === 'function' ) {
        pointerLockElement.requestPointerLock();

    }

}

function onPointerUnrestricted() {

    var currentPointerLockElement = document.pointerLockElement;
    var expectedPointerLockElement = renderer.domElement;
    if ( currentPointerLockElement && currentPointerLockElement === expectedPointerLockElement && typeof ( document.exitPointerLock ) === 'function' ) {

        document.exitPointerLock();

    }

}

export default RenderController;