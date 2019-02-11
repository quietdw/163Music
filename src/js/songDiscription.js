{
    let view = {
        el:'.songDiscription',
        template:`
       <div class="songDiscriptionSubmitContainer">
       <h2>新建歌曲</h2>
       <form action="" method="post" id="songDiscriptionSubmit">
       <label for="">
           <span>歌名:</span>
           <input type="text" name="name" id="" value="__name__">
       </label>
       <label for="">
           <span>歌手:</span>
           <input type="text" name="singer" id="" value="__singer__">
       </label>
       <label for="">
           <span>外链:</span>
           <input type="text" name="url" id="" value="__url__">
       </label>
       <label for=""><input type="submit" value=保存></label>
   </form>
       </div>
        `,
        render(data={}){
            let placeholders = ['name','singer','url','id']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            
        },
        reset(){
            this.render({})
        }
    }

    let model = {
        data:{
            name:'',
            singer:'',
            url:'',
            id:''
        },
        create(data){
            let Song = AV.Object.extend('Song')
            let song = new Song()
            song.set('name',data.name)
            song.set('singer',data.singer)
            song.set('url',data.url)
            return song.save().then( (newSong)=> {
                let {id,attributes} = newSong
                //this.data = {id,...attributes}
                Object.assign(this.data,{id,...attributes}) 
            }, () => {
                console.log('failed')
            })
        }
    }

    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEvents()
            this.view.render()
            window.eventHub.on('upload',(data)=>{
                this.reset(data)
            })
        },
        reset(data){
            this.view.render(data)
        },
        bindEvents(){
            $(this.view.el).on('submit','form',(e)=>{//事件委托，form可能还没渲染出来
                e.preventDefault()
                let data = {}
                let needs = 'name singer url'.split(' ')
                needs.map((string)=>{
                    data[string] =
                     $(this.view.el).find(`[name="${string}"]`).val()
                })
                this.model.create(data).then(()=>{
                    this.view.reset()
                    //console.log(this.model.data)
                    data = JSON.parse(JSON.stringify(this.model.data))//深拷贝

                    window.eventHub.emit('create',data)
                })
            })
        }

    }

    controller.init.call(controller,view,model)
}