import angular from 'angular';

//IMPORTS
import './lighting-first-base/lighting-first-base';
import './rotating-camera/rotating-camera';
import './drawing-lines/drawing-lines';
import './dashboard/dashboard';

const routes = angular.module('app.routes', [
  'app.routes.dashboard',
  'app.routes.drawingLines',
  'app.routes.rotatingCamera',
  'app.routes.lightingFirstBase',
]);

export default routes;
