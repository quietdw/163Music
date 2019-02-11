{
    let view = {
        el:'.createSong',
        template:`
        <h2>新建歌曲</h2>
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }

    let  model = {}

    let controller ={
        init(view,model){
            this.view = view
            this.model = model
            this.view.render()
            this.active()
            window.eventHub.on('upload',(data)=>{
                this.active()
            })
            window.eventHub.on('select',(data)=>{
                 this.model.data = data
                if(data.id){
                    this.deactive()
                }
            })
        },
        active(){
            $(this.view.el).addClass('active')
        },
        deactive(){
            $(this.view.el).removeClass('active')
        }
    }

    controller.init.call(controller,view,model)

}