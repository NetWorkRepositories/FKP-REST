SA.set('USER', {error: '-1'})

var api = require('libs/api')
var libs = require('libs/libs')
var AppList = require('modules/list/like_lagou');
var cfg = require('root/config')
// var loginBox = require('modules/sign/signin')

//异步调用js
//有些文件需要异步调用
require.ensure(['./_common/epic'], function(require){
    // alert(2)
    var param = libs.queryString(),
        repass = false;


    if (param && param.type) {
        var type = param.type;
        if (type==='signup') {
            repass = true;
            // $('.box, .sign, .repassword').show()
        }
    }
    else {
        //初始化获取用户信息
        //页面载入请求用户信息
        api.req(
            '/$signin',
            sign_resaults
        )
    }

    //弹出编辑框
    $('body').on('openEditor', function(opts){
        //打开输入框
        $('.box').toggle()

        //插入编辑器
        //必须后置打开，不然编辑器的宽高不对
        require('./_common/epic')(opts)

    })

    $('body').on('addTopic', function(e, args){
        //添加文章 或者 修改文章
        //ajax
        var content = args.cnt,
            upid = false,
            editor = args.editor;
        if (content.length){
            if (libs.strLen(content)>15) {
                var postdata = {cnt: content};
                if (upid){
                    libs.api.req(
                        '/$updatetopic',
                        postdata,
                        topic_resaults
                    )
                }
                else {
                    libs.api.req(
                        '/$addtopic',
                        postdata,
                        topic_resaults
                    )
                }
            }
            else {
                alert('文章字数少于15字')
            }
        }

        function topic_resaults(data){
            editor.importFile('')
            $('.box').hide()
            if (upid){
                libs.msgtips('更新成功')
            }
            else {
                libs.msgtips('发布成功')
            }
            return data
        }
    })


    //注册信息
    //signin返回信息回调
    function sign_resaults(data){
        SA.set('USER', data)
        if (data.error){ //没有该用户
            console.log(data);
            SA.set('USER', {error: '-2'})
        }
        else{
            $('#edit').click(function(){

                //设置按钮显示
                var txt = this.textContent;
                if (txt === '发布')
                    this.textContent = '关闭'
                else
                    this.textContent = '发布'

                $('body').trigger('openEditor')
            })
        }
    }


    //  ===========  列表文章  =========
    api.req(
        '/$listtopic',
        listTopic_resaults
    )

    //处理每一个item为左右拖动
    function dealwith_drag(){
        require('./_common/dragandedit')()
    }

    function listTopic_resaults(data){
        var lists = []
        data.map(function(item, i){
            // console.log(item);
            lists.push( <a href={"?topic="+item._id}>{item.title}</a> )
        })

        if (!param.topic){
            console.log('列表页展示');
            $('#listtopic').html('')
            setTimeout(function(){
                $('#listtopic').css({'margin-left':0})
                AppList(lists, 'listtopic', {evt: 'auto', callback: dealwith_drag});
            }, 100)
        }
    }

})