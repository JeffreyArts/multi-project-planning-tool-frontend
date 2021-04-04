import angular from 'angular';

import * as THREE from 'three';

const createWorldService = function() {
    'ngInject'

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
    return (dimensions, scene) => {

        // Objects
        const pedestalGeometry  = new THREE.BoxGeometry(dimensions.width+.01, dimensions.height, dimensions.depth+.01);
        const pedestalWireframeGeometry = new THREE.EdgesGeometry( pedestalGeometry );
        const pedestalMaterial  = new THREE.LineBasicMaterial( { color: "#ff7800" } );
        const pedestal          = new THREE.LineSegments( pedestalWireframeGeometry, pedestalMaterial );

        const floorGeometry  = new THREE.BoxGeometry(dimensions.width,.005,dimensions.depth);
        const floorMaterial  = new THREE.MeshLambertMaterial( { color: "#fff" } );
        const floor          = new THREE.Mesh( floorGeometry, floorMaterial );

        const gridGeometry   = createGrid(dimensions.width,dimensions.depth, 100)
        const gridMaterial   = new THREE.LineBasicMaterial( { color: "#ededed", linewidth: 1 } );
        const grid           = new THREE.LineSegments( gridGeometry, gridMaterial );

        const gridPrimaryG   = createGrid(dimensions.width,dimensions.depth, 10)
        const gridPrimaryM   = new THREE.LineBasicMaterial( { color: "#ddd", linewidth: 4 } );
        const gridPrimary    = new THREE.LineSegments( gridPrimaryG, gridPrimaryM );

        const floorShadowGeometry  = new THREE.BoxGeometry(dimensions.width,.001,dimensions.depth);
        const floorShadowMaterial  = new THREE.ShadowMaterial({opacity: .8});
        const floorShadow          = new THREE.Mesh( floorShadowGeometry, floorShadowMaterial );
        floorShadowMaterial.blending = THREE.NormalBlending;


        // Lights
        const ambientLight      = new THREE.AmbientLight( "#fffaea", .2);
        const spotLight         = new THREE.SpotLight("#fffaea", dimensions.height/10*2, dimensions.width*dimensions.depth/2 ,Math.PI/360*180 ,0);

        pedestal.receiveShadow = false;
        pedestal.position.y = dimensions.height/2+.01;
        pedestal.position.x -= .005;
        pedestal.position.z -= .005;

        floorShadow.receiveShadow = true;
        floorShadow.position.y = floor.position.y+0.01;
        grid.position.y = floor.position.y + .01;
        gridPrimary.position.y = floor.position.y +0.02;

        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024; // default
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 100;
        spotLight.shadow.camera.fov = 30;

        spotLight.position.x = 0
        spotLight.position.y = dimensions.height*1.5
        spotLight.position.z = 0
        spotLight.lookAt(0,0,0)

        // scene.add( ambientLight, spotLight );
        scene.add( pedestal, floor, floorShadow, grid, gridPrimary, ambientLight, spotLight );

    }

};

angular.module('app.services.createWorld', []).service('createWorld', createWorldService);
export default createWorldService;
