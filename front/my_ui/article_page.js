class article_page{
    constructor(doi, page_manager){
        this.doi = doi
        this.page_manager = page_manager

        this.note_ind = []
        this.page = document.createElement('div')

        let table_box = document.createElement('div')
        this.page.appendChild(table_box)
        get_article(doi).then((value)=>{
            let table = obj2table(value, ['json_file','filename','folder','ref','crossref','loaded'])
            table_box.appendChild(table)
        })


        this.ref_list = new ref_list(doi)
        this.ref_list.add_to(this.page)


        let to = document.createElement('div')
        to.innerHTML = '<h2>Comment To</h2>'

        var new_note = new note_new(this)
        new_note.add_to(to)

        var {ind, notes} = window.api.send_syn('search_note', doi, 'from')
        for (let i in notes){
            var new_note = new note_to(notes[i].comment, notes[i].to, ind[i], this.page_manager)
            new_note.add_to(to)
        }

        this.page.appendChild(to)




        let from = document.createElement('div')
        from.innerHTML = '<h2>Comment From</h2>'
        
        var {ind, notes} = window.api.send_syn('search_note', doi, 'to')
        for (let i in notes){
            var new_note = new note_from(notes[i].comment, notes[i].from, ind[i], this.page_manager)
            new_note.add_to(from)
        }

        this.page.appendChild(from)
    }

    show(){
        this.page.hidden = false
    }
    hide(){
        this.page.hidden = true
    }
    add_to(parent){
        parent.appendChild(this.page)
    }
    remove(){
        this.page.remove()
    }
}