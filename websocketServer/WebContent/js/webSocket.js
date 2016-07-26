    var url = "ws://127.0.0.1:8080/websocketServer/chat";
    var socket = null;
    var musicInfo = null , musicNo = 1;
    var audio = document.createElement('audio');
    
    $(document).ready(function() {
        $('#messages').attr('readOnly',true);
        socket = new WebSocket(url);
        socket.onmessage = handleMsg;
        loadMusicInfo();
        /*
		window.onbeforeunload = function () {
	    	var msg = {
	    		    logoutName: $('#nickName').val(),
	    		  };
	    	socket.send(JSON.stringify(msg));
		}
        */
        
        //home觸發聊天室顯示與隱藏
        $('.home').click(function(){
    		$('#boxInside').slideToggle();
    		$('#home').toggleClass('home');
        })
        
        $('#fileUploadImage').on('click',function(e){
        	e.preventDefault();
            $('#fileUpload').trigger('click');
        })
        
        $('#fileUpload').change(function(){
		  	$.ajaxFileUpload({
			  	url : "FileUpload.do",
			   	type: "post",
			   	fileElementId: 'fileUpload',
			   	dataType : 'text',
			   	success : function(data) {
				   	if(data=="true"){
				   		alert("upload success");
					  	setTimeout(function(){ 
					    	var msg = {
					    			musicInfo: 'updateMusicList',
					    		  };
					    	socket.send(JSON.stringify(msg));
					    	
					  	}, 15000);
				   	}else if(data=="false"){
				   		alert("file type error");
				    }
			   }
			});
        })
        
        //更新歌曲表單
		function loadMusicInfo(){
			$.ajax({
                type:"POST",                    
                url: "doAjaxServlet.do",        
                data: "", 
                dataType:'json', 
                success : function(response){
                	musicInfo = response;
                	$('.list-group').html('');
                	for (var i = 0; i < Object.keys(musicInfo).length; i++) {
                		if(i == 0){
                			$('.list-group').append('<a href="#" class="list-group-item active">Music Info</a>');
                		}else{
                			$('.list-group').append('<a href="#" id=mid"'+i+'" class="list-group-item" onClick="sendMusicInfo('+i+')">'+ musicInfo[i] +'</a>');
                		}
					}
                },
                error:function(xhr, ajaxOptions, thrownError){
                	console.log('ajax error');
                }
            });
    	}
    });
    
    function handleMsg(event) {
    	if(isNaN(parseInt(event.data))== false){
    		//點擊list內容播放
    		var songs = parseInt(event.data);
            audio.src = "music/" + musicInfo[songs];
			audio.play();
    	}else if(event.data=="play"){
    		//點擊play內容播放
    		audio.currentTime;
			audio.play();
        }else if(event.data=="prev"){
        	//點擊prev內容播放
        	musicNo == 1 ? 1 : musicNo-- ;
            audio.src = "music/" + musicInfo[musicNo];
			audio.play();
        }else if(event.data=="next"){
        	//點擊next內容播放
        	musicNo == Object.keys(musicInfo).length ? Object.keys(musicInfo).length : musicNo++;
            audio.src = "music/" + musicInfo[musicNo];
			audio.play();
        }else if(event.data=="pause"){
        	//點擊pause內容暫停
        	audio.pause();
        }else if(event.data=="updateMusicList"){
        	//同步更新歌曲表單
        	loadMusicInfo();
        }else{
            //同步顯示聊天內容
            var msgJObj = $('#messages');
            msgJObj.val(msgJObj.val() + event.data + "\n");
            msgJObj.scrollTop(msgJObj[0].scrollHeight);
        }
        setTimeout(function(){ progress(); }, 1000);
        
    }
    //顯示進度條
    function progress(){
		var progressStop = setInterval(function(){
			var totalTime = audio.duration;
			var currentTime = audio.currentTime
			var progress = (currentTime/totalTime)*100; 
			document.getElementById("progress").style.width = progress + "%";
			document.getElementById("progress").innerHTML = Math.round(progress) + "%";
			if(audio.ended == true){
				clearInterval(progressStop);
			}			
		}, 1000);
    }
	   
    function disconnect() {
        socket.close();
    }

    function sendMessage() {
    	if($('#msg').val() != '' && $('#nickName').val() != ''){
        	var msg = {
        		    msg: $('#msg').val(),
        		    nickName: $('#nickName').val(),
        		  };
        	socket.send(JSON.stringify(msg));
    	}
    }

    /* send websocket current type*/
    function sendMusicPrev(){
    	var msg = {
    		    musicInfo: 'prev',
    		  };
		socket.send(JSON.stringify(msg));	
    }

    function sendMusicPlay(){
    	var msg = {
    		    musicInfo: 'play',
    		  };
		socket.send(JSON.stringify(msg));	
    }
    
    function sendMusicPause(){
    	var msg = {
    		    musicInfo: 'pause',
    		  };
		socket.send(JSON.stringify(msg));	
    }
    
    function sendMusicNext(){
    	var msg = {
    		    musicInfo: 'next',
    		  };
		socket.send(JSON.stringify(msg));	
    }

    function sendMusicInfo(songs){
    	var msg = {
    		    musicInfo: songs,
    		  };
		socket.send(JSON.stringify(msg));	
    }