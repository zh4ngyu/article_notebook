const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path')

const dt = require('./back/data_tools')
const hr = require('./back/https_request')

let mainWindow;
var note = new dt.note_list()








async function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 960,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        //frame: false,
        //titleBarStyle: 'hidden',
        //titleBarOverlay: {
            //color: '#222222',
            //symbolColor: '#74b1be'
        //}
    })
    // and load the index.html of the app.
    mainWindow.loadFile('./index.html')


    // open url in external browser
    var handleRedirect = (e, url) => {
        if(url != mainWindow.webContents.getURL()) {
            e.preventDefault()
            require('electron').shell.openExternal(url)
        }
    }
    mainWindow.webContents.on('will-navigate', handleRedirect);
    mainWindow.webContents.on('new-window', handleRedirect);
  

    // log console message to terminal
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        const script_name = sourceId.split('/').join('\\').split('\\').slice(-1)[0]
        console.log(message +"    ---"+ script_name+" line "+line);
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}


app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})


// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})




ipcMain.handle('article', (event, doi) => {
    return dt.get_article(doi)
})

ipcMain.on("test", (event, args) => {
        // Do something with file contents
        console.log(args)
        // Send result back to renderer process
        event.reply("test_back", 'another some test data');
});

ipcMain.on('article', (event, doi)=>{
    var article = dt.get_article(doi, (data)=>{
        event.reply('return_article_'+doi, data)
    })
    //event.returnValue = article
})

ipcMain.on('ref_list', (event, args)=>{
    var ref_list = new dt.ref_list(args)
    event.returnValue = ref_list
})

ipcMain.on('search_note', (event, string, key)=>{
    console.log('search "' +string+'" in key: '+key)
    var ind = note.search(string, key)
    var notes = note.get_note(ind)
    event.returnValue = {ind, notes}
})

ipcMain.on('edit_note', (event, args, ind)=>{
    var {from, to, comment} = args
    note.edit(from, to, comment, ind)
    note.save()
    event.returnValue = 1
})

ipcMain.on('save_ref_list', (event, doi, refs) => {
    var ref_list = new dt.ref_list(doi)
    ref_list.list = refs
    ref_list.save()
    event.returnValue = 1
})










let temp = hr.get_content('https://www.google.com/search?q=javascript+https+timeout')
temp.then((value)=>{console.log(value)})




//var inst = new dt.note_list('comment','./default_data_folder')
//console.log(inst.string())
//inst.add('a','gee','bla')
//console.log(inst.search('bla'))



//dt.load_data('10.1038/s41567-018-0224-7')

//console.log(`test valid path: ${dt.to_path('adfpas/ \\ : * ? " < > ||||')}`)
//console.log(`test isDOI: ${dt.is_doi('http://link.aps.org/supplemental/10.1103/PhysRevLett.119.246402')}`)





//var b = dt.get_article('10.1038/nature25777')
//console.log(b.string())
//var c = dt.get_article('https://arxiv.org/abs/1708.03636')
//console.log(c.string())