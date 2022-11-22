class note_to{
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
        this.p_comment.addEventListener('dblclick', ()=>{
            this.turn_on_edit()
            this.p_comment.focus()
        })
        this.p_comment.addEventListener('focusout', (event)=>{
            let hover_element = document.querySelectorAll( ":hover" )
            let current_element = get_last_item(hover_element)
            if (this.p_ref != current_element && this.p_comment != current_element){
                this.turn_off_edit()
            }
        })
        this.p_comment.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 's') {
                // Prevent the Save dialog to open
                e.preventDefault();
                console.log('CTRL + S');
                this.save()
            }
            if (e.key === 'Escape') {
                this.save()
            }
        });


        this.p_ref = document.createElement('p')
        this.p_ref.className = 'edit_off'
        this.p_ref.hidden = true
        this.p_ref.innerHTML = str2html(this.ref)
        this.p_ref.addEventListener('dblclick', ()=>{
            this.turn_on_edit()
            this.p_ref.focus()
        })
        this.p_ref.addEventListener('focusout', ()=>{
            let hover_element = document.querySelectorAll( ":hover" )
            let current_element = get_last_item(hover_element)
            if (this.p_comment != current_element && this.p_ref != current_element){
                this.turn_off_edit()
            }
        })
        this.p_ref.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 's') {
                // Prevent the Save dialog to open
                e.preventDefault();
                console.log('CTRL + S');
                this.save()
            }
            if (e.key === 'Escape') {
                this.save()
            }
        });


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
    
    
        this.tips = document.createElement('div')
        this.tips.innerHTML = ('ESC/Ctrl+S to turn off edit')
        this.tips.hidden = true
        this.tips.style = 'float:right'
    
                
        this.container.appendChild(this.tips)
        this.container.appendChild(this.p_comment)
        this.container.appendChild(this.p_ref)
        this.container.appendChild(this.div_ref)
    }


    turn_on_edit(){
        this.p_comment.contentEditable = true
        this.p_ref.contentEditable = true
        this.tips.hidden = false
        this.p_comment.className = 'edit_on'
        this.p_ref.className = 'edit_on'
        this.p_ref.hidden = false
    }

    turn_off_edit(){
        this.p_comment.contentEditable = false
        this.p_ref.contentEditable = false
        this.tips.hidden = true            
        this.p_comment.className = 'edit_off'
        this.p_ref.className = 'edit_off'
        this.p_ref.hidden = true
    }

    save(){
        console.log('save something ...')
        this.turn_off_edit()
    }

    add_to(parent){
        parent.appendChild(this.container)
    }
}