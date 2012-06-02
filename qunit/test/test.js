test("jquery.mosh is defined", function(){
    ok(typeof jQuery != "undefined","JQuery is defined");
    ok(typeof $ != "undefined", "$ is defined");
    ok(typeof $.fn.mosh != "undefined", "$.fn.mosh is defined");
    ok(typeof $.mosh != "undefined", "$.mosh is defined");
    ok(typeof $.mosh.xmlToObject != "undefined", "$.mosh.xmlToObject is defined");
    ok(typeof $.mosh.objectToXml != "undefined", "$.mosh.objectToXml is defined");
    ok(typeof $.mosh.stringToXml != "undefined", "$.mosh.stringToXml is defined");
    ok(typeof $.mosh.xmlToObject != "undefined", "$.mosh.xmlToString is defined");
    ok(typeof $.mosh.propCount != "undefined", "$.mosh.propCount is defined");
});



asyncTest("T0019 : Transform Test 8 - Simple using xml document input",function(){
    
    $("#moshOut").empty();

    $("#moshOut").mosh({
        xml :   $.mosh.stringToXml("<?xml version=\"1.0\" encoding=\"UTF-8\"?><records><record><Name>Fred</Name><Colour>Red</Colour></record><record><Name>Jessica</Name><Colour>Purple</Colour></record><record><Name>&lt;span id=\"Arthur\" style=\"font-weight:bold;\"&gt;Arthur&lt;/span&gt;</Name><Colour>Green</Colour></record></records>"),
        xsl :   "layout.xsl",
        xslCharEscape: true,
        success : function(data)
        {
            var html = $("#moshOut").html();
            ok(html.indexOf("SUCCESS") >= 0,"SUCCESS text exists");
            ok(!!document.getElementById("Arthur"),"Does contain Xsl Char Escaped Element 'Arthur'");
            start();
        },
        error   :   function(data)
        {
            ok(false,"Error performing transform.");
            start();
        }

    });

    
    
});


asyncTest("T0001 : Transform Test 1 - Simple",function(){
    
    $("#moshOut").empty();
    
    $("#moshOut").mosh({
        xml :   "data.xml",
        xsl :   "layout.xsl",
        success : function(data)
        {
            var html = $("#moshOut").html();
            ok(html.indexOf("SUCCESS") >= 0,"SUCCESS text exists");
            ok(!document.getElementById("Arthur"),"Does not contain Xsl Char Escaped Element 'Arthur'");
            start();
        },
        error   :   function(data)
        {
            ok(false,"Error performing transform.");
            start();
        }
        
    });
    
    
    
});


asyncTest("T0002 : Transform Test 2 - Xsl Params",function(){
    
    $("#moshOut").empty();
    
    $("#moshOut").mosh({
        xml :   "data.xml",
        xsl :   "layout.xsl",
        data:null,
        dataXsl:{
            title:"TITLE"
        },
        success : function(data)
        {
            var html = $("#moshOut").html(),
                title = $("#title").html();
            ok(html.indexOf("SUCCESS") >= 0,"SUCCESS text exists");
            ok(title == "TITLE","TITLE text from Xsl Param exists");
            ok(!document.getElementById("Arthur"),"Does not contain Xsl Char Escaped Element 'Arthur'");
            start();
        },
        error   :   function(data)
        {
            ok(false,"Error performing transform.");
            start();
        }
        
    });
    
    
    
});

asyncTest("T0003 : Transform Test 3 - Xsl Char Escape",function(){
    
    $("#moshOut").empty();
    
    $("#moshOut").mosh({
        xml :   "data.xml",
        xsl :   "layout.xsl",
        data:null,
        dataXsl:{
            title:"TITLE"
        },
        crossDoamin : true,
        cache : false,
        xslCharEscape:true,
        success : function(data)
        {
            var html = $("#moshOut").html(),
                title = $("#title").html();
                
            ok(html.indexOf("SUCCESS") >= 0,"SUCCESS text exists");
            ok(title == "TITLE","TITLE text from Xsl Param exists");
            ok(!!document.getElementById("Arthur"),"Does contain Xsl Char Escaped Element 'Arthur'");
            start();
        },
        error   :   function(data)
        {
            ok(false,"Error performing transform.");
            start();
        }
        
    });
    
    
    
});


asyncTest("T0004 : Transform Test 4 - Xsl Char Escape with Cache",function(){
    
    $("#moshOut").empty();
    
    $("#moshOut").mosh({
        xml :   "data.xml",
        xsl :   "layout.xsl",
        data: {
            something:0
        },
        dataXsl:{
            title:"TITLE"
        },
        crossDoamin : true,
        cache : true,
        xslCharEscape:true,
        success : function(data)
        {
            var html = $("#moshOut").html(),
                title = $("#title").html();
                
            ok(html.indexOf("SUCCESS") >= 0,"SUCCESS text exists");
            ok(title == "TITLE","TITLE text from Xsl Param exists");
            ok(!!document.getElementById("Arthur"),"Does contain Xsl Char Escaped Element 'Arthur'");
            start();
        },
        error   :   function(data)
        {
            ok(false,"Error performing transform.");
            start();
        }
        
    });
    
});





asyncTest("T0005 : Transform Test 5 - Simple using xml string input",function(){
    
    

    $("#moshOut").empty();

    $("#moshOut").mosh({
        xml :   "<?xml version=\"1.0\" encoding=\"UTF-8\"?><records><record><Name>Fred</Name><Colour>Red</Colour></record><record><Name>Jessica</Name><Colour>Purple</Colour></record><record><Name>&lt;span id=\"Arthur\" style=\"font-weight:bold;\"&gt;Arthur&lt;/span&gt;</Name><Colour>Green</Colour></record></records>",
        xsl :   "layout.xsl",
        xslCharEscape: true,
        success : function(data)
        {
            var html = $("#moshOut").html();
            ok(html.indexOf("SUCCESS") >= 0,"SUCCESS text exists");
            ok(!!document.getElementById("Arthur"),"Does contain Xsl Char Escaped Element 'Arthur'");
            start();
        },
        error   :   function(data)
        {
            ok(false,"Error performing transform.");
            start();
        }

    });
    
    
});


asyncTest("T0015 : Transform Test 6 - Simple using xsl string input",function(){
    
  
    $("#moshOut").empty();

    $("#moshOut").mosh({
        xml :   "data.xml",
        xsl :   "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?><xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\">	    <xsl:output method=\"html\" omit-xml-declaration=\"yes\" /><xsl:param name=\"title\" select=\"''\" />                    <xsl:template match=\"/\">        <div id=\"merged\">SUCCESS</div>        <h4>            <span id=\"title\">                <xsl:value-of select=\"$title\" />                </span>                    </h4>                <xsl:for-each select=\"//record\">            <p>                <xsl:value-of select=\"Name\" />            </p>        </xsl:for-each>    </xsl:template>      </xsl:stylesheet>",
        xslCharEscape: true,
        success : function(data)
        {
            var html = $("#moshOut").html();
            ok(html.indexOf("SUCCESS") >= 0,"SUCCESS text exists");
            ok(!!document.getElementById("Arthur"),"Does contain Xsl Char Escaped Element 'Arthur'");
            start();
        },
        error   :   function(data)
        {
            ok(false,"Error performing transform.");
            start();
        }

    });

    
});



asyncTest("T0016 : Transform Test 7 - Simple using xml string input and xsl string input",function(){
    
    $("#moshOut").empty();

    $("#moshOut").mosh({
        xml :   "<?xml version=\"1.0\" encoding=\"UTF-8\"?><records><record><Name>Fred</Name><Colour>Red</Colour></record><record><Name>Jessica</Name><Colour>Purple</Colour></record><record><Name>&lt;span id=\"Arthur\" style=\"font-weight:bold;\"&gt;Arthur&lt;/span&gt;</Name><Colour>Green</Colour></record></records>",
        xsl :   "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?><xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\">	    <xsl:output method=\"html\" omit-xml-declaration=\"yes\" /><xsl:param name=\"title\" select=\"''\" />                    <xsl:template match=\"/\">        <div id=\"merged\">SUCCESS</div>        <h4>            <span id=\"title\">                <xsl:value-of select=\"$title\" />                </span>                    </h4>                <xsl:for-each select=\"//record\">            <p>                <xsl:value-of select=\"Name\" />            </p>        </xsl:for-each>    </xsl:template>      </xsl:stylesheet>",
        xslCharEscape: true,
        success : function(data)
        {
            var html = $("#moshOut").html();
            ok(html.indexOf("SUCCESS") >= 0,"SUCCESS text exists");
            ok(!!document.getElementById("Arthur"),"Does contain Xsl Char Escaped Element 'Arthur'");
            start();
        },
        error   :   function(data)
        {
            ok(false,"Error performing transform.");
            start();
        }

    });

    
    
});



asyncTest("T0020 : Transform Test 9 - Simple using xsl (XMLDocument) input",function(){
    
    $("#moshOut").empty();

    $("#moshOut").mosh({
        xml :   "data.xml",
        xsl :   $.mosh.stringToXml("<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?><xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\">	    <xsl:output method=\"html\" omit-xml-declaration=\"yes\" /><xsl:param name=\"title\" select=\"''\" />                    <xsl:template match=\"/\">        <div id=\"merged\">SUCCESS</div>        <h4>            <span id=\"title\">                <xsl:value-of select=\"$title\" />                </span>                    </h4>                <xsl:for-each select=\"//record\">            <p>                <xsl:value-of select=\"Name\" />            </p>        </xsl:for-each>    </xsl:template>      </xsl:stylesheet>"),
        xslCharEscape: true,
        success : function(data)
        {
            var html = $("#moshOut").html();
            ok(html.indexOf("SUCCESS") >= 0,"SUCCESS text exists");
            ok(!!document.getElementById("Arthur"),"Does contain Xsl Char Escaped Element 'Arthur'");
            start();
        },
        error   :   function(data)
        {
            ok(false,"Error performing transform.");
            start();
        }

    });

});

asyncTest("T0021 : Transform Test 10 - Simple using xml and xsl as XMLDocument inputs",function(){
    
    $("#moshOut").empty();

    $("#moshOut").mosh({
        xml :   $.mosh.stringToXml("<?xml version=\"1.0\" encoding=\"UTF-8\"?><records><record><Name>Fred</Name><Colour>Red</Colour></record><record><Name>Jessica</Name><Colour>Purple</Colour></record><record><Name>&lt;span id=\"Arthur\" style=\"font-weight:bold;\"&gt;Arthur&lt;/span&gt;</Name><Colour>Green</Colour></record></records>"),
        xsl :   $.mosh.stringToXml("<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?><xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\">	    <xsl:output method=\"html\" omit-xml-declaration=\"yes\" /><xsl:param name=\"title\" select=\"''\" />                    <xsl:template match=\"/\">        <div id=\"merged\">SUCCESS</div>        <h4>            <span id=\"title\">                <xsl:value-of select=\"$title\" />                </span>                    </h4>                <xsl:for-each select=\"//record\">            <p>                <xsl:value-of select=\"Name\" />            </p>        </xsl:for-each>    </xsl:template>      </xsl:stylesheet>"),
        xslCharEscape: true,
        success : function(data)
        {
            var html = $("#moshOut").html();
            ok(html.indexOf("SUCCESS") >= 0,"SUCCESS text exists");
            ok(!!document.getElementById("Arthur"),"Does contain Xsl Char Escaped Element 'Arthur'");
            start();
        },
        error   :   function(data)
        {
            ok(false,"Error performing transform.");
            start();
        }

    });

    
    
});



test("T0006 : jquery.mosh.objectToXml to string",function(){
    var expected= "<array><item>1</item><item>2</item><item>3</item><item>4</item></array>";
        
    equal( $.mosh.xmlToString(
            $.mosh.objectToXml(
                [1,2,3,4]
            )
        ).replace(/\n|\t|\s/g,""),
        expected,
        "Array to Xml to String");
        
});


test("T0007 : jquery.mosh.objectToXml to string",function(){
    var expected= "<string>abc</string>";
        
    equal($.mosh.xmlToString(
                $.mosh.objectToXml(
                    "abc"
                )
            ).replace(/\n|\t|\s/g,""),
        expected,
        "String to Xml to String");
        
});

test("T0008 : jquery.mosh.objectToXml to string",function(){
    var expected= "<function>function(){return;}</function>";
        
    equal($.mosh.xmlToString(
                $.mosh.objectToXml(
                    function(){return;}
                )
            ).replace(/\n|\t|\s/g,""),
        expected,
        "Function to Xml to String");
        
});


test("T0009 : jquery.mosh.objectToXml to string",function(){
    var expected= "<object><a>1</a><b>2</b><c><i>1</i><ii>2</ii><iii>3</iii><iv><x>1</x><y>2</y><z>3</z></iv></c><d>4</d><e>5</e><g>7</g></object>";
        
    equal($.mosh.xmlToString(
                $.mosh.objectToXml({
                    a:1,
                    b:2,
                    c:{
                        i : 1,
                        ii : 2,
                        iii : 3,
                        iv : {
                            x : 1,
                            y : 2,
                            z : 3
                        }
                    },
                    d:4,
                    e:5,
                    f:function(){},
                    i:function(){},
                    g:7
                    
                })
            ).replace(/\n|\t|\s/g,""),
        expected,
        "Object (without functions) to Xml to String");
        
});


test("T0010 : jquery.mosh.objectToXml to string",function(){
    var expected= "<object><a>1</a><b>2</b><c><i>1</i><ii>2</ii><iii>3</iii><iv><x>1</x><y>2</y><z>3</z></iv></c><d>4</d><e>5</e><f>function(){}</f><i>function(){}</i><g>7</g></object>";
        
    equal($.mosh.xmlToString(
                $.mosh.objectToXml({
                    a:1,
                    b:2,
                    c:{
                        i : 1,
                        ii : 2,
                        iii : 3,
                        iv : {
                            x : 1,
                            y : 2,
                            z : 3
                        }
                    },
                    d:4,
                    e:5,
                    f:function(){},
                    i:function(){},
                    g:7
                    
                },null,null,true)
            ).replace(/\n|\s/g,""),
        expected,
        "Object (including functions) to Xml to String");
        
});


test("T0011 : jquery.mosh.objectToXml to string",function(){
    var expected= "<string>abc</string>";
        
    equal($.mosh.xmlToString(
                $.mosh.objectToXml(
                    "abc"
                )
            ).replace(/\n|\t|\s/g,""),
        expected,
        "Object to Xml to String");
        
});



test("T0012 : jquery.mosh.xmlToObject to string",function(){
    var expected= "<object><a>1</a><b>2</b><c><i>1</i><ii>2</ii><iii>3</iii><iv><x>1</x><y>2</y><z>3</z></iv></c><d>4</d><e>5</e><g>7</g></object>";
        
    equal($.mosh.xmlToString(
                $.mosh.objectToXml(
                    $.mosh.xmlToObject(
                        $.mosh.objectToXml({
                                    a:1,
                                    b:2,
                                    c:{
                                        i : 1,
                                        ii : 2,
                                        iii : 3,
                                        iv : {
                                            x : 1,
                                            y : 2,
                                            z : 3
                                        }
                                    },
                                    d:4,
                                    e:5,
                                    f:function(){},
                                    i:function(){},
                                    g:7

                                })
                    )
                )
            ).replace(/\n|\s/g,""),
        expected,
        "Object To Xml To Object To Xml to String");
        
});



test("T0013 : jquery.mosh.stringToXml to xmlToString",function(){
    var expected= "<object><a>1</a><b>2</b><c><i>1</i><ii>2</ii><iii>3</iii><iv><x>1</x><y>2</y><z>3</z></iv></c><d>4</d><e>5</e><g>7</g></object>";
        
    equal($.mosh.xmlToString(
                $.mosh.stringToXml("<object><a>1</a><b>2</b><c><i>1</i><ii>2</ii><iii>3</iii><iv><x>1</x><y>2</y><z>3</z></iv></c><d>4</d><e>5</e><g>7</g></object>")
            ).replace(/\n|\t|\s/g,""),
        expected,
        "String To Xml to String");
        
});


test("T0014 : jquery.mosh.objectToXml to string",function(){
    var expected= "<string>abc</string>";
        
    equal($.mosh.xmlToString(
                $.mosh.objectToXml(
                    "abc"
                )
            ).replace(/\n|\t|\s/g,""),
        expected,
        "Object to Xml to String");
        
});





asyncTest("T0017 : Transform Test 1 using JSON and conversion functions",function(){
    
    $("#moshOut").empty();

    $("#moshOut").mosh({
        json :   "data.json",
        xsl :   "layout.json.xsl",
        xslCharEscape: true,
        success : function(data)
        {
            var html = $("#moshOut").html();
            ok(html.indexOf("SUCCESS with JSON / XSL") >= 0,"SUCCESS text exists");
            ok(html.indexOf("London") >= 0,"London text exists");
            start();
        },
        error   :   function(data)
        {
            ok(false,"Error performing transform.");
            start();
        }

    });

    
    
});


test("T0018 : jquery.mosh.propCount",function(){
    
    ok($.mosh.propCount({a:1,b:2,c:3}) == 3);
    ok($.mosh.propCount({a:1,b:2,c:3,d:function(){}}) == 3);
    ok($.mosh.propCount({a:1,b:2,c:3,d:function(){}},true) == 4);
    ok($.mosh.propCount("string length") == 0);
    ok($.mosh.propCount([1,2,3,5,7]) == 5);
        
});




asyncTest("T0022 : Transform Test 11 - Using $.ajax settings - XML",function(){
    
    $("#moshOut").empty();

    $("#moshOut").mosh({
        xml :   {
            url :   "data.xml"
        },
        xsl :   {
            url :   "layout.xsl"
        },
        xslCharEscape: true,
        success : function(data)
        {
            var html = $("#moshOut").html();
            ok(html.indexOf("SUCCESS") >= 0,"SUCCESS text exists");
            ok(!!document.getElementById("Arthur"),"Does contain Xsl Char Escaped Element 'Arthur'");
            start();
        },
        error   :   function(data)
        {
            ok(false,"Error performing transform.");
            start();
        }

    });

    
    
});

asyncTest("T0023 : Transform Test 12 using $.ajax - JSON",function(){
    
    $("#moshOut").empty();

    $("#moshOut").mosh({
        json : {
            url : "data.json"
        },
        xsl :   {
            url :   "layout.json.xsl"
        },
        xslCharEscape: true,
        success : function(data)
        {
            var html = $("#moshOut").html();
            ok(html.indexOf("SUCCESS with JSON / XSL") >= 0,"SUCCESS text exists");
            ok(html.indexOf("London") >= 0,"London text exists");
            start();
        },
        error   :   function(data)
        {
            ok(false,"Error performing transform.");
            start();
        }

    });

    
    
});








// --- vvv Test Functions vvv --- ///


(function() {
	var reset = QUnit.reset;
	function afterTest() {
		ok( false, "reset should not modify test status" );
	}
	module("reset");
	test("reset runs assertions", function() {
		QUnit.reset = function() {
			afterTest();
			reset.apply( this, arguments );
		};
	});
	test("reset runs assertions2", function() {
		QUnit.reset = reset;
	});
})();

if (typeof setTimeout !== 'undefined') {
function testAfterDone(){
	var testName = "ensure has correct number of assertions";

	function secondAfterDoneTest(){
		QUnit.config.done = [];
		//QUnit.done = function(){};
		//because when this does happen, the assertion count parameter doesn't actually
		//work we use this test to check the assertion count.
		module("check previous test's assertion counts");
		test('count previous two test\'s assertions', function(){
			var spans = document.getElementsByTagName('span'),
			tests = [],
			countNodes;

			//find these two tests
			for (var i = 0; i < spans.length; i++) {
				if (spans[i].innerHTML.indexOf(testName) !== -1) {
					tests.push(spans[i]);
				}
			}

			//walk dom to counts
			countNodes = tests[0].nextSibling.nextSibling.getElementsByTagName('b');
			equal(countNodes[1].innerHTML, "99");
			countNodes = tests[1].nextSibling.nextSibling.getElementsByTagName('b');
			equal(countNodes[1].innerHTML, "99");
		});
	}
	QUnit.config.done = [];
	QUnit.done(secondAfterDoneTest);

	module("Synchronous test after load of page");

	asyncTest('Async test', function(){
		start();
		for (var i = 1; i < 100; i++) {
			ok(i);
		}
	});

	test(testName, 99, function(){
		for (var i = 1; i < 100; i++) {
			ok(i);
		}
	});

	//we need two of these types of tests in order to ensure that assertions
	//don't move between tests.
	test(testName + ' 2', 99, function(){
		for (var i = 1; i < 100; i++) {
			ok(i);
		}
	});


}

QUnit.done(testAfterDone);

}


// --- ^^^ Test Functions ^^^ --- ///
