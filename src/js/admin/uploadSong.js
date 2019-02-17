{
    let view = {
        el:'.uploadContainer',
        template:`
        <div id="uploadArea">
            <span id="uploadBtn">
                <span>点击/拖拽上传 </span>
                <span>文件大小不能超过20mb</span>
            </span>
        </div>
        `,
        find(selector){
           return $(this.el).find(selector)[0]
        },
        render(data){
            $(this.el).html(this.template)
        }
    }

    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.initQiniu()
        },
        initQiniu(){
            let uploader = Qiniu.uploader({
                runtimes: 'html5', // 上传模式，依次退化
                browse_button: this.view.find(uploadBtn), // 上传选择的点选按钮，必需
                uptoken_url: 'http://127.0.0.1:8888/uptoken', // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
                domain: 'plonb42pd.bkt.clouddn.com', // bucket域名，下载资源时用到，必需 plonb42pd.bkt.clouddn.com
                container: this.view.find(uploadArea), // 上传区域DOM ID，默认是browser_button的父元素
                max_file_size: '20mb', // 最大文件体积限制
                //max_retries: 3,                     // 上传失败最大重试次数
                dragdrop: true, // 开启可拖曳上传
                drop_element: this.view.find(uploadArea), // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                //chunk_size: '4mb',                  // 分块上传时，每块的体积
                auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function (up, files) {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后，处理相关的事情
                        });
                    },
                    'BeforeUpload': function (up, file) {
                        // 每个文件上传前，处理相关的事情
                    },
                    'UploadProgress': function (up, file) {
                        window.eventHub.emit('UploadProgress')
                        // 每个文件上传时，处理相关的事情
                    },
                    'FileUploaded': function (up, file, info) {
                        window.eventHub.emit('FileUploaded')
                        var domain = up.getOption('domain');
                        var response = JSON.parse(info.response);
                        var sourceLink = '//'+domain + "/" + encodeURIComponent(response.key);
                        window.eventHub.emit('new',{
                            url:sourceLink,
                            name:response.key
                        })


                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时，处理相关的事情
                    },
                    'UploadComplete': function () {
                        //队列文件处理完毕后，处理相关的事情
                    },

                }
            });
        }
    }

    controller.init.call(controller,view,model)
}