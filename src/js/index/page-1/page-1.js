{
    let view = {
        el:'.page-1',
        show(){
            $(this.el).addClass('active')  
        },
        hide(){
            $(this.el).removeClass('active')  
        },
        render(){

        }
    }
    let model = {
        data:{
            name:'',
            id:'',
            cover:'',
            summary:'',
        },
        create(data){
            let Song = AV.Object.extend('RecommendedSongsLists')
            let song = new Song()
            song.set('name',data.name)
            song.set('id',data.id)
            song.set('summary',data.summary)
            song.set('cover',data.cover)
            return song.save().then( (newSong)=> {
                let {id,attributes} = newSong
                //this.data = {id,...attributes}
                Object.assign(this.data,{id,...attributes}) 
            }, () => {
                console.log('failed')
            })
        },
        // update(data){
        //      // 第一个参数是 className，第二个参数是 objectId
        //      let song = AV.Object.createWithoutData('Song', this.data.id);
        //      // 修改属性
        //      song.set('name', data.name);
        //      song.set('singer', data.singer);
        //      song.set('url', data.url);
        //      song.set('cover', data.cover);
        //      song.set('lyric', data.lyric);
        //      // 保存到云端
             
        //      return song.save().then((response)=>{
        //         Object.assign(this.data,data)
        //         return response
        //      });
        // }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model= model
            this.bindEventHub()
            this.model.create({
                name:'推荐歌单1',
                id:'1',
                cover:'1',
                summary:'111',
            })
        },
        bindEventHub(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName==='page-1'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view,model)
}