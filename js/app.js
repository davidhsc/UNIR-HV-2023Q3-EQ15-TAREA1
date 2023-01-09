
const body = d3.select("body"); //selector principal body
let data = null;                //variable principal de datos

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
        <th scope="row">${d.VID}</th>
        <td>${d.NOM_BUQUE}</td>
        <td>${d.NOM_NAVIERA}</td>
        <td>${d.NOM_MUELLES}</td>
      </tr>`)

} 

// DEFINICIÓN DE LA FUNCIÓN
const renderDimensionesBuques = (data)=> {
    // calcular ancho, alto y márgenes del SVGs
    const anchototal = +body.style("width").slice(0,-2) *.9 ;
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
    const dimensionestab =body.select("#dimensionestab-pane");
    const svgdimensionesbuques = dimensionestab.append("svg")
    .attr("width",anchototal)
    .attr("height", altototal)
    .attr("class", "fig");

    // crear el grupo para los puntos
    const g = svgdimensionesbuques
        .append("g")
        .attr("transform", `translate(${margins.left}, ${margins.top})`);
    
    g.append("rect").attr("x",0).attr("y",0).attr("width",anchografica).attr("height",altografica).attr("class","grupo");
    g.selectAll("circle")
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d=> x(+d.ESLORA) )
            .attr('cy', d=> y(+d.CALADO) )
            .attr('r',5)        
        
        ;
    
    // ejes
    xAxis = d3.axisBottom(x).tickSize(-altografica);
    yAxis = d3.axisLeft(y).tickSize(-anchografica);
    //crear un subgrupo para los ejes
    g.append("g").attr("transform", `translate(0, ${altografica})`).attr("class","ejes").call(xAxis);
    g.append("g").attr("class","ejes").call(yAxis);

    // títulos de la gráfica
    g.append("text")
        .attr("x", anchototal/2)
        .attr("y", altototal - 30)
        .attr("text-anchor", "middle")
        .text("Calado y Eslora de los buques");
}

//EJECUTAR LA FUNCIÓN PRINCIPAL
loadDataAndRenderAll()
