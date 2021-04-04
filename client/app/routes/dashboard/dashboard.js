import angular from 'angular';
import * as THREE from 'three';
import routeWrap from 'ng-component-routing';
import template from './dashboard.html';
import './dashboard.scss';

const controller = function($element) {
    'ngInject';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth*.8, window.innerHeight*.8 );
    $element[0].appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: "#fe6401" } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    function animate() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;


    	requestAnimationFrame( animate );
    	renderer.render( scene, camera );
    }
    animate();
};

const dashboardComponent = {
  bindings: {},
  routeOpts: {
    name: 'dashboard',
    url: '/',
    pageTitle: 'dashboard',
  },
  template,
  controller,
  controllerAs: 'vm'
};

routeWrap(angular).module('app.routes.dashboard', []).route('dashboard', dashboardComponent);
export default dashboardComponent;
