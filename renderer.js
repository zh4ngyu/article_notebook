console.log('renderer.js')


/*
window.api.receive("test_back", (data) => {
    console.log(`Received ${data} from main process`);
});

window.api.send("test", "send some test data");

*/



var body = document.getElementById('body')


/*
var box = document.createElement('div')
box.style.textAlign = 'right'

var text_area = document.createElement('div')
text_area.style = 'display:inline-block; text-align:left; width:75%'

body.appendChild(box)
box.appendChild(text_area)
*/


var pm = new page_manager(body)

var doi = '10.1103/PhysRevB.103.235111'
pm.to_page(doi)

/*
window.api.receive("return_article_"+doi, (data) => {
    console.log(`Received "${data}" from main process`)
    console.log(JSON.stringify(data, null, 4))
});

window.api.send("article", doi);



window.api.invoke('article', doi).then((value)=>{
    console.log(JSON.stringify(value, null, 4))
})
*/