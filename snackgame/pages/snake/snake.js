// pages/snake/snake.js

Page({
  data: {
    score:0,
    maxscore:100,
    startx:0,
    starty:0,
    endx:0,
    endy:0,
    direction:"right",
    ground:[],
    rows:28, 
    cols:22,
    len:3,//蛇的初始长度
    snack:[],
    food:[],
    timer:"",
    modalhiden:true,
    voiceTempFilePath:"/music/music.wav",
    innerAudioContext:""
  },

  onLoad: function (options) {
      var max=wx.getStorageSync('maxstore');
     if(!max)
     {
       max=0;
     }
     this.setData({
       maxscore:max
     })
      this.initGround(this.data.rows,this.data.cols);
      this.initSnack(this.data.len);
      this.createFood();
      this.move();
  },
  //声音播放器
  musicplay : function () {
    this.data.innerAudioContext = wx.createInnerAudioContext();

    var voicePath = this.data.voiceTempFilePath;
    
    this.data.innerAudioContext.src = voicePath;  
    
    this.data.innerAudioContext.play();
    
    this.data.innerAudioContext.onEnded((res) => {

    
     })
     // 播放音频失败的回调
    
    this.data.innerAudioContext.onError((res) => { 
    
    console.log('播放音频失败' + res);
    
    })
     this.data.innerAudioContext.onStop((res) => {
    
          console.log('停止播放!');
    
      })
  },
  //计分器
  storeScore :function () {
    if(this.data.score>this.data.maxscore)
    {
      this.setData({
          maxscore:this.data.score
      })
    }
    wx.setStorageSync("maxstore", this.data.maxscore);
  },
  //初始s化场地
  initGround :function (rows,cols) {
    for(var i=0;i<rows;i++)
    {
        var array=[];
        this.data.ground.push(array);
        for(var j =0 ;j<cols;j++)
        {
          this.data.ground[i].push(0);
        }
    }
  },
  //初始化蛇
  initSnack:function (len) {
    for(var i=0;i<len;i++)
    {
        this.data.ground[0][i]=1;
        this.data.snack.push([0,i]);
    }
  },
  //创建食物
  createFood :function () {
    var x=Math.floor(Math.random()*this.data.rows);
    var y=Math.floor(Math.random()*this.data.cols);
    var ground=this.data.ground;
    ground[x][y]=2;
    var snack=this.data.snack;
    for(var i =0;i<snack.length;i++)
    {
        var node=snack[i][1];
        if(x==snack[i][0] && y==node)
        {
          this.createFood();
          return ;
        }
        else{
            this.setData({
                ground:ground,
                food:[x,y]


            })
        }

    }

  },

  //手指触摸开始
  tapstart:function(event)
  {
    this.setData({
      startx:event.touches[0].pageX,
      starty:event.touches[0].pageY
    })
  },
  //手指移动事件
  tapmove:function (e) {
   
    this.setData({
      endx:e.touches[0].pageX,
      endy:e.touches[0].pageY
    })
  },
  //触摸结束
  tapend:function (e) {
    var x=(this.data.endx)?(this.data.endx-this.data.startx):0;
    var y=(this.data.endy)?(this.data.endy-this.data.starty):0;
    if(Math.abs(x)>5 || Math.abs(y)>5)
    {
      var direction=Math.abs(x)>Math.abs(y)?this.computDir(1,x): this.computDir(0,y);
    }
    switch(direction)
    {
      case "left":
        if(this.data.direction=="right")
        return ;
        break;
      case "right":
        if(this.data.direction=="left")
          return ;
          break;
      case "up":
        if(this.data.direction=="down")
          return ;
          break;
      case "down":
        if(this.data.direction=="up")
          return ;
          break;
    }
    this.setData({
      direction:direction,
      startx:0,
      starty:0,
      endx:0,
      endy:0
    })
  },
  //判断方向函数
  computDir:function(x,num) {
    if(x)
    { 
      return num>0?"right":"left";
    }
    else{
     return  num>0?"down":"up";
    }
  },

  move :function () {
    var that=this;
    this.data.timer=setInterval(function () {
      try {
        that.changeDir(that.data.direction);
        that.setData({
          ground:that.data.ground
        })
      } catch (error) {
       
      }
   
    },200);
  },
  //具体方向函数
  changeLeft :function () {
    var arr=this.data.snack;
    var len=this.data.snack.length;
    var snackHEAD=arr[len-1][1];
    var snackTAIL=arr[0];
    var ground=this.data.ground;
    ground[snackTAIL[0]][snackTAIL[1]]=0;
    for(var i=0;i<len-1;i++)
    {
      arr[i]=arr[i+1];
    }
    var x=arr[len-1][0];
    var y=arr[len-1][1]-1;
    arr[len-1]=[x,y];
    this.checkGame(snackTAIL);
    for(var i=1;i<len;i++)
    {
      ground[arr[i][0]][arr[i][1]]=1;
    }
    this.setData({
      ground:ground,
      snack:arr
    })
    return true;
  },
  changeRight :function () {
    var arr=this.data.snack;
    var len=this.data.snack.length;
    var snackHEAD=arr[len-1][1];
    var snackTAIL=arr[0];
    var ground=this.data.ground;
    ground[snackTAIL[0]][snackTAIL[1]]=0;
    for(var i=0;i<len-1;i++)
    {
      arr[i]=arr[i+1];
    }
    var x=arr[len-1][0];
    var y=arr[len-1][1]+1;
    arr[len-1]=[x,y];
    this.checkGame(snackTAIL);
    for(var i=1;i<len;i++)
    {
      ground[arr[i][0]][arr[i][1]]=1;
    }
    this.setData({
      ground:ground,
      snack:arr
    })
    return true;
  },
  changeUp :function () {
    var arr=this.data.snack;
    var len=this.data.snack.length;
    var snackHEAD=arr[len-1][1];
    var snackTAIL=arr[0];
    var ground=this.data.ground;
    ground[snackTAIL[0]][snackTAIL[1]]=0;
    for(var i=0;i<len-1;i++)
    {
      arr[i]=arr[i+1];
    }
    var x=arr[len-1][0]-1;
    var y=arr[len-1][1]; 
    this.checkGame(snackTAIL);
    try {
      for(var i=1;i<len;i++)
      {
        ground[arr[i][0]][arr[i][1]]=1;
      }
    } catch (error) {
      console.log(error);
    }
   
    this.setData({
      ground:ground,
      snack:arr
    })
    return true;
    
  },
  changeDown :function () {
    var arr=this.data.snack;
    var len=this.data.snack.length;
    var snackHEAD=arr[len-1][1];
    var snackTAIL=arr[0];
    var ground=this.data.ground;
    ground[snackTAIL[0]][snackTAIL[1]]=0;
    for(var i=0;i<len-1;i++)
    {
      arr[i]=arr[i+1];
    }
    var x=arr[len-1][0]+1;
    var y=arr[len-1][1];
    arr[len-1]=[x,y];
    this.checkGame(snackTAIL);
    for(var i=1;i<len;i++)
    {
      ground[arr[i][0]][arr[i][1]]=1;
    }
    this.setData({
      ground:ground,
      snack:arr
    })
    return true;
  },
  //具体方向函数
  //改变方向
  changeDir:function (dir) {
    switch(dir)
    {
      case "left":
        return this.changeLeft();
        break;
      case "right":
        return this.changeRight();
        break;
      case "up":
        return this.changeUp();
        break;
      case "down":
        return this.changeDown();
        break;
      }
    
  },
  checkGame:function (snackTAIL) {
    var arr=this.data.snack;
    var len=this.data.snack.length;
    var snackHEAD=arr[len-1];
    if(snackHEAD[0]<0 || snackHEAD[0]>this.data.rows ||snackHEAD[1]<0||snackHEAD[1]>=this.data.cols)
    {
        try {
          clearInterval(this.data.timer);
          this.setData({
            modalhiden:false
          })
        } catch (error) {
          
        }
      
    }
    for(var i=0;i<len-1;i++)
    {
      if(snackHEAD[0]==arr[i][0] && snackHEAD[1]==arr[i][1])
      {
        clearInterval(this.data.timer);
        this.setData({
          modalhiden:false
        })
      }
    }
    if(snackHEAD[0]==this.data.food[0] && snackHEAD[1]==this.data.food[1])
    {
      arr.unshift(snackTAIL);
      this.setData({
        score:this.data.score+1,
      })
      this.musicplay();
      this.createFood();
      this.storeScore();
    }
    
  },

  modalconfirm:function () {
    this.setData({
      score:0,
      ground:[],
      food:[],
      snack:[],
      direction:"",
      modalhiden:true
    })
    this.onLoad();
  }


})