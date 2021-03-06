var libs = require('libs/libs');
var Store = require('mixins/store');
var ItemMixin = require('mixins/item')

var popwin = {
	mixins: [ItemMixin],
	getInitialState: function() {
        this.addSheet();
		return {
			data: []
		}
	},
	componentWillMount: function(){
		if(this.props.data){
			this.setState({
				data: this.props.data
			})
		}
	},
	componentDidMount: function () {

	},
	componentDidUpdate:function(){
		$(this.refs.popbox.getDOMNode()).addClass('autoPop');
		var oPop = $(this.refs.popbox.getDOMNode()).find('.pop_content');
		var popH = oPop.height();
		var winH = $(window).height();
		if(popH>=winH/2){
			//oPop.height('50%');
			$(this.refs.popbox.getDOMNode()).removeClass('autoPop');
		}
	},
    addSheet: function(){
        //添加css到头部
		libs.addSheet([
			'/css/t/pop/pop.css',
			'popwin'
		])
    },

	componentWillReceiveProps:function(nextProps){
        if(nextProps.data){
            this.setState({
                data: nextProps.data
            })
        }
    },

	renderContent: function(){
	},

	handleClick: function(){
		// var self = React.findDOMNode(this);  //React.findDOMNode(this)
		this.setState({
			data: {display:'none'}
		});
		$(this.refs.popbox.getDOMNode()).addClass('autoPop');

	},

    render: function () {
		var display = 'none';
		var body='';
		var bodyDom='';
		var cls='pop';
		if(this.state.data){
			var theData = this.state.data;
			if(theData.body)
				body = theData.body;
			else {
				//暂时去掉 加载中... 图片
				//body = <div className={'loading'}><img style={{width:'1rem'}} src='/images/loading1.gif'/></div>
				body = '';
			}
			if(theData.display){
				display = theData.display;
				if(display==='block')
					cls+=' active'
				if(display==='none')
					cls = 'pop'
			}
			if(theData.alert){
				cls +=' alert';
				body = <div><div className={'alertTit'}><i className={'ifont icon-infofill'}></i>{theData.alert.title?theData.alert.title:'温馨提示'}</div><div className={'alertCon'}>{theData.alert.body?theData.alert.body:theData.body}</div><div className={'alertBtn'}>我知道了</div></div>
			}

			if(theData.type){
				var _this = this;
				setTimeout(function(){
					_this.setState({
						data: {display:'none'}
					});
				},2000);
			}
		}
        return(
    		theData.type ?
    		<div className={'autoTip'} ref='popbox'><div>{body}</div></div>
    		:
			<div className={cls} ref='popbox'>
				<div className="pop_content">{body}</div>
				<div className="pop_bg" onClick={this.handleClick}></div>
		    </div>
        )
    }
}


function actRct( storeName ){
    var _storeName = storeName||'Pop',
        _rct = _.cloneDeep(popwin);

	if( _rct.mixins && _rct.mixins.length ){
		_rct.mixins.push( Store( _storeName ))
    }
	else{
		_rct.mixins = [ Store( _storeName ) ]
    }

    return React.createClass( _rct );
}

module.exports = actRct;
