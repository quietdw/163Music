{
    let view = {
        el:'.songListContainer',
        template:`
        <ul>
            <li class='active'>歌曲1</li>
            <li>歌曲2</li>
            <li>歌曲3</li>
            <li>歌曲4</li>
            <li>歌曲5</li>
        </ul>
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload',()=>{
                this.deactive()
            })
        },
        deactive(){
            $(this.view.el).find('.active').removeClass('active')
        }
    }

    controller.init.call(controller,view,model)
}