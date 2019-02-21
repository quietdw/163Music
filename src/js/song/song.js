{
    let view = {
        el:'#app',
        template:``,
        render(data){
            let audio = $(this.el).find('audio').get(0)
            audio.onended = ()=>{
                this.pause()
            }
            
           $(this.el).find('audio').attr('src',data.url)
           $(this.el).find('.cover').attr('src',data.cover)
           $(this.el).find('.songName').html(data.name)
           $(this.el).find('.singer').html(data.singer)
           $(this.el).find('.backgroundBlur').css('background-image',`url(${data.cover})`)
           this.renderLyric(data)
        },
        play(){
            $(this.el).find('audio')[0].play()
            $(this.el).find('.icon-wrapper').addClass('hide')
            $(this.el).find('.disc-container').addClass('playing')
            $(this.el).find('.pointer').addClass('playing')
            $(this.el).find('audio').get(0).ontimeupdate = ()=>{
                this.showLyric($(this.el).find('audio').get(0).currentTime)
            }
        },
        pause(){
            $(this.el).find('audio')[0].pause()
            $(this.el).find('.disc-container').removeClass('playing')
            $(this.el).find('.pointer').removeClass('playing')
            $(this.el).find('.icon-wrapper').removeClass('hide')
            
        },
        renderLyric(data){
            let audio = $(this.el).find('audio').get(0)
            let lyric = data.lyric
            let linesAndTime = lyric.split('\n')
            //let reg = /\[([\d:.]+)\](.+)/
            linesAndTime.map((line)=>{
                matches =  line.match(/\[([\d:.]+)\](.+)/)
                let oDiv = null
               
                if(matches){
                    let ms = matches[1].split(':')
                    let seconds = parseInt(ms[0],10)*60+parseFloat(ms[1])
                    oDiv = $(`<div>${matches[2]}</div>`).attr('data-timeline',seconds)                  
                }
                
                $(this.el).find('.lines').append(oDiv)
            })
            
        },
        showLyric(time){

            //console.log($(this.el).find('.lines>div').length)
            let  lines = $(this.el).find('.lines>div')
            let p
            for(let i=0;i<lines.length;i++){
                if(time>=lines.eq(lines.length-1).attr('data-timeline')){
                    p=lines.eq(lines.length-1)
                    //lines.eq(i).addClass('active').siblings('.active').removeClass('active')
                }
                if(time>=lines.eq(i).attr('data-timeline') && time<lines.eq(i+1).attr('data-timeline')){
                    p=lines.eq(i)
                   
                }  
            }
            

            if(p){
                p.addClass('active').siblings('.active').removeClass('active')
            let height = p.get(0).getBoundingClientRect().top-$(this.el).find('.lines').get(0).getBoundingClientRect().top
            $(this.el).find('.lines').css('transform',`translateY(-${height-18}px)`)
            }
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



