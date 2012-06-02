<?xml version="1.0" encoding="ISO-8859-1" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
    <xsl:output method="html" omit-xml-declaration="yes" />
        
    <xsl:param name="title" select="''" />
        
        
    <xsl:template match="/">

        <div id="merged">SUCCESS with JSON / XSL</div>

        <h4>
            <span id="title">
                <xsl:value-of select="$title" />    
            </span>
            
        </h4>
        
        <table>
            <tr>
                <thead>
                    <tr>
                        <th>Place</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                    </tr>
                </thead>
            </tr>
            <tbody>
                <xsl:for-each select="//results">
                        <tr>
                            <td>
                                <xsl:value-of select="formatted_address"/>
                            </td>
                            <td>
                                <xsl:value-of select="geometry/location/lat" />
                            </td>
                            <td>
                                <xsl:value-of select="geometry/location/lng" />
                            </td>
                        </tr>
                </xsl:for-each>
            </tbody>
        </table>

    </xsl:template>
    
    

</xsl:stylesheet>