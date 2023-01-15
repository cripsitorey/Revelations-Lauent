
'use strict';

import { logger, database, changePanel } from '../utils.js';
const { Launch, Status } = require('minecraft-java-core');
const { ipcRenderer } = require('electron');
const launch = new Launch();
const pkg = require('../package.json');
// const vvvns = document.querySelector('#vversionS').value;
// console.log(vvvns);

const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? `${process.env.HOME}/Library/Application Support` : process.env.HOME)

class Lowkey {
    static id = "lowkey";
    async init(config) {
        this.config = config
        this.database = await new database().init();
        // this.vnls(); //vanilla selector
        this.lici();
        this.initLaunch();
        this.initBtn();
        this.initSvl();
    }
    

      // vnls() {
      //   document.querySelector('#VS-btn').addEventListener('click', () => {
      //     return(document.querySelector('#vversionS').value);
      // });
      // }

      lici() {
        document.querySelector('#LO-btn').addEventListener('click', () => {
          changePanel('home');
      });
      }

      async initSvl() {
        document.querySelector('#VS-btn').addEventListener('click', async() => {
          let vvvns = document.querySelector('#vversionS').value
          console.log(vvvns);
        })
      }

      async initLaunch() {
        document.querySelector('.play-btn').addEventListener('click', async() => {
            // let vvvns = document.querySelector('#vversionS').value;
            let urlpkg = pkg.user ? `${pkg.url}/${pkg.user}` : pkg.url;
            let uuid = (await this.database.get('1234', 'accounts-selected')).value;
            let account = (await this.database.get(uuid.selected, 'accounts')).value;
            let ram = (await this.database.get('1234', 'ram')).value;
            let javaPath = (await this.database.get('1234', 'java-path')).value;
            let javaArgs = (await this.database.get('1234', 'java-args')).value;
            let Resolution = (await this.database.get('1234', 'screen')).value;
            let launcherSettings = (await this.database.get('1234', 'launcher')).value;
            let screen;

            let playBtn = document.querySelector('.play-btn');
            let info = document.querySelector(".text-download")
            let progressBar = document.querySelector(".progress-bar")

            if (Resolution.screen.width == '<auto>') {
                screen = false
            } else {
                screen = {
                    width: Resolution.screen.width,
                    height: Resolution.screen.height
                }
            }

            let opts = {
                url: this.config.game_url === "" || this.config.game_url === undefined ? `${urlpkg}/files` : this.config.game_url,
                authenticator: account,
                path: `${dataDirectory}/${process.platform == 'darwin' ? this.config.dataDirectory : `.${this.config.dataDirectory}`}`,
                version: vvvns,
                detached: launcherSettings.launcher.close === 'close-all' ? false : true,
                java: this.config.java,
                javapath: javaPath.path,
                args: [...javaArgs.args, ...this.config.game_args],
                screen,
                modde: this.config.modde,
                verify: this.config.verify,
                ignored: this.config.ignored,
                memory: {
                    min: `${ram.ramMin * 1024}M`,
                    max: `${ram.ramMax * 1024}M`
                }
            }

            playBtn.style.display = "none"
            info.style.display = "block"
            launch.Launch(opts);

            launch.on('progress', (DL, totDL) => {
                progressBar.style.display = "block"
                document.querySelector(".text-download").innerHTML = `Descargar ${((DL / totDL) * 100).toFixed(0)}%`
                ipcRenderer.send('main-window-progress', {DL, totDL})
                progressBar.value = DL;
                progressBar.max = totDL;
            })

            launch.on('speed', (speed) => {
                console.log(`${(speed / 1067008).toFixed(2)} Mb/s`)
            })

            launch.on('check', (e) => {
                progressBar.style.display = "block"
                document.querySelector(".text-download").innerHTML = `Verificación ${((DL / totDL) * 100).toFixed(0)}%`
                progressBar.value = DL;
                progressBar.max = totDL;

            })

            launch.on('data', (e) => {
                new logger('Minecraft', '#36b030');
                if(launcherSettings.launcher.close === 'close-launcher') ipcRenderer.send("main-window-hide");
                progressBar.style.display = "none"
                info.innerHTML = `Empenzando...`
                console.log(e);
            })

            launch.on('close', () => {
                if(launcherSettings.launcher.close === 'close-launcher') ipcRenderer.send("main-window-show");
                progressBar.style.display = "none"
                info.style.display = "none"
                playBtn.style.display = "block"
                info.innerHTML = `Verificación`
                new logger('Launcher', '#7289da');
                console.log('Close');
            })
        })
    }

      initBtn() {
        document.querySelector('.settings-btn').addEventListener('click', () => {
            changePanel('settings');
        });
    }
      

    }
    
    
new logger('Lowkey', '#8527D9')
console.log('LLNMQ');
console.log('Bye Crip ya no te quiero cerca');
// const btnrs = document.querySelector('#VS-btn');
// const svrs = document.querySelector('#vversionS')
// btnrs.onclick = (ki) => {
//   ki.preventDefault();
//   console.log(svrs.value)
// };
// console.log(document.querySelector('#vversionS').value)

export default Lowkey;