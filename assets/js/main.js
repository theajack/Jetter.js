//tabIndent.js
tabIndent={version:'0.1.8',config:{tab:'\t'},events:{keydown:function(e){var a=tabIndent.config.tab;var b=a.length;if(e.keyCode===9){e.preventDefault();var c=this.selectionStart,currentEnd=this.selectionEnd;if(e.shiftKey===false){if(!tabIndent.isMultiLine(this)){this.value=this.value.slice(0,c)+a+this.value.slice(c);this.selectionStart=c+b;this.selectionEnd=currentEnd+b}else{var d=tabIndent.findStartIndices(this),l=d.length,newStart=undefined,newEnd=undefined,affectedRows=0;while(l--){var f=d[l];if(d[l+1]&&c!=d[l+1])f=d[l+1];if(f>=c&&d[l]<currentEnd){this.value=this.value.slice(0,d[l])+a+this.value.slice(d[l]);newStart=d[l];if(!newEnd)newEnd=(d[l+1]?d[l+1]-1:'end');affectedRows++}}this.selectionStart=newStart;this.selectionEnd=(newEnd!=='end'?newEnd+(b*affectedRows):this.value.length)}}else{if(!tabIndent.isMultiLine(this)){if(this.value.substr(c-b,b)==a){this.value=this.value.substr(0,c-b)+this.value.substr(c);this.selectionStart=c-b;this.selectionEnd=currentEnd-b}else if(this.value.substr(c-1,1)=="\n"&&this.value.substr(c,b)==a){this.value=this.value.substring(0,c)+this.value.substr(c+b);this.selectionStart=c;this.selectionEnd=currentEnd-b}}else{var d=tabIndent.findStartIndices(this),l=d.length,newStart=undefined,newEnd=undefined,affectedRows=0;while(l--){var f=d[l];if(d[l+1]&&c!=d[l+1])f=d[l+1];if(f>=c&&d[l]<currentEnd){if(this.value.substr(d[l],b)==a){this.value=this.value.slice(0,d[l])+this.value.slice(d[l]+b);affectedRows++}else{}newStart=d[l];if(!newEnd)newEnd=(d[l+1]?d[l+1]-1:'end')}}this.selectionStart=newStart;this.selectionEnd=(newEnd!=='end'?newEnd-(affectedRows*b):this.value.length)}}}else if(e.keyCode===27){tabIndent.events.disable(e)}else if(e.keyCode===13&&e.shiftKey===false){var g=tabIndent,cursorPos=this.selectionStart,d=g.findStartIndices(this),numStartIndices=d.length,startIndex=0,endIndex=0,tabMatch=new RegExp("^"+a.replace('\t','\\t').replace(/ /g,'\\s')+"+",'g'),lineText='';tabs=null;for(var x=0;x<numStartIndices;x++){if(d[x+1]&&(cursorPos>=d[x])&&(cursorPos<d[x+1])){startIndex=d[x];endIndex=d[x+1]-1;break}else{startIndex=d[numStartIndices-1];endIndex=this.value.length}}lineText=this.value.slice(startIndex,endIndex);tabs=lineText.match(tabMatch);if(tabs!==null){e.preventDefault();var h=tabs[0];var i=h.length;var j=cursorPos-startIndex;if(i>j){i=j;h=h.slice(0,j)}this.value=this.value.slice(0,cursorPos)+"\n"+h+this.value.slice(cursorPos);this.selectionStart=cursorPos+i+1;this.selectionEnd=this.selectionStart}}},disable:function(e){var a=this;tabIndent.remove(e.target)},focus:function(){var c=tabIndent,el=this,delayedRefocus=setTimeout(function(){var a=(el.getAttribute('class')||'').split(' '),contains=a.indexOf('tabIndent');el.addEventListener('keydown',c.events.keydown);el.style.backgroundImage="url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAKZSURBVEjH7ZRfSFNRHMe/9+/+3G26tUn+ycywgURgUBAUJlIhWlEQEjN8yQcfolKJxJAefOjRCnT0IPYQ9iRa9FAYJiaUVP4twf7gzJzpnDbdzHt3z+3Fua3dO4Ne/f5ezjmc8+F7zvmeA2zrv0VFGlexAssFw1mG1pqqUL8npGY60Bw3ykYaOVjlrFXmEyw0AQj6g53UONQBO8DBzuiT2tUx+gR/mwACBQpIUoACBZoAZaOSiWwFIFs4oMMS9/boZVF8T8vtkbEofatiRKF9mXK6M7tTyyxRaPwWtJezIu9+9cNzxHk/n9938rz6IWpvgRdZd5/HcsvC9jadqk6Z0qkBiCaAF3UtX8cy6h1mwlnLhsuZuRvqABlyNJqb0q0ZWsb7uUVHlXAahWl1y3M2tVuQVR1Q0Pl0dwZ67KbZtGnX/ma++/FsCCY1ANlAxIuT2NZP3XB/GRKc9qKhKTYnd4auJbIqINEBDa5zoWWByoS1jocR+loKpKGJKqBLybN/OQN2Tmodv4jCtYIMYurnP5sLf+V5XK4DbFv4haaDCEABA/J88GdegD1I2+heY0Xj7M1itiMjP8srzutjXMbkIDZKCrAcfGOt8LwODimYnzzjLcHIx5VFwPekZrhVPYmxyVNAvZP8KV28SykClo6XF4/t9LpC2TTIteulJepJjD5nCjL8E56sMHt40NYYqE51ZnZIfmGXYBC68p/6v6UkApSI8Y2ejPVKhyE0PdLDPcg+Z003G0W7YUmmvo/WtjXgbiKAAQNGpjYRDOwWILx3dV16ZBsx3QsdYi4JNUw6uCvMbrUcWFAvPWznfH9/GQHR5xAbPuTumRFWvS+ZwDGyJFfidkxWk2oaIfTRk8RI0YqMAQBAL7YVrz/iUDx4QII4/QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMi0xMi0wMVQwMDowNjo0My0wNTowMLKpTWYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTItMTItMDFUMDA6MDY6NDMtMDU6MDDD9PXaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAABJRU5ErkJggg==)";el.style.backgroundPosition='top right';el.style.backgroundRepeat='no-repeat';if(contains!==-1)a.splice(contains,1);a.push('tabIndent-rendered');el.setAttribute('class',a.join(' '));el.removeEventListener('focus',c.events.keydown)},500);el.addEventListener('blur',function b(){clearTimeout(delayedRefocus);el.removeEventListener('blur',b)})}},render:function(a){var c=this;if(a.nodeName==='TEXTAREA'){a.addEventListener('focus',c.events.focus);a.addEventListener('blur',function b(e){c.events.disable(e)})}},renderAll:function(){var a=document.getElementsByTagName('textarea'),t=a.length,contains=-1,classes=[],el=undefined;while(t--){classes=(a[t].getAttribute('class')||'').split(' ');contains=classes.indexOf('tabIndent');if(contains!==-1){el=a[t];this.render(el)}contains=-1;classes=[];el=undefined}},remove:function(a){if(a.nodeName==='TEXTAREA'){var b=(a.getAttribute('class')||'').split(' '),contains=b.indexOf('tabIndent-rendered');if(contains!==-1){a.removeEventListener('keydown',this.events.keydown);a.style.backgroundImage='';b.splice(contains,1);b.push('tabIndent');a.setAttribute('class',(b.length>1?b.join(' '):b[0]))}}},removeAll:function(){var a=document.getElementsByTagName('textarea'),t=a.length,contains=-1,classes=[],el=undefined;while(t--){classes=(a[t].getAttribute('class')||'').split(' ');contains=classes.indexOf('tabIndent-rendered');if(contains!==-1){el=a[t];this.remove(el)}contains=-1;classes=[];el=undefined}},isMultiLine:function(a){var b=a.value.slice(a.selectionStart,a.selectionEnd),nlRegex=new RegExp(/\n/);if(nlRegex.test(b))return true;else return false},findStartIndices:function(a){var b=a.value,startIndices=[],offset=0;while(b.match(/\n/)&&b.match(/\n/).length>0){offset=(startIndices.length>0?startIndices[startIndices.length-1]:0);var c=b.search("\n");startIndices.push(c+offset+1);b=b.substring(c+1)}startIndices.unshift(0);return startIndices}};

//搜索api功能  左右切换api
var detailText=[
  "Select and set HTML element expediently.",
  "Read and write value or text of a set of HTML element expediently.",
  "Convient validation of a set of HTML element.",
  "Some other frequently-used functions."
];
var searchResult=[];
/*注册事件*/
/*if(document.addEventListener){
    document.addEventListener('DOMMouseScroll',scrollFunc,false);
}//W3C
window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome/Safari*/
J.ready(function(){
  tabIndent.render(J.id("apiCode"));
  addApiDetails();
  //Jet.setNoteStyle("gray");
  J.class("intro-item").event("onclick","showIntroDetail(this)");
  J.id("copyBtn").event("onclick",copySourceCode);
  J.class("api-title").event("onclick",function(e){
    showRipple(e,this);
    moveApiBar(this);
  })
  J.id("viewApi").event("onclick",function(){
    showApi(this.parent().attr("jet-index"));
  })
  J.select("#apiDetail .close-btn").event("onclick",hideApiDetail);
  J.select("#apiDetail .prev").event("onclick","switchApiDetail(0)");
  J.select("#apiDetail .next").event("onclick","switchApiDetail(1)");
  J.select(".api-item span").event("onclick",function(){
    showApiDetail(this);
  });
  J.id("apiCodeBtn").event("onclick",showResult);
  J.id("apiCodeResetBtn").event("onclick",function(){
    Jet.confirm("Are you sure to reset code,you will lose all code you are editting!",resetCode);
  });
  J.id("apiCodeClearBtn").event("onclick",function(){
    Jet.confirm("Are you sure to clear code,you will lose all code you are editting!",function(){
      J.id("apiCode").val("");
    });
  });
  J.id("apiCodeCopyBtn").event("onclick",function(){
    if(Jet.isMobile()){
      Jet.show('Sorry,this function is just for PC',"warn","slow");
    }else{
      if(J.id('apiCode').copy()){
        Jet.show('Code copy success');
      }
    }
  });
  J.id("apiCode").event({
    "onmouseleave":"showResult(false)",
    "onkeydown":codeChange,
    "oninput":showResultHtml,
    "onmousewheel":redefineMouseWhell
  });
  J.id("apiSearchResultList").event({
    "onmousewheel":redefineMouseWhell,
    //"onmouseleave":function(){this.slideUp()}
  });
  J.class("api-item").event("onmousewheel",redefineMouseWhell);
  
  J.class("result-close-btn").event("onclick",function(){this.parent().slideUp(null,"fast")});
  J.id("apiSearchInput").event("onkeydown",function(e){if(e.keyCode===13){J.id("apiSearchBtn").click()}});
  //J.id("apiSearchBtn").event("onclick","alert('a')");
  J.id("apiSearchBtn").event("onclick",showApiSearch);
  checkWidth();
});
function switchApiDetail(dirc){// 0:prev
  var arr=J.id("apiCode").attr("jet-api-index").split(" ");
  if(arr.length==1){//searchResult
    if(dirc==0){
      if(arr[0]>0){
        showApiDetailForSearchByIndex(parseInt(arr[0])-1);
      }else{
        Jet.show("Alerady the first one","warn")
      }
    }else{
      if(arr[0]<searchResult.length-1){
        showApiDetailForSearchByIndex(parseInt(arr[0])+1);
      }else{
        Jet.show("Alerady the last one","warn")
      }
    }
  }else{
    if(dirc==0){
      if(arr[1]>0){
        showApiDetailByIndex(arr[0],parseInt(arr[1])-1);
      }else{
        Jet.show("Alerady the first one","warn")
      }
    }else{
      if(arr[1]<apiData[arr[0]].length-1){
        showApiDetailByIndex(arr[0],parseInt(arr[1])+1);
      }else{
        Jet.show("Alerady the last one","warn")
      }
    }
  }
}
function showApiSearch(){
 var skey=J.id("apiSearchInput").val().toLowerCase();
  J.id("apiSearchResultList").empty();
  searchResult.empty();
  for(var key in apiData){
    apiData[key].each(function(d){
      if(d.title.toLowerCase().includes(skey)){
        searchResult.append(d);
        var title;
        if(skey!=""){
          var start=d.title.toLowerCase().indexOf(skey);
          var end=start+skey.length;
          title=d.title.substring(0,start)+"<span class='search-key'>"+d.title.substring(start,end)+"</span>"+d.title.substring(end);
        }else{
          title=d.title;
        }
        var span=J.new("span").html(title).event("onclick",function(){
          showApiDetailForSearch(this);
        });
        if(d.title.length>13){
          if(d.title.length<19){
            span.css({"font-size":"22px","padding-top":"25px"});
          }else{
            span.css({"font-size":"18px","padding-top":"29px"});
          }
        }
        J.id("apiSearchResultList").append(span);
      }
    });
  }
  J.id("resultNum").text(searchResult.length);
  J.id("apiSearchResultWrapper").slideDown(null,"fast");
}
function redefineMouseWhell(e){
  e.preventDefault();
  this.scroll(e.deltaY,null,50);
}
function addApiDetails(){
  var list=J.id("apiBar").child();
  list.each(function(api){
    apiData[api.attr("jet-api")].each(function(data){
      var span=J.new("span").text(data.title);
      if(data.title.length>13){
        if(data.title.length<19){
          span.css({"font-size":"22px","padding-top":"25px"});
        }else{
          span.css({"font-size":"18px","padding-top":"29px"});
        }
      }
      api.append(span);
    })
  })
}
function codeChange(e){
  if(this.attr("jet-change")=="0"){
    this.attr("jet-change","1");
  }
}
window.onresize=function(){
  checkWidth();
}
function checkWidth(){
  var w=J.width();
  if(w>=1800){
    J.class("part").css("padding","100px 20%");
  }else if(w<=1200){
    J.class("part").css("padding","100px 5%");
  }else{
    J.class("part").css("padding","100px 15%");
  }
}
function showResult(needShow){
  if(needShow!=false){
    if(showResultBase()){
      Jet.show("submit success");
    }
  }else{
    if(J.id("apiCode").attr("jet-change")=="1"){
      showResultBase();
    }
  }
}
function showResultBase(){
  var obj=J.id("resultArea");
  if(obj!=null){
    var a=J.id("apiCode").val();
    if(a.has("<\/script>")){
      var script=a.substring(a.indexOf("<script"),a.indexOf("<\/script>")+9);
      var elems=a.replace(script,"");
      var newScript = J.new('script[type=text/javascript]').html(script.substring(script.indexOf(">")+1,(script.indexOf("<\/script>"))));
      obj.append(newScript).html(elems);
    }else{
      obj.html(a);
    }
    if(a.has("jet-valid")){
      Jet.initValid();
    }
    J.id("apiCode").attr("jet-change","0");
    Jet.initValid(obj);
    return true;
  }
  return false;
}
function showResultHtml(){
  var obj=J.id("resultArea");
    if(obj!=null){
    var a=J.id("apiCode").val();
    if(a.indexOf("<\/script>")!=-1){
      var script=a.substring(a.indexOf("<script"),a.indexOf("<\/script>")+9);
      var elems=a.replace(script,"");
      obj.html(elems);
    }else{
      obj.html(a);
    }
  }
}
function showIntroDetail(obj){
  var detail= J.id("introDetail");
  if(detail.attr("jet-index")=="-1"){
    var i=obj.index();
    detail.css("height","150px");
    detail.attr("jet-index",i).child(1).text(detailText[i]);
    detail.findClass("trangle").css("margin-left",(10+i*25)+"%");
  }else{
    if(obj.index()==detail.attr("jet-index")){
      detail.css("height","0px");
      detail.attr("jet-index","-1");
    }else{
      var i=obj.index();
      detail.findClass("trangle").css("margin-left",(10+i*25)+"%");
      detail.attr("jet-index",i).child(1).text(detailText[i]);
    }
  }
}
function copySourceCode(){
  J.id("downloadArea").copy();
  Jet.show("copy success");
}
function showApi(i){
  J.scrollTo(J.id("apiPart").top(),function(){
    J.id("apiBarTitle").child(i).click();
    hideApiDetail();
  });
}
function showApiDetailForSearch(obj){
  showApiDetailForSearchByIndex(obj.index());
}
function showApiDetailForSearchByIndex(i){
  J.id("apiCode").attr("jet-api-index",i);
  checkSwitchBtnState(i,searchResult.length-1);
  showDetailBase(searchResult[i]);
}
function showApiDetail(obj){
  var api=obj.parent().attr("jet-api");
  var i=obj.index();
  showApiDetailByIndex(api,i);
}
function showApiDetailByIndex(api,i){
  J.id("apiCode").attr("jet-api-index",api+" "+i);
  checkSwitchBtnState(i,apiData[api].length-1);
  showDetailBase(apiData[api][i]);
}
function checkSwitchBtnState(i,b){
  if(i==0){
    J.select("#apiDetail .prev").addClass("disable");
  }else{
    J.select("#apiDetail .prev").removeClass("disable");
  }
  if(i==b){
     J.select("#apiDetail .next").addClass("disable");
  }else{
    J.select("#apiDetail .next").removeClass("disable");
  }
}
function resetCode(){
  var a=J.id("apiCode").attr("jet-api-index").split(" ");
  showDetailBase(apiData[a[0]][a[1]]);
}
function showDetailBase(d){
  Jet.set("apiDetail",d,function(elem,text,name){
    if(name=="title"){
      if(text.length>19){
        elem.css({"font-size":"27px","padding-top":"29px!important"});
      }else if(text.length<13){
        elem.css({"font-size":"50px","padding-top":"0!important"});
      }else{
        elem.css({"font-size":"35px","padding-top":"25px!important"});
      }
    }
  },"api-part");
  if(!d.test){
    J.id("resultArea").addClass("hide");
    J.class("result-cover").removeClass("hide");
  }else{
    J.id("resultArea").removeClass("hide");
    J.class("result-cover").addClass("hide");
  }
  J.id('apiDetail').addClass('show');
  showResultBase();
}
function hideApiDetail(){
  J.id('apiDetail').removeClass('show');
}
function showRipple(e,obj){
  J.class("ripple").remove();
  var offset = obj.offset();
  var len=(offset.width>offset.height)?offset.width:offset.height;
  if(obj.hasClass("bg-dark")){
    obj.prepend(J.new("span").addClass("ripple r-white"));
  }else{
    obj.prepend(J.new("span").addClass("ripple r-black"));
  }
  var x = e.pageX - offset.left - len / 2;
  var y = e.pageY - offset.top - len / 2;
  J.class("ripple").css({
    "width": len+ 'px',
    "height": len+ 'px',
    "top": y + 'px',
    "left": x + 'px'
  }).addClass("rippleEffect");
}
function moveApiBar(obj){
  var i=obj.index();
  J.id("apiBar").css("left",(-100*i)+"%");
  J.select(".trangle.api").css({"margin-left":(10+i*25)+"%","border-top-color":obj.css("background-color")});
}

var scrollFunc=function(e){
    var direct=0;
    e=e || window.event;
   
    var t1=document.getElementById("wheelDelta");
    var t2=document.getElementById("detail");
    if(e.wheelDelta){//IE/Opera/Chrome
        t1.value=e.wheelDelta;
    }else if(e.detail){//Firefox
        t2.value=e.detail;
    }
    ScrollText(direct);
}

/*function insertText(obj,str) {
    if (document.selection) {
        var sel = document.selection.createRange();
        sel.text = str;
    } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
        var startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            cursorPos = startPos,
            tmpStr = obj.value;
        obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
        cursorPos += str.length;
        obj.selectionStart = obj.selectionEnd = cursorPos;
    } else {
        obj.value += str;
    }
}
function moveEnd(obj){
    obj.focus();
    var len = obj.value.length;
    if (document.selection) {
        var sel = obj.createTextRange();
        sel.moveStart('character',len);
        sel.collapse();
        sel.select();
    } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
        obj.selectionStart = obj.selectionEnd = len;
    }
}*/ 
      
      