import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { loadEarthquakeData } from "./utils/earthquake.js";

init();

function init() {
    const MinLatitude = -50.29;
    const MaxLatitude = 72.5;
    const MinLongitude = -23.9;
    const MaxLongitude = 190.2;
    const EarthquakeCsvFile = "assets/earthquakes.csv";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.z = 5;

    const Renderer = new THREE.WebGLRenderer();
    Renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(Renderer.domElement);

    const CameraControls = new OrbitControls(camera, Renderer.domElement);

    plane(0, 0, 0, 6.5, 5, scene);

    const earthquakeData = loadEarthquakeData(EarthquakeCsvFile).then(
        (earthquakes) => {
            console.log(earthquakes);
        }
    );

    loop(scene, camera, Renderer);
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
