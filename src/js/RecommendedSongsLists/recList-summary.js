{
    let view = {
        el:'.list-summary-innerContainer',
        template:`
        <div class="list-summary hide">
                    <span><i></i><br></span>
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
            $(this.el).html(html)
            
            summaryLines = data.summary.split('\n')

            summaryLines.map((summaryLine)=>{
                let span = $('<span></span>')
                let i = $('<i></i>').text(summaryLine)
                let br = $('<br>')
                span.append(i)
                span.append(br)
                $('.list-summary').append(span)
            })
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
           this.bindEvents()
        },
        bindEvents(){
            console.log(2);
            
            $(this.view.el).on('click','.list-summary-arrow',(e)=>{
                $(e.currentTarget).find('.active').removeClass('active').siblings().addClass('active')
                let ohide = $(e.currentTarget).siblings().attr('class')

                if(ohide.match('hide')){
                    $(e.currentTarget).siblings().removeClass('hide')
                }else{
                    $(e.currentTarget).siblings().addClass('hide')
                }
            })
        }
    }
    controller.init(view,model)
}