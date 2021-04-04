import angular from 'angular';
import * as THREE from 'three';
import routeWrap from 'ng-component-routing';
import template from './drawing-lines.html';
import './drawing-lines.scss';

const controller = function($element) {
    'ngInject';

    this.name = 'drawingLines';

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth*.8, window.innerHeight*.8 );
    $element[0].appendChild( renderer.domElement );

    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set( 0, 0, 100 );
    camera.lookAt( 0, 0, 0 );

    const scene = new THREE.Scene();

    const material = new THREE.LineBasicMaterial( { color: "#fe6401" } );
    const points = [];
    points.push( new THREE.Vector3( - 10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 10, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const line = new THREE.Line( geometry, material );

    scene.add( line );
    var tilt = 1;
    function animate() {
        if (line.rotation.y > 2) {
            tilt = -1
        } else if (line.rotation.y < -2) {
            tilt = 1
        }

        line.rotation.x += 0.005;
        line.rotation.y += 0.01*tilt;


    	requestAnimationFrame( animate );
    	renderer.render( scene, camera );
    }
    animate();

};

const drawingLinesComponent = {
  bindings: {},
  routeOpts: {
    name: 'drawingLines',
    url: '/drawing-lines',
    //componentBindings: [],
    //resolve: [],
    pageTitle: 'drawingLines',
  },
  template,
  controller,
  controllerAs: 'vm'
};

routeWrap(angular).module('app.routes.drawingLines', []).route('drawingLines', drawingLinesComponent);
export default drawingLinesComponent;
