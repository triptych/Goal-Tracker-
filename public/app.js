// updating to new app architecture
import { helloWorld } from './helpers.js';

const App = {
  init() {
    console.log('App.init()');
  },
  hello() {
    console.log('App.hello()', helloWorld());

  },
}

App.init();
App.hello();