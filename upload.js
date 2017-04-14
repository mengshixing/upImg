$scope.cropok=function(){
	
		var img=document.getElementById("croppic");
		
		var canvas = document.createElement("canvas");
		console.log(canvas);
		
		canvas.width=$scope.rect.width;
		canvas.height=$scope.rect.height;
		
		var ctx = canvas.getContext("2d");
		
		console.log($scope.rect.left,$scope.rect.top,$scope.rect.width,$scope.rect.height,0,0,$scope.rect.width,$scope.rect.height);
		
		ctx.drawImage(img,$scope.rect.left,$scope.rect.top,$scope.rect.width,$scope.rect.height,0,0,$scope.rect.width,$scope.rect.height);

		//$(document.body).append(canvas);
		
		var data=canvas.toDataURL();
		
		data=data.split(',')[1];
		data=window.atob(data);
		var ia = new Uint8Array(data.length);
		for (var i = 0; i < data.length; i++) {
			ia[i] = data.charCodeAt(i);
		};

		
		// canvas.toDataURL 返回的默认格式就是 image/png
		var blob=new Blob([ia], {type:"image/png"});
		
		//testpaperfile.name = "imageFilename.png"
		
		var fd=new FormData();

		fd.append('testpaperfile',blob,"imageFilename.png");

		
		$http({
				method: "POST", 
				url: $cookies.get('getupurl'),
				data:fd,
				headers: {'Content-Type': undefined }
				//alias: 'testpaperfile',
			}).then(function successCallback(response) {
			// this callback will be called asynchronously
			// when the response is available
			   
				console.log(response);
				var dt=response.data;
				dt.name=items.name;
				dt.id=items.id;
				EventBus.fire({
					type:'crop',
					data:{
						data:response.data
					}
				})
					
				//setTimeout(function(){
					alert("裁剪保存成功");
					$uibModalInstance.close("close");
				//},500);
			
			}, function errorCallback(response) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log(response);
		});
	}
	
