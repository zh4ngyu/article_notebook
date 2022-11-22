class note_new{
    constructor(page){
        this.page = page
        this.container = document.createElement('div')
        this.container.innerHTML = `New Note`
        this.container.className = 'note_item'

        
        this.p_comment = document.createElement('p')
        this.p_comment.className = 'edit_on'
        this.p_comment.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 's') {
                // Prevent the Save dialog to open
                e.preventDefault();
                console.log('CTRL + S');
                this.save()
            }
        });


        this.p_ref = document.createElement('p')
        this.p_ref.className = 'edit_on'
        this.p_ref.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 's') {
                // Prevent the Save dialog to open
                e.preventDefault();
                console.log('CTRL + S');
                this.save()
            }
        });
        this.p_ref.addEventListener('keyup', e => {
            this.refresh_ref()
        })


        this.div_ref = document.createElement('div')
    
    
        this.tips = document.createElement('div')
        this.tips.innerHTML = ('Ctrl+S to save')
        this.tips.style = 'float:right'
        this.tips.addEventListener('click',()=>{
            this.save()
        })


        this.p_comment.contentEditable = true
        this.p_ref.contentEditable = true
    
                
        this.container.appendChild(this.tips)
        this.container.appendChild(this.p_comment)
        this.container.appendChild(this.p_ref)
        this.container.appendChild(this.div_ref)
    }

    refresh_ref(){
        let temp = document.createElement('div')

        let text = this.p_ref.innerText
        let list = text.split(/\s*,| |\n\s*/)

        for (let item of list){
            let box = document.createElement('div')
            temp.appendChild(box)

            //console.log(`ref length: ${this.page.ref_list.ref_items.length}`)


            if (is_doi(item)){
                console.log(`${item} is DOI`)
                get_article(item).then((value)=>{
                    box.innerHTML = value.title
                })
                return
            }

            let i = parseInt(item)
            if(i>0 && i<this.page.ref_list.ref_items.length){
                get_article(this.page.ref_list.ref_items[i]).then((value)=>{
                    box.innerHTML = value.title
                })
            }else{
                box.innerHTML = item
            }
        }

        this.div_ref.replaceChildren(temp)
    }


    save(){
        console.log('save something ...')
    }

    add_to(parent){
        parent.appendChild(this.container)
    }
}