import angular from 'angular';
import _ from 'lodash';
import routeWrap from 'ng-component-routing';
import template from './polyline-test.html';
import './polyline-test.scss';

import vpg from 'visual-pattern-generator';
import { CSG } from 'three-csg-ts';
import * as THREE from 'three';
import { OrbitControls } from './../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';

const symbols = [];
symbols.push(_.merge({}, {
    polylines: [
        [{x:0, y:0},{ x:1, y:0}]
    ],
    connectCords: [
        {
            x:0, y:0
        },
        {
            x:1, y:0
        }
    ],
    width:2,
    height:1
}));

symbols.push(_.merge({}, {
    polylines: [
        [{x:0, y:0},{ x:0, y:1}]
    ],
    connectCords: [
        {
            x:0, y:0
        },
        {
            x:0, y:1
        }
    ],
    width:1,
    height:2
}));

var patternInput = {
    seed: (Math.round(Math.random()*10000)),
    width: 8,
    height: 8,
    symbols: symbols,
    algorithm: {
        type: "default",
        mirrorX: 1,
        mirrorY: 1,
        drawConnectLines: true,
        mask: [
            [  1, 1, 0, 0, 0, 0, 1, 1],
            [  1, 0, 0, 0, 0, 0, 0, 1],
            [  0, 0, 0, 0, 0, 0, 0, 0],
            [  0, 0, 0, 0, 0, 0, 0, 0],
            [  0, 0, 0, 0, 0, 0, 0, 0],
            [  0, 0, 0, 0, 0, 0, 0, 0],
            [  1, 0, 0, 0, 0, 0, 0, 1],
            [  1, 1, 0, 0, 0, 0, 1, 1]
        ],
    }
};

const createLine = (polylines, type = "box", options = {tube: false, shadow: false}) => {
    var result = new THREE.Group();
    type = _.isUndefined(type) ? "box" : type
    if (type.indexOf["box", "cylinder"] == -1) {
        return console.error("Provide correct type ('box' or 'cylinder')")
    }



    if (type == "cylinder") {
        var segments = options.segments || 32;
        var thickness = options.thickness || .5;
    }

    if (type == "box") {
        var thickness = options.width || .5;
        var height = options.height || .5;
    }

    polylines.forEach((polyline, i) => {
        const points = [];

        polyline.forEach((cord, ii) => {
            if (ii == 0) {
                return;
            }

            var length = 0;
            var xOffset = cord.x;
            var zOffset = cord.z;

            if (polyline[ii-1].x == polyline[ii].x) {

                // Set length
                if (polyline[ii-1].z > polyline[ii].z) {
                    length = polyline[ii-1].z - polyline[ii].z + thickness*2;
                    zOffset += length/2 - thickness
                } else {
                    length = polyline[ii].z - polyline[ii-1].z + thickness*2;
                    zOffset -= length/2 - thickness;
                }

                if (type == "cylinder") {
                    var geometry = new THREE.CylinderGeometry(thickness, thickness , length, segments);
                } else if (type == "box") {
                    length -= thickness
                    var geometry = new THREE.BoxGeometry(thickness, length, height);
                }
                geometry.rotateX(Math.PI/180*90);


            } else if (polyline[ii-1].z == polyline[ii].z) {

                // Set length
                if (polyline[ii-1].x > polyline[ii].x) {
                    length = polyline[ii-1].x - polyline[ii].x + thickness*2;
                    xOffset += length/2 - thickness
                } else {
                    length = polyline[ii].x - polyline[ii-1].x + thickness*2;
                    xOffset -= length/2 - thickness;
                }

                if (type == "cylinder") {
                    var geometry = new THREE.CylinderGeometry(thickness, thickness , length, segments);
                } else if (type == "box") {
                    length -= thickness
                    var geometry = new THREE.BoxGeometry(thickness, length, height);
                }

                geometry.rotateZ(Math.PI/180*90);
                geometry.rotateX(Math.PI/180*90); // Only required for box type

            } else {
                console.error('Unsupported input', polyline[ii], polyline[ii-1]);
            }

            if (height) {
                geometry.translate(xOffset, height/2, zOffset)
            } else {
                geometry.translate(xOffset, thickness, zOffset)
            }

            var r = 255 - Math.floor(Math.random()*20)
            var g = 60 + Math.floor(Math.random()*50)
            var b = 0//Math.floor(Math.random()*255)
            var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: `rgb(${r},${g},${b})` } ))
            mesh.castShadow = !_.isUndefined(options.shadow) ? options.shadow : false;
            result.add(mesh)
        });

    });
    return result;
}


const controller = function($element, createWorld) {
    'ngInject';

    const dimensions = {width: 10, height:8, depth:10}


    const renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize( window.innerWidth*.8, window.innerHeight*.8 );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;


    const scene             = new THREE.Scene({background: "#ffffff"});
    const camera            = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

    createWorld(dimensions, scene);

    const generatePattern = (patternInput) => {
        return _.map( vpg(patternInput),polylines => {
            return _.map(polylines,polyline => {
                return _.map(polyline, cord => {
                    return {x: cord.x, z: cord.y};
                })
            })
        })[0]
    }
    var pattern = generatePattern(patternInput);
    // pattern = [
    //     [{x:0,z:0}, {x:0,z:1}],
    //     [{x:0,z:1}, {x:1,z:1}],
    //     [{x:1,z:1}, {x:1,z:0}],
    //     [{x:1,z:0}, {x:0,z:0}],
    // ]

    // var line = createLine(pattern,"cylinder", {thickness: 0.2, segments: 64});
    var lineGroup = createLine(pattern,"box", {width: .5, height:5});
    // line.position.x -= 1
    // line.position.z -= 1
    lineGroup.position.x -= patternInput.width/2 - .5
    lineGroup.position.z -= patternInput.height/2 - .5
    scene.add(lineGroup);


    // Controls
    const controls = new OrbitControls( camera, renderer.domElement );
    $element[0].appendChild( renderer.domElement );

    // camera.position.z = dimensions.depth*2.5;
    camera.position.y = dimensions.height*2;

    controls.update();

    function animate() {
        // Create a generic rotation matrix that will rotate an object
        // The math here just makes it rotate every 'period' seconds.


        // Make camera look at the box.
        camera.lookAt(0,0,0);

        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }
    animate();

    this.regeneratePattern = () => {
        // selectedObject = scene.getObjectById(line.id);
        lineGroup.clear();
        patternInput.seed = (Math.round(Math.random()*10000));
        var pattern = generatePattern(patternInput);

        scene.remove( scene.getObjectById(lineGroup.id) );
        lineGroup = createLine(pattern,"box", {width: .25, height:5});
        lineGroup.position.x -= patternInput.width/2 - .5
        lineGroup.position.z -= patternInput.height/2 - .5

        scene.add(lineGroup)
    }


};

const polylineTestComponent = {
  bindings: {},
  routeOpts: {
    name: 'polylineTest',
    url: '/polyline-test',
    //componentBindings: [],
    //resolve: [],
    pageTitle: 'polylineTest',
  },
  template,
  controller,
  controllerAs: 'vm'
};

routeWrap(angular).module('app.routes.polylineTest', []).route('polylineTest', polylineTestComponent);
export default polylineTestComponent;
