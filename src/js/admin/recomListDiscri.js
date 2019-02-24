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

            return recsonglist.save().then( (recsonglist)=> {
                let {id,attributes} = recsonglist
                
                //this.data = {id,...attributes}
                Object.assign(this.data,{id,...attributes}) 
            }, () => {
                console.log('failed')
            })
        },
        update(data){
console.log(data);

            // 第一个参数是 className，第二个参数是 objectId
            let query = AV.Object.createWithoutData('RecommendedSongsLists', data.id);
            // 修改属性
            query.set('name', data.name);
            query.set('cover', data.cover);
            query.set('summary', data.summary);
            // 保存到云端
            return query.save()
        }
    }
    let controller= {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render()
            this.bindEvents()
            window.eventHub.on('select',(data)=>{
                this.view.render(data)
                this.model.data = data
            })
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
            $(this.view.el).on('submit','form',(e)=>{
                e.preventDefault()
                if(this.model.data.id){
                    this.update(this.model.data)
                }else{
                    this.create()
                }
                
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
                // data = JSON.parse(JSON.stringify(this.model.data))//深拷贝
                // window.eventHub.emit('new',data)
            })
        },
        update(){
            let data = {}//收集所填写的信息
            let needs = 'name cover summary'.split(' ')
            needs.map((string)=>{
                data[string] =
                 $(this.view.el).find(`[name="${string}"]`).val()
            })
            Object.assign(this.model.data,data)
           return this.model.update(this.model.data)
        },
        reset(){

        }
    }
    controller.init.call(controller,view,model)
}