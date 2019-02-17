{
    let view = {
        el:'#app',
        template:`
            <audio src="{{url}}"></audio>\
            <button class="play">播放</button>
            <button class="pause">暂停</button>
        `,
        render(data){
            $(this.el).html(this.template.replace('{{url}}',data.url))
        },
        play(){
            $(this.el).find('audio')[0].play()
            
        },
        pause(){
            $(this.el).find('audio')[0].pause()
        }

    }
    let model = {
        data:{
            name:'',
            url:'',
            singer:'',
            id:''
        },
        fetch(id){
            let query = new AV.Query('Song');
            return query.get(id).then( (song) => {
                Object.assign(this.data,{id:song.id,...song.attributes})
                return song
            }, function (error) {
              // 异常处理
              console.log(error)
            });
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.model.fetch(this.getId()).then(()=>{
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        getId(){
            let search = window.location.search
            if(search.indexOf('?')===0){
                 search = search.substring(1)
            }
            let array = search.split('&').filter((x) => x)
            let id = ''
            array.map((info) => {
                let kv = info.split('=')
                let key = kv[0]
                let value = kv[1]
                if (key === 'id') {
                    id = value
                }
            })
            
            return id
        },
        bindEvents(){
            $(this.view.el).on('click','.play',()=>{
                this.view.play()
            })
            $(this.view.el).on('click','.pause',()=>{
                this.view.pause()
            })
        }
    }
    controller.init.call(controller,view,model)
}



