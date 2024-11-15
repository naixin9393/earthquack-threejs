import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { loadEarthquakeData } from "./utils/earthquake.js";

let currentDateTime;
let earthquakes;
let currentEarthquakes = [];
let dateElement;
const mapWidth = 6.5;
const mapHeight = 5;

init();

function init() {
    const startDateTime = new Date(2023, 11, 1);
    currentDateTime = startDateTime;

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

    createDateElement();

    camera.position.z = 5;

    const Renderer = new THREE.WebGLRenderer();
    Renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(Renderer.domElement);

    const CameraControls = new OrbitControls(camera, Renderer.domElement);

    plane(0, 0, 0, mapWidth, mapHeight, scene);

    const earthquakeData = loadEarthquakeData(EarthquakeCsvFile).then((eq) => {
        earthquakes = eq;
        loop(scene, camera, Renderer);
    });
}

function loop(scene, camera, renderer) {
    requestAnimationFrame(() => loop(scene, camera, renderer));
    currentDateTime = new Date(currentDateTime.getTime() + 100000);
    dateElement.innerHTML = currentDateTime.toString();
    drawEarthquakes(scene);
    renderer.render(scene, camera);
}

function createDateElement() {
    dateElement = document.createElement("div");
    dateElement.style.position = "absolute";
    dateElement.style.width = "100%";
    dateElement.style.textAlign = "center";
    dateElement.style.color = "#fff";
    dateElement.style.fontWeight = "bold";
    dateElement.style.backgroundColor = "black";
    dateElement.style.zIndex = "1";
    dateElement.style.fontFamily = "Monospace";
    dateElement.innerHTML = "";
    document.body.appendChild(dateElement);
}

function drawEarthquakes(scene) {
    const filteredEarthquakes = filterEarthquakes(earthquakes);
    removeNonVisibleEarthquakes(scene, filteredEarthquakes);
    addNewEarthquakes(scene, filteredEarthquakes);
    updateEarthquakeColors(scene);
}

function filterEarthquakes(earthquakes) {
    // Mostrar terremotos en durante 4 horas
    const endDateTime = new Date(currentDateTime.getTime() + 14400000);
    return earthquakes.filter((earthquake) => {
        const dateTime = new Date(earthquake.dateTime);
        return dateTime >= currentDateTime && dateTime < endDateTime;
    });
}

function removeNonVisibleEarthquakes(scene, visibleEarthquakes) {
    currentEarthquakes.forEach((earthquake) => {
        let found = false;
        visibleEarthquakes.forEach((visibleEarthquake) => {
            if (earthquake.earthquake.dateTime === visibleEarthquake.dateTime) {
                found = true;
            }
        });
        if (!found) {
            scene.remove(earthquake.mesh);
            currentEarthquakes.splice(
                currentEarthquakes.indexOf(earthquake),
                1
            );
        }
    });
}

function addNewEarthquakes(scene, visibleEarthquakes) {
    visibleEarthquakes.forEach((earthquake) => {
        let found = false;
        currentEarthquakes.forEach((currentEarthquake) => {
            if (earthquake.dateTime === currentEarthquake.earthquake.dateTime) {
                found = true;
            }
        });
        if (!found) {
            const geometry = new THREE.SphereGeometry(0.05, 4, 4);
            const material = new THREE.MeshBasicMaterial({ color: 0xdd0000 });
            const latitude = parseFloat(earthquake.latitude);
            const longitude = parseFloat(earthquake.longitude);
            const x = ((longitude + 180) / 360) * mapWidth - mapWidth / 2;
            const y = ((latitude + 90) / 180) * mapHeight - mapHeight / 2;
            const z = 0.01;
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(x, y, z);
            scene.add(sphere);
            currentEarthquakes.push({ earthquake: earthquake, mesh: sphere });
        }
    });
}

function updateEarthquakeColors(scene) {
    currentEarthquakes.forEach((earthquake) => {
        const dateTime = new Date(earthquake.earthquake.dateTime);
        earthquake.mesh.material.color.add(new THREE.Color(0x001100));
    });
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
    return new THREE.TextureLoader().load(url, function (texture) {
        map.material.map = texture;
        map.material.needsUpdate = true;
    });
}
