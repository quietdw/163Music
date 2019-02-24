{
    let view = {
        el: '.songListContainer',
        template: `
        <ul>
        </ul>
        `,
        render(data) {
            let {
                songs,//数组
                selectedId
            } = data
            $(this.el).html(this.template)
            $(this.el).find('ul').empty()
            songs.map((song,key) => {
                let domSpan1 = $('<span></span>').text(key+1)
                let domSpan2 = $('<span></span>').text(song.name).attr('data-song-id', song.id)
                let img = $('<img>').attr('src', song.cover)
                let domLi = $('<li></li>')
                if(key%2){
                    domLi.addClass('white')
                }
                domLi.append(domSpan1)
                domLi.append(img)
                domLi.append(domSpan2)

                if(selectedId===song.id){
                    this.activeItem(domLi)
                }
                $(this.el).find('ul').append(domLi)
            })

        },
        activeItem(obj) {
            $(this.el).find('.active').removeClass('active')

            $(obj).addClass('active')
        }
    }
    let model = {
        data: {
            songs: [],
            selectedId: undefined,
        },
        find(listId) {
           if (listId){
            let recLists = AV.Object.createWithoutData('RecommendedSongsLists', listId);
            let query = new AV.Query('Song');
            query.equalTo('dependent', recLists);
            return  query.find().then( (songs)=> {
                this.data.songs = songs.map((song) => {
                    return {
                        id: song.id,
                        ...song.attributes
                    }
                });
                return songs
            });
           }else{
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
        },

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
            this.getAllSongs(this.getId())
        },
        deactive() {
            $(this.view.el).find('.active').removeClass('active')
        },
        bindEvents() {
            $(this.view.el).on('click', 'li', (e) => {
                this.view.activeItem(e.currentTarget)
                let songId =$( e.currentTarget).find('span')[1].getAttribute('data-song-id')
                songData = {}
                for(let i=0;i<this.model.data.songs.length;i++){
                    if(this.model.data.songs[i].id === songId){
                        songData=this.model.data.songs[i]
                        break
                    }
                }           
                window.eventHub.emit('select',JSON.parse(JSON.stringify(songData)))
            })
        },
        bindEventHub() {
            window.eventHub.on('new', () => {
                this.deactive()
            })
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('update', (data) => {
               for(let i=0;i<this.model.data.songs.length;i++){
                    if(this.model.data.songs[i].id===data.id){
                        Object.assign(model.data.songs[i],data)
                        this.model.data.selectedId = data.id
                    }

                }
                this.view.render(this.model.data)
            })
        },
        getAllSongs(id) {
            return this.model.find(id).then(() => {
                this.view.render(this.model.data)
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
    }

    controller.init.call(controller, view, model)
}