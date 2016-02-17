var marked = require('marked')
var render = require('./common/mdrender')
var libs = require('../libs/libs')
var _ = libs.$lodash;

function *mkmd(md_raw, templet){
    var mdcnt = templet
    var cvariable = {}   //markdown 自定义变量
    marked.setOptions({
        renderer: render,
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
    });

    if (md_raw.indexOf('@@@')>-1) {
        var rev = /[@]{3,}[ ]*\n?([^@]*)[@]{3,}[ ]*\n?/ig
        var rev2 = /(.*)(?=:[ ]*)[\s]*(.*)(?=\n)/ig

        var tmp = md_raw.match(rev);
        tmp = tmp.join('\n')
        var tmp2 = tmp.match(rev2)
        var tmp3 = tmp2.map(function(item,i){
            var tmp = item.split(':')
            var k = tmp[0]
            var v = _.trim(tmp[1])
            cvariable[k] = v
        })
        md_raw = md_raw.replace(rev,'');
    }

    return yield marked(md_raw, function (err, data) {
        if (err) {
            console.log(err, 'markdown.js');
            // cb(new gutil.PluginError('gulp-markdown', err, {fileName: file.path}));
            return;
        }

        title = md_raw.match(/#([\s\S]*?)\n/)
        if (title) {
            title = title[1].replace(/ \{(.*)\}/g, '')  // 清除自定义属性，如{"id":"xxx"}
            mdcnt.mdcontent.title = title
        }

        // var re = /<h2[^>]?.*>(.*)<\/h2>/ig;
        var re = /<h2 [^>]*>(.*?)<\/h2>/ig;
        var re2 = /id="(.*?)">/i;
        var mdMenu='', mdMenuList = data.match(re);
        if(mdMenuList&&mdMenuList.length){
            mdMenuList.map(function(item){
                // console.log('66666666666');
                // console.log(item);
                var kkk = item.match(re2);
                var href = kkk[1]
                if (href!='-')
                    mdMenu += '<li><a href="#'+href+'">'+ re.exec(item)[1]+'</a></li>\n\r';
                else
                    mdMenu += '<li>'+ re.exec(item)[1]+'</li>\n\r';

                re.lastIndex = 0;
            })
        }
        mdcnt.mdcontent.mdmenu = mdMenu

        mdcnt.mdcontent.cnt = data

        var tmp_len = Object.keys(cvariable)
        if (tmp_len) {
            mdcnt.mdcontent = _.assign(mdcnt.mdcontent, cvariable)
        }
        return mdcnt

    });
}
module.exports = mkmd