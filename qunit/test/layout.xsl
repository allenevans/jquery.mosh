<?xml version="1.0" encoding="ISO-8859-1" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
    <xsl:output method="html" omit-xml-declaration="yes" />
        
    <xsl:param name="title" select="''" />
        
        
    <xsl:template match="/">

        <div id="merged">SUCCESS</div>

        <h4>
            <span id="title">
                <xsl:value-of select="$title" />    
            </span>
            
        </h4>
        
        <xsl:for-each select="//record">
            <p>
                <xsl:value-of select="Name" />
            </p>
        </xsl:for-each>

    </xsl:template>
    
    

</xsl:stylesheet>