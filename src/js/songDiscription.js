{
    let view = {
        el:'.songDiscription',
        template:`
       <div class="songDiscriptionSubmitContainer">
       <h2>新建歌曲</h2>
       <form action="" method="post" id="songDiscriptionSubmit">
       <label for="">
           <span>歌名:</span>
           <input type="text" name="" id="" value="__key__">
       </label>
       <label for="">
           <span>歌手:</span>
           <input type="text" name="" id="" value="">
       </label>
       <label for="">
           <span>外链:</span>
           <input type="text" name="" id="" value="__link__">
       </label>
       <label for=""><input type="button" value=保存></label>
   </form>
       </div>
        `,
        render(data={}){
            let placeholders = ['key','link']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        }
    }

    let model = {}

    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render()
            window.eventHub.on('upload',(data)=>{
                this.reset(data)
            })
        },
        reset(data){
            this.view.render(data)
        }

    }

    controller.init.call(controller,view,model)
}