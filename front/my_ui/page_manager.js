class page_manager{
    constructor(container){
        
        let main_box = document.createElement('div')
        main_box.style.textAlign = 'right'
        container.appendChild(main_box)

        let text_area = document.createElement('div')
        text_area.className = 'text_area'
        main_box.appendChild(text_area)

        this.text_area = text_area
        this.dois = []
        this.pages = []
        this.side_item = []
        this.current_ind = -1

        this.side_nav = document.createElement('div')

        const go_to_box = document.createElement('div')
        go_to_box.contentEditable = true
        go_to_box.innerHTML = 'type DOI here'
        const go_to_button = document.createElement('button')
        go_to_button.style.float = 'right'
        go_to_button.innerText = 'go to'
        go_to_button.addEventListener('click', ()=>{
            console.log(`get text: "${go_to_box.innerText}"`)
            if (is_doi(go_to_box.innerText)){
                console.log(`"${go_to_box.innerText}" is DOI`)
                this.to_page(go_to_box.innerText)
            }else{
                console.log(`"${go_to_box.innerText}" is not DOI`)
                this.to_page(go_to_box.innerText)
            }
        })
        go_to_box.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('press ENTER');
                this.to_page(go_to_box.innerText)
            }
        });

        const side_nav_text = document.createElement('d')
        side_nav_text.innerHTML = '<br> OPENED PAPERS<br>'

        this.side_nav.appendChild(go_to_button)
        this.side_nav.appendChild(go_to_box)
        this.side_nav.appendChild(side_nav_text)
        this.side_nav.className = 'sidenav'
        main_box.appendChild(this.side_nav)
    }


    new_page(doi){
        var side_item = document.createElement('p')
        
        doi2title(doi).then((value)=>{
            side_item.innerHTML = value
        })
        side_item.addEventListener('click', ()=>{
            this.to_page(doi)
        })
        side_item.addEventListener('mouseup', (e)=>{
            if (typeof e === 'object'&&e.button == 2) {
                this.delete_page(doi)
            }
        })
        this.side_item.push(side_item)
        this.side_nav.appendChild(side_item)

        
        this.pages.push(new article_page(doi, this))
        this.dois.push(doi)
        this.pages[this.dois.length - 1].add_to(this.text_area)
    }

    delete_page(doi){
        // actually hide the page and side_item
        var ind = this.get_page_ind(doi)
        this.side_item[ind].hidden = true
        if (this.current_ind == ind){
            this.pages[this.current_ind].hide()
        }
        this.current_ind = -1
    }

    get_page_ind(doi){
        // get page index, create new page if the page not exist
        if (this.dois.includes(doi)) {
            var ind = this.dois.findIndex((element)=>{return element==doi})
            return ind
        }else{
            this.new_page(doi)
            return (this.dois.length - 1)
        }
    }

    to_page(doi){
        var ind = this.get_page_ind(doi)
        console.log(`\ndoi list: ${this.dois}\nto doi: ${doi} \nto doi ind = ${ind}\ncurrent ind = ${this.current_ind}`)
        if (ind == this.current_ind){
            return
        }

        if (this.current_ind != -1){
            this.pages[this.current_ind].hide()
            this.side_item[this.current_ind].className = ''
        }
        this.pages[ind].show()
        this.side_item[ind].className = 'selected'
        this.side_item[ind].hidden = false

        this.current_ind = ind
    }
}