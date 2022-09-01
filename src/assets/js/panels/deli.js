
'use strict';

import { logger, database, changePanel } from '../utils.js';


class Deli {
    static id = "deli";
    async init(config) {
        this.config = config
        this.database = await new database().init();
        this.cepe();
    }

      cepe() {
        document.querySelector('#EC-btn').addEventListener('click', () => {
          changePanel('home');
      });
      }
    }
    
    
new logger('Eternal', '#8527D9')
console.log('hola');
console.log('xd');

export default Deli;