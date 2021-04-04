import angular from 'angular';

//IMPORTS
import './create-world';

const services = angular.module('app.services', [
  'app.services.createWorld',
]);

export default services;
