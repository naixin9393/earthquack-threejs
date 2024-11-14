import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

init();

function init() {
    const minLatitude = -50.29;
    const maxLatitude = 72.5;
    const minLongitude = -23.9;
    const maxLongitude = 190.2;

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    camera.position.z = 5;

    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  
    let cameraControls = new OrbitControls(camera, renderer.domElement);
}