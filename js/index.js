$(function(){
	var heights=document.documentElement.clientHeight;
	$('.boxs').height(heights);
	console.log(heights)
	var canvas=$('.canvas').get(0);
	var ctx=canvas.getContext('2d');
    var ROW=15;
    var widths=canvas.width;
    var jianju=widths/ROW;
    var biao={};
    var flag=true;
    var blanks={};
    var ai=false;
    var audio=$('audio').get(0)
    $(document).on('mousedown',false)
 //将棋盘所有的坐标以——方式保存下来
 function pq(x,y){
     return x+"_"+y;
      }
 for(var i=0;i<ROW;i++){
        for(var j=0;j<ROW;j++){
            blanks[pq(i,j)]=true;
        }
       }
  //绘制棋盘
function huibei(){
	   function huixian(){
	    for(var i=0;i<ROW;i++){
	        ctx.beginPath();
		    ctx.moveTo(jianju/2+i*jianju+0.5,jianju/2+0.5);
		    ctx.lineTo(jianju/2+i*jianju+0.5,widths-jianju/2+0.5);
		    ctx.stroke();
		    ctx.closePath();
		   }
	    for(var i=0;i<ROW;i++){
	    	ctx.beginPath();
		    ctx.moveTo(jianju/2+0.5,jianju/2+i*jianju+0.5);
		    ctx.lineTo(widths-jianju/2+0.5,jianju/2+i*jianju+0.5);
		    ctx.stroke();
		    ctx.closePath();
		   }
	    }
	  huixian();   
	  function huiyuan(x,y){
	  ctx.beginPath();
	  ctx.arc(x,y,4,0,2*Math.PI,true);
	  ctx.fill();
	  ctx.closePath();	
	    }
		huiyuan(117,117);
		huiyuan(117,384);
		huiyuan(384,117);
		huiyuan(384,384);
		huiyuan(250,250)	
      }
 huibei();
 //返回一个位置信息
  function kk(pos){
       var arr=pos.split("_");
       return position={
           x:parseInt(arr[0]),
           y:parseInt(arr[1])
       }
      } 
  //判断白旗放的位置
 function weizhiyi(){
        var max1=-Infinity;
        var max2=-Infinity;
        var pos1;
        var pos2;
        for(var i in blanks){
           var score1= shuying(kk(i),"black")   
           var score2= shuying(kk(i),"yellow");
            if(score1>max1){
                max1=score1;
                pos1=i;
            }
            if(score2>max2){
                max2=score2;
                pos2=i;
            }
        }
        if(max1>max2){
          return kk(pos1);
        }
        if(max2>=max1){
          return kk(pos2);
        }
      }
   //绘制棋子
 function qizi(position,colors){
 	      x=position.x;
 	      y=position.y;
		  ctx.save();
		  ctx.translate(jianju/2+x*jianju,jianju/2+y*jianju)
		    ctx.beginPath();
		    ctx.arc(0,0,15,0,2*Math.PI,true);
		  if(colors=="black"){
		  	 audio.play()
		     var img= new Image();
			 img.src='img/heiqi.png'
			ctx.drawImage(img,-15,-15,30,30);
		 }else{
		    audio.play()
		    var img= new Image();
		   	img.src='img/baiqi.png'
			ctx.drawImage(img,-15,-15,30,30);
		   }

		  ctx.closePath();
		  ctx.restore();
		  biao[x+'_'+y]=colors;	
		  delete blanks[x+'_'+y];
		     }
 //输赢判断
 function shuying(position,colors){
		   var lefts=1;
		   var rights=1;
		   var shang=1;
		   var xia=1;
		   var table={};
		   var tx=position.x;
		   var ty=position.y;
		   for(var i in biao){
		     if(biao[i]===colors){
		     	table[i]=true;
		      }
		   }
	      while(table[(tx+1)+'_'+ty]){
		    rights++;
		    tx++;
		  }
		  tx=position.x;
		  ty=position.y;
		  while(table[(tx-1)+'_'+ty]){
		    rights++;
		    tx--;
		  }
		  tx=position.x;
		  ty=position.y;
		  while(table[tx+'_'+(ty+1)]){
		  	lefts++;
		  	ty++;
		  }
		  tx=position.x;
		  ty=position.y;
		  while(table[tx+'_'+(ty-1)]){
		  	lefts++;
		  	ty--;
		  }
		  tx=position.x;
		  ty=position.y;
		  while(table[(tx+1)+'_'+(ty+1)]){
		     shang++;
		     tx++;
		     ty++;
		  }
		  tx=position.x;
		  ty=position.y;
		  while(table[(tx+1)+'_'+(ty-1)]){
		     xia++;
		     tx++;
		     ty--;
		  }
		  tx=position.x;
		  ty=position.y;
		  while(table[(tx-1)+'_'+(ty-1)]){
		     shang++;
		     tx--;
		     ty--;
		  }
		  tx=position.x;
		  ty=position.y;
		  while(table[(tx-1)+'_'+(ty+1)]){
		     xia++;
		     tx--;
		     ty++;
		  }
         return Math.max(shang,xia,lefts,rights);
               }
 $('.canvas').on('click',weizhi); 
   //位置的确定
 function weizhi(e){
		  var  position={
		  	x:Math.round((e.offsetX-jianju/2)/jianju),
		  	y:Math.round((e.offsetY-jianju/2)/jianju)
		   }
		  if(biao[position.x+'_'+position.y]){
		  	return;
		  }
		   if(ai){
             qizi(position,"black");
         
             if(shuying(position,"black")>=5){
                $('.tanchukuang').addClass('active');
                $('.title').text('你真棒');
                $('.neirong').text('又赢了');
                return;
                 }
             qizi(weizhiyi(),"yellow");
             if(shuying(weizhiyi(),"yellow")>=6){
               $('.tanchukuang').addClass('active');
                $('.title').text('真遗憾');
                $('.neirong').text('你又输了');
                 return;
                }
            return;
         }
		 //双人对战的时候
		 if(flag){
			  	qizi(position,'black');
			    if(shuying(position,"black")>=5){
                 $('.tanchukuang').addClass('active');
                 $('.title').text('恭喜你');
                $('.neirong').text('黑棋赢');
                 return;
             }
			  	flag=false;
		      }else{
			  	qizi(position,'yellow');
			  	if(shuying(position,"yellow")>=5){
             	 $('.tanchukuang').addClass('active');
             	 $('.title').text('恭喜你');
                 $('.neirong').text('白棋赢');
                 return;
             }
			  	flag=true;
		     }
		 }
//游戏介绍
$('.jieshao').on('click',function(){
	$('.guize').toggleClass('active');
})
//开始游戏
$('.kaishishi').on('click',function(){
   $('.jihe').toggleClass('active')
})
//选择游戏
   $(".renji input").on('click',function(){
        $('.renji input:checkbox').prop('checked',true)
        $('.shuangren input:checkbox').prop('checked',false)
    })
    $(".shuangren input").on('click',function(){
        $('.shuangren input:checkbox').prop('checked',true)
        $('.renji input:checkbox').prop('checked',false)
    })
    $('.queren').on('click',function(){
        if($('.renji input:checked').length==0){
            ai=false;
       }else{
            ai=true;
           }
       $('.jihe').toggleClass('active')
     })
 //再来一局
 $('.chongzhi').on('click',function(){
 	 $('.jihe').toggleClass('active')
 })
 $('.zailai').on('click',function(){
 	 $('.jihe').toggleClass('active')
 	  ctx.clearRect(0,0,widths,widths);
		  flag=true;
		  ai=false;
		  huibei();
     $('.tanchukuang').removeClass('active');
 })
 //退出游戏
 $('.tuichu').on('click',function(){
 	 ctx.clearRect(0,0,widths,widths);
		  flag=true;
		  ai=false;
		  huibei();
     $('.tanchukuang').removeClass('active');
   })

})