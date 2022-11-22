var https = require('https');

function get_content(url){
    console.log(`requesting: ${url}`)

    var url_obj = new URL(url)

    var options = {
        host: url_obj.host,
        path: url_obj.pathname,
        headers: {'User-Agent': 'request'},
        timeout: 10000,
    };
    
    return new Promise((resolve, reject)=>{
        https
        .get(options, (res) => {
            var data = '';
            res.on('data', (chunk) => {data += chunk});
    
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        resolve(data)
                    } catch (e) {
                        console.log('Failed: ', e)
                        reject()
                    }
                } else {
                    console.log('Status: ', res.statusCode)
                    reject()
                }
            });
        })
        .on('error', (err) => {
            console.log('Error: ', err)
            reject()
        })
        .on('timeout', ()=>{
            console.log('request timeout: ', url)
            reject()
        })
        .end()
    })

}


async function get_json(url){
    return get_content(url).then((data)=>{
        var json = JSON.parse(data)
        return json
    })
    .catch((e)=>{console.log('failed to get JSON from:', url)})
}

async function get_title(url){
    return get_content(url).then((data)=>{
        var title = data.match(/<title>(.*)<\/title>/im)[1]
        return title
    })
}




module.exports = {get_content, get_json, get_title}