console.log('preload.js')


//window.addEventListener('DOMContentLoaded', () => {
  //  console.log('DOM loaded')
//})

  

const { contextBridge, ipcRenderer} = require('electron')

/*
to_main = [
    'test',
    'article',
    'ref_list',
    'search_note',
    'edit_note'
]
from_main = [
    'test_back',
    'return_article'
]
*/


// for using ipcRenderer in renderer.js
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, ...args) => {
            // whitelist channels
            //let validChannels = to_main;
            //if (validChannels.includes(channel)) {
                //console.log('valid send channel: '+ channel)
                ipcRenderer.send(channel, ...args);
            //}
        },
        receive: (channel, func) => {
            //let validChannels = from_main;
            //if (validChannels.includes(channel)) {
                //console.log('valid recieve channel: '+ channel + ', build listener')
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            //}
        },
        send_syn: (channel, ...args) => {
            // whitelist channels
            //let validChannels = to_main;
            //if (validChannels.includes(channel)) {
                //console.log('valid send channel: '+ channel)
                return ipcRenderer.sendSync(channel, ...args);
            //}
        },
        invoke: (channel, ...args) => {
            return ipcRenderer.invoke(channel, ...args).then((result) => {
                return result
            })
        }
    }
);