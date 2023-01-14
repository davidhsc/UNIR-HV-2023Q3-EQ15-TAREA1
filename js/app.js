
const body = d3.select("body"); //selector principal body
let data = null;                //variable principal de datos

// objetos para el tooltip
const tooltip = body.select("#tooltip");
const tooltipnombrebuque = body.select("#tooltipnombrebuque");
const tooltipnaviera = body.select("#tooltipnaviera");
const tooltipmaniobrista = body.select("#tooltipmaniobrista");
const tooltipeslora = body.select("#tooltipeslora");
const tooltipcalado = body.select("#tooltipcalado");

// DEFINICIÓN DE LA FUNCIÓN PRICIPAL
// llamará a las demás funciones después de cargar los datos
const loadDataAndRenderAll = async() => {
    data = await d3.json("./data/buquesHistoricos.json", d3.autoType);
    console.log(data);

    renderTablaDatos(data);
    renderDimensionesBuques(data);
}

// DEFINICIÓN DE LA FUNCIÓN
const renderTablaDatos = (data) => {
    const tabla = d3.select("#renglonesdatos");
    let registros = tabla.selectAll("body > #renglonesdatos > tr").data(data);
    registros.enter().append("tr").html( (d) => `<tr>
        <th scope="row"><i class="fa-solid fa-ship ${d.MANIOBRISTA.substring(0,3).toLowerCase()}"></i></th>
        <th scope="row">${d.VID}</th>
        <td>${d.NOM_BUQUE}</td>
        <td>${d.NOM_NAVIERA}</td>
        <td>${d.ESLORA}</td>
        <td>${d.CALADO}</td>
        <td>${d.MANIOBRISTA}</td>
        <td>${d.NOM_MUELLES}</td>
      </tr>`)

} 

// DEFINICIÓN DE LA FUNCIÓN
const renderDimensionesBuques = (data)=> {
    // calcular ancho, alto y márgenes del SVGs
    const anchototal = +body.style("width").slice(0,-2) *.8;
    const altototal = anchototal * 9 / 16 *.8;
    console.log ("ancho total (px): " + anchototal);
    console.log ("alto total (px) " + altototal);
    const margins = { left: 50, top: 10, right: 50, bottom: 100};
    const anchografica = anchototal - margins.left - margins.right;
    const altografica = altototal -margins.top - margins.bottom;

    // escalas y dominios
    x = d3.scaleLinear().range([0, anchografica]);
    y = d3.scaleLinear().range([altografica, 0]);
    x.domain([0, d3.max(data, (d) => +d.ESLORA * 1.1 )])
    y.domain([0, d3.max(data, (d) => +d.CALADO * 1.1)])
    
    // construir el svg
    const graf =body.select("#graf");
    const svgdimensionesbuques = graf.append("svg")
    .attr("width",anchototal)
    .attr("height", altototal)
    .attr("class", "fig");

    // crear el grupo para los puntos
    const g = svgdimensionesbuques
        .append("g")
        .attr("transform", `translate(${margins.left}, ${margins.top})`);
    
    g.append("rect").attr("x",0).attr("y",0).attr("width",anchografica).attr("height",altografica).attr("class","grupo");
    
    // SE USAN IMÁGENES DE BARCOS PARA LOS PUNTOS. 
    // Usar el código Unicode f21A, queda \uf21A 
    // Icono barco en fontawsome: https://fontawesome.com/icons/ship?s=solid&f=classic
    // referencia: https://stackoverflow.com/questions/18416749/adding-fontawesome-icons-to-a-d3-graph
    g.selectAll("circle")
        .data(data)
        .enter()
        .append("text")
        .attr('x', d=> x(+d.ESLORA) )
        .attr('y', d=> y(+d.CALADO) )
        .attr('font-family', 'FontAwesome')
        .attr("class", d=> "buque " + d.MANIOBRISTA.substring(0,3).toLowerCase() )
        .text(function(d) { return '\uf21A' })
        //ampliar el icono del buque al seleccionarlo (antes quita la clase seleccionado de los anteriores)
        .on("mouseover", function(e,d) {
            // quitar la selección anterior 
            console.log(d);
            d3.selectAll(".seleccionado").classed("seleccionado",false);
            // seleccionar el buque (ampliar el icono mediante css)
            d3.select(this).classed("seleccionado", !d3.select(this).classed("seleccionado"))
            showTooltip(d);
          })
        .on("mouseout", function(e,d) {
            hideTooltip();
        })
        /*
        .append('circle')
            .attr('cx', d=> x(+d.ESLORA) )
            .attr('cy', d=> y(+d.CALADO) )
            .attr('r',5)           
        */               
        
        ;
    
    // ejes
    xAxis = d3.axisBottom(x).tickSize(-altografica);
    yAxis = d3.axisLeft(y).tickSize(-anchografica);
    //crear un subgrupo para los ejes
    g.append("g").attr("transform", `translate(0, ${altografica})`).attr("class","ejes").call(xAxis);
    g.append("g").attr("class","ejes").call(yAxis);

    // títulos de la gráfica
    //   título del eje X
    g.append("text")
        .attr("x", anchototal/2)
        .attr("y", altototal - 30)
        .attr("text-anchor", "middle")
        .text("Eslora de los buques (metros)");
    //   título del eje y (con rotación)
    g.append("g")
        .attr("transform",`translate(0,${altototal/2})`)
        .append("text")
        .attr("y",-35)
        .attr("transform","rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Calado de los buques (metros)");

    //definición de la función auxiliar showTooltip
    const showTooltip = (d)=>{
        tooltip.style("display","block");
        tooltip.style("left", x(+d.ESLORA)+10+"px").style("top", y(+d.CALADO)+20+"px")
        tooltipnombrebuque.text(d.NOM_BUQUE);
        tooltipnaviera.text(d.NOM_NAVIERA);
        tooltipmaniobrista.text(d.MANIOBRISTA);
        tooltipeslora.text(d.ESLORA + " metros");
        tooltipcalado.text(d.CALADO + " metros");
    }
    //definición de la función auxiliar hideTooltip
    const hideTooltip = (d)=>{
        tooltip.style("display","none");
    }

}



//EJECUTAR LA FUNCIÓN PRINCIPAL
loadDataAndRenderAll()
