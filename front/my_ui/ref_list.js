

class ref_list{
    constructor(doi){
        
        this.ref_items = []

        this.doi = doi
        this.d = document.createElement('div')
        this.d.className = 'ref_list'
        

        this.ref_list = document.createElement('div')
        this.ref_list.hidden = true
        this.ref_text = document.createElement('div')

        this.save = document.createElement('button')
        this.save.innerHTML = 'save'
        this.save.addEventListener('click',()=>{
            console.log('click save button')
            let temp = window.api.send_syn('save_ref_list', this.doi, this.ref_items)
        })
        this.save.hidden = true

        this.load = document.createElement('button')
        this.load.innerHTML = 'load'
        this.load.addEventListener('click',()=>{
            this.load_ref_list()
        })
        this.load.hidden = true

        this.ref_button = document.createElement('button')
        this.ref_button.innerHTML = 'reference list'
        this.ref_button.addEventListener('click',()=>{
            if(this.ref_list.hidden){
                this.ref_list.hidden = false
                this.save.hidden = false
                this.load.hidden = false
            }else{
                this.ref_list.hidden = true
                this.save.hidden = true
                this.load.hidden = true
            }
        })

        this.d.appendChild(this.ref_button)
        this.d.appendChild(this.load)
        this.d.appendChild(this.save)
        this.d.appendChild(this.ref_list)
        this.ref_list.appendChild(this.ref_text)

        this.load_ref_list()
    }

    load_ref_list(){
        console.log(`loading reference list of ${this.doi}`)
        var rl = window.api.send_syn('ref_list', this.doi)
        if (rl.loaded){
            this.ref_items = rl.list
            this.show_ref_list()
        }else{
            console.log('no reference JSON file found, load reference from article JSON ...')
            get_article(this.doi).then((value)=>{
                this.ref_items = value.ref
                this.show_ref_list()
            })
            //this.ref_list_doi.innerHTML = JSON.stringify(rl, null, 4)
        }
    }


    show_ref_list(){
        
        this.ref_box = []

        let temp = document.createElement('div')

        if (check_empty(this.ref_items)){
            this.ref_items = ['']
        }
        for (let i in this.ref_items){
            if (i == 0){
                continue
            }

            let box = document.createElement('div')
            this.ref_box[i] = box
            box.innerHTML = `[${i}]`

            

            new ref_item(this.ref_items[i], i, this).add_to(box)

            temp.appendChild(box)
        }

        this.ref_text.replaceChildren(temp)
    }
/*
    to_title(){
        var title_string = ''
        var dois = this.ref_list_doi.innerText.split('\n')
        dois.splice(dois.length, 1)
        for (let i in dois){
            let a = window.api.send_syn('article', dois[i])
            let string = a.title
            //if (string.length > 80){
                //string = string.slice(string.length-80)
            //}
            title_string += `<div>[${parseInt(i)+1}] ${string}</div>`
        }
        this.ref_list_title.innerHTML = title_string
        console.log(this.ref_list_doi.innerText)
    }
*/

    change_ref_list(i, doi, type = 'edit'){
        if (type == 'edit'){
            this.ref_items[i] = doi
        }else if (type == 'add'){
            this.ref_items.splice(i, 0, doi)
        }else if (type == 'delete'){
            this.ref_items.splice(i, 1)
        }
        this.show_ref_list()
    }


    add_to(parent){
        parent.appendChild(this.d)
    }
}



class ref_item{
    constructor(doi, i, ref_manager){
        this.index = i
        this.container = document.createElement('div')
        this.container.className = 'ref_item'

        const plus = document.createElement('button')
        plus.innerHTML = '+'
        plus.style.float = 'right'
        plus.addEventListener('click', ()=>{
            console.log('click +') 
            ref_manager.change_ref_list(i, '', 'add')
        })
        const minus = document.createElement('button')
        minus.innerHTML = '-'
        minus.style.float = 'right'
        minus.addEventListener('click', ()=>{
            console.log('click -')
            ref_manager.change_ref_list(i, '', 'delete')
        })
        /*
        const save = document.createElement('button')
        save.innerHTML = 'save'
        save.style.float = 'right'
        save.addEventListener('click', ()=>{
            console.log('click save')
            ref_manager.change_ref_list(i, this.doi.innerHTML, 'edit')
        })
        */

        this.container.appendChild(plus)
        this.container.appendChild(minus)
        //this.container.appendChild(save)

        this.doi = document.createElement('div')
        this.doi.contentEditable = true
        this.doi.innerHTML = doi
        this.doi.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('press ENTER');
                ref_manager.change_ref_list(i, this.doi.innerHTML, 'edit')
            }
        });

        this.title = document.createElement('div')

        if (doi != ''){
            doi2title(doi).then((value)=>{
                this.title.innerHTML = value
            })
        }else{
            this.title.innerHTML = '^ type DOI above'
        }


        this.container.appendChild(this.doi)
        this.container.appendChild(this.title)
    }

    add_to(parent){
        parent.appendChild(this.container)
    }
}


