$(".drop").on("change", "input[type=file]", function() {
	$(this).prev().css("opacity","1")
	
	var filePath = $(this).val();//读取图片路径
	
	var fr = new FileReader();//创建new FileReader()对象
	var imgObj = this.files[0];//获取图片

	fr.readAsDataURL(imgObj);//将图片读取为DataURL
	var obj = $(this).prev()[0];//

	if(filePath.indexOf("jpg") != -1 || filePath.indexOf("JPG") != -1 || filePath.indexOf("PNG") != -1 || filePath.indexOf("png") != -1) {
		var arr = filePath.split('\\');
		var fileName = arr[arr.length - 1];

		// console.log(fileName);
		$(this).parent().next().show();

		fr.onload = function() {
			obj.src = this.result;

			var data = new FormData();
			data.append("file",imgObj);
            data.append("id",$("#codeId").val());

			$.ajax({
				type: "POST",
				url: "/qr/parse",
				enctype: 'multipart/form-data',
				processData: false,
				contentType: false,
				data: data,
				cache: false,
				timeout: 600000,
				success: function (data) {
					// console.log("SUCCESS : ",data);
					var newData = JSON.stringify(data);
					newData = eval("("+newData+")");

					if(true == newData.flag){
						var id = newData.data.id;
						var title = newData.data.title;
						var value = newData.data.value;

						if(title != "all"){
							$("#"+title).val(value);
							$("#codeId").val(id);
						} else {
							alert("该二维码不是QQ、微信、支付宝的收款码");
						}
					} else{
					   alert(newData.message);
					}
				}
			});
		};
	}
});