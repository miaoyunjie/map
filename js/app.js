//地图标点基础数据
var data_info = [	
		{
			lng:121.510825,
			lat:31.303319,
			name:"复旦大学"
		},
		{	
			lng:121.508186,
			lat:31.289124,
			name:"同济大学"
		},
		{
			lng:121.431398,
			lat:31.149172,
			name:"华东理工大学"
		},
		{
			lng:121.49713,
			lat:31.244559,
			name:"外滩情人墙"
		},
		{
			lng:121.406081,
			lat:31.230879,
			name:"长风公园"
		},
		{	
			lng:121.498981,
			lat:31.232772,
			name:"豫园"
		}
];
//信息窗口基础数据
var opts = {	
	width : 500,     
	height: 160,     
	title : "<h5>介绍：</h5>" , 
	enableAutoPan : true,
	maxWidth : 730
};

var ViewModel = function(){
	var self = this;
	//创建百度地图
	var map = new BMap.Map('map');	
	var point = new BMap.Point(121.467603,31.235558);
	map.centerAndZoom(point, 12);
	map.addControl(new BMap.MapTypeControl({
		mapTypes:[
	        BMAP_NORMAL_MAP,
	        BMAP_HYBRID_MAP
	    ]}));	  
	map.setCurrentCity("上海");	   
	map.enableScrollWheelZoom(true); 	
	createPoints(data_info);	
	//筛选输入框，默认字符消失
	this.textInput = ko.observable("");
	this.inputClick = function(){
		if(this.textInput() !== ""){
			this.textInput('');
		}
	}
	//隐藏、显示筛选框
	this.changeList = ko.observable(false);
	this.clickImage = function(){
		if(this.changeList() === true){
			this.changeList(false);
		} else {
			this.changeList(true);
		}
	}
	//列表
	this.dataList = ko.observable(data_info);
	//列表点击事件
	this.listHandler = function(data){
		var points = new BMap.Point(data.lng,data.lat);
		var marker = new BMap.Marker(points);             
		var content = data.name;
		getAPI(marker,content,points);
	}
	//筛选功能
	this.clickSubmit = function(){
		if (this.textInput() == ""){
			this.dataList(data_info);
			createPoints(data_info);
		} else {
			var newLists = ko.utils.arrayFilter(data_info, function(el, index) {
			    return el.name.indexOf(self.textInput()) != -1;
			});
			this.dataList(newLists);
			createPoints(newLists);
		}
	}
	//创建标注
	function createPoints(datas){
		//初始化标注
		map.clearOverlays();	
		datas.forEach(function(data){
			var points = new BMap.Point(data.lng,data.lat);
			var marker = new BMap.Marker(points);  
			map.addOverlay(marker);            
			var content = data.name;	
			addClickHandler(content,marker);
		});
	}
	//标注点击事件
	function addClickHandler(content,marker){
		marker.addEventListener("click",function(e){
			var p = e.target;
			var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
			getAPI(marker,content,point);
		});
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