{
    let view = {
        el:'.songListContainer',
        template:`
        <ul>
        </ul>
        `,
        render(data){
            let {songs} = data
            $(this.el).html(this.template)
            $(this.el).find('ul').empty()
            
            songs.map((song)=>{
                let domLi = $('<li></li>').text(song.name)
                console.log(domLi)
                $(this.el).find('ul').append(domLi)
            })
            
        }
    }
    let model = {
        data:{
            songs:[]
        },

    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload',()=>{
                this.deactive()
            })
            window.eventHub.on('create',(songData)=>{
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
        },
        deactive(){
            $(this.view.el).find('.active').removeClass('active')
        }
    }

    controller.init.call(controller,view,model)
}