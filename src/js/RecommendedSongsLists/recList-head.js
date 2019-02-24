{
    let view = {
        el:'.list-head-innercontainer',
        template:`

        `,
        render(data={}){
            $(this.el).find('img').attr('src',data.cover)
            $(this.el).find('h2').text(data.name)
            $(this.el).find('.list-head-background').css('background-image',`url(${data.cover})`)
        }
    }
    let model = {
        data:{
        },
        fetch(id){
            query = new AV.Query('RecommendedSongsLists');
            return query.get(id).then((recList)=>{
                this.data = recList.attributes
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.renderData()
        },
        gitid(){
            let search = window.location.search
            if(search.indexOf('?')===0){
                 search = search.substring(1)
            }
            let array = search.split('&').filter((x) => x)
            let id = ''
            array.map((info) => {
                let kv = info.split('=')
                let key = kv[0]
                let value = kv[1]
                if (key === 'id') {
                    id = value
                }
            })
            
            return id
        },
        renderData(){
            this.model.fetch(this.gitid()).then(()=>{
                this.view.render(this.model.data)
                window.eventHub.emit('headleaded',JSON.parse(JSON.stringify(this.model.data)))
            })
        }
    }
    controller.init(view,model)
}