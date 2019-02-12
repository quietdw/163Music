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
            this.bindEvents()
            window.eventHub.on('new',(data)=>{
                this.active()
            })
            window.eventHub.on('select',(data)=>{
                
                
                    this.deactive()
                
            })
        },
        bindEvents(){
            $(this.view.el).on('click',()=>{
                
                window.eventHub.emit('new',this.model.data)
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