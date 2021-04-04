import angular from 'angular';
import template from './menu.html';
import './menu.scss';

const menuComponent = {
  bindings: {},
  template,
  controller: function($state) {
    'ngInject';

    this.name = 'menu';

    this.$onInit = () => {
      //bindings available here
    };
    this.state = $state
  },
  controllerAs: 'vm'
};

angular.module('app.components.menu', []).component('menu', menuComponent);
export default menuComponent;
