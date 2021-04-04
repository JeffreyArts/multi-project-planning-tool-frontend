import angular from 'angular';
import * as THREE from 'three';
import routeWrap from 'ng-component-routing';
import template from './rotating-camera.html';
import './rotating-camera.scss';

const controller = function($element) {
    'ngInject';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth*.8, window.innerHeight*.8 );
    $element[0].appendChild( renderer.domElement );

    const pedestalGeometry = new THREE.BoxGeometry(10,10,10);
    const pedestalMaterial = new THREE.MeshBasicMaterial( { color: "#eee" } );
    const pedestal = new THREE.Mesh( pedestalGeometry, pedestalMaterial );
    pedestal.position.y = -5.5;

    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshBasicMaterial( { color: "#fe6401" } );
    const cube = new THREE.Mesh( geometry, material );

    scene.add( pedestal );
    scene.add( cube );


    var period = 1;
    var clock = new THREE.Clock();
    var matrix = new THREE.Matrix4(); // Pre-allocate empty matrix for performance. Don't want to make one of these every frame.

    new THREE.Vector3(0,0,0)
    camera.position.z = 10;
    camera.position.y = 5;

    function animate() {
        // Create a generic rotation matrix that will rotate an object
        // The math here just makes it rotate every 'period' seconds.
        matrix.makeRotationY( clock.getDelta() * Math.PI/180 / period);

        // Apply matrix like this to rotate the camera.
        camera.position.applyMatrix4(matrix);

        // Make camera look at the box.
        camera.lookAt(cube.position);

    	requestAnimationFrame( animate );
    	renderer.render( scene, camera );
    }
    animate();
};

const rotatingCameraComponent = {
  bindings: {},
  routeOpts: {
    name: 'rotatingCamera',
    url: '/rotating-camera',
    //componentBindings: [],
    //resolve: [],
    pageTitle: 'rotatingCamera',
  },
  template,
  controller,
  controllerAs: 'vm'
};

routeWrap(angular).module('app.routes.rotatingCamera', []).route('rotatingCamera', rotatingCameraComponent);
export default rotatingCameraComponent;
