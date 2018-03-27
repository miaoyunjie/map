var data_info = [	//地图标点基础数据
	[121.510825,31.303319,"复旦大学"],	
	[121.508186,31.289124,"同济大学"],
	[121.431398,31.149172,"华东理工大学"],
	[121.49713,31.244559,"外滩情人墙"],
	[121.406081,31.230879,"长风公园"],
	[121.498981,31.232772,"豫园"]
];
var opts = {	//信息窗口基础数据
	width : 500,     // 信息窗口宽度
	height: 160,     // 信息窗口高度
	title : "<h5>介绍：</h5>" , // 信息窗口标题
	enableAutoPan : true,
	maxWidth : 730
};

var ViewModel = function(){
	var map = new BMap.Map('map');	//创建地图
	var point = new BMap.Point(121.467603,31.235558);
	map.centerAndZoom(point, 13);
	map.addControl(new BMap.MapTypeControl({
		mapTypes:[
	        BMAP_NORMAL_MAP,
	        BMAP_HYBRID_MAP
	    ]}));	  
	map.setCurrentCity("上海");		//设置城市名称     
	map.enableScrollWheelZoom(true); 	//设置鼠标滚动缩放地图
	createPoints(data_info);
	//筛选输入框，默认字符消失
	this.inputClick = function(){
		var gjz = $("#suggestId")[0].value;
		if (gjz !== "") {
			$("#suggestId")[0].value = "";
		}
	}
	//隐藏、显示筛选框
	this.clickImage = function(){
		
		if ($("#list").css("display") === "block"){
			$("#list").css("display","none");
			$("#right").css("width","100%");
		} else {
			$("#list").css("display","block");
			$("#right").css("width","calc(100% - 175px)");
		}
		
	}
	//列表筛选功能
	this.clickSubmit = function(){
		var gjz = $("#suggestId")[0].value;
		var xianshi = [];
		if (gjz == ""){
			$("ul")[0].innerHTML = "";
			createPoints(data_info);
			$("ul li").show();
		} else {
			$("ul li").each(function(){
				var name = this.innerText;
				map.clearOverlays();
				if( name.indexOf(gjz) != -1){
					$(this).show();
					xianshi.push(name);
				} else {
					$(this).hide();
				}
			});
		}
		for(var i=0;i<data_info.length;i++){	//修改地图显示图标
			if (xianshi.indexOf(data_info[i][2]) != -1){
				var points = new BMap.Point(data_info[i][0],data_info[i][1]);
				var marker = new BMap.Marker(points);  // 创建标注
				var content = data_info[i][2];		//设置标点信息窗口描述数据
				map.addOverlay(marker);               // 将标注添加到地图中
				addClickHandler(content,marker);	//将窗口信息添加到标注中
			}	
		}
	}
	//创建列表
	function createList(e){
		var a = document.createElement('li');
		a.innerHTML = e;
		$('ul')[0].appendChild(a);
	}
	//创建标注及列表
	function createPoints(datas){
		for(var i=0; i < datas.length; i++){
			var points = new BMap.Point(datas[i][0],datas[i][1]);
			var marker = new BMap.Marker(points);  // 创建标注
			map.addOverlay(marker);             // 将标注添加到地图中
			var content = datas[i][2];	
			addClickHandler(content,marker);
			//由于
			var listKey = [datas[i][2]];
			createList(listKey);				//创建标注点列表
			$("li")[i].addEventListener("click",(function(marker,content,points){
				return function(){
					getAPI(marker,content,points);
				}
			})(marker,content,points));
		}
	}
	//标记点击响应事件
	function addClickHandler(content,marker){
		marker.addEventListener("click",function(e){
			openInfo(marker,content,e)}
		);
	}
	function openInfo(marker,content,e){
		var p = e.target;
		var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
		getAPI(marker,content,point);
	}
	//获取第三方api数据
	function getAPI(marker,content,point){
		var abc = "";
		$.ajax({
	        type: 'post',
	        url: 'http://route.showapi.com/268-1',
	        dataType: 'json',
	        data: {
	            "showapi_appid": 59881, 
	            "showapi_sign": '97222fd1bbb14a4ea40fe0a9ce00ff6b',
	            "keyword": content
	        },
	        error: function(XmlHttpRequest, textStatus, errorThrown) {
	            alert("请求失败!");
	        },
	        success: function(result) {
	        	marker.setAnimation(BMAP_ANIMATION_DROP);		//设置点击动画效果
	            abc ="<p>" + result.showapi_res_body.pagebean.contentlist["0"].summary + "</p>";
	            var infoWindow = new BMap.InfoWindow(abc, opts);  // 创建信息窗口对象
				map.openInfoWindow(infoWindow, point);
	        }
	    });
	}
}

ko.applyBindings(new ViewModel());