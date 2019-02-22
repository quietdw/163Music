{
    let view = {
        el:'#controlPanel',
        template:`
        <form action="" method="post" id="adminRecSubmit">
            <label for="">
                <span>歌单:</span>
                <input type="text" name="name" id="" value="__name__">
            </label>
            <label for="">
                <span>封面:</span>
                <input type="text" name="cover" id="" value="__cover__">
            </label>
            <label for="">
                    <span>简介:</span>
                    <textarea  rows="8" cols="24" name="summary" id="" >__summary__</textarea>
                </label>
            <label for=""><input type="submit" value=保存></label>
        </form>
        `,
        render(data={}){
            let placeholders = ['name','id','cover','summary']
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
            cover:'',
            summary:''
        },
        create(data){
            let RecSongsLists = AV.Object.extend('RecommendedSongsLists')
            let recsonglist = new RecSongsLists()
            recsonglist.set('name',data.name)
            recsonglist.set('cover',data.cover)
            recsonglist.set('summary',data.summary)

            var song = new AV.Object('Song');// 广州
     
        //     song.set('name', '测试歌曲');
        //     //var recsonglist = new AV.Object('RecommendedSongsLists');// 广东
        //     var recsonglist1 = new AV.Object.createWithoutData('RecommendedSongsLists','5c700e5da91c930054d37a26');// 广东
        //     //recsonglist.set('name', '广东');
        //     song.set('dependent', recsonglist1);// 为广州设置 dependent 属性为广东
        //    // return 
        //    song.save().then(function (song) {
        //         console.log(song.id);
        //     });

            return recsonglist.save().then( (recsonglist)=> {
                let {id,attributes} = recsonglist
                //this.data = {id,...attributes}
                Object.assign(this.data,{id,...attributes}) 
                console.log(this.data)
            }, () => {
                console.log('failed')
            })
        }
    }
    let controller= {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render()
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('submit','form',(e)=>{
                e.preventDefault()
                this.create()
            })
        },
        create(){
            let data = {}
            let needs = 'name summary cover'.split(' ')
            needs.map((string)=>{
                data[string] =
                 $(this.view.el).find(`[name="${string}"]`).val()
            })
            
            this.model.create(data).then(()=>{
                this.view.reset()
                data = JSON.parse(JSON.stringify(this.model.data))//深拷贝
                window.eventHub.emit('new',data)
            })
        },
        reset(){

        }
    }
    controller.init.call(controller,view,model)
}