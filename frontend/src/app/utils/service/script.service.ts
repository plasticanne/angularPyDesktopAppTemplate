import { Injectable } from "@angular/core";
import { ScriptStore } from "./scriptStore";

declare var document: any;

@Injectable()
export class ScriptService {

    protected scripts: any = {};

    constructor() {
        ScriptStore.forEach((script: any) => {
            this.scripts[script.name] = {
                loaded: false,
                src: script.src
            };
        });
    }

    load(...scripts: string[]) {
        var promises: any[] = [];
        scripts.forEach((script) => promises.push(this.loadScript(script)));
        return Promise.all(promises);
    }
        loadOnce(...scripts: string[]) {
        var promises: any[] = [];
        scripts.forEach((script) => promises.push(this.loadScriptOnce(script)));
        return Promise.all(promises);
        }

    loadScriptOnce(name: string) {
        return new Promise((resolve, reject) => {
            //resolve if already loaded
            if (this.scripts[name].loaded) {
                this._checkLoad(name, resolve, reject)
            } else {
                //load script
                this._loadSetting(name, resolve, reject)
            }
        });
    }
    loadScript(name: string) {
        return new Promise((resolve, reject) => {
            this._loadSetting(name, resolve, reject)
        })
    }


    _loadSetting(name, resolve, reject) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {  //IE
            script.onreadystatechange = () => {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    this.scripts[name].loaded = true;
                    resolve({ script: name, loaded: true, status: 'Loaded' });
                }
            };
        } else {  //Others
            script.onload = () => {
                this.scripts[name].loaded = true;
                resolve({ script: name, loaded: true, status: 'Loaded' });
            };
        }
        script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script)
    }
    _checkLoad(name, resolve, reject) {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
    }


}