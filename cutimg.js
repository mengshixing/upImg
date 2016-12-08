
//本地图片在上传之前的预览效果 
//图片上传预览
function previewImage(file)
{
  var MAXWIDTH  = 260; 
  var MAXHEIGHT = 180;

  if (file.files && file.files[0])
  {	  
	  var img = document.getElementById('imghead');
	  img.onload = function(){

		//draw(img.offsetTop,img.offsetLeft,img.offsetWidth,img.offsetHeight);
	  }
	  var reader = new FileReader();
	  //读取file完成之后加载
	  reader.onload = function(evt){
		img.src = evt.target.result;
		//canvasimg();
	  }
	  //开始读取file
	  reader.readAsDataURL(file.files[0]);
  }
  
}  


// startX, startY 为鼠标点击时初始坐标
// diffX, diffY 为鼠标初始坐标与 box 左上角坐标之差，用于拖动
var startX, startY, diffX, diffY;

// 是否拖动，初始为 false
var dragging = false;
//window.onload=function(e) {
//e = e || window.event;   
    
//是否存在方框	
var existbox = false;	  

// 鼠标按下
document.onmousedown = function(e) {
	
	startX = e.pageX;
	startY = e.pageY;
	
	if(isimg(startX,startY)!==true){		
		return false;
	}		
	
	// 如果鼠标在 box 上被按下
	if(e.target.className.match(/box/)) {
		// 允许拖动
		dragging = true;
	  
		// 设置当前 box 的 id 为 moving_box
		if(document.getElementById("moving_box") !== null) {
			document.getElementById("moving_box").removeAttribute("id");
		}
		e.target.id = "moving_box";
	  
		// 计算坐标差值
		diffX = startX - e.target.offsetLeft;
		diffY = startY - e.target.offsetTop;
	}
	else {
		//如果页面已经画出了box,则不能画出第二个box框
		if(existbox===true){
			return false;
		}			
		// 在页面创建 box
		var active_box = document.createElement("div");
		active_box.id = "active_box";
		active_box.className = "box";
		active_box.style.top = startY + 'px';
		active_box.style.left = startX + 'px';
		document.body.appendChild(active_box);
		active_box = null;
	}
	//防止浏览器拖动图片乱动
	e.preventDefault();
};
	   
// 鼠标移动
document.onmousemove = function(e) {
	// 更新 box 尺寸
	if(document.getElementById("active_box") !== null) {
		
		
		
		var ab = document.getElementById("active_box");
		ab.style.width = e.pageX - startX + 'px';
		ab.style.height = e.pageY - startY + 'px';
		
		canvasimg(e);
	}
	   
	// 移动，更新 box 坐标
	if(document.getElementById("moving_box") !== null && dragging) {
		var mb = document.getElementById("moving_box");
		mb.style.top = e.pageY - diffY + 'px';
		mb.style.left = e.pageX - diffX + 'px';
		
		canvasimg(e);
	}
};
	   
// 鼠标抬起
document.onmouseup = function(e) {
	// 禁止拖动
	dragging = false;
	if(document.getElementById("active_box") !== null) {
		var ab = document.getElementById("active_box");
		ab.removeAttribute("id");
		existbox=true;
		// 如果长宽均小于 3px，移除 box
		if(ab.offsetWidth < 3 || ab.offsetHeight < 3) {
			document.body.removeChild(ab);
			existbox=false;
		}
	}
};

//判断鼠标是否在要裁剪的大图之内,否则不触发点击事件
function isimg(x,y){
	var img = document.getElementById('imghead');
	if((x>img.offsetLeft)&&(x<(img.offsetLeft+img.offsetWidth))&&(y>img.offsetTop)&&(y<(img.offsetTop+img.offsetHeight))){
		return true;
	}
}

      
function canvasimg(e){
	var img=document.getElementById("imghead");
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	c.style.display="block";
	
	if(document.getElementById("active_box") !== null) {
		var ab = document.getElementById("active_box");
		ab.style.width = e.pageX - startX + 'px';
		ab.style.height = e.pageY - startY + 'px';
		
		c.height=parseInt(ab.style.height);
		c.width=parseInt(ab.style.width);

		ctx.drawImage(img,startX-img.offsetLeft,startY-img.offsetTop,parseInt(ab.style.width),parseInt(ab.style.height),0,0,parseInt(ab.style.width),parseInt(ab.style.height));
	}
	   
	// 移动，更新 box 坐标
	if(document.getElementById("moving_box") !== null && dragging) {
		var mb = document.getElementById("moving_box");
		mb.style.top = e.pageY - diffY + 'px';
		mb.style.left = e.pageX - diffX + 'px';

		c.height=parseInt(mb.style.height);
		c.width=parseInt(mb.style.width);
		
		ctx.drawImage(img,parseInt(mb.style.left)-img.offsetLeft,parseInt(mb.style.top)-img.offsetTop,parseInt(mb.style.width),parseInt(mb.style.height),0,0,parseInt(mb.style.width),parseInt(mb.style.height));
	}
}