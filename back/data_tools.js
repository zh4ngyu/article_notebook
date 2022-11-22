



const fs = require('fs');
const f = require('./folder_config.json')
var https_request = require('./https_request')



var test = {
    name: 'dt_test',
    show: function(){console.log('name is: '+this.name)}
}


function check_empty(obj) {
    for (var i in obj) return false;
    return true;
}

function check_folder(folder){
    if (!fs.existsSync(folder)){
        console.log(`Directory [${folder}] not found. Create directory.`)
        fs.mkdirSync(folder, { recursive: true });
    }
}


function text2filename(text){
    var filename = text
    if (is_url(text)){
        filename = filename.slice(6)
    }
    if (filename.length > 25){
        filename = '_'+filename.slice(filename.length-25)
    }
    filename = to_path(filename)
    return filename
}

function to_path(string){
    if (!string instanceof String){
        console.log(`"${string}" is not String`)
        return 
    }
    return string.replaceAll(/\\|\/|\:|\*|\?|\"|\<|\>|\|/gi, '_')
}

function is_doi(string){
    if (!string instanceof String){
        console.log(`"${string}" is not String`)
        return 
    }
    return /\./.test(string) && !/ |http/.test(string)
}

function is_url(string){
    if (!string instanceof String){
        console.log(`"${string}" is not String`)
        return 
    }

    var matches = string.match(/\bhttps?:\/\/\S+/gi);

    if (check_empty(matches)){
        return false
    }else{
        return(matches[0])
    }
}





class data_object{
    constructor(filename = 'data', folder = './default_data_folder'){
        check_folder(folder)
        this.filename = filename
        this.folder = folder
        this.loaded = this.auto_load()
    }
    string(){
        return JSON.stringify(this, null, 4)
    }
    save(path = this.folder+'/'+this.filename+'.json'){
        console.log('save to '+path)
        delete this.loaded
        fs.writeFileSync(path, this.string()); 
    }
    auto_load(path = this.folder+'/'+this.filename+'.json'){
        if(fs.existsSync(path)){
            console.log('load '+path)
            let obj = JSON.parse(fs.readFileSync(path, 'utf8'));
            delete obj.filename
            delete obj.folder
            Object.assign(this, obj)
            return true
        }else{
            return false
        }
    }
}


class article_text extends data_object{
    constructor(text, folder = f.article_text){
        var filename = text2filename(text)
        super(filename, folder)
        this.text = text
    }

    load(){
        return new Promise((resolve, reject)=>{
            if (this.loaded){
                resolve(this)
                return
            }

            if (is_url(this.text)){
                this.url = this.text
                https_request.get_title(this.url).then((title)=>{
                    this.title = title
                    this.save()
                    resolve(this)
                    return
                })
            }else{
                this.url = 'https://www.google.com/search?q=' + this.text
                this.title = this.text
                this.save()
                resolve(this)
                return
            }            
        })
    }
}



class article extends data_object{
    constructor(doi, folder = f.article_doi){
        var filename = to_path(doi)
        super(filename, folder)
        this.doi = doi
    }

    load(){
        return new Promise((resolve, reject)=>{
            if (this.loaded){
                resolve(this)
                return
            }

            let url = 'https://api.crossref.org/works/'+ this.doi

            https_request.get_json(url).then((data)=>{

                this.title = data.message.title[0]
    
                var author = data.message.author
                this.author = author[0].given + ' ' + author[0].family + ', ' 
                + author[author.length - 1].given + ' ' + author[author.length - 1].family
    
    
                var date = data.message.published['date-parts'][0]
                if (date.length > 0){
                    var year = date[0]
                }else{ var year = 1 }
                
                if (date.length > 1){
                    var month = date[1]
                }else{ var month = 1 }
                
                if (date.length > 2){
                    var day = date[2]
                }else{ var day = 1 }
    
                this.publish_date = year.toString().padStart(4,'0') 
                + '-' + month.toString().padStart(2,'0') 
                + '-' +day.toString().padStart(2,'0')
    
    
                this.url = 'https://doi.org/' + this.doi
    
                this.publisher = data.message.publisher
    
                this.journal = data.message['container-title'][0]
    
                if (data.message.hasOwnProperty('abstract')){
                    this.abstract = data.message.abstract
                }
    
                this.ref = []
                if (data.message.hasOwnProperty('reference')){
                    var ref = data.message.reference
                    for (let i in ref){
                        if (ref[i].hasOwnProperty('DOI')){
                            this.ref.push(ref[i]['DOI'])
                        }else if (ref[i].hasOwnProperty('unstructured')){
    
                            var string = ref[i]['unstructured']
                            var matches = string.match(/\bhttps?:\/\/\S+/gi);
    
                            if (check_empty(matches)){
                                this.ref.push(ref[i]['unstructured'])
                            }else{
                                this.ref.push(matches[0])
                            }
                        }
                    }
                }
                
                this.save()
                resolve(this)
                return
            })
            .catch((e)=>{
                console.log('failed to request article', e)
                reject()
            })
        })
    }
}


class ref_list extends data_object{
    constructor(doi, folder = f.ref_list){
        var filename = to_path(doi)
        super(filename, folder)
        this.doi = doi
    }
}

class note_list extends data_object{
    constructor(filename = 'comment', folder = f.note){
        super(filename, folder)
        if (!this.hasOwnProperty('data')){
            this.data = []
        }
    }

    leng(){
        return this.data.length
    }

    edit(from, to, comment, index){
        while(index > this.leng()){
            this.data.push({})
        }
    
        if(!Array.isArray(to)){
            to = [to]
        }
    
        this.data[index] = {
            'from': from,
            'to': to,
            'comment': comment
        }
        this.save()
    }

    add(from, to, comment){
        this.edit(from, to, comment, this.leng())
    }

    delete(index){
        this.data.splice(index, 1)
    }

    delete_empty(){
        for (let i = this.leng()-1; i >= 0 ; i--){
            if(check_empty(this.data[i]) || (this.data[i].comment == '' && this.data[i].from == '')){
                this.delete(i)
                console.log(`note [${i}] is empty and been deleted`)
            }
        }
        this.save()
    }

    search(string, key = 'comment'){
        if (!['comment','from','to'].includes(key)){
            console.log('wrong key')
            return []
        }
        var index = []

        if (key == 'to'){
            for (let i = 0; i < this.leng(); i++){
                let item = this.data[i]
                if(!check_empty(item) && item[key].includes(string)){
                    index.push(i)
                }
            }
            return index
        }

        for (let i = 0; i < this.leng(); i++){
            let item = this.data[i]
            if(!check_empty(item) && item[key].search(string) != -1){
                index.push(i)
            }
        }
        return index
    }

    get_note(index){
        if(!Array.isArray(index)){
            index = [index]
        }
        var notes = []
        for (let i of index){
            notes.push(this.data[i])
        }
        return notes
    }
}




function get_article(doi = ''){
    if (is_doi(doi)){
        var a = new article(doi)
        return a.load().catch((e)=>{console.log('failed to get article: ', doi, '\n error:', e)})
    }else{
        var a = new article_text(doi)
        return a.load().catch((e)=>{console.log('failed to get article: ', doi, '\n error:', e)})
    }
}

/*
function get_ref_list(doi){
    filename = to_path(doi)
    var obj = load_file_if_exist(f.ref_list+'/'+filename+'.json')
    if (!check_empty(obj)){return obj}
    else {return false}
}
*/

module.exports = {
    ref_list,
    get_article,
    test,
    data_object,
    note_list,
    article,
    article_text
}