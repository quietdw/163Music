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
            window.eventHub.on('upload',(data)=>{
                this.active()
            })
        },
        active(){
            $(this.view.el).addClass('active')
        }
    }

    controller.init.call(controller,view,model)

}