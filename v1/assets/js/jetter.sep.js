/*Jetter.js
  by theajack
  2017/3/18
  http://www.theajack.com/jetterjs/
*/
(function(){
  window.J = {
    ready: (function() {
      var b = [];
      var d = false;

      function c(g) {
        if (d) {
          return
        }
        if (g.type === "onreadystatechange" && document.readyState !== "complete") {
          return
        }
        for (var f = 0; f < b.length; f++) {
          b[f].call(document)
        }
        d = true;
        b = null
      }
      if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", c, false);
        document.addEventListener("readystatechange", c, false);
        window.addEventListener("load", c, false)
      } else {
        if (document.attachEvent) {
          document.attachEvent("onreadystatechange", c);
          window.attachEvent("onload", c)
        }
      }
      return function a(e) {
        if (d) {
          e.call(document)
        } else {
          b.push(e)
        }
      }
    })(),
    load: function(a) {
      if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function() {
          document.removeEventListener("DOMContentLoaded", arguments.callee, false);
          a()
        }, false)
      } else {
        if (document.attachEvent) {
          document.attachEvent("onreadystatechange", function() {
            if (document.readyState == "complete") {
              document.detachEvent("onreadystatechange", arguments.callee);
              a()
            }
          })
        }
      }
    },
    height: function() {
      return document.body.offsetHeight
    },
    width: function() {
      return document.body.offsetWidth
    },
    class: function(a) {
      return _checkSelect(document.getElementsByClassName(a))
    },
    id: function(a) {
      return document.getElementById(a)
    },
    tag: function(a) {
      return _checkSelect(document.getElementsByTagName(a))
    },
    attr: function(a) {
      return _checkSelect(document.querySelectorAll("[" + a + "]"))
    },
    name: function(a) {
      return _checkSelect(document.getElementsByName(a))
    },
    select: function(a) {
      return _checkSelect(document.querySelectorAll(a))
    },
    body: function() {
      return document.body
    },
    copy: _copy,
    new: function(a) {
      if (a.has("#") || a.has(".") || a.has("[")) {
        var b = a.split('#');
        if(b.length>1){
          b=[b[0],a.substring(b[0].length+1)];
        }
        var c;
        if (a.has("[")) {
          var l = b[b.length - 1];
          c = l.substring(0, l.indexOf("[")).split('.');
          c[c.length - 1] += l.substring(l.indexOf("["))
        } else {
          c = b[b.length - 1].split('.')
        }
        var d = c.length - 1;
        var f = c[d].split('[');
        for (var i = 0; i < f.length; i++) {
          c[d + i] = f[i]
        }
        anum = f.length - 1;
        cnum = c.length - anum - 1;
        var e;
        if (b.length == 1) {
          e = document.createElement(c[0])
        } else {
          e = document.createElement(b[0]);
          e.attr("id", c[0])
        }
        for (var i = 1; i < c.length; i++) {
          if (cnum > 0) {
            cnum--;
            e.addClass(c[i])
          } else {
            var g = c[i].substring(0, c[i].length - 1);
            var index=g.indexOf("=");
            e.attr(g.substring(0,index), g.substring(index+1));
          }
        }
        return e
      } else {
        return document.createElement(a)
      }
    },
    scroll: function(a, b, c) {
      if (arguments.length != 0) {
        if (a != 0) {
          document.body.scroll(a, null, c);
          document.documentElement.scroll(a, null, c);
          if (b != undefined) {
            c = _checkArg(c, 400);
            if (c.constructor!= Number) {
              c = _checkAnimateSpeed(c)
            }
            if (b.constructor == String) {
              setTimeout(function() {
                eval(b)
              }, c)
            } else {
              setTimeout(b, c)
            }
          }
        }
      } else {
        if (document.body.scrollTop == 0) {
          return document.documentElement.scrollTop
        } else {
          return document.body.scrollTop
        }
      }
    },
    scrollTo: function(y, a, b) {
      document.body.scrollTo(y, null, b);
      document.documentElement.scrollTo(y, null, b);
      if (a != undefined) {
        b = _checkArg(b, 400);
        if (b.constructor != Number) {
          b = _checkAnimateSpeed(b)
        }
        if (a.constructor == String) {
          setTimeout(function() {
            eval(a)
          }, b)
        } else {
          setTimeout(a, b)
        }
      }
    },
    ajax: function(a) {
      var b = {
        type: a.type || "GET",
        url: a.url || "",
        async: a.async || "true",
        data: a.data || null,
        dataType: a.dataType || "text",
        contentType: a.contentType || "application/x-www-form-urlencoded",
        beforeSend: a.beforeSend ||
        function() {},
        success: a.success ||
        function() {},
        error: a.error ||
        function() {}
      };
      b.beforeSend();
      var c;
      if (window.ActiveXObject) {
        c = ActiveXObject("Microsoft.XMLHTTP")
      } else if (window.XMLHttpRequest) {
        c = XMLHttpRequest()
      }
      c.responseType = b.dataType;
      c.open(b.type, b.url, b.async);
      c.setRequestHeader("Content-Type", b.contentType);
      c.send(_convertData(b.data));
      c.onreadystatechange = function() {
        if (c.readyState == 4) {
          if (c.status == 200) {
            b.success(c.response)
          } else {
            b.error()
          }
        }
      }
    },
    jsonp: function(options) {
      if (!options.url) {
        throw new Error("Parameter error");
      }else{
        var callbackName = ('_jsonp' + Math.random()).replace(".", "").substring(0, 15);
        var head = J.tag("head");
        options.data[_checkArg(options.callback, "callback")] = callbackName;
        var script = J.new('script');
        head.append(script);
        window[callbackName] = function(a) {
          head.removeChild(script);
          clearTimeout(script.timer);
          window[callbackName] = null;
          if(a.constructor==String){
            a=JSON.parse(a);
          }
          options.success && options.success(a);
        };
        if (options.dataType != undefined && options.dataType.toUpperCase() == "JSON") {
          script.attr("src", options.url + '?json=' + encodeURIComponent(JSON.stringify(options.data)))
        } else {
          script.attr("src", options.url + '?' + _formatParams(options.data))
        }
        options.time = _checkArg(options.time, 5000);
        script.timer = setTimeout(function() {
          window[callbackName] = null;
          head.removeChild(script);
          options.timeout && options.timeout({
            message:( (!options.message)?"timeout":options.message)
          })
        }, options.time)
      }
    },
    cookie: function(a, b, d, e) {
      if (arguments.length == 1) {
        if (document.cookie.length > 0) {
          var f = document.cookie.indexOf(a + "=");
          if (f != -1) {
            f = f + a.length + 1;
            var g = document.cookie.indexOf(";", f);
            if (g == -1) g = document.cookie.length;
            return unescape(document.cookie.substring(f, g))
          }
        }
        return ""
      } else {
        if (b == null) {
          J.cookie(a, "", -1)
        } else {
          var c = a + "=" + escape(b);
          if (d != undefined) {
            var h = new Date();
            h.setDate(h.getDate() + d);
            c += ";expires=" + h.toGMTString()
          }
          if (e != undefined) {
            if (e.constructor == Boolean) {
              if (e) {
                c += (";path=/")
              }
            } else {
              c += (";path=" + e)
            }
          }
          document.cookie = c;
          return a + "=" + b
        }
      }
    }
  };

  function _convertData(a) {
    if (typeof a === 'object') {
      var b = "";
      for (var c in a) {
        b += c + "=" + a[c] + "&"
      }
      b = b.substring(0, b.length - 1);
      return b
    } else {
      return a
    }
  }
  function _formatParams(a) {
    var b = [];
    for (var c in a) {
      b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]))
    }
    return b.join("&")
  }
  J.ready(function() {
    J.tag("head").append(J.new("style").txt(".j-none{visibility:hidden!important;position:absolute!important;display:block!important;}.j-animation{transition:all .5s linear!important;-moz-transition:all .5s linear!important;-webkit-transition:all .5s linear!important;-o-transition:all .5s linear!important}.j-slide{overflow:hidden!important;height:0!important;padding-top:0!important;padding-bottom:0!important}.j-fade{opacity:0!important}.j-display-none{display:none!important}@keyframes j-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}@-moz-keyframes j-spin{from{-moz-transform:rotate(0)}to{-moz-transform:rotate(360deg)}}@-webkit-keyframes j-spin{from{-webkit-transform:rotate(0)}to{-webkit-transform:rotate(360deg)}}@-o-keyframes j-spin{from{-o-transform:rotate(0)}to{-o-transform:rotate(360deg)}}.j-over-hidden{overflow:hidden!important;}"))
  });

  window.S=function(s) {
    if (s == undefined) {
      return J.body()
    } else {
      return J.select(s)
    }
  };

  function _checkSelect(b) {
    if (b.length == 1) {
      return b[0]
    }
    return b
  };
  HTMLElement.prototype.css = function(d, a) {
    if (a == undefined) {
      if (d.constructor == Object) {
        for (var b in d) {
          if (d[b].has("!")) {
            this.style.setProperty(b, _checkCssValue(this, b, d[b].substring(0, d[b].indexOf("!"))), "important")
          } else {
            this.style.setProperty(b, _checkCssValue(this, b, d[b]))
          }
        }
        return this
      } else {
        return getComputedStyle(this)[d]
      }
    } else {
      if (a.has("!")) {
        this.style.setProperty(d, _checkCssValue(this, d, a.substring(0, a.indexOf("!"))), "important")
      } else {
        this.style.setProperty(d, _checkCssValue(this, d, a))
      }
      return this
    }
  };
  HTMLCollection.prototype.css = NodeList.prototype.css = function(d, c) {
    if (c == undefined && d.constructor != Object) {
      var a = [];
      this.each(function(b) {
        a.append(b.css(d))
      });
      return a
    } else {
      this.each(function(a) {
        a.css(d, c)
      });
      return this
    }
  };
  HTMLElement.prototype.data = function(d, b) {
    if (arguments.length == 0) {
      if (this.hasAttr("jet-data")) {
        return JSON.parse(this.attr("jet-data"))
      } else {
        return null
      }
    } else if (arguments.length == 1) {
      if (d == undefined) {
        this.removeAttr("jet-data");
        return this
      } else {
        if (d.constructor == Object) {
          if (this.hasAttr("jet-data")) {
            var c = JSON.parse(this.attr("jet-data"));
            for (var e in d) {
              if (d[e] != undefined) {
                c[e] = d[e]
              } else {
                delete c[e]
              }
            }
            this.attr("jet-data", JSON.stringify(c))
          } else {
            this.attr("jet-data", JSON.stringify(d))
          }
          return this
        } else {
          if (this.hasAttr("jet-data")) {
            return JSON.parse(this.attr("jet-data"))[d]
          } else {
            return ""
          }
        }
      }
    } else {
      if (b == undefined) {
        if (this.hasAttr("jet-data")) {
          var c = JSON.parse(this.attr("jet-data"));
          if (d.constructor == Array) {
            d.each(function(a) {
              delete c[a]
            })
          } else {
            delete c[d]
          }
          this.attr("jet-data", JSON.stringify(c))
        }
        return this
      } else {
        if (this.hasAttr("jet-data")) {
          var c = JSON.parse(this.attr("jet-data"));
          c[d] = b;
          this.attr("jet-data", JSON.stringify(c))
        } else {
          var c = {};
          c[d] = b;
          this.attr("jet-data", JSON.stringify(c))
        }
        return this
      }
    }
  };
  HTMLCollection.prototype.data = NodeList.prototype.data = function(d, c) {
    if (c == undefined && d.constructor != Object && d != undefined) {
      var a = [];
      this.each(function(b) {
        a.append(b.data(d))
      });
      return a
    } else {
      if (c == undefined) {
        this.each(function(a) {
          a.data(d)
        })
      } else {
        this.each(function(a) {
          a.data(d, c)
        })
      };
      return this
    }
  };

  function _checkCssValue(a, c, d) {
    if (d.has("=")) {
      var e = _getCssNumberValue(d.substring(d.indexOf("=") + 1));
      if (d.has("-=")) {
        e[0] = -e[0]
      }
      var b;
      if (d.has("%")) {
        b = _getCssNumberValue(a.style[c])
      } else {
        b = _getCssNumberValue(getComputedStyle(a)[c])
      }
      return (e[0] + b[0]) + e[1]
    }
    return d
  };

  function _getCssNumberValue(a, b) {
    if (a == "" || a == undefined) {
      a = "0%"
    }
    if (b == undefined) {
      if (a.has("px")) {
        b = "px"
      } else if (a.has("%")) {
        b = "%"
      } else if (a.has("em")) {
        b = "em"
      } else {
        return [parseFloat(a), "px"]
      }
    }
    return [parseFloat(a.substring(0, a.indexOf(b))), b]
  };

  function _checkStyleName(b) {
    var a = b.split("-");
    if (a.length <= 1) {
      return b
    } else {
      var c = a[0];
      for (var i = 1; i < a.length; i++) {
        c += (a[i].charAt(0).toUpperCase() + a[i].substring(1))
      }
      return c
    }
  };
  HTMLElement.prototype.attr = function(c, b) {
    if (b == undefined) {
      if (c.constructor == Object) {
        for (var a in c) {
          this.setAttribute(a, c[a])
        }
        return this
      } else {
        return this.getAttribute(c)
      }
    } else {
      this.setAttribute(c, b);
      return this
    }
  };
  HTMLCollection.prototype.attr = NodeList.prototype.attr = function(d, c) {
    if (c == undefined && d.constructor != Object) {
      var a = [];
      this.each(function(b) {
        a.append(b.attr(d))
      });
      return a
    } else {
      this.each(function(a) {
        a.attr(d, c)
      });
      return this
    }
  };
  HTMLElement.prototype.hasAttr = function(a) {
    return this.hasAttribute(a)
  };
  HTMLElement.prototype.removeAttr = function(b) {
    var c = b.split(" ");
    if (c.length > 1) {
      var d = this;
      c.each(function(a) {
        d.removeAttribute(a)
      })
    } else {
      this.removeAttribute(b)
    }
    return this
  };
  HTMLCollection.prototype.removeAttr = NodeList.prototype.removeAttr = function(b) {
    this.each(function(a) {
      a.removeAttr(b)
    });
    return this
  };
  HTMLElement.prototype.findClass = function(a) {
    return _checkSelect(this.getElementsByClassName(a))
  };
  HTMLElement.prototype.findId = function(a) {
    return this.getElementById(a)
  };
  HTMLElement.prototype.findTag = function(a) {
    return _checkSelect(this.getElementsByTagName(a))
  };
  HTMLElement.prototype.findAttr = function(a) {
    return _checkSelect(this.querySelectorAll("[" + a + "]"))
  };
  HTMLElement.prototype.findName = function(a) {
    return _checkSelect(this.querySelectorAll("[name=" + a + "]"))
  };
  HTMLElement.prototype.select = function(a) {
    return _checkSelect(this.querySelectorAll(a))
  };
  HTMLElement.prototype.addClass = function(a) {
    var b = a.split(" ");
    if (b.length > 1) {
      var c = this;
      b.each(function(i) {
        if (!c.hasClass(i)) {
          c.className += " " + i
        }
      })
    } else {
      if (!this.hasClass(a)) {
        this.className += " " + a
      }
    }
    return this
  };
  HTMLCollection.prototype.addClass = NodeList.prototype.addClass = function(a) {
    this.each(function(b) {
      b.addClass(a)
    });
    return this
  };
  HTMLElement.prototype.replaceClass = function(a, b) {
    if (this.hasClass(a)) {
      this.addClass(b).removeClass(a)
    }
    return this
  };
  HTMLCollection.prototype.replaceClass = NodeList.prototype.replaceClass = function(a, b) {
    this.each(function(c) {
      c.replaceClass(a, b)
    });
    return this
  };
  HTMLElement.prototype.removeClass = function(a) {
    if (a == undefined) {
      this.className = ""
    } else {
      var c = a.split(" ");
      if (c.length > 1) {
        var d = this;
        c.each(function(i) {
          if (d.hasClass(i)) {
            var b = new RegExp("(\\s|^)" + i + "(\\s|$)");
            d.className = d.className.replace(b, " ")
          }
        })
      } else {
        if (this.hasClass(a)) {
          var b = new RegExp("(\\s|^)" + a + "(\\s|$)");
          this.className = this.className.replace(b, " ")
        }
      }
    }
    return this
  };
  HTMLCollection.prototype.removeClass = NodeList.prototype.removeClass = function(a) {
    this.each(function(b) {
      b.removeClass(a)
    });
    return this
  };
  HTMLElement.prototype.toggleClass = function(a) {
    var b = a.split(" ");
    var c = this;
    b.each(function(i) {
      if (c.hasClass(a)) {
        c.removeClass(a)
      } else {
        c.addClass(a)
      }
    });
    return this
  };
  HTMLCollection.prototype.toggleClass = NodeList.prototype.toggleClass = function(v) {
    this.each(function(b) {
      b.toggleClass(v)
    });
    return this
  };
  HTMLElement.prototype.val = function(a) {
    if (a == undefined && arguments.length == 0) {
      return this.value
    } else {
      if (this.tagName == "INPUT" || this.tagName == "TEXTAREA"||this.tagName == "SELECT") {
        this.value = _checkArg(a, "")
      }
      return this
    }
  };
  HTMLCollection.prototype.val = NodeList.prototype.val = function(v) {
    if (v == undefined) {
      var a = [];
      this.each(function(b) {
        a.append(b.val())
      });
      return a
    } else {
      this.each(function(b) {
        b.val(v)
      });
      return this
    }
  };
  HTMLElement.prototype.text = function(a) {
    if (a == undefined && arguments.length == 0) {
      return this.innerText
    } else {
      this.innerText = _checkArg(a, "");
      return this
    }
  };
  HTMLCollection.prototype.text = NodeList.prototype.text = function(v) {
    if (v == undefined && arguments.length == 0) {
      var a = [];
      this.each(function(b) {
        a.append(b.txt())
      });
      return a
    } else {
      this.each(function(b) {
        b.txt(v)
      });
      return this
    }
  };
  HTMLElement.prototype.content = function(a) {
    if (this.tagName == "INPUT" || this.tagName == "TEXTAREA"|| this.tagName == "SELECT") {
      if (a == undefined && arguments.length == 0) {
        return this.value
      } else {
        this.value = _checkArg(a, "")
      }
    } else {
      if (a == undefined && arguments.length == 0) {
        return this.innerText
      } else {
        this.innerText = _checkArg(a, "")
      }
    }
    return this
  };
  HTMLCollection.prototype.content = NodeList.prototype.content = function(v) {
    if (v == undefined) {
      var a = [];
      this.each(function(b) {
        a.append(b.content())
      });
      return a
    } else {
      this.each(function(b) {
        b.content(v)
      });
      return this
    }
  };
  HTMLElement.prototype.copy = function() {
    return _copy(this.content())
  };

  function _copy(b) {
    var a = J.id("jCopyInput");
    if (a == undefined) {
      a = J.new("input").attr({
        "type": "text",
        "id": "jCopyInput"
      }).css({
        "height": "0",
        "position": "fixed"
      });
      J.body().append(a)
    }
    a.val(b).select();
    if (document.execCommand("Copy")) {
      return true
    } else {
      alert("Copy is not supported in your browser");
      return false
    }
  };
  HTMLElement.prototype.copyHtml = function() {
    return _copy(this.html())
  };
  HTMLElement.prototype.html = function(a) {
    if (a == undefined) {
      return this.innerHTML
    } else {
      this.innerHTML = a;
      return this
    }
  };
  HTMLCollection.prototype.html = NodeList.prototype.html = function(v) {
    if (v == undefined) {
      var a = [];
      this.each(function(b) {
        a.append(b.html())
      });
      return a
    } else {
      this.each(function(b) {
        b.html(v)
      });
      return this
    }
  };
  HTMLElement.prototype.hasClass = function(a) {
    return new RegExp("(\\s|^)" + a + "(\\s|$)").test(this.className)
  };
  HTMLElement.prototype.next = function(i) {
    if (i != undefined) {
      return this.parent().child(this.index() + i)
    } else {
      return this.parent().child(this.index() + 1)
    }
  };
  HTMLElement.prototype.prev = function(i) {
    if (i != undefined) {
      return this.parent().child(this.index() - i)
    } else {
      return this.parent().child(this.index() - 1)
    }
  };
  HTMLElement.prototype.offset = function() {
    return {
      left: this.offsetLeft,
      top: this.offsetTop,
      height: this.offsetHeight,
      width: this.offsetWidth
    }
  };
  HTMLElement.prototype.left = function() {
    return this.offsetLeft
  };
  HTMLElement.prototype.top = function() {
    return this.offsetTop
  };
  HTMLElement.prototype.scrollTo = function(a, b, c) {
    var n = 0;
    var e = this;
    c = _checkArg(c, 400);
    var f = _checkAnimateSpeed(c) / 10;
    var g = (a - e.scrollTop) / f;
    var d = e.scrollTop;
    var h = setInterval(function() {
      d += g;
      e.scrollTop = Math.round(d);
      n++;
      if (n == f) {
        e.scrollTop = a;
        _checkCallBack(b, e);
        clearTimeout(h)
      }
    }, 10);
    return this
  };
  HTMLCollection.prototype.scrollTo = NodeList.prototype.scrollTo = function(i, b, c) {
    this.each(function(a) {
      a.scrollTo(i, b, c)
    });
    return this
  };
  HTMLElement.prototype.scroll = function(i, a, b) {
    if (arguments.length == 0) {
      return this.scrollTop
    } else {
      return this.scrollTo(this.scrollTop + i, a, b)
    }
  };
  HTMLCollection.prototype.scroll = NodeList.prototype.scroll = function(i, b, c) {
    this.each(function(a) {
      a.scroll(i, b, c)
    });
    return this
  };
  HTMLElement.prototype.animate = function(a, b, c, d) {
    var e = JSON.stringify(a);
    if (e.has("left") || e.has("top")) {
      if (this.css("position") == "static") {
        this.css({
          "position": "relative",
          "left": "0",
          "top": "0"
        })
      } else {
        if (this.style.top == "") {
          this.style.top = this.css("top")
        }
        if (this.style.left == "") {
          this.style.left = this.css("left")
        }
      }
    }
    if (e.has("height") && this.style.height == "") {
      this.style.height = this.css("height")
    }
    if (e.has("width") && this.style.width == "") {
      this.style.width = this.css("width")
    }
    this.addClass("j-animation");
    c = _checkAnimatePara(this, c, d);
    var f = this;
    setTimeout(function() {
      f.css(a);
      setTimeout(function() {
        _checkCallBack(b, f);
        f.removeClass("j-animation")
      }, c)
    }, 50);
    return this
  };
  HTMLCollection.prototype.animate = NodeList.prototype.animate = function(b, c, d, e) {
    this.each(function(a) {
      a.animate(b, c, d, e)
    });
    return this
  };
  HTMLElement.prototype.rotate = function(a, b, c, d, e) {
    var f = this;
    f.addClass("j-animation");
    setTimeout(function() {
      c = _checkAnimatePara(f, c, e);
      _checkOrigin(f, d);
      f.css({
        "transform": "rotate(" + a + "deg)",
        "-ms-transform": "rotate(" + a + "deg)",
        "-webkit-transform": "rotate(" + a + "deg)",
        "-o-transform": "rotate(" + a + "deg)",
        "-moz-transform": "rotate(" + a + "deg)"
      });
      setTimeout(function() {
        _checkCallBack(b, f);
        _removeAnimation(f)
      }, c)
    }, 50);
    return this
  };
  HTMLElement.prototype.scale = function(a, b, c, d) {
    return _scaleBase(this, a, a, b, c, d)
  };
  HTMLElement.prototype.scaleX = function(a, b, c, d) {
    return _scaleBase(this, a, 1, b, c, d)
  };
  HTMLElement.prototype.scaleY = function(a, b, c, d) {
    return _scaleBase(this, 1, a, b, c, d)
  };

  function _checkCallBack(a, b) {
    if (a != undefined) {
      if (a.constructor == Function) {
        if (b != undefined) {
          a(b)
        } else {
          a()
        }
      } else {
        eval(a)
      }
    }
  };
  HTMLCollection.prototype.scale = NodeList.prototype.scale = function(b, c, d, e) {
    this.each(function(a) {
      a.scale(b, c, d, e)
    });
    return this
  };
  HTMLCollection.prototype.scaleX = NodeList.prototype.scaleX = function(b, c, d, e) {
    this.each(function(a) {
      a.scaleX(b, c, d, e)
    });
    return this
  };
  HTMLCollection.prototype.scaleY = NodeList.prototype.scaleY = function(b, c, d, e) {
    this.each(function(a) {
      a.scaleY(b, c, d, e)
    });
    return this
  };

  function _scaleBase(a, x, y, b, c, d) {
    a.addClass("j-animation");
    setTimeout(function() {
      c = _checkAnimatePara(a, c, d);
      a.css({
        "transform": "scale(" + x + "," + y + ")",
        "-ms-transform": "scale(" + x + "," + y + ")",
        "-webkit-transform": "scale(" + x + "," + y + ")",
        "-o-transform": "scale(" + x + "," + y + ")",
        "-moz-transform": "scale(" + x + "," + y + ")"
      });
      setTimeout(function() {
        _checkCallBack(b, a);
        _removeAnimation(a)
      }, c)
    }, 50);
    return a
  };

  function _checkOrigin(a, o) {
    if (o == undefined) {
      o = "center"
    }
    a.css({
      "transform-origin": o,
      "-ms-transform-origin": o,
      "webkit-transform-origin": o,
      "-o-transform-origin": o,
      "-moz-transform-origin": o
    })
  };
  HTMLCollection.prototype.rotate = NodeList.prototype.rotate = function(b, c, d, e, f) {
    this.each(function(a) {
      a.rotate(b, c, d, e, f)
    });
    return this
  };
  HTMLElement.prototype.spin = function(a, b, c, d, e) {
    e = _checkArg(e, "linear");
    b = _checkArg(b, "infinite");
    if (a != undefined) {
      a = _checkSpinSpeed(a)
    } else {
      a = 2
    }
    _checkOrigin(this, c);
    if (b.constructor == Number) {
      this.stopSpin();
      var f = this;
      setTimeout(function() {
        _helpSpin(a, b, c, d, e, f)
      }, 20)
    } else {
      _helpSpin(a, b, c, d, e, this)
    }
    return this
  };

  function _helpSpin(a, b, c, d, e, f) {
    f.css({
      "animation": "j-spin " + a + "s " + e + " 0s " + b,
      "-moz-animation": "j-spin " + a + "s " + e + " 0s " + b,
      "-webkit-animation": "j-spin " + a + "s " + e + " 0s " + b,
      "-o-animation": "j-spin " + a + "s " + e + " 0s " + b
    });
    if (b.constructor == Number) {
      if (d != undefined) {
        setTimeout(function() {
          _checkCallBack(d, f)
        }, a * b * 1000)
      }
    }
  };
  HTMLCollection.prototype.spin = NodeList.prototype.spin = function(b, c, d, e, f) {
    this.each(function(a) {
      a.spin(b, c, d, e, f)
    });
    return this
  };

  function _checkSpinSpeed(a) {
    if (a.constructor == String) {
      switch (a) {
      case "slower":
        a = 3;
        break;
      case "slow":
        a = 2.5;
        break;
      case "normal":
        a = 2;
        break;
      case "fast":
        a = 1.5;
        break;
      case "faster":
        a = 1;
        break;
      default:
        a = 2
      }
      return a
    } else {
      return a / 1000
    }
  };
  HTMLElement.prototype.stopSpin = function() {
    var a = this.css("transform");
    this.css({
      "animation": "none",
      "-moz-animation": "none",
      "-webkit-animation": "none",
      "-o-animation": "none",
      "transform": a
    });
    return this
  };
  HTMLCollection.prototype.stopSpin = NodeList.prototype.stopSpin = function() {
    this.each(function(a) {
      a.stopSpin()
    });
    return this
  };

  function _removeAnimation(a) {
    a.removeClass("j-animation").css({
      "transition-duration": "0s!important",
      "-ms-transition-duration": "0s!important",
      "-webkit-transition-duration": "0s!important",
      "-o-transition-duration": "0s!important",
      "-moz-transition-duration": "0s!important"
    })
  };
  HTMLElement.prototype.slideUp = function(a, b, c) {
    return _checkSlideHeight(this, a, b, c,false)
  };
  HTMLElement.prototype.slideDown = function(a, b, c) {
    if (this.hasClass("j-fade")) {
      this.removeClass("j-fade").addClass("j-slide")
    };
    return _checkSlideHeight(this, a, b, c,true)
  };
  HTMLElement.prototype.slideToggle = function(a, b, c) {
    if (this.hasClass("j-fade")) {
      this.removeClass("j-fade").addClass("j-slide")
    }
    return _checkSlideHeight(this, a, b, c)
  };
  function _checkSlideHeight(obj,a, b, c,d){
    if(obj.style.height==""||obj.style.height=="auto"){
      if(d&&obj.css("display")=="none"){
        obj.addClass("j-none");
      }
      obj.css("height",obj.css("height"));
      obj.removeClass("j-none");
      obj.attr("j-h-auto","true");
      setTimeout(function(){
        _animateBase(obj, "j-slide", a, b, c,d)
      },50);
    }else{
      _animateBase(obj, "j-slide", a, b, c,d)
    }
    return obj;
  }
  HTMLElement.prototype.fadeOut = function(a, b, c) {
    return _animateBase(this, "j-fade", a, b, c, false)
  };
  HTMLElement.prototype.fadeIn = function(a, b, c) {
    if (this.hasClass("j-slide")) {
      this.removeClass("j-slide").addClass("j-fade")
    }
    return _animateBase(this, "j-fade", a, b, c, true)
  };
  HTMLElement.prototype.fadeToggle = function(a, b, c) {
    if (this.hasClass("j-slide")) {
      this.removeClass("j-slide").addClass("j-fade")
    }
    return _animateBase(this, "j-fade", a, b, c)
  };
  HTMLElement.prototype.hide = function() {
    if (!this.hasAttr("j-display")) {
      this.attr("j-display", this.css("display"));
      return this.css("display", "none!important")
    };
    return this
  };
  HTMLElement.prototype.show = function(a) {
    if (this.css("display") == "none") {
      this.css("display", "block!important");/*for initial is not supported*/
      //this.css("display", "initial!important");
    }
    if (this.hasAttr("j-display")) {
      if (a == undefined) {
        this.removeClass("j-fade j-slide")
      }
      return this.css("display", this.attr("j-display") + "!important").removeAttr("j-display")
    };
    return this
  };
  HTMLElement.prototype.showToggle = function() {
    if (this.hasAttr("j-display")) {
      this.show()
    } else {
      this.hide()
    }
  };

  function _animateBase(a, b, c, d, e, f) {
    if (f == undefined) {
      if (a.hasAttr("j-display")) {
        f = true
      } else {
        f = false
      }
    }
    a.addClass("j-animation");
    if (f) {
      if (a.css("display") == "none") {
        a.addClass(b)
      }
      a.show(false)
    }
    if (f != false) {
      setTimeout(function() {
        _animateBasePart(a, b, c, d, e, f)
      }, 50)
    } else {
      _animateBasePart(a, b, c, d, e, f)
    }
    return a
  };

  function _animateBasePart(a, b, c, d, e, f) {
    d = _checkAnimatePara(a, d, e);
    if (f) {
      if (b == "j-slide") {
        a.addClass("j-over-hidden")
      }
      a.removeClass(b)
    } else {
      a.addClass(b)
    }
    setTimeout(function() {
      _checkCallBack(c, a);
      _removeAnimation(a);
      if (!f) {
        a.hide()
      } else {
        if (b == "j-slide") {
          a.removeClass("j-over-hidden");
          if(a.attr("j-h-auto")=="true"){
            a.css("height","auto");
          }
        }
      }
    }, d)
  };

  function _checkAnimatePara(a, b, c) {
    if (b != undefined) {
      b = _checkAnimateSpeed(b) / 1000
    } else {
      b = 0.5
    }
    a.css({
      "transition-duration": b + "s!important",
      "-ms-transition-duration": b + "s!important",
      "-webkit-transition-duration": b + "s!important",
      "-o-transition-duration": b + "s!important",
      "-moz-transition-duration": b + "s!important"
    });
    c = _checkArg(c, "linear");
    a.css({
      "transition-timing-function": c + "!important",
      "-ms-transition-timing-function": c + "!important",
      "-webkit-transition-timing-function": c + "!important",
      "-o-transition-timing-function": c + "!important",
      "-moz-transition-timing-function": c + "!important"
    });
    return b * 1000
  };
  HTMLCollection.prototype.slideUp = NodeList.prototype.slideUp = function(b, c, d) {
    this.each(function(a) {
      a.slideUp(b, c, d)
    });
    return this
  };
  HTMLCollection.prototype.slideDown = NodeList.prototype.slideDown = function(b, c, d) {
    this.each(function(a) {
      a.slideDown(b, c, d)
    });
    return this
  };
  HTMLCollection.prototype.slideToggle = NodeList.prototype.slideToggle = function(b, c, d) {
    this.each(function(a) {
      a.slideToggle(b, c, d)
    });
    return this
  };
  HTMLCollection.prototype.fadeIn = NodeList.prototype.fadeIn = function(b, c, d) {
    this.each(function(a) {
      a.fadeIn(b, c, d)
    });
    return this
  };
  HTMLCollection.prototype.fadeOut = NodeList.prototype.fadeOut = function(b, c, d) {
    this.each(function(a) {
      a.fadeOut(b, c, d)
    });
    return this
  };
  HTMLCollection.prototype.fadeToggle = NodeList.prototype.fadeToggle = function(b, c, d) {
    this.each(function(a) {
      a.fadeToggle(b, c, d)
    });
    return this
  };
  HTMLCollection.prototype.hide = NodeList.prototype.hide = function() {
    this.each(function(a) {
      a.hide()
    });
    return this
  };
  HTMLCollection.prototype.show = NodeList.prototype.show = function() {
    this.each(function(a) {
      a.show()
    });
    return this
  };
  HTMLCollection.prototype.showToggle = NodeList.prototype.showToggle = function() {
    this.each(function(a) {
      a.showToggle()
    });
    return this
  };

  function _checkAnimateSpeed(a) {
    if (a.constructor == String) {
      switch (a) {
      case "slower":
        a = 1500;
        break;
      case "slow":
        a = 1000;
        break;
      case "normal":
        a = 400;
        break;
      case "fast":
        a = 250;
        break;
      case "faster":
        a = 100;
        break;
      default:
        a = 400
      }
    }
    return a
  };

  function _checkArg(a, b) {
    return (a == undefined) ? b : a
  };
  HTMLElement.prototype.scrollXTo = function(a, b, c) {
    var n = 0;
    var e = this;
    c = _checkArg(c, 400);
    var f = _checkAnimateSpeed(c) / 10;
    var g = (a - e.scrollLeft) / f;
    var d = e.scrollLeft;
    var h = setInterval(function() {
      d += g;
      e.scrollLeft = Math.round(d);
      n++;
      if (n == f) {
        e.scrollLeft = a;
        _checkCallBack(b, e);
        clearTimeout(h)
      }
    }, 10);
    return this
  };
  HTMLCollection.prototype.scrollXTo = NodeList.prototype.scrollXTo = function(i, b, c) {
    this.each(function(a) {
      a.scrollXTo(i, b, c)
    });
    return this
  };
  HTMLElement.prototype.scrollX = function(i, a, b) {
    if (arguments.length == 0) {
      return this.scrollLeft
    } else {
      return this.scrollXTo(this.scrollLeft + i, a, b)
    }
  };
  HTMLCollection.prototype.scrollX = NodeList.prototype.scrollX = function(i, b, c) {
    this.each(function(a) {
      a.scrollX(i, b, c)
    });
    return this
  };
  HTMLElement.prototype.hei = function() {
    return this.offsetHeight
  };
  HTMLElement.prototype.wid = function() {
    return this.offsetWidth
  };
  HTMLElement.prototype.child = function(i) {
    if (i == undefined) {
      return this.children
    } else {
      return this.children[i]
    }
  };
  HTMLElement.prototype.hasChild = function(a) {
    if(a==undefined){
      return (this.children.length>0)?true:false; 
    }else{
      return (this.select(a).length==0)?false:true; 
    }
  };
  HTMLElement.prototype.clone = function() {
    return this.cloneNode().html(this.html());
  };
  HTMLElement.prototype.parent = function(i) {
    if (i == undefined) {
      return this.parentElement
    } else {
      var p = this;
      for (var j = 0; j < i; j++) {
        p = p.parentElement
      }
      return p
    }
  };
  HTMLElement.prototype.brother = function(i) {
    if (i == undefined) {
      return this.parent().child()
    } else {
      return this.parent().child(i)
    }
  };
  HTMLElement.prototype.prepend = function(a) {
    if (a.constructor == Array) {
      var b = this;
      a.each(function(a) {
        b.insertBefore(a, this.children[0])
      })
    } else {
      this.insertBefore(a, this.children[0])
    }
    return this
  };
  HTMLCollection.prototype.prepend = NodeList.prototype.prepend = function(a) {
    this.each(function(c) {
      c.prepend(a)
    });
    return this
  };
  HTMLElement.prototype.append = function(b, a) {
    if (a == undefined) {
      if (b.constructor == Array) {
        var c = this;
        b.each(function(a) {
          c.appendChild(a)
        })
      } else {
        this.appendChild(b)
      }
    } else {
      this.insertBefore(b, this.children[a])
    }
    return this
  };
  HTMLElement.prototype.after = function(b) {
    if (b.constructor == Array) {
      var c = this;
      var d = c.next();
      b.each(function(a) {
        c.parent().insertBefore(a, d)
      })
    } else {
      this.parent().insertBefore(b, this.next())
    }
    return this
  };
  HTMLCollection.prototype.after = NodeList.prototype.after = function(b) {
    this.each(function(c) {
      c.after(b)
    });
    return this
  };
  HTMLElement.prototype.before = function(b) {
    if (b.constructor == Array) {
      var c = this;
      b.each(function(a) {
        c.parent().insertBefore(a, c)
      })
    } else {
      this.parent().insertBefore(b, this)
    }
    return this
  };
  HTMLCollection.prototype.before = NodeList.prototype.before = function(b) {
    this.each(function(c) {
      c.before(b)
    });
    return this
  };
  HTMLCollection.prototype.append = NodeList.prototype.append = function(b, a) {
    this.each(function(c) {
      c.append(b, a)
    });
    return this
  };
  HTMLElement.prototype.index = function() {
    var a = this.parent().child();
    for (var i = 0; i < a.length; i++) {
      if (a[i] == this) {
        return i
      }
    }
    return -1
  };
  HTMLElement.prototype.event = function(a, b) {
    if (b == undefined) {
      for (var c in a) {
        if (a[c] != undefined) {
          if (a[c].constructor == Function) {
            eval('this.' + c + '=' + a[c])
          } else {
            this.attr(c, a[c])
          }
        }
      }
    } else {
      if (b.constructor == Function) {
        eval('this.' + a + '=' + b)
      } else {
        this.attr(a, b)
      }
    }
    return this
  };
  HTMLCollection.prototype.event = NodeList.prototype.event = function(a, c) {
    this.each(function(b) {
      b.event(a, c)
    });
    return this
  };
  HTMLElement.prototype.empty = function() {
    return this.html("")
  };
  HTMLCollection.prototype.empty = NodeList.prototype.empty = function() {
    this.each(function(a) {
      a.empty()
    });
    return this
  };
  HTMLElement.prototype.remove = function() {
    this.parentNode.removeChild(this)
  };
  HTMLCollection.prototype.remove = NodeList.prototype.remove = function(a) {
    if (a == undefined) {
      for (var i = 0; i < this.length;) {
        this[i].remove()
      }
    } else {
      if (a.constructor == Number) {
        for (var i = 0; i < this.length; i++) {
          if (i == a) {
            this[i].remove();
            return this
          }
        }
      } else {
        for (var i = 0; i < this.length; i++) {
          if (this[i] == a) {
            this[i].remove();
            return this
          }
        }
      }
    }
  };
  HTMLElement.prototype.each = function(b) {
    b(this, 0);
    return this
  };
  HTMLCollection.prototype.each = NodeList.prototype.each = Array.prototype.each = function(b) {
    for (var a = 0; a < this.length; a++) {
      b(this[a], a)
    }
    return this
  };
  Array.prototype.removeByIndex = function(b) {
    for (var a = 0; a < this.length; a++) {
      if (a == b) {
        if (a < this.length - 1) {
          for (var i = a + 1; i < this.length; i++) {
            this[i - 1] = this[i]
          }
        }
        this.length--;
        return this
      }
    }
    return this
  };
  Array.prototype.empty = function(b) {
    this.length = 0
  };
  Array.prototype.remove = function(b) {
    for (var a = 0; a < this.length; a++) {
      if (this[a] == b) {
        if (a < this.length - 1) {
          for (var i = a + 1; i < this.length; i++) {
            this[i - 1] = this[i]
          }
        }
        this.length--;
        return this
      }
    }
    return this
  };
  Array.prototype.insert = function(b, i) {
    for (var a = this.length - 1; a >= i; a--) {
      this[a + 1] = this[a]
    }
    this[i] = b;
    return this
  };
  Array.prototype.append = function(b) {
    if(arguments.length==1){
      this[this.length] = b;
    }else if(arguments.length>1){
      for(var i=0;i<arguments.length;i++){
        this[this.length] = arguments[i];
      }
    }
    return this
  };
  Array.prototype.prepend = function(b) {
    return this.insert(b, 0)
  };
  Array.prototype.sort = function(a) {
    var b = this.length;
    var c, current;
    for (var i = 1; i < b; i++) {
      c = i - 1;
      current = this[i];
      while (c >= 0 && this[c] > current) {
        this[c + 1] = this[c];
        c--
      }
      this[c + 1] = current
    }
    if (a == false) {
      this.reverse()
    }
    return this
  };
  Array.prototype.sortByAttr = function(a, b) {
    if (!(!parseFloat(this[0][a]))) {
      var c = this.length;
      var d, current;
      for (var i = 1; i < c; i++) {
        d = i - 1;
        current = this[i];
        while (d >= 0 && this[d][a] > current[a]) {
          this[d + 1] = this[d];
          d--
        }
        this[d + 1] = current
      }
      if (b == false) {
        this.reverse()
      }
    }
    return this
  };
  Array.prototype.reverse = function() {
    var t;
    var n = Math.floor(this.length / 2);
    for (var i = 0; i < n; i++) {
      t = this[i];
      this[i] = this[this.length - 1 - i];
      this[this.length - 1 - i] = t
    };
    return this
  };
  String.prototype.has = function(s) {
    if (s.constructor == String) {
      if (this.includes == undefined) {
        return (this.indexOf(s) != -1)
      } else {
        return this.includes(s)
      }
    } else {
      if (this.match(s) == null) {
        return false
      } else {
        return true
      }
    }
  };
  String.prototype.timesOf = function(s) {
    if (s.constructor == String) {
      return this.split(s).length - 1
    } else {
      var a = this.match(s);
      if (a == null) {
        return 0
      } else {
        return a.length
      }
    }
  };
  String.prototype.replaceAll = function(a, b) {
    if (b.constructor == Array) {
      if (a.constructor == String) {
        var s = this.split(a);
        var d = s[0];
        s.each(function(a, i) {
          if (i > 0) {
            d += (b[i - 1] + a)
          }
        });
        return d
      } else {
        var e = "";
        var f = this;
        var g = this.match(a);
        if (g != null) {
          g.each(function(a, i) {
            var c = f.split(a);
            e += (f.substring(0, f.indexOf(a)) + b[i]);
            f = f.substring(f.indexOf(a) + a.length)
          });
          e += f;
          return e
        }
        return this
      }
    } else {
      if (a.constructor == String) {
        return this.replace(new RegExp(a, "g"), b)
      } else {
        return this.replace(a, b)
      }
    }
  };
  String.prototype.indexsOf = function(a, i) {
    var b = this.split(a);
    var c = null;
    if (a.constructor != String) {
      c = this.match(a)
    }
    if (b.length <= 2) {
      if (this.indexOf(a) == -1) {
        return []
      } else {
        return [this.indexOf(a)]
      }
    } else {
      var d = [];
      var e = a.length;
      var f = 0;
      b.each(function(s, n) {
        if (n > 0) {
          d[d.length] = f;
          if (c != null) {
            f += c[n - 1].length
          } else {
            f += a.length
          }
        }
        f += s.length
      });
      if (i == undefined) {
        return d
      } else {
        if (i > d.length - 1) return d[d.length - 1];
        return d[i]
      }
    }
  };
  String.prototype.insert = function(a, i) {
    return this.substring(0, i) + a + this.substring(i)
  };
})();

/*jetter*/
(function(){
  J.ready(function() {
    Jet.initValid();
    J.jetForm = function(a) {
      return J.attr("jet-form=" + a)
    };
    J.jetName = function(a, b) {
      if (arguments.length == 2) {
        return J.attr("jet-form=" + a).findAttr("jet-name=" + b)
      } else {
        return J.attr("jet-name=" + a)
      }
    };
    J.tag("head").append(J.new("style").txt(".jet-unpass{border-color:#f20!important;border-style:solid!important;background-color:rgba(255,0,0,.1)!important;color:red!important}.jet-icon-wrapper{width:100%;height:40px}.jet-icon-circle{display:block;width:40px;height:40px;margin:0 auto;border-radius:20px;border:5px solid #fff;position:relative}.jet-icon-circle span{background-color:#fff;display:block;position:absolute;border-radius:3px}.jet-icon-circle.jet-no-border{border-color:transparent;position:relative;top:3px;left:5px}.jet-icon-part-ok1{width:11px;height:7px;top:14px;left:5px}.jet-icon-part-ok2{width:7px;height:18px;top:7px;left:14px}.jet-icon-part-x{width:7px;height:20px;top:5px;left:11px}.jet-rotate-45{transform:rotate(45deg);-ms-transform:rotate(45deg);-webkit-transform:rotate(45deg);-o-transform:rotate(45deg);-moz-transform:rotate(45deg)}.jet-rotate-045{transform:rotate(-45deg);-ms-transform:rotate(-45deg);-webkit-transform:rotate(-45deg);-o-transform:rotate(-45deg);-moz-transform:rotate(-45deg)}.jet-icon-part-bar,.jet-icon-part-block{width:7px;left:11px}.jet-icon-part-block{height:7px}.jet-icon-part-bar{height:13px}.jet-icon-part-info1,.jet-icon-part-warn1{top:4px}.jet-icon-part-info2{top:13px}.jet-icon-part-warn2{top:19px}#jetConfirmWrapper,#jetConfirmWrapper *,#jetInputWrapper,#jetInputWrapper *,#jetNoteWrapper,#jetNoteWrapper *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}#jetConfirmWrapper,#jetInputWrapper,#jetNoteWrapper{width:100%;position:fixed;z-index:10000;transition:top .3s ease;top:-100%}#jetConfirmWrapper{z-index:10001}#jetNoteWrapper{z-index:10002;cursor:pointer;}#jetConfirmContent,#jetInputContent{font-size:22px;padding:3% 10px 10px 10px;color:#fff;height:50%;white-space:normal;word-break:break-all}#jetConfirmBtnWrapper,#jetInputBtnWrapper{height:50px}#jetInputContent{padding:3% 10% 10px 10%}.jet-input{width:100%;color:#888;padding-left:5px;font-size:18px}.jet-input-text{text-align:left}#jetConfirmCancel,#jetConfirmOk,#jetInputCancel,#jetInputOk{width:50%;float:left;height:100%;border-top:4px solid rgba(255,255,255,.9);cursor:pointer}#jetConfirmOk{border-right:2px solid rgba(255,255,255,.9)}#jetConfirmCancel,#jetInputCancel{border-left:2px solid rgba(255,255,255,.9)}#jetConfirmLittleWrapper,#jetInputLittleWrapper,#jetNoteLittleWrapper{width:30%;min-height:65px;text-align:center;margin:0 auto;border:1px solid #666;border-radius:0 0 10px 10px;border-top:0;padding-top:10px;background-color:rgba(51,134,51,.9)}#jetConfirmLittleWrapper,#jetInputLittleWrapper{width:30%;background-color:rgba(136,136,136,.9);border-color:#bbb;padding-top:0}#jetInputLittleWrapper{background-color:rgba(100,100,100,.9)}#jetConfirmLittleWrapper.jet-large,#jetInputLittleWrapper.jet-large,#jetNoteLittleWrapper[jet-size=large]{width:70%}#jetConfirmLittleWrapper.jet-middle,#jetInputLittleWrapper.jet-middle,#jetNoteLittleWrapper[jet-size=middle]{width:50%}#jetNoteLittleWrapper[jet-style=gray].jet-success{background-color:rgba(210,210,210,.9);color:#444}#jetNoteLittleWrapper[jet-style=gray].jet-info .jet-icon-circle,#jetNoteLittleWrapper[jet-style=gray].jet-success .jet-icon-circle{border-color:#444}#jetNoteLittleWrapper[jet-style=gray].jet-info .jet-icon-circle span,#jetNoteLittleWrapper[jet-style=gray].jet-success .jet-icon-circle span{background-color:#444}#jetNoteLittleWrapper[jet-style=gray].jet-info{background-color:rgba(170,170,170,.9);color:#444}#jetNoteLittleWrapper[jet-style=gray].jet-warn{background-color:rgba(80,80,80,.9);color:#ccc}#jetNoteLittleWrapper[jet-style=gray].jet-error .jet-icon-circle,#jetNoteLittleWrapper[jet-style=gray].jet-warn .jet-icon-circle{border-color:#ccc}#jetNoteLittleWrapper[jet-style=gray].jet-error .jet-icon-circle span,#jetNoteLittleWrapper[jet-style=gray].jet-warn .jet-icon-circle span{background-color:#ccc}#jetNoteLittleWrapper[jet-style=gray].jet-error{background-color:rgba(40,40,40,.9);color:#ccc}#jetNoteLittleWrapper[jet-style=color]{border-color:#ddd;color:#fff}#jetNoteLittleWrapper[jet-style=color].jet-success{background-color:rgba(51,134,51,.9)}#jetNoteLittleWrapper[jet-style=color].jet-info{background-color:rgba(55,78,237,.9)}#jetNoteLittleWrapper[jet-style=color].jet-warn{background-color:rgba(237,149,58,.9)}#jetNoteLittleWrapper[jet-style=color].jet-error{background-color:rgba(212,73,73,.9)}#jetNoteLittleWrapper[jet-style=color] .jet-icon-circle,#jetNoteLittleWrapper[jet-style=gray] .jet-icon-circle{border-color:#fff}#jetNoteLittleWrapper[jet-style=color] .jet-icon-circle span,#jetNoteLittleWrapper[jet-style=gray] .jet-icon-circle span{background-color:#fff}#jetNoteContent{font-size:20px;margin-bottom:5px;padding-top:5px;white-space:normal;word-break:break-all}"));
    for(item in Jet){
      J[item]=Jet[item];
    }
  });
  var _t, _ct;
  window.Jet = {
    useDefaultStyle: true,
    useShowForValid: true,
    showInPlaceHolder: false,
    noteStyle: "color",
    language: "ENGLISH",
    lang: function(l) {
      this.language = l.toUpperCase()
    },
    get: function(a, b, c) {
      c = this.checkArg(c, "jet-name");
      if (b != undefined && b != "json") {
        return _getElemsFormData(_checkJetForm(a), c)
      } else {
        return _getElemsObj(_checkJetForm(a), c)
      }
    },
    set: function(a, b, c, d) {
      d = this.checkArg(d, "jet-name");
      _setObjVal(_checkJetForm(a), d, b, c)
    },
    clear: function(a, b) {
      this.set(a, {}, null, b)
    },
    addValid: function(a, b) {
      b = this.checkArg(b, "notnull");
      _checkJetForm(a).addValid(b)
    },
    initValid: function(b) {
      var c;
      if (b == undefined) {
        c = J.attr("jet-valid")
      } else {
        c = _checkJetForm(b).select("[jet-valid]")
      }
      c.each(function(a) {
        a.attr({
          "onBlur": "Jet.validInput(this)",
          "onfocus": "Jet.addValidValue(this)"
        });
        if (this.showInPlaceHolder) {
          a.attr("placeholder", _getValueText(a.attr("jet-valid")))
        }
      })
    },
    clearValid: function(a) {
      _checkJetForm(a).clearValid()
    },
    validate: function(a, b, c) {
      if (c != undefined) {
        _validateForm(_checkJetForm(a), b, c)
      } else {
        _validateForm(_checkJetForm(a), b)
      }
    },
    validText: function(a, b) {
      if(a.constructor==Object&&b==undefined){
        for (var c in a) {
          this.validText(c,a[c]);
        }
      }else{
        if(this.language=="CHINESE"){
          validTextCn[a]=b;
        }else{
          validTextEn[a]=b;
        }
      }
    },
    banDefault: function() {
      this.useDefaultStyle = false;
      var b = J.class("jet-unpass");
      b.each(function(a) {
        _checkIsPw(a);
        a.removeClass("jet-unpass").val(a.attr("jet-value")).removeAttr("jet-value")
      })
    },
    useDefault: function() {
      this.useDefaultStyle = true
    },
    banValidShow: function() {
      this.useShowForValid = false
    },
    useValidShow: function() {
      this.useShowForValid = true
    },
    banPlaceHolder: function() {
      this.showInPlaceHolder = false;
      J.attr("jet-valid").each(function(a) {
        a.attr("placeholder", "")
      })
    },
    usePlaceHolder: function() {
      this.showInPlaceHolder = true;
      J.attr("jet-valid").each(function(a) {
        a.attr("placeholder", _getValueText(a.attr("jet-valid")))
      })
    },
    show: _mesShow,
    confirm: _confirmShow,
    showWait: _mesShowWait,
    close: _mesClose,
    confirmClose: _confirmClose,
    inputClose: _inputClose,
    checkArg: _checkArg,
    setNoteStyle: _setNoteStyle,
    validInput:_validInput,
    addValidValue:_addValidValue,
    onOnePass: function(c) {
      if (c == undefined) {
        _onOnePass = null
      } else {
        if (c.constructor == String) {
          _onOnePass = function(a, b) {
            eval(c)
          }
        } else {
          _onOnePass = c
        }
      }
    },
    onOneFail: function(c) {
      if (c == undefined) {
        _onOneFail = null
      } else {
        if (c.constructor == String) {
          _onOneFail = function(a, b) {
            eval(c)
          }
        } else {
          _onOneFail = c
        }
      }
    },
    jump: _turnPage,
    open: function(a) {
      window.open(a)
    },
    back: function() {
      window.history.back()
    },
    forward: function() {
      window.history.forward()
    },
    getUrlPara: _getUrlPara,
    sign: _sign,
    getRandom: _getRandomNum,
    isMobile: _isMobile,
    copy: J.copy,
    confirmOk:_confirmOk,
    confirmCancel:_confirmCancel,
    inputOk:_inputOk,
    inputCancel:_inputCancel,
    input: function(c, d, e) {
      var f = J.id("jetInputContent");
      if (f == undefined) {
        _addInputWrapper();
        f = J.id("jetInputContent")
      }
      f.empty();
      if (c.constructor == String) {
        f.append(J.new("div").txt(_checkArg(c, (this.language == "CHINESE") ? "信息输入" : "Input Information")));
        _appendOneInput((this.language == "CHINESE") ? "请输入：" : "Please input:", null, null,null)
      } else if (c.constructor == Array) {
        f.append(J.new("div").txt(_checkArg(c[0], (this.language == "CHINESE") ? "信息输入" : "Input Information")));
        _appendOneInput(c[1], c[2], c[3],c[4]);
        if (c[3] != undefined) {
          this.initValid(f)
        }
      } else {
        f.append(J.new("div").txt(_checkArg(c.title, (this.language == "CHINESE") ? "信息输入" : "Input Information")));
        var a = _checkArg(c.default, []);
        var b = _checkArg(c.valid, []);
        var p = _checkArg(c.placeholder, []);
        if (c.text == undefined || c.text.constructor == String) {
          _appendOneInput(c.text, a, b,p)
        } else {
          for (var i = 0; i < c.text.length; i++) {
            _appendOneInput(_checkArg(c.text[i], (this.language == "CHINESE") ? "请输入：" : "Please input:"), a[i], b[i],p[i])
          }
        }
        if (b.length > 0 || b.constructor == String) {
          this.initValid(f)
        }
      }
      if (d != undefined) {
        if (d.constructor == Function) {
          _submitCall = d
        } else {
          _submitCall = function() {
            eval(d)
          }
        }
      }
      if (e != undefined) {
        if (e.constructor == Function) {
          _submitCancelCall = e
        } else {
          _submitCancelCall = function() {
            eval(e)
          }
        }
      }
      J.id("jetInputWrapper").css("top", "0")
    }
  };
  var _submitCall = null,
    _submitCancelCall = null,
    _onOnePass = null,
    _onOneFail = null;

  function _checkIsPw(a) {
    if (a.attr("jet-ispw") == "true") {
      a.attr("type", "password")
    }
  };

  function _inputOk() {
    if (_submitCall != undefined) {
      J.id("jetInputContent").validate(function() {
        _submitCall(J.id("jetInputContent").findClass("jet-input").val());
        _submitCall = null;
        _inputClose()
      })
    } else {
      _inputClose()
    }
  };

  function _inputCancel() {
    if (_submitCancelCall != undefined) {
      _submitCancelCall();
      _submitCancelCall = null
    }
    _inputClose()
  };

  function _inputClose() {
    J.id("jetInputWrapper").css("top", "-100%");
    setTimeout(function() {
      J.id("jetInputContent").empty()
    }, 300)
  };

  function _appendOneInput(a, b, c,p) {
    if (arguments.length == 1) {
      b = a.default;
      c = a.valid;
      p=a.placeholder;
      a = Jet.checkArg(a.text, (Jet.language == "CHINESE") ? "请输入：" : "Please input:")
    } else {
      a = Jet.checkArg(a, (Jet.language == "CHINESE") ? "请输入：" : "Please input:")
    }
    J.id("jetInputContent").append(J.new("div").addClass("jet-input-text").txt(a));
    var d = J.new("input.jet-input[type=text]");
    if (b != undefined) {
      d.val(b)
    }
    if (c != undefined) {
      d.attr("jet-valid", c)
    }
    if (p != undefined) {
      d.attr("placeholder", p)
    }
    J.id("jetInputContent").append(d)
  };
  HTMLElement.prototype.addValid = function(a) {
    if (this.hasAttr("jet-form")) {
      if (a.constructor == Object) {
        for (var b in a) {
          this.findAttr("jet-name=" + b).addValid(a[b])
        }
      } else {
        this.findAttr("jet-name").addValid(a)
      }
    } else {
      this.attr({
        "jet-valid": a,
        "onBlur": "Jet.validInput(this)",
        "onfocus": "Jet.addValidValue(this)"
      })
    }
    return this
  };
  HTMLCollection.prototype.addValid = NodeList.prototype.addValid = function(b) {
    if (b.constructor == Array) {
      this.each(function(a, i) {
        a.addValid(b[i])
      })
    } else {
      this.each(function(a) {
        a.addValid(b)
      })
    }
    return this
  };
  HTMLElement.prototype.clearValid = function() {
    if (this.hasAttr("jet-form")) {
      this.findAttr("jet-name").clearValid()
    } else {
      if (this.hasClass("jet-unpass")) {
        this.removeClass("jet-unpass").val(this.attr("jet-value"))
      }
      this.removeAttr("jet-valid onBlur onfocus jet-value")
    }
    return this
  };
  HTMLCollection.prototype.clearValid = NodeList.prototype.clearValid = function() {
    this.each(function(a) {
      a.clearValid()
    });
    return this
  };
  HTMLElement.prototype.getContent = function() {
    return _getContentForGet(this)
  };
  HTMLElement.prototype.get = function(a, b) {
    return Jet.get(this, a, b)
  };
  HTMLElement.prototype.initValid = function() {
    Jet.initValid(this);
    return this
  };
  HTMLCollection.prototype.initValid = NodeList.prototype.initValid = function() {
    this.each(function(a) {
      a.initValid()
    });
    return this
  };
  HTMLElement.prototype.set = function(a, b, c) {
    Jet.set(this, a, b, c);
    return this
  };
  HTMLElement.prototype.clear = function(a) {
    Jet.clear(this, a);
    return this
  };
  HTMLElement.prototype.validate = function(s, f) {
    _validateForm(this, s, f)
  };

  function _checkJetForm(a) {
    if (a.constructor == String) {
      return J.select("[jet-form=" + a + "]")
    }
    return a
  };


  function _getElemsObj(d, b) {
    var a = d.select("[" + b + "]");
    var c = {};
    a.each(function(e) {
      var value="";
      if(e.attr("jet-get")==undefined){
        value = _getContentForGet(e)
      }else{
        switch(e.attr("jet-get")){
          case "html":value = e.html();break;
          case "class":value = e.attr("class");break;
          case "value":value = e.val();break;
          case "text":value = e.txt();break;
          default:value=e.attr(e.attr("jet-get"));break;
        }
      }
      c[e.attr(b)] = value;
    });
    return c
  };
  function _getElemsFormData(d, b) {
    var a = d.select("[" + b + "]");
    var c = new FormData();
    a.each(function(e) {
      c.append(e.attr(b), _getContentForGet(e))
    });
    return c
  };

  function _getContentForGet(b) {
    if (b.hasClass("jet-unpass")) {
      return b.attr("jet-value")
    } else {
      var a = b.content();
      return a
    }
  };

  function _setObjVal(c, a, b, f) {
    inputs = c.select("[" + a + "]");
    if (b.constructor == Object) {
      inputs.each(function(d) {
        var e = d.attr(a);
        d.content(b[e]);
        if (f != undefined) {
          f(d, b[e], e)
        }
      })
    } else {
      inputs.each(function(d) {
        var e = d.attr(a);
        d.content(b.get(e));
        if (f != undefined) {
          f(d, b.get(e), e)
        }
      })
    }
  };

  function _validInput(b, a) {
    var v = b.attr("jet-valid");
    var c = "";
    if (v.indexOf("lengthOfAny") != -1) {
      var e = v.substring(12, v.length - 1).split(",");
      var f = "lengthOfAny";
      var d = b.content();
      if (d.length >= parseInt(e[0]) && d.length <= parseInt(e[1])) {
        c = "true"
      } else {
        c = _getValidText(f, e)
      }
    } else {
      c = _checkValue(v, b.content())
    }
    if (c == "true") {
      if (Jet.useDefaultStyle) {
        b.removeClass("jet-unpass").attr("jet-value", "");
        _checkIsPw(b)
      }
      if (_onOnePass != undefined) _onOnePass(b, c)
    } else {
      if (Jet.useDefaultStyle) {
        b.attr("jet-value", b.content()).content(c).addClass("jet-unpass");
        if (b.attr("type") == "password") {
          b.attr("jet-ispw", "true").attr("type", "text")
        }
      }
      if (_onOneFail != undefined) _onOneFail(b, c);
      if (Jet.useShowForValid && a != false) {
        Jet.show(c, "error")
      }
    }
    return c
  };

  function _validInputOfForm(b) {
    if (b.hasClass("jet-unpass")) {
      if (_onOneFail != undefined) {
        _onOneFail(b, b.val())
      }
      return b.val()
    } else {
      return _validInput(b, false)
    }
  };

  function _addValidValue(a) {
    if (a.hasClass("jet-unpass")) {
      a.content(a.attr("jet-value"));
      _checkIsPw(a)
    }
  };

  function _validateForm(g, f, c) {
    var e = [];
    var b = true;
    if (c == undefined) {
      b = false
    }
    var d = true;
    var a = g.select("[jet-valid]");
    a.each(function(j) {
      var h = _validInputOfForm(j);
      if (h != "true") {
        d = false;
        if (b) {
          e[e.length] = {
            "obj": j,
            "error": h
          }
        }
      }
    });
    if (!d) {
      if (b) {
        if (c.constructor = Function) {
          c(e)
        } else {
          eval(c)
        }
      }
      var i = (Jet.language == "CHINESE") ? "输入有误，请按提示改正。" : "Values is not expected";
      if (Jet.useShowForValid) {
        Jet.show(i, "error")
      } else {
        alert(i)
      }
    } else {
      if (f != undefined) {
        if (f.constructor = Function) {
          f(g.get())
        } else {
          eval(f)
        }
      }
    }
  };

  function _getElemsStrs(d, b) {
    var a = d.select("[" + b + "]");
    var c = [];
    a.each(function(e) {
      c[i] = [e.attr(b), _getContentForGet(e)]
    });
    return c
  };
  var validTextCn = {
    "null": "*可以为空",
    "notnull": "*必填",
    "date": "*格式为XXXX-XX-XX",
    "email": "*格式为XXX@XX.com",
    "number": "*须为纯数字",
    "idcard": "*17位数字加一位数字或X",
    "length": "*输入长度为",
    "url": "*请输入正确的网址",
    "float": "*请正确的小数",
    "lengthOfAny": "*输入长度为",
    "phone": "*须为11位纯数字",
    "letterStart": "*字母开头且长度为",
    "range": "*数字不在范围内",
    "express": "*自定义错误",
  };
  var validTextEn = {
    "null": "*null is allowed",
    "notnull": "*Required",
    "date": "*format:XXXX-XX-XX",
    "email": "*format:XXX@XX.com",
    "number": "*expect a number",
    "idcard": "*17 numbers plus a number or X",
    "length": "*length between",
    "url": "*Expect an url name",
    "float": "*Expect a float number",
    "lengthOfAny": "*length between",
    "phone": "*must be 11 digits",
    "letterStart": "*letter start and length",
    "range": "*not in range",
    "express": "*wrong express",
  };

  function _getValueText(b) {
    var c = 0;
    if (b.indexOf("range") != -1) {
      c = 6
    } else {
      if (b.indexOf("letterStart") != -1) {
        c = 12
      } else if (b.indexOf("length") != -1) {
        c = 7
      } else if (b.has("number") && b != "number") {
        c = 7
      }
    }
    if (c != 0) {
      var a = b.substring(c, b.length - 1).split(",");
      if (a[1] == undefined) {
        a[1] = a[0]
      }
      return _getValidText(b.substring(0, c - 1), a)
    } else {
      return _getValidText(b)
    }
  };

  function _getValidText(a, b) {
    if (Jet.language == "CHINESE") {
      if (b == undefined) {
        return validTextCn[a]
      } else {
        var c = "";
        if (a.has("number")) {
          c = " 且长度为"
        }
        return validTextCn[a] + c + "[" + b[0] + "," + b[1] + "]"
      }
    } else {
      if (b == undefined) {
        return validTextEn[a]
      } else {
        var c = "";
        if (a.has("number")) {
          c = " and length between"
        }
        return validTextEn[a] + c + "[" + b[0] + "," + b[1] + "]"
      }
    }
  };

  function _getRegExp(f) {
    var d = -1;
    var c = -1;
    if (f.indexOf("length") != -1) {
      var e = f.substring(7, f.length - 1).split(",");
      f = "length";
      d = e[0];
      if (e[1] == undefined) {
        e[1] = e[0]
      }
      c = e[1]
    } else if (f.indexOf("letterStart") != -1) {
      var e = f.substring(12, f.length - 1).split(",");
      f = "letterStart";
      d = e[0];
      if (e[1] == undefined) {
        e[1] = e[0]
      }
      c = e[1]
    } else if (f.has("number") && f != "number") {
      var e = f.substring(7, f.length - 1).split(",");
      f = "number";
      d = e[0];
      if (e[1] == undefined) {
        e[1] = e[0]
      }
      c = e[1]
    } else if (f.has("express")) {
      d = f.substring(8, f.length - 1);
      f = "express"
    }
    switch (f) {
    case "null":
      return /^\S{0}$/;
      break;
    case "date":
      return /^(([12]\d{3}-((0[1-9])|(1[0-2]))-((0[1-9])|([1-2]\d)|3(0|1))))$/;
      break;
    case "email":
      return /^((\w*@\w*.com))$/;
      break;
    case "number":
      if (d >= 0) {
        return new RegExp("^-?(\\d{" + d + "," + c + "})$")
      } else {
        return /^-?(\d+)$/
      }
      break;
    case "float":
      return /^-?[1-9]\d*.\d*|0.\d*[1-9]\d*$/;
      break;
    case "idcard":
      return /^(\d{17}(X|\d))$/;
      break;
    case "url":
      return /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+$/;
      break;
    case "phone":
      return /^([1]\d{10})$/;
      break;
    case "letterStart":
      return new RegExp("^([a-zA-Z]([a-zA-Z\\d]){" + (parseInt(d) - 1) + "," + (parseInt(c) - 1) + "})$");
      break;
    case "length":
      return new RegExp("^(([a-zA-Z\\d]){" + d + "," + c + "})$");
      break;
    case "express":
      return new RegExp(d);
      break;
    default:
      return "null";
      break
    }
  };

  function _checkValue(a, e) {
    if (a.indexOf("notnull") != -1) {
      if (e.length == 0) {
        return _getValueText("notnull")
      }
    } else if (a.indexOf("null") != -1) {
      var c = a.split(" ");
      var b = (c[0] == "null") ? c[1] : c[0];
      if (b.indexOf("range") != -1) {
        var d = _testRange(a, e);
        if (d != "true" && e != "") {
          return d
        }
      }
      if (!_getRegExp(b).test(e) && e != "") {
        return _getValueText(b)
      }
    } else {
      if (a.indexOf("range") != -1) {
        var d = _testRange(a, e);
        if (d != "true") {
          return d
        }
      } else {
        if (!_getRegExp(a).test(e)) {
          return _getValueText(a)
        }
      }
    }
    return "true"
  };

  function _testRange(b, c) {
    var a = b.substring(6, b.length - 1).split(",");
    b = "number";
    if (_getRegExp(b).test(c)) {
      if (parseInt(c) < parseInt(a[0]) || parseInt(c) > parseInt(a[1])) {
        return _getValidText("range", a)
      }
    } else {
      return _getValidText("number")
    }
    return "true"
  };

  function _getUrlPara() {
    var d = decodeURI(location.search.substring(1)).split("&");
    if (d.length == 0) {
      return ""
    } else {
      if (d.length == 1) {
        return d[0].split("=")[1]
      } else {
        var a = {};
        for (var c = 0; c < d.length; c++) {
          var b = d[c].split("=");
          a[b[0]] = b[1]
        }
        return a
      }
    }
  };

  function _turnPage(a) {
    window.location.href = (encodeURI(a))
  };

  function _getRandomNum(a, b) {
    return (a + Math.round(Math.random() * (b - a)))
  };

  function _sign(n) {
    if (n >= 0) {
      return 1
    }
    return -1
  };

  function _isMobile() {
    if ((/AppleWebKit.*Mobile/i).test(navigator.userAgent)) {
      return true
    } else {
      return false
    }
  };

  function _mesShow(a, b, c, d, e) {
    clearTimeout(_t);
    var f = J.id("jetNoteLittleWrapper");
    if (f == undefined) {
      _addNoteWrapper();
      f = J.id("jetNoteLittleWrapper")
    }
    var g = f.findClass("jet-icon-circle").child();
    if (!b) {
      g[0].className = "jet-icon-part-ok1 jet-rotate-45";
      g[1].className = "jet-icon-part-ok2 jet-rotate-45";
      b = "success"
    } else {
      switch (b) {
      case "success":
        g[0].className = "jet-icon-part-ok1 jet-rotate-45";
        g[1].className = "jet-icon-part-ok2 jet-rotate-45";
        break;
      case "warn":
        g[0].className = "jet-icon-part-bar jet-icon-part-warn1";
        g[1].className = "jet-icon-part-block jet-icon-part-warn2";
        break;
      case "error":
        g[0].className = "jet-icon-part-x jet-rotate-45";
        g[1].className = "jet-icon-part-x jet-rotate-045";
        break;
      case "info":
        g[0].className = "jet-icon-part-block jet-icon-part-info1";
        g[1].className = "jet-icon-part-bar jet-icon-part-info2";
        break;
      default:
        g[0].className = "jet-icon-part-ok1 jet-rotate-45";
        g[1].className = "jet-icon-part-ok2 jet-rotate-45";
        break
      }
    }
    f.className = "jet-" + b;
    J.id("jetNoteContent").txt(a);
    J.id("jetNoteWrapper").css("top", "0");
    c = Jet.checkArg(c, 1500);
    if (c.constructor == String) {
      switch (c) {
      case "slower":
        c = 2500;
        break;
      case "slow":
        c = 2000;
        break;
      case "normal":
        c = 1500;
        break;
      case "fast":
        c = 1000;
        break;
      case "faster":
        c = 500;
        break;
      default:
        c = 1500
      }
    }
    _t = setTimeout(function() {
      if (e != false) {
        _t = setTimeout(function() {
          _mesClose();
          if (d != undefined) {
            d()
          }
        }, c)
      }
    }, 300)
  };
  var _okCall = null;
  var _cancelCall = null;

  function _confirmShow(a, b, c) {
    clearTimeout(_ct);
    var d = J.id("jetConfirmContent");
    if (d == undefined) {
      _addConfirmWrapper();
      d = J.id("jetConfirmContent")
    }
    d.txt(a);
    J.id("jetConfirmWrapper").css("top", "0");
    if (b != undefined) {
      if (b.constructor == Function) {
        _okCall = b
      } else {
        _okCall = function() {
          eval(b)
        }
      }
    }
    if (c != undefined) {
      if (c.constructor == Function) {
        _cancelCall = c
      } else {
        _cancelCall = function() {
          eval(c)
        }
      }
    }
  };

  function _mesShowWait(a, b) {
    b = Jet.checkArg(b, "info");
    _mesShow(a, b, 0, function() {}, false)
  };

  function _mesClose() {
    J.id("jetNoteWrapper").css("top", "-100%")
  };

  function _confirmOk() {
    if (_okCall != null) {
      _okCall();
      _okCall = null
    }
    _confirmClose()
  };

  function _confirmCancel() {
    if (_cancelCall != null) {
      _cancelCall();
      _cancelCall = null
    }
    _confirmClose()
  };

  function _confirmClose() {
    J.id("jetConfirmWrapper").css("top", "-100%")
  };

  function _setNoteStyle(a) {
    if (a != "color") {
      a = "gray"
    }
    Jet.noteStyle = a;
    if (J.id("jetNoteLittleWrapper") != undefined) {
      J.id("jetNoteLittleWrapper").attr("jet-style", a)
    }
  };
  function _checkArg(a, b) {
    return (a == undefined) ? b : a
  };
  function _addNoteWrapper() {
    var a = J.new("span").addClass("jet-icon-circle").append([J.new("span"), J.new("span")]);
    var b = J.new("div").attr("id", "jetNoteIcon").addClass("jet-icon-wrapper").append(a);
    var c = J.new("div").attr("id", "jetNoteContent");
    var d = J.new("div").attr({
      "id": "jetNoteLittleWrapper",
      "jet-style": Jet.noteStyle
    }).append([b, c]);
    J.body().append(J.new("div").attr({
      "id": "jetNoteWrapper",
      "onclick": "Jet.close()"
    }).append(d));
    var w = J.width();
    if (w < 400) {
      J.id("jetNoteLittleWrapper").attr("jet-size", "large")
    } else if (w < 1200) {
      J.id("jetNoteLittleWrapper").attr("jet-size", "middle")
    }
  };

  function _addConfirmWrapper() {
    var a = J.new("span").addClass("jet-icon-circle jet-no-border").append([J.new("span").addClass("jet-icon-part-ok1 jet-rotate-45"), J.new("span").addClass("jet-icon-part-ok2 jet-rotate-45")]);
    var b = J.new("span").addClass("jet-icon-circle jet-no-border").append([J.new("span").addClass("jet-icon-part-x jet-rotate-45"), J.new("span").addClass("jet-icon-part-x jet-rotate-045")]);
    var c = J.new("div").attr({
      "id": "jetConfirmOk",
      "onclick": "Jet.confirmOk()"
    }).append(a);
    var d = J.new("div").attr({
      "id": "jetConfirmCancel",
      "onclick": "Jet.confirmCancel()"
    }).append(b);
    var e = J.new("div").attr("id", "jetConfirmBtnWrapper").append([c, d]);
    var f = J.new("div").attr("id", "jetConfirmContent");
    var g = J.new("div").attr("id", "jetConfirmLittleWrapper").append([f, e]);
    var h = J.new("div").attr("id", "jetConfirmWrapper").append(g);
    J.body().append(h);
    var w = J.width();
    if (w < 400) {
      J.id("jetConfirmLittleWrapper").addClass("jet-large")
    } else if (w < 1200) {
      J.id("jetConfirmLittleWrapper").addClass("jet-middle")
    }
  };

  function _addInputWrapper() {
    var a = J.new("span").addClass("jet-icon-circle jet-no-border").append([J.new("span").addClass("jet-icon-part-ok1 jet-rotate-45"), J.new("span").addClass("jet-icon-part-ok2 jet-rotate-45")]);
    var b = J.new("span").addClass("jet-icon-circle jet-no-border").append([J.new("span").addClass("jet-icon-part-x jet-rotate-45"), J.new("span").addClass("jet-icon-part-x jet-rotate-045")]);
    var c = J.new("div").attr({
      "id": "jetInputOk",
      "onclick": "Jet.inputOk()"
    }).append(a);
    var d = J.new("div").attr({
      "id": "jetInputCancel",
      "onclick": "Jet.inputCancel()"
    }).append(b);
    var e = J.new("div").attr("id", "jetInputBtnWrapper").append([c, d]);
    var f = J.new("div").attr("id", "jetInputContent");
    var g = J.new("div").attr("id", "jetInputLittleWrapper").append([f, e]);
    var h = J.new("div").attr("id", "jetInputWrapper").append(g);
    J.body().append(h);
    var w = J.width();
    if (w < 400) {
      J.id("jetInputLittleWrapper").addClass("jet-large")
    } else if (w < 1200) {
      J.id("jetInputLittleWrapper").addClass("jet-middle")
    }
  };
})();