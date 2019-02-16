{
    let view = {
        el:'.siteLoading',
        template:`
        <div class='circle'></div>
        `,
        render(data){
            $(this.el).html(this.template)
        },
        show(){
            $(this.el).addClass('active')
        },
        hide(){
            $(this.el).removeClass('active')
        },
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render()
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('FileUploaded',()=>{
                this.view.hide()
            })
            window.eventHub.on('UploadProgress',()=>{
                this.view.show()
            })
        }
    }
    controller.init.call(controller,view,model)
}