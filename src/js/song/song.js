{
    let view = {
        el:'#app',
        template:``,
        render(data){
           $(this.el).find('audio').attr('src',data.url)
           $(this.el).find('.cover').attr('src',data.cover)
           $(this.el).find('.songName').html(data.name)
           $(this.el).find('.singer').html(data.singer)
           $(this.el).find('.backgroundBlur').css('background-image',`url(${data.cover})`)
        },
        play(){
            $(this.el).find('audio')[0].play()
            $(this.el).find('.icon-wrapper').addClass('hide')
            $(this.el).find('.disc-container').addClass('playing')
            $(this.el).find('.pointer').addClass('playing')
        },
        pause(){
            $(this.el).find('audio')[0].pause()
            $(this.el).find('.disc-container').removeClass('playing')
            $(this.el).find('.pointer').removeClass('playing')
            $(this.el).find('.icon-wrapper').removeClass('hide')
            
        }

    }
    let model = {
        data:{
            song:{
                name:'',
                url:'',
                singer:'',
                id:'',
                cover:'',
            },
            playState:false
        },
        fetch(id){
            let query = new AV.Query('Song');
            return query.get(id).then( (song) => {
                Object.assign(this.data.song,{id:song.id,...song.attributes})
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
                this.view.render(this.model.data.song)
            })
            this.bindEvents()
            //this.view.play()
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
            $(this.view.el).on('click','.icon-wrapper',()=>{
                if(this.model.playState){
                    this.view.pause()
                    this.model.playState = !this.model.playState
                }else{
                    this.view.play()
                    this.model.playState = !this.model.playState
                }
            })
        }
    }
    controller.init.call(controller,view,model)
}



