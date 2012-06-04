/* 
jQuery Mosh Plugin - Copyright (c) 2012 Allen Evans 
 
Version:  v1.0.0 
Homepage: http://mosh.allenevans.co.uk/ 
 
Permission is hereby granted, free of charge, to any person obtaining 
a copy of this software and associated documentation files (the 
"Software"), to deal in the Software without restriction, including 
without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to 
the following conditions: 
 
The above copyright notice and this permission notice shall be 
included in all copies or substantial portions of the Software. 
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
*/ 
(function( $ ){

  var Mosh = function(context){
     
     this.context =   context ? context.selector : null;
     this.options =   null;
     this.xhrJson =   null;
     this.xhrXml  =   null;
     this.xhrXsl  =   null;
     
  };
  
  Mosh.prototype = {
     
     init : function( options )
     {
        this.options = {
          
          json      :   null,   //json document
          xml       :   null,   //xml document
          xsl       :   null,   //xsl document
          
          data      :   null,
          
          error     :   null,
          success   :   null,
                    
          xslCharEscape:false
            
        };
        $.extend(this.options, options);

        
        //continue chaining
        return this.merge();

     },
     destroy : function( )
     {
        this.context  =   null;
        this.data     =   null;
        this.options  =   null;
        this.xhrJson  =   null;
        this.xhrXml   =   null;
        this.xhrXsl   =   null;
     },
     
     merge  :   function(isCallback)
     {
        var mosh = this,
            options = mosh.options;
        
        if(!isCallback && (!mosh.xhrXml || !mosh.xhrXsl))
        {
            //get data
            mosh.getData(function(){mosh.merge.call(mosh,true);});
        }
        else if(mosh.xhrXml && mosh.xhrXsl)
        {
            var target = mosh.context ? mosh.context : document.body,
                xproc, html, k;
                
            target = $(target);

            if((target && target.tagName && target.tagName.toUpperCase() == "IFRAME"))
            {
                target = target.contentWindow.document.body;
            }
            if(window.ActiveXObject)
            {
                //Internet Explorer way of applying xsl sheet
                try
                {
                    if(options.dataXsl || (mosh.xhrXml && mosh.xhrXml.responseXML && (typeof mosh.xhrXml.responseXML.transformNode == "undefined" || typeof mosh.xhrXml.responseXML.hasOwnProperty == "undefined")))
                    {
                        //use MSXML2.FreeThreadedDomDocument approach
                        //xd:   XSL Stylesheet but using a Free Threaded XML Document
                    
                        var xd = new ActiveXObject("MSXML2.FreeThreadedDomDocument");
                        xd.validateOnParse = false;
                        xd.loadXML(mosh.xhrXsl.responseText);
                        
                        //xc:   XSLT Compiled
                        var xc = new ActiveXObject("MSXML2.XSLTemplate");

                        xc.stylesheet = xd.documentElement;

                        //xp:   XSLTProcessor
                        var xp = xc.createProcessor();
                        xp.input = mosh.xhrXml.responseXML;

                        //Set the parameters
                        for(k in options.dataXsl)
                        {
                            if(typeof options.dataXsl[k] != "function")
                            {
                                xp.addParameter(k, mosh.options.dataXsl[k]);
                            }
                        }

                        //Perform the transform
                        xp.transform();

                        html = xp.output.toString();
                    }
                    else if(mosh.xhrXml.responseXML)
                    {
                        html = mosh.xhrXml.responseXML.transformNode(mosh.xhrXsl.responseXML);
                    }
                    if(options.xslCharEscape && html)
                    {
                        html = html.replace(/&amp;/g,"&");
                        html = html.replace(/&gt;/g,">");
                        html = html.replace(/&lt;/g,"<");
                    }
                    target.empty();
                    target.html(html);

                }
                catch(x){$.error("Transform: " + (x ? (x.message ? x.message : x.toString()) : "") + " Xml: " + options.xml + " Xsl: " + options.xsl);if(typeof options.error == "function"){options.error.apply(mosh.$,[x,mosh.xhrXml,mosh.xhrXsl]);}}
            }
            else
            {
                //Every other browsers way of applying xsl sheet
                try
                {
                    xproc = new XSLTProcessor();
                    xproc.importStylesheet(mosh.xhrXsl.responseXML || $.mosh.stringToXml(mosh.xhrXsl.responseText));

                    if(options.dataXsl)
                    {
                        for(k in options.dataXsl)
                        {
                            if(typeof options.dataXsl[k] != "function")
                            {
                                xproc.setParameter("", k, options.dataXsl[k]);
                            }
                        }
                    }

                    target.empty();
                    target.append(xproc.transformToFragment(mosh.xhrXml.responseXML,document));
                    if(mosh.options.xslCharEscape)
                    {
                        html = target.html();
                        if(html)
                        {
                            html = html.replace(/&amp;/g,"&");
                            html = html.replace(/&amp;/g,"&");	//needed twice in Mozilla Firefox
                            html = html.replace(/&gt;/g,">");
                            html = html.replace(/&lt;/g,"<");

                            target.html(html);
                        }
                    }
                 
                }
                catch(y){$.error("Transform: " + (y ? (y.message ? y.message : y.toString()) : "") + " Xml: " + options.xml + " Xsl: ");if(typeof options.error == "function"){options.error.apply(mosh.$,[y,mosh.xhrXml,mosh.xhrXsl]);}}
            }

            if(typeof options.success == "function"){options.success.apply(mosh.$,[mosh.xhrXml,mosh.xhrXsl]);}

        }/*else{not everything has loaded}*/
       
     },
     
     getData : function(callback)
     {
         var mosh = this,
             options = mosh.options;
         if(!(options.xml || options.json)){$.error( 'Xml / JSON has not been defined.' );}
         else if(!options.xsl){$.error( 'Xsl has not been defined.' );}
         else
         {
            
            if(!mosh.dataXml && !mosh.dataJson)
            {
                var xml = options.xml,
                    xsl = options.xsl,
                    json = options.json;
                
                if(json)
                {
                    //use JSON to get the data
                    if(typeof json == "string")
                    {
                        //assume url. load xml document
                        $.ajax(json, {
                            data    :   options.data,
                            dataType:   "json",
                            cache   :   false,
                            success :   function(data, textStatus, xhr)
                                        {
                                            mosh.xhrJson = xhr;
                                            mosh.dataJson = data;
                                            
                                            mosh.dataXml = $.mosh.objectToXml(data);
                                            mosh.xhrXml = {
                                                responseText :$.mosh.xmlToString(mosh.dataXml),
                                                responseXML  : mosh.dataXml
                                            };
                                            
                                             if(typeof callback == "function")
                                            {
                                                callback.call(mosh,true);
                                            }
                                        },
                            error   :   function(xhr, textStatus, errorThrown)
                                        {
                                            $.error(textStatus + " Json: " + json);
                                        }
                        });
                    }
                    else if(options.json && options.json.url)
                    {
                        //assume options.xml contains settings object to pass through to $.ajax
                        var _jsonSuccess = options.json.success;
                        //override success function to allow for
                        options.json.success = function(data,textStatus,xhr){
                            mosh.xhrJson = xhr;
                            mosh.dataJson = data;

                            mosh.dataXml = $.mosh.objectToXml(data);
                            mosh.xhrXml = {
                                responseText :$.mosh.xmlToString(mosh.dataXml),
                                responseXML  : mosh.dataXml
                            };
                            if(typeof callback == "function")
                            {
                                callback.call(mosh,true);
                            }
                            if(typeof _jsonSuccess == "function")
                            {
                                _jsonSuccess(data,textStatus,xhr);
                            }
                        };
                        
                        options.json.dataType = options.json.dataType || "json";
                        
                        $.ajax(options.json);
                    }
                }
                else
                {
                    //use XML to get the data
                    //load xml data
                    if(xml && (typeof xml == "string" || mosh.isXmlDoc(xml)))
                    {
                        //check if xml document
                        if(mosh.isXmlDoc(xml))
                        {
                            //xml is XMLDocument object
                            mosh.xhrXml = {
                                responseText : $.mosh.xmlToString(xml),
                                responseXML  : xml
                            };
                            if(typeof callback == "function")
                            {
                                callback.call(mosh,true);
                            }
                        }
                        else if(typeof xml == "string" && xml.match(/^</))
                        {
                            //is xml document in string format
                            mosh.dataXml = $.mosh.stringToXml(xml);
                            mosh.xhrXml = {
                                responseText : xml,
                                responseXML  : mosh.dataXml
                            };
                            if(typeof callback == "function")
                            {
                                callback.call(mosh,true);
                            }
                        }
                        else
                        {
                            //assume url. load xml document
                            $.ajax(xml, {
                                cache   :   false,
                                data    :   options.data,
                                success :   function(data, textStatus, xhr)
                                            {
                                                mosh.xhrXml = xhr;
                                                mosh.dataXml = data;
                                                if(typeof callback == "function")
                                                {
                                                    callback.call(mosh,true);
                                                }
                                            },
                                error   :   function(xhr, textStatus, errorThrown)
                                            {
                                                $.error(textStatus + " Xml: " + xml);
                                            }
                            });
                        }
                    }
                    else if(options.xml && options.xml.url)
                    {
                        //assume options.xml contains settings object to pass through to $.ajax
                        var _xmlSuccess = options.xml.success;
                        //override success function to allow for
                        options.xml.success = function(data,textStatus,xhr){
                            mosh.xhrXml = xhr;
                            mosh.dataXml = data;
                            if(typeof callback == "function")
                            {
                                callback.call(mosh,true);
                            }
                            if(typeof _xmlSuccess == "function")
                            {
                                _xmlSuccess(data,textStatus,xhr);
                            }
                        };
                        $.ajax(options.xml);
                    }
                }
                
            }
            //load xsl data
            if(xsl && (typeof xsl == "string" || mosh.isXmlDoc(xsl)))
            {
                //check if xml document
                if(mosh.isXmlDoc(xsl))
                {
                    //xml is XMLDocument object
                    mosh.xhrXsl = {
                        responseText : $.mosh.xmlToString(xsl),
                        responseXML  : xsl
                    };
                    if(typeof callback == "function")
                    {
                        callback.call(mosh,true);
                    }
                }
                else if(xsl.match(/^</))
                {
                    //is xml document in string format
                    mosh.dataXsl = $.mosh.stringToXml(xsl);
                    mosh.xhrXsl = {
                        responseText : xsl,
                        responseXML  : mosh.dataXsl
                    };
                    if(typeof callback == "function")
                    {
                        callback.call(mosh,true);
                    }
                }
                else
                {
                    //assume url. load xsl document
                    $.ajax(xsl, {

                        cache   :   false,
                        success :   function(data, textStatus, xhr)
                                    {
                                        mosh.xhrXsl = xhr;
                                        mosh.dataXsl = data;
                                        if(typeof callback == "function")
                                        {
                                            callback.call(mosh,true);
                                        }
                                    },
                        error   :   function(xhr, textStatus, errorThrown)
                                    {
                                        $.error(textStatus + " Xsl: " + xsl);
                                    }
                    });
                }
            }
            else if(options.xsl && options.xsl.url)
            {
                //assume options.xml contains settings object to pass through to $.ajax
                var _xslSuccess = options.xsl.success;
                //override success function to allow for
                options.xsl.success = function(data,textStatus,xhr){
                    mosh.xhrXsl = xhr;
                    mosh.dataXsl = data;
                    if(typeof callback == "function")
                    {
                        callback.call(mosh,true);
                    }
                    if(typeof _xslSuccess == "function")
                    {
                        _xslSuccess(data,textStatus,xhr);
                    }
                };
                $.ajax(options.xsl);
            }
        }
            
         return this;
         
     },
     isXmlDoc   :   function(object)
     {
         return typeof object == "object" && (object.xmlVersion || object.xml || object.loadXML || (object.contentType == "text/xml" && object.nodeName == "#document"));
     }
     
  };
  

  $.mosh = $.fn.mosh = function( method )
  {
    var mosh = new Mosh(this);
    
    if ( mosh[method] )
    {
      return mosh[method].apply( mosh, Array.prototype.slice.call( arguments, 1 ));
    }
    else if ( typeof method === "object" || ! method )
    {
        return mosh.init.apply( mosh, arguments );
    }
    else
    {
        $.error("Unknown method " +  method);
        return this;
    }    
  
  };




  $.extend($.fn.mosh,{
    
    xmlToObject :   function(xmlDoc)
                    {
                        var retObj = null,
                            obj = {},
                            childNodes,
                            child,
                            tagName,
                            firstChild,
                            prop,
                            val,
                            sibling,
                            nodeValue,
                            length;
                        if(xmlDoc)
                        {	
                            childNodes = xmlDoc.childNodes;
                            length = childNodes.length;
                            for(var i = 0; i < length; i++)
                            {   
                                child = childNodes[i];
                                tagName = child.tagName;
                                if(typeof tagName != "undefined")
                                {
                                    firstChild = child.firstChild;
                                    if(firstChild)
                                    {
                                        sibling = firstChild.nextSibling;
                                        nodeValue = firstChild.nodeValue;

                                        if(firstChild.nodeName == "#text")
                                        {
                                            val = ((nodeValue && nodeValue.length) ? nodeValue.length : 0) ? nodeValue : null;

                                            while(sibling && sibling.nodeName == "#text")
                                            {
                                                firstChild = sibling;
                                                sibling = firstChild.nextSibling;
                                                nodeValue = firstChild.nodeValue;
                                                val += ((nodeValue && nodeValue.length) ? nodeValue.length : 0) ? nodeValue : null;
                                            }
                                        }
                                        else
                                        {
                                            val = null;
                                        }

                                        prop = obj[tagName];

                                        //if(v is not empty and v is typeof string and exists a sibling)
                                        if((!(typeof val == "undefined" || val === null || (typeof val == "string" && val === "") || (typeof val == "object" && val.constructor == Array && !val.length))) && typeof val == "string" && !sibling)
                                        {
                                            //assign the value to this object as opposed to looping through it
                                            if(typeof prop != "undefined")
                                            {
                                                //an object already exists
                                                if(!(typeof prop == "object" && prop.constructor == Array))
                                                {
                                                        //adding more objects to convert to an array
                                                        obj[tagName] = [prop];
                                                        prop = obj[tagName];
                                                }

                                                if(!isNaN(val))
                                                {
                                                    val = Number(val);
                                                }
                                                prop[prop.length] = val; //add item to the end of the array

                                            }
                                            else
                                            {
                                                if(!isNaN(val))
                                                {
                                                    val = Number(val);
                                                }
                                                obj[tagName] = val;
                                            }


                                        }
                                        else
                                        {
                                            if(prop)
                                            {
                                                //an object already exists

                                                if(!(typeof prop == "object" && prop.constructor == Array))
                                                {
                                                    //adding more objects to convert to an array
                                                    obj[tagName] = [prop];
                                                    prop = obj[tagName];
                                                }
                                                prop[prop.length] = $.mosh.xmlToObject(child);

                                            }
                                            else
                                            {
                                                obj[tagName] = $.mosh.xmlToObject(child);
                                            }
                                        }

                                    }
                                    else
                                    {
                                        obj[tagName] = null;
                                    }						
                                }
                            }

                            retObj = obj;
                        }
                        
                        if(retObj && retObj.object && $.mosh.propCount(retObj) == 1)
                        {
                            retObj = retObj.object;
                        }
                        
                        return retObj;

                    },

                    /**
                    *   @function objectToXML
                    *   @description                    Converts a JavaScript object into an XML document.
                    *   @param  {Object}    object      XMLdocument to convert to a JavaScript object representation. 
                    *   @param  {String}    rootTag     Root tag name (optional). Needed if the JavaScript object has more than one top level element.
                    *   @param  {String}    nameSpace   Namespace (optional)
                    *   @param  {Boolean}   incFunc     Include functions (optional). Default = false.
                    *   @param  {int}       maxDepth    Maximum recursive depth to parse object. Default = 5.
                    *   @returns {XMLDocument}  XML document representation of the JavaScript object input.
                    */
    objectToXml :   function(object,rootTag,nameSpace,incFunc,maxDepth)
                    {
                        //pf    :   prefix
                        //tn    :   tagname
                        //i     :   index pointer
                        //k:    :   key
                        //v:    :   value
                        //n     :   node
                        var doc, prefix = "", tagName, index;
                        
                        if(object)
                        {
                        
                            rootTag = rootTag ? rootTag : "";
                            nameSpace = nameSpace ? nameSpace : "";
                            incFunc = incFunc || typeof object == "function";
                            maxDepth = maxDepth || 5;
                            if(!rootTag)
                            {
                                //check if a rootTag needs to be defined
                                if(object.constructor == Array)
                                {
                                    rootTag = "array";
                                }
                                else if(typeof object == "string")
                                {
                                    rootTag = "string";
                                }
                                else if(typeof object == "boolean")
                                {
                                    rootTag = "boolean";
                                }
                                else if(typeof object == "number")
                                {
                                    rootTag = "number";
                                }
                                else if(typeof object == "function")
                                {
                                    rootTag = "function";
                                }
                                else if($.mosh.propCount(object) > 1)
                                {
                                    rootTag = "object";
                                }
                            }
                        
                            //    Get the XML Document
                            // vv --------------------- vv
                            if(document.implementation && document.implementation.createDocument)
                            {
                                doc = document.implementation.createDocument(nameSpace,rootTag,null);
                            }
                            else
                            {
                                doc = new ActiveXObject("MSXML2.DOMDocument");
                                tagName = rootTag;
                                
                                if(rootTag)
                                {
                                    index = rootTag.indexOf(":");
                                }
                                
                                if(index >= 0)
                                {
                                    prefix = rootTag.substring(0,index);
                                    tagName = rootTag.substring(index + 1);
                                }
                                            
                                doc.loadXML("<" + (prefix ? prefix + ":" : "") + tagName + (nameSpace ? " xmlns:" + prefix + "=\"" + nameSpace + "\"" : "") + "/>");
                                
                            }
                            //    Get the XML Document
                            // ^^ --------------------- ^^
                            
                            if(doc)
                            {
                                
                                var parseObject = function(xDoc,parent,object,nameSpace,depth){
                                    
                                    var key,
                                        value,
                                        length,
                                        node,
                                        formattedKey;
                                                                            
                                    if(typeof object != "undefined")
                                    {

                                        if(depth > 0 || typeof object == "string" || typeof object == "number" || typeof object == "function")
                                        {
                                            if(typeof object == "string" || typeof object == "number" || typeof object == "function")
                                            {
                                                parent.appendChild(xDoc.createTextNode((object.toString ? object.toString() : object)));
                                            }
                                            else
                                            {
                                                try{
                                                    for(key in object)
                                                    {
                                                        if(typeof object[key] != "function" || incFunc)
                                                        {
                                                            value = object[key];

                                                            if(!isNaN(key))
                                                            {
                                                                if(object.constructor == Array)
                                                                {
                                                                    formattedKey = "item";
                                                                }
                                                                else
                                                                {
                                                                    formattedKey = "_" + key;
                                                                }
                                                            }
                                                            else if(key.match(/\$/))
                                                            {
                                                                formattedKey = key.replace(/\$/g,"_");
                                                            }
                                                            else
                                                            {
                                                                formattedKey = key;
                                                            }

                                                            node = xDoc.createElementNS ? xDoc.createElementNS(nameSpace,formattedKey) : xDoc.createNode(1,formattedKey,nameSpace);

                                                            if(typeof value != "undefined")
                                                            {
                                                                if(typeof value == "object")
                                                                {
                                                                    if(value && value.constructor == Array)
                                                                    {
                                                                        length = value.length;
                                                                        for(var i = 0; i < length; i++)
                                                                        {
                                                                            node = xDoc.createElementNS ? xDoc.createElementNS(nameSpace,formattedKey) : xDoc.createNode(1,formattedKey,nameSpace);
                                                                            parseObject(xDoc,node,value[i],nameSpace,depth - 1);
                                                                            parent.appendChild(node);
                                                                        }
                                                                    }
                                                                    else
                                                                    {
                                                                        parseObject(xDoc,node,value,nameSpace,depth - 1);
                                                                        parent.appendChild(node);
                                                                    }
                                                                }
                                                                else
                                                                {
                                                                    node.appendChild(xDoc.createTextNode((value.toString ? value.toString() : value)));
                                                                    parent.appendChild(node);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }catch(x){}
                                            }
                                        }
                                        else if(depth === 0 && object !== null)
                                        {
                                            parent.appendChild(xDoc.createTextNode("{object}"));//exceeded recursive depth. output {object} to indicate this.
                                        }
                                    }
                                 };
                                
                                parseObject(doc,doc.firstChild || doc,object,nameSpace,maxDepth);
                            
                            }
                            
                        }
                        
                        return doc;
                    },
    stringToXml :   function(xml_str)
                    {
                        var xmlDoc = null;
                        if(xml_str)
                        {
                            if(typeof DOMParser != "undefined")
                            {
                                var parser = new DOMParser();
                                xmlDoc = parser.parseFromString(xml_str,"text/xml");
                            }
                            else
                            {
                                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                                xmlDoc.async = false;
                                xmlDoc.loadXML(xml_str);
                            }
                        }
                        return xmlDoc;
                    },
    xmlToString :   function(xmlDoc)
                    {
                        var str = null;
                        if(xmlDoc)
                        {
                            if(xmlDoc.xml)
                            {
                                str = xmlDoc.xml;
                            }
                            else
                            {
                                var serializer = new XMLSerializer();
                                str = serializer.serializeToString(xmlDoc);
                            }
                        }
                        return str;
                    },
        propCount : function(object,incFunc)
                    {
                        var count = 0;
                        if(typeof object != "string")
                        {
                            for(var k in object)
                            {
                                if(incFunc || typeof object[k] != "function")
                                {
                                    count++;
                                }
                            }
                        }
                        return count;
                    }
  });

})( jQuery );
