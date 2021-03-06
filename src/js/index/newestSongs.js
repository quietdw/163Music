{
    let view = {
        el: 'section.songs',
        render(data) {
            let {songs} = data
            songs.map((song) => {
                let oLi = $(`
            <li>
            <h3>${song.name}</h3>
            <p>
              <svg class="icon icon-sq">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-sq"></use>
              </svg>
              ${song.singer}
            </p>
            <a class="playButton" href="song.html?id=${song.id}">
              <svg class="icon icon-play">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play"></use>
              </svg>
            </a>
          </li>
            `)

            $('section.songs>#songs').append(oLi)
            })



        }
    }
    let model = {
        data: {
            songs:[]
        },
        fetch() {
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
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.model.fetch().then(() => {
                this.view.render(this.model.data)
            })
        }
    }

    controller.init.call(controller, view, model)
}