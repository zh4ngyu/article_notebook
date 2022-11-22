class note_from{
    constructor(comment = 'comment here', ref = [], num = 'x', page_manager){
        this.page_manager = page_manager
    
        if (ref.length == 0){
            ref = []
        }
        if(!Array.isArray(ref)){
            ref = [ref]
        }
        this.comment = comment
        this.ref = ref
    
        this.container = document.createElement('div')
        this.container.innerHTML = `NO. ${num}`
        this.container.className = 'note_item'
    
        this.p_comment = document.createElement('p')
        this.p_comment.className = 'edit_off'
        this.p_comment.innerHTML = str2html(this.comment)


        this.div_ref = document.createElement('div')
        for (let doi of this.ref){
            if (doi == 'null'){continue}
            let div_ref = document.createElement('div')
            
            doi2title(doi).then((value)=>{
                div_ref.innerHTML = value
            })
            
            div_ref.addEventListener('click',()=>{
                this.page_manager.to_page(doi)
            })
            this.div_ref.appendChild(div_ref)
        }
    
    
        this.container.appendChild(this.p_comment)
        this.container.appendChild(this.div_ref)
    }


    add_to(parent){
        parent.appendChild(this.container)
    }
}