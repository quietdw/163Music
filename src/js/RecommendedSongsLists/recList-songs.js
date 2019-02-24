{
    let view = {
        el:'.list-songs',
        template:`
        <ol>
        
        </ol>
        `,
        render(data){
            let {songs} = data
            
            $(this.el).html(this.template)
            $(this.el).find('ul').empty()
            songs.map((song,key) => {
                
                let div1 = $('<div></div>').text(key+1).attr('class','list-song-order')
                let div2 = $('<div></div>').attr('class','list-song-info')
                let h3 = $('<h3></h3>').text(song.name)
                let p = $('<p></p>').text(song.singer)
                let a = $(`
                <a>
                    <svg class="icon icon-play">
                        <use xlink:href="#icon-bofang1"></use>
                    </svg>
                </a>
                `).attr('href',`song.html?id=${song.id}`)
                let domLi = $('<li></li>')

                div2.append(h3)
                div2.append(p)
                div2.append(a)

                domLi.append(div1)
                domLi.append(div2)
             
                $(this.el).find('ol').append(domLi)
            })
        }
    }
    let model = {
        data:{
            songs:[]
        },
        fetch(listId) {
            if (listId) {
                let recLists = AV.Object.createWithoutData('RecommendedSongsLists', listId);
                let query = new AV.Query('Song');
                query.equalTo('dependent', recLists);
                return query.find().then((songs) => {
                    this.data.songs = songs.map((song) => {
                        return {
                            id: song.id,
                            ...song.attributes
                        }
                    });
                    return songs
                });
            } else {
                let query = new AV.Query('Song');
                return query.find().then((songs) => {
                    this.data.songs = songs.map((song) => {
                        return {
                            id: song.id,
                            ...song.attributes
                        }
                    });
                    return songs
                });
            }
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.getAllSongs(this.getId())
            this.bindEvents()
        },
        bindEvents(){

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
        getAllSongs(id){
            return this.model.fetch(id).then(() => {
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}