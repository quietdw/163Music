{
    let view = {
        el:'.songDiscription',
        template:`
       <div class="songDiscriptionSubmitContainer">
       
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
       <label for="">
           <span>封面:</span>
           <input type="text" name="cover" id="" value="__cover__">
       </label>
       <label for="">
           <span>歌词:</span>
           <textarea  rows="8" cols="24" name="lyric" id="" >__lyric__</textarea>
       </label>
       <label for=""><input type="submit" value=保存></label>
   </form>
       </div>
        `,
        render(data={}){
            let placeholders = ['name','singer','url','id','cover','lyric']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).find('.songDiscriptionSubmitContainer').prepend('<h2>编辑歌曲</h2>')
            }else{
                $(this.el).find('.songDiscriptionSubmitContainer').prepend('<h2>新建歌曲</h2>')
            }
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
            id:'',
            cover:'',
            lyric:'',
        },
        create(data){
            let Song = AV.Object.extend('Song')
            let song = new Song()
            song.set('name',data.name)
            song.set('singer',data.singer)
            song.set('url',data.url)
            song.set('cover',data.cover)
            song.set('lyric',data.lyric)
            return song.save().then( (newSong)=> {
                let {id,attributes} = newSong
                //this.data = {id,...attributes}
                Object.assign(this.data,{id,...attributes}) 
            }, () => {
                console.log('failed')
            })
        },
        update(data){
             // 第一个参数是 className，第二个参数是 objectId
             let song = AV.Object.createWithoutData('Song', this.data.id);
             // 修改属性
             song.set('name', data.name);
             song.set('singer', data.singer);
             song.set('url', data.url);
             song.set('cover', data.cover);
             song.set('lyric', data.lyric);
             // 保存到云端
             
             return song.save().then((response)=>{
                Object.assign(this.data,data)
                return response
             });
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEvents()
            this.view.render()
            window.eventHub.on('select',(data)=>{
                console.log(1)
                console.log(data)
                this.model.data = data
                this.view.render(data)
            })
            window.eventHub.on('new', (data) => {
                if(this.model.data.id){
                    this.model.data = {id:'',name:'',singer:'',url:'',cover:'',lyric:''}
                    Object.assign(this.model.data,data)
                 }
                 Object.assign(this.model.data,data)
                this.view.render(this.model.data)
            })
        },
        reset(data){
            this.view.render(data)
        },
        create(){
            let data = {}
            let needs = 'name singer url cover lyric'.split(' ')
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
        },
        update(){
            let data = {}//收集所填写的信息
            let needs = 'name singer url cover lyric'.split(' ')
            needs.map((string)=>{
                data[string] =
                 $(this.view.el).find(`[name="${string}"]`).val()
            })
           return this.model.update(data)
        },
        bindEvents(){
            $(this.view.el).on('submit','form',(e)=>{//事件委托，form可能还没渲染出来
                e.preventDefault()
                if(this.model.data.id){
                    this.update().then(()=>{
                        alert('更改成功')
                        window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
                    })
                }else{
                    this.create()
                }
               
            })
        }

    }

    controller.init.call(controller,view,model)
}