
function check_empty(obj) {
    for (var i in obj) return false;
    return true;
}


function get_last_item(obj){
    return obj[Object.keys(obj)[Object.keys(obj).length-1]]
}


function obj2table(obj, except=[]){
    if(!Array.isArray(except)){
        except = [except]
    }

    var table = document.createElement('table')
    for (let i in obj){
        if (except.includes(i)){continue}
        if (obj.hasOwnProperty(i)) {
            var row = table.insertRow()
            var cell = row.insertCell()
            cell.innerHTML = i
            if (i == 'url'){
                var cell = row.insertCell()
                cell.innerHTML=  '<a href="'+obj[i]+'">'+obj[i]+'</a>';
            }else{
                var cell = row.insertCell()
                cell.innerHTML = obj[i]
            }
        }
    }
    return table
}


function str2html(string = ''){
    if(Array.isArray(string)){
        string = string.join('<br>')
    }
    string = string.replace(/\n\n\n/g,'\n')
    string = string.replace(/\n/g, '<br>')
    string = string.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
    return string
}


function html2str(string = ''){
    string = string.replace(/\<br\>/g, '\n')
    string = string.replace(new RegExp('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;','g'), '\t')
    string = string.replace(/\&nbsp\;/g,' ')
    return string
}


async function doi2title(doi){
    return get_article(doi).then((value)=>{return value.title})
    .catch((e)=>{console.log('failed to get article title: ', e)})
}

async function get_article(doi){
    return window.api.invoke('article', doi)
    .then((value)=>{
        return value
    })
    .catch((e)=>{console.log('failed to connect main process: ', e)})
}


function is_doi(string){
    if (!string instanceof String){
        console.log(`"${string}" is not String`)
        return 
    }
    return /\./.test(string) && !/ |http/.test(string)
}