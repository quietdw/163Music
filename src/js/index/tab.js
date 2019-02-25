{
    let view = {
        el:'#tabs'
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            //this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click','.tabs-nav>li', (e)=>{
                let oLi = $(e.currentTarget)
                oLi.addClass('active').siblings().removeClass('active')
                tabName = oLi.attr('data-tab-name')
                window.eventHub.emit('selectTab',tabName)
            })
        }
    }
    controller.init.call(controller,view,model)
}