import angular from 'angular';
import * as THREE from 'three';
import { OrbitControls } from './../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import routeWrap from 'ng-component-routing';
import template from './cura-world.html';
import './cura-world.scss';
new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );

const createGrid = (width, height, steps = 10) => {
    const geometry = new THREE.BufferGeometry()
    const points = [];
    const stepsizeHeight = height/steps;
    const stepsizeWidth = width/steps;
    for (var i = 0; i < steps; i++) {

        points.push( new THREE.Vector3( -width/2, 0, i*stepsizeHeight - height/2) );
        points.push( new THREE.Vector3( width/2, 0, i*stepsizeHeight  - height/2) );
        geometry.setFromPoints( points );

        points.push( new THREE.Vector3( i*stepsizeWidth - width/2, 0 , -height/2) );
        points.push( new THREE.Vector3( i*stepsizeWidth  - width/2, 0 , height/2) );
        geometry.setFromPoints( points );
        // points.push( new THREE.Vector3( i*stepsize, 0, -height/2) );
        // points.push( new THREE.Vector3( i*stepsize, 0, height/2) );
        // geometry.setFromPoints( points );

    }
    return geometry;
}

const controller = function($element) {
    'ngInject';


    const renderer = new THREE.WebGLRenderer({alpha: true,});
    renderer.setSize( window.innerWidth*.8, window.innerHeight*.8 );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;


    const scene             = new THREE.Scene({background: "#ffffff"});
    const camera            = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 0.1, 1000 );


    const pedestalGeometry  = new THREE.BoxGeometry(10, 10, 10);
    const pedestalWireframeGeometry = new THREE.EdgesGeometry( pedestalGeometry );
    const pedestalMaterial  = new THREE.LineBasicMaterial( { color: "#ff7800" } );
    const pedestal          = new THREE.LineSegments( pedestalWireframeGeometry, pedestalMaterial );

    const floorGeometry  = new THREE.BoxGeometry(9.9,.001,9.9);
    const floorMaterial  = new THREE.MeshLambertMaterial( { reflectivity: 0, color: "#fff", side: THREE.DoubleSide } );
    const floor          = new THREE.Mesh( floorGeometry, floorMaterial );

    const gridGeometry   = createGrid(10,10, 100)
    const gridMaterial   = new THREE.LineBasicMaterial( { color: "#ededed", linewidth: 1 } );
    const grid           = new THREE.LineSegments( gridGeometry, gridMaterial );

    const gridPrimaryG   = createGrid(10,10, 10)
    const gridPrimaryM   = new THREE.LineBasicMaterial( { color: "#ddd", linewidth: 4 } );
    const gridPrimary    = new THREE.LineSegments( gridPrimaryG, gridPrimaryM );

    const floorShadowGeometry  = new THREE.BoxGeometry(10,.001,10);
    const floorShadowMaterial  = new THREE.ShadowMaterial({opacity: .8});
    const floorShadow          = new THREE.Mesh( floorShadowGeometry, floorShadowMaterial );
    floorShadowMaterial.blending = THREE.NormalBlending;

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
    pedestal.position.y = 5.01;

    floorShadow.receiveShadow = true;
    floorShadow.position.y = floor.position.y+0.01;
    grid.position.y = floor.position.y + .001;
    gridPrimary.position.y = floor.position.y +0.002;

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

    scene.add( pedestal, floor, floorShadow, grid, gridPrimary, cube, ambientLight, spotLight );

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

const curaWorldComponent = {
  bindings: {},
  routeOpts: {
    name: 'curaWorld',
    url: '/cura-world',
    //componentBindings: [],
    //resolve: [],
    pageTitle: 'curaWorld',
  },
  template,
  controller,
  controllerAs: 'vm'
};

routeWrap(angular).module('app.routes.curaWorld', []).route('curaWorld', curaWorldComponent);
export default curaWorldComponent;
