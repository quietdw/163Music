{
    let view = {
        el:'#recList',
        render(){}
    }
    let model = {
        data:{},
        fetch(){}
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            bindEvents()
        },
        bindEvents(){

        }
    }
    controller.init(view,model)
}