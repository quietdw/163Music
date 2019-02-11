{
    let view = {
        el: '.songListContainer',
        template: `
        <ul>
        </ul>
        `,
        render(data) {
            let {
                songs
            } = data
            $(this.el).html(this.template)
            $(this.el).find('ul').empty()
            songs.map((song) => {
                let domLi = $('<li></li>').text(song.name).attr('data-song-id', song.id)

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
            songs: []
        },
        find() {
            var query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return {
                        id: song.id,
                        ...song.attributes
                    }
                });
                return songs
            });


        },

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
            this.getAllSongs()
        },
        deactive() {
            $(this.view.el).find('.active').removeClass('active')
        },
        bindEvents() {
            $(this.view.el).on('click', 'li', (e) => {
                this.view.activeItem(e.currentTarget)
                let songId = e.currentTarget.getAttribute('data-song-id')
                window.eventHub.emit('select',{id:songId})
            })
        },
        bindEventHub() {
            window.eventHub.on('upload', () => {
                this.deactive()
            })
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
        },
        getAllSongs() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        }
    }

    controller.init.call(controller, view, model)
}