
//本地图片在上传之前的预览效果 
//图片上传预览
function previewImage(file)
{
  //var MAXWIDTH  = 260; 
  //var MAXHEIGHT = 180;

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
		console.log( startX ,e.target.offsetLeft);
		console.log(diffX,diffY);
	}
	else {
		//如果页面已经画出了box,则不能画出第二个box
		if(existbox===true){
			return false;
		}			
		// 在页面创建 box
		var active_box = document.createElement("div");
		active_box.id = "active_box";
		active_box.className = "box";
		active_box.setAttribute("name","box");
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
		
		//右下角不能超过图片边界,否则默认鼠标抬起
		if(isimg(e.pageX,e.pageY)!==true){		
			document.onmouseup(e);
			return false;
		}	
		
		var ab = document.getElementById("active_box");
		ab.style.width = e.pageX - startX + 'px';
		ab.style.height = e.pageY - startY + 'px';
		
		canvasimg(e);
	}
	   
	// 移动，更新 box 坐标
	if(document.getElementById("moving_box") !== null && dragging) {
		
		var mb = document.getElementById("moving_box");
		var img = document.getElementById('imghead');
		
		//左上角超出图片界限
		if(isimg(e.target.offsetLeft,e.target.offsetTop)!==true){		
			//document.onmouseup(e);
			
			console.log(e.target.offsetLeft,mb.style.left,img.offsetLeft);
			console.log(img.offsetLeft+1 + 'px');
			//超出左方,限定在图片之内,
			if(e.target.offsetLeft<=img.offsetLeft)
			{				
				mb.style.left = img.offsetLeft+1 + 'px';				
			}
				
			//超出上方
			if(e.target.offsetTop<=img.offsetTop)
			{				
				mb.style.top = img.offsetTop+1 + 'px';
			}
			//mb.style.top = e.pageY - diffY + 'px';
			//mb.style.left = e.pageX - diffX + 'px';
			document.onmouseup(e);
			//return false;
		}


		
		
		//右下角超出图片界限
		else if(isimg(e.target.offsetLeft+parseInt(mb.style.width),e.target.offsetTop+parseInt(mb.style.height))!==true){		
			//document.onmouseup(e);
			
			//超出右方,限定在图片之内,
			if((e.target.offsetLeft+parseInt(mb.style.width))>=(img.offsetLeft+img.offsetWidth))
			{				
				mb.style.left = img.offsetLeft+img.offsetWidth-parseInt(mb.style.width)-1 + 'px';				
			}
				
			//超出下方
			if((e.target.offsetTop+parseInt(mb.style.height))>=(img.offsetTop+img.offsetHeight))
			{				
				mb.style.top = img.offsetTop+img.offsetHeight-parseInt(mb.style.height)-1 + 'px';
			}
			//mb.style.top = e.pageY - diffY + 'px';
			//mb.style.left = e.pageX - diffX + 'px';
			//return false;
			document.onmouseup(e);
		}	
		
		else{
			mb.style.top = e.pageY - diffY + 'px';
			mb.style.left = e.pageX - diffX + 'px';			
		}
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
//点击取消方框
function cancer(){
	var b = document.getElementsByName("box")[0];
	document.body.removeChild(b);
	
	//是否存在方框置为否
	existbox=false;
	var c=document.getElementById("myCanvas");
	
	c.style.display="none";
}

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