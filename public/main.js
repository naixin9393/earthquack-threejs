import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

init();

function init() {
    const minLatitude = -50.29;
    const maxLatitude = 72.5;
    const minLongitude = -23.9;
    const maxLongitude = 190.2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.z = 5;

 	const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let cameraControls = new OrbitControls(camera, renderer.domElement);

    plane(0, 0, 0, 6.5, 5, scene);

    loop(scene, camera, renderer);
}

function loop(scene, camera, renderer) {
    requestAnimationFrame(() => loop(scene, camera, renderer));
    renderer.render(scene, camera);
}

function plane(x, y, z, width, height, scene) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({});
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(x, y, z);
    scene.add(plane);
	loadTexture("assets/europe-asia.png", plane, width, height);
}

function loadTexture(url, map, mapWidth, mapHeight) {
    return new THREE.TextureLoader().load(
        url,

        function (texture) {
            map.material.map = texture;
            map.material.needsUpdate = true;
        }
    );
}
