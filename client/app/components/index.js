import angular from 'angular';

//IMPORTS
import './menu/menu';

const components = angular.module('app.components', [
  'app.components.menu',
]);

export default components;
