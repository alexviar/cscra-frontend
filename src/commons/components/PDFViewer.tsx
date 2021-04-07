import React, {useEffect} from 'react'
import PDFObject from 'pdfobject'

export function PDFViewer({url, height}:{url: string, height: number}) {
    useEffect(()=>{
      var options = {
        fallbackLink: '<p>Este navegador no soporta la visualizacion de archivos PDF en linea, por favor descarga el archivo haciendo clic : <a href="[url]">aquí</a></p>'
      };
     
      PDFObject.embed(url, "#pdfcontainer", options);
    }, [url])
    return <div id="pdfcontainer" style={{height}}></div>
  }