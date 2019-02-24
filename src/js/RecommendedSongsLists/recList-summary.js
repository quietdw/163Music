{
    let view = {
        el:'.list-summary-innerContainer',
        template:`
        <div class="list-summary hide">
                    <span><i>$$summary$$</i><br></span>
                </div>
                <div class="list-summary-arrow">
                    <svg class="icon icon-play active">
                        <use xlink:href="#icon-down"></use>
                    </svg>
                    <svg class="icon icon-play">
                        <use xlink:href="#icon-up"></use>
                    </svg>
                </div>
        `,
        render(data={}){
            let html = this.template
            html = html.replace('$$summary$$',data.summary||'')
            $(this.el).html(html)
        }
    }
    let model = {
        data:{},
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            window.eventHub.on('headleaded',(data)=>{
                this.model.data = data
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}