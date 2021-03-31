import angular from 'angular';
import * as THREE from 'three';
import { OrbitControls } from './../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import routeWrap from 'ng-component-routing';
import template from './orbit-controls.html';
import './orbit-controls.scss';


const controller = function($element) {
    'ngInject';


    const renderer = new THREE.WebGLRenderer({alpha: true,});
    renderer.setSize( window.innerWidth*.8, window.innerHeight*.8 );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;


    const scene             = new THREE.Scene({background: "#ffffff"});
    const camera            = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


    const pedestalGeometry  = new THREE.BoxGeometry(10,.001,10);
    // const pedestalMaterial  = new THREE.MeshLambertMaterial( { color: "#fff" } );
    const pedestalMaterial  = new THREE.MeshBasicMaterial( { color: "#fff" } );
    const pedestal          = new THREE.Mesh( pedestalGeometry, pedestalMaterial );

    const floorGeometry  = new THREE.BoxGeometry(10,.001,10);
    const floorMaterial  = new THREE.ShadowMaterial( );
    const floor          = new THREE.Mesh( floorGeometry, floorMaterial );

    const geometry          = new THREE.BoxGeometry(1,1,1);
    const material          = new THREE.MeshLambertMaterial( { color: "#333" } );
    const cube              = new THREE.Mesh( geometry, material );

    const ambientLight      = new THREE.AmbientLight( "#fffaea", .2);
    const spotLight         = new THREE.SpotLight("#fffaea", 2, 50 ,Math.PI/360*120 ,0);
    const controls          = new OrbitControls( camera, renderer.domElement );

    $element[0].appendChild( renderer.domElement );

    cube.castShadow = true;
    cube.position.y = .5;


    pedestal.receiveShadow = false;
    pedestal.position.y = 0;

    floor.receiveShadow = true;
    floor.position.y = pedestal.position.y+0.001;

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024; // default
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 100;
    spotLight.shadow.camera.fov = 30;

    spotLight.position.x = 5
    spotLight.position.y = 20
    spotLight.position.z = 0
    spotLight.lookAt(0,0,0)

    scene.add( pedestal, floor, cube, ambientLight, spotLight );


    var period = 1;
    var clock = new THREE.Clock();
    var matrix = new THREE.Matrix4(); // Pre-allocate empty matrix for performance. Don't want to make one of these every frame.

    new THREE.Vector3(0,0,0)
    camera.position.z = 10;
    camera.position.y = 5;

    controls.update();

    function animate() {
        // Create a generic rotation matrix that will rotate an object
        // The math here just makes it rotate every 'period' seconds.


        // Make camera look at the box.
        camera.lookAt(cube.position);

        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }
    animate();


};

const orbitControlsComponent = {
  bindings: {},
  routeOpts: {
    name: 'orbitControls',
    url: '/orbit-controls',
    //componentBindings: [],
    //resolve: [],
    pageTitle: 'orbitControls',
  },
  template,
  controller,
  controllerAs: 'vm'
};

routeWrap(angular).module('app.routes.orbitControls', []).route('orbitControls', orbitControlsComponent);
export default orbitControlsComponent;
