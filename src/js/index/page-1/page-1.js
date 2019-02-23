{
    let view = {
        el:'.playlists',
        template:`
        <h2 class="sectionTitle">推荐歌单</h2>
        <ol class="songs">

        </ol>
        `,
        show(){
            $(this.el).parent('.page-1').addClass('active')  
        },
        hide(){
            $(this.el).parent('.page-1').removeClass('active')  
        },
        render(data) {
            
            
            let {lists} = data
             $(this.el).html(this.template)
             $(this.el).find('ol').empty()
            lists.map((list,key) => {
                let domdiv = $('<div></div>').attr('class', 'cover')
                let domimg = $('<img>').attr('src', list.cover)
                domdiv.append(domimg)
                let domp = $('<p></p>').text(list.name)
                let a = $('<a></a>').attr('href', `recList.html?id=${list.id}`)
                let domLi = $('<li></li>')
                a.append(domdiv)
                a.append(domp)
                domLi.append(a)
                $(this.el).find('ol').append(domLi)
            })

        },
    }
    let model = {
        data:{
            lists:[]
        },
        fetch(){
            let query = new AV.Query('RecommendedSongsLists');
            return query.find().then((recLists) => {
                this.data.lists = recLists.map((recList) => {
                    return {
                        id: recList.id,
                        ...recList.attributes
                    }
                });
                return recLists
            });
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model= model
            //this.view.render()
            this.getAllRecLists()
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName==='page-1'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        },
        getAllRecLists(){
            this.model.fetch().then(()=>{
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}