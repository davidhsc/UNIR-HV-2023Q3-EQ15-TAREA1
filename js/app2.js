/* ----------------------------------*/
/* CÓDIGO PARA LA GRÁFICA DE BARRAS */
/* ----------------------------------*/
const body2 = d3.select("body"); //selector principal body
const histo = d3.select("#histo")

const anchoTotal = +body2.style("width").slice(0,-2) *.8;
const altoTotal = anchoTotal * 9 / 16 *.8;
console.log ("ancho total (px): " + anchoTotal);
console.log ("alto total (px) " + altoTotal);
const margins = { left: 75, top: 40, right: 45, bottom: 50 }

const ancho = anchoTotal - margins.left - margins.right
const alto = altoTotal - margins.top - margins.bottom
const svg = histo
  .append("svg")
  .attr("width", anchoTotal)
  .attr("height", altoTotal)
  .attr("class", "figbarras")

const fondo = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

fondo
  .append("rect")
  .attr("x", "0")
  .attr("y", "0")
  .attr("width", ancho)
  .attr("height", alto)
  .attr("class", "grupobarras")

const g = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

const gDatos = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)
  
// Data
const load = async () => {
  data = await d3.csv("data/buquesHistoricosManiobrista.csv", d3.autoType)
  
    const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.BUQUES_OPERADOS)*1.1])
    .range([alto, 0])

    const x = d3
    .scaleBand()
    .domain(d3.map(data, (d) => d.MANIOBRISTA))
    .range([0, ancho])
    .paddingInner(0.2)
    .paddingOuter(0.1)

    // Ejes
    const xAxis = d3.axisBottom(x)
    const xAxisGroup = g
    .append("g")
    .attr("class", "ejesbarras")
    .attr("transform", `translate(0, ${alto})`)
    .call(xAxis)
    
    const yAxis = d3.axisLeft(y)
    const yAxisGroup = g
    .append("g")
    .attr("class", "ejesbarras")
    .call(yAxis)

    const rectVentas = gDatos
        .selectAll("rect")
        .data(data)
        .join(
        (enter) =>
            enter
            .append("rect")
            .attr("x", (d) => x(d.MANIOBRISTA))
            .attr("y", y(0))
            .attr("width", x.bandwidth() / 2)
            .attr("height", 0)
            .attr("fill", "green")
            .transition()
            .duration(2000)
            .attr("fill", "orange")
            .attr("y", (d) => y(d.BUQUES_OPERADOS))
            .attr("height", (d) => alto - y(d.BUQUES_OPERADOS))
            
        );
    const gLabels =   g.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text").text( (d)=> d.BUQUES_OPERADOS )    
            .attr("y", (d) => y(d.BUQUES_OPERADOS) -5 )
            .attr("x", (d) => x(d.MANIOBRISTA)+5 );
    
    renderTablaDatosBuquesXManiobrista(data);
         
}

// DEFINICIÓN DE LA FUNCIÓN
const renderTablaDatosBuquesXManiobrista = (data) => {
    const tabla = d3.select("#renglonesdatosbuquexmaniobrista");
    let registros = tabla.selectAll("body > #renglonesdatosbuquexmaniobrista > tr").data(data);
    registros.enter().append("tr").html( (d) => `<tr>
        <td scope="row">${d.MANIOBRISTA}</td>
        <td scope="row">${d.BUQUES_OPERADOS}</td>
      </tr>`)

} 

load();
