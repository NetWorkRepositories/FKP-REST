path = require 'path';
config = require '../configs/config.coffee';

module.exports = (gulp,$,slime)->
    return () ->
        slime.build(config.globalCssDir,true,{
            type: 'less',
            rename: 'common',
            prepend: [path.join(config.globalCssDir+'/_base/index.less')]
        });
    # return () ->
    #     slime.build(config.modulesCssDir,true,{
    #         type: 'less',
    #         rename: 'common',
    #         prepend: [path.join(config.modulesCssDir+'/_settings/_setting.scss')]
    #     });
