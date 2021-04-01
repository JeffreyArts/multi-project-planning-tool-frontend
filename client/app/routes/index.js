import angular from 'angular';

//IMPORTS
import './csg/csg';
import './cura-world/cura-world';
import './orbit-controls/orbit-controls';
import './lighting-first-base/lighting-first-base';
import './rotating-camera/rotating-camera';
import './drawing-lines/drawing-lines';
import './dashboard/dashboard';

const routes = angular.module('app.routes', [
  'app.routes.dashboard',
  'app.routes.drawingLines',
  'app.routes.rotatingCamera',
  'app.routes.lightingFirstBase',
  'app.routes.orbitControls',
  'app.routes.curaWorld',
  'app.routes.csg',
]);

export default routes;
