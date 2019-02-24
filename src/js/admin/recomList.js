{
    let view = {
        el:'.recSongLists',
        template: `
        <ul>
        </ul>
        `,
        render(data){
            
            let {
                reclists,//数组
                selectedId
            } = data
            $(this.el).html(this.template)
            $(this.el).find('ul').empty()
            reclists.map((reclist,key) => {
                let domSpan1 = $('<span></span>').text(key+1)
                let a =  $('<a></a>').text(`专辑名称：${reclist.name}`).attr('href',`admin.html?id=${reclist.id}`)
                let domSpan2 = $('<span></span>').attr('data-reclist-id', reclist.id).append(a)
                let img = $('<img>').attr('src', reclist.cover)
                let p =$('<p></p>').text(`专辑简介：${reclist.summary}`)
                let domLi = $('<li></li>')
                let div = $('<div></div>')

                domLi.append(domSpan1)
                domLi.append(img)
                div.append(domSpan2)
                div.append(p)

                domLi.append(div)

                if(selectedId===reclist.id){
                    this.activeItem(domLi)
                }
                $(this.el).find('ul').append(domLi)
            })
        },
        activeItem(e){
            $(e).addClass('active').siblings('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            reclists: [],
            selectedId: undefined,
        },
        find() {
            var query = new AV.Query('RecommendedSongsLists');
            return query.find().then((reclists) => {
               
                this.data.reclists = reclists.map((reclist) => {
                    return {
                        id: reclist.id,
                        ...reclist.attributes
                    }
                });
                return reclists
            });


        },
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.getAllLists()
            this.bindEvents()
        },
        getAllLists() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            $(this.view.el).on('click', 'li', (e) => {
                 this.view.activeItem(e.currentTarget)
                 let listId =$( e.currentTarget).find('span')[1].getAttribute('data-reclist-id')
                 listData = {}
                for(let i=0;i<this.model.data.reclists.length;i++){
                    if(this.model.data.reclists[i].id === listId){
                        listData=this.model.data.reclists[i]
                        break
                    }
                }          
                window.eventHub.emit('select',JSON.parse(JSON.stringify(listData)))
            })
        },
    }
    controller.init(view,model)
}