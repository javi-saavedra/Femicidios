
async function glifo(height, width) {
  const data = await d3.dsv('#', "../dataset/femicidios.csv")

  const opciones = ['Todos', '2020', '2019', '2018', '2017', '2016', '2015', '2014']
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(opciones)
    .enter()
    .append('option')
    .text(function (d) { return d; }) 
    .attr("value", function (d) { return d; }) 
    .attr("class", "items")


  const svg = d3.select("#graph")
    .append("svg")
      .attr("height", height)
      .attr("width", width)
      .attr("id", "svg-glifo");
  
  MAX = 100;
  RADIO = 300;
  CENTERX = 400;
  CENTERY = 350; 

  const leyendas = ['Ex cónyuge', 'Familiar', 'Cónyuge', 'Ex pareja', 
  'Conviviente', 'Pareja', 'Ex conviviente', 'Conocido', 
  'Desconocido', 'Amigo', 'Se investiga']

  const x = d3
    .scaleLinear()
    .domain([1, MAX])
    .range([85, RADIO]);

  const contenedorCircle = svg
    .append("g")
    .attr("transform", `translate(${CENTERX}, ${CENTERY})`)
  
  let rScale = d3.scaleLinear()
    .range([0, 360])
    .domain([0, data.length-1]);

  let ticks = [10,20,30,40,50,60,70,80,90,100];
  ticks.forEach(t =>
    contenedorCircle.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("fill", "none")
    .attr("stroke", "#B2B9B8")
    .attr("stroke-width", "0.3px")
    .attr('stroke-dasharray', '10,5')
    .attr("r", x(t))
  );

  
  let yAxis2 = contenedorCircle
    .append("g")

  ticks.forEach(t =>
    contenedorCircle.append("text")
    .attr("x", 5)
    .attr("y", -2 - x(t))
    .text(t.toString())
    .attr("fill", "white")
  );
  
  contenedorCircle.append("text")
    .attr('x', -15)
    .attr('y', -x(100)-25)
    .text('Edad')
    .attr("fill", "white")

  let yAxis3 = contenedorCircle
    .append("g")
    .attr("transform", "rotate(90)")
    .attr("id", "axis3")

  let yTick3 = yAxis3
  .selectAll("g")
  .data(data)
  .enter().append("g");

  yTick3.append("line")
  .attr("transform", function(d,i) { return `rotate( ${-rScale(i)} )`; }) // 
  .attr("stroke", function(d, i){ return color_point(d);} )
  .attr("class", `linegraph`)
  .transition()
    .duration(2000)
    .attr("x2", function(d,i){ return x(d.Edad); })
    .delay(function(d,i){ return i * (2000 / 417); })
  
  const circles = contenedorCircle
  .append("g")
  .attr("transform", "rotate(90)")


  let chart = circles
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("fill", function(d, i){ return color_point(d) })
      .attr("class", `circlegraph`)
      .attr("r", 4)
      .attr("transform", function(d,i) { return `rotate( ${ -rScale(i)} )`; })
      .on("mouseover", (event, d) => {
        let indice = null;

        d3.selectAll('.circlegraph')
          .style('opacity', (e, j) => {
            if (e['Relación víctima-femicida'] != d['Relación víctima-femicida']) {
              return 0
            } 

            if (e['Nombre víctima'] == d['Nombre víctima']) {
              indice = j;
            } 
          })
          .attr('r', (e, j) => {
            if (e['Relación víctima-femicida'] == d['Relación víctima-femicida']) {
              return 6
            } else {
              return 4
            }
          });

        d3.selectAll('.linegraph')
          .style('opacity', 0)
        d3.select('#name')
          .text(`Nombre: ${d['Nombre víctima']}`)
        d3.select('#fecha')
          .text(`Fecha: ${d['Fecha']}`)
        d3.select('#edad')
          .text(`Edad: ${d['Edad']} años`)
        d3.select('#lugar')
          .text(`Lugar: ${d['Lugar']}, ${d['Región']}`)
        d3.select('#femicida')
          .text(`Femicida: ${d['Nombre femicida']}`)
        d3.select('#violencia')
          .text(`Violencia Sexual: ${d['Violencia sexual']}`)
        d3.select('#Información')
          .text(`Información: ${d['Información sobre el hecho']}`)
        
        if (d['Link'].includes('http')) {
          d3.select('#Link')
            .attr('href', `${d['Link']}`)
        } else {
          d3.select('#Link')
            .attr('href', `#`)
        }

        d3.selectAll('#text-legend')
          .attr('text-decoration', (e, j) => {
            if (d['Relación víctima-femicida'] == leyendas[e]) {
              return 'underline'

            } else {
              return 'none'
            }
          })
      })
      .on("mouseout", (event, d) => {
        d3.selectAll('.circlegraph')
          .style('opacity', 1)
          .attr('r', 4);
        d3.selectAll('.linegraph')
          .style('opacity', 1)
        d3.selectAll('#text-legend')
          .attr('text-decoration', 'none')
      })
      .transition()
        .duration(2000)
        .attr("cx", function(d,i){ return x(d.Edad) })
        .delay(function(d,i){ return i * (2000 / 417); })
      
  let circle = contenedorCircle
    .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 80)
      .attr("fill", "black") //#270061
      .attr("stroke", "#B2B9B8")
  
  let resultado = violencia_sexual(data);
  let ticksYdetalle = resultado.map((d) => parseInt(d[1]))
  let maximo = Math.max(...ticksYdetalle);

  const HEIGHT_DETALLE = 270
  const WIDTH_DETALLE = 430

  const svgDetalle = d3
    .select("#detalle")
    .append("svg")
    .attr("width", WIDTH_DETALLE)
    .attr("height", HEIGHT_DETALLE);
  
  svgDetalle
    .append("text")
      .attr("transform", `translate(25, 20)`)
      .text("Cantidad de mujeres que sufrieron Violencia Sexual previo al femicidio")
      .attr("id", 'text-legend')
      .attr("fill", "white")

  const escalaYDetalle = d3
    .scaleLinear()
    .domain([0, maximo+10])
    .range([HEIGHT_DETALLE-50, 0]);
  
  const escalaAltura = d3
    .scaleLinear()
    .domain([0, maximo+10])
    .range([0, HEIGHT_DETALLE-50]);
  
  const ejeYDetalle = d3.axisLeft(escalaYDetalle);
  
  const contenedorEjeYDetalle = svgDetalle
    .append("g")
    .attr("transform", `translate(${50}, ${30})`)
    .call(ejeYDetalle);
  
  const escalaXDetalle = d3
    .scaleOrdinal()
    .domain(["Sí", "No", "No hay información", "Presunta"])
    .range([0, 90, 180, 270]);
  
  const ejeXDetalle = d3.axisBottom(escalaXDetalle);
  
  const contenedorEjeXDetalle = svgDetalle
    .append("g")
    .attr("transform", `translate(${50}, ${HEIGHT_DETALLE - 20})`)
    .call(ejeXDetalle);
  
  contenedorEjeYDetalle.selectAll("text")
    .attr("fill", "white")

  contenedorEjeXDetalle.selectAll("text")
    .attr("fill", "white")
    .attr("transform", `translate(45,0)`)
  
  const contenedorBarrasVertical = svgDetalle
    .append("g")
    .attr("transform", `translate(${50} ${30})`);

  contenedorBarrasVertical
    .selectAll("rect")
    .data(resultado)
    .join("rect")
      .attr("width", 85)
      .attr("height", (d) => `${escalaAltura(d[1])}`)
      .attr("x", (d) => escalaXDetalle(d[0]))
      .attr("y", (d) => escalaYDetalle(d[1]))
      .attr("stroke", "white")
      .attr("fill", "white");

  contenedorEjeXDetalle.call(d3.axisBottom(escalaXDetalle));
  contenedorEjeYDetalle.call(d3.axisLeft(escalaYDetalle));
  
  const ticksLeyendas = [20-12, 110-25, 180-35, 255-40, 330-40, 425-50, 480-50, 590-60, 670-70, 770-85, 730]
  
  const colors = {
    'Ex cónyuge': '#FEE266', 
    'Familiar': '#E34229', 
    'Cónyuge': '#E86F96', 
    'Ex pareja': '#6AD7C8', 
    'Conviviente': '#207CC0',
    'Pareja': '#C02094', 
    'Ex conviviente': '#F78038', 
    'Conocido': '#3838F7', 
    'Desconocido': '#ffd9da', 
    'Amigo': '#9a48d0',
    'Se investiga': '#07AA18'
  }

  const contenedorLeyendas = svg.append('g')
  
  contenedorLeyendas
    .selectAll("text")
    .data(d3.range(0, 11, 1))
    .enter()
      .append("text")
      .text(function(d){ return leyendas[d] })
      .attr('x', function(d, i){ return `${ticksLeyendas[d]}` })
      .attr('y', '680')
      .attr('id', 'text-legend')
      .attr('fill', function(d) {return colors[leyendas[d]]})

  d3.select("#selectButton").on("change", function(d) {
    let selectedOption = d3.select(this).property("value")
    update(selectedOption)
  })

  function color_point(row) {
    const colors = {
      'Ex cónyuge': '#FEE266', 
      'Familiar': '#E34229', 
      'Cónyuge': '#E86F96', 
      'Ex pareja': '#6AD7C8', 
      'Conviviente': '#207CC0',
      'Pareja': '#C02094', 
      'Ex conviviente': '#F78038', 
      'Conocido': '#3838F7', 
      'Desconocido': '#ffd9da', 
      'Amigo': '#9a48d0',
      'Se investiga': '#07AA18'
    }

    return colors[row['Relación víctima-femicida']]
      
  }

  function violencia_sexual(data) {
    const resp_si = data.filter(function(d){return d['Violencia sexual'] == "Sí";})
    const resp_no = data.filter(function(d){return d['Violencia sexual'] == "No";})
    const resp_ni = data.filter(function(d){return d['Violencia sexual'] == "No hay información";})
    const resp_pres = data.filter(function(d){return d['Violencia sexual'] == "Presunta";})

    let result = [["Sí", resp_si.length], 
      ["No", resp_no.length], 
      ["No hay información", resp_ni.length], 
      ["Presunta", resp_pres.length]];
    return result;
  }

  function update(selectedGroup) {
    let dataFilter = data.filter(function(d){return d['Año'] == selectedGroup;})

    if (dataFilter.length == 0){
      dataFilter = data;
    }
    let resultadoUpdate = violencia_sexual(dataFilter);
    let ticksYdetalleUpdate = resultadoUpdate.map((d) => parseInt(d[1]))
    let maximoUpdate = Math.max(...ticksYdetalleUpdate);
    escalaYDetalle.domain([0, maximoUpdate+10]);
    escalaAltura.domain([0, maximoUpdate+10]);
    contenedorEjeYDetalle.call(d3.axisLeft(escalaYDetalle));

    contenedorBarrasVertical
      .selectAll("rect")
      .data(resultadoUpdate)
      .join("rect")
        .attr("width", 85)
        .attr("x", (d) => escalaXDetalle(d[0]))
        .attr("stroke", "white")
        .attr("fill", "white")
        .transition()
          .duration(1000)
            .attr("y", (d) => escalaYDetalle(d[1]))
            .attr("height", (d) => `${escalaAltura(d[1])}`)

    rScale = d3.scaleLinear()
      .range([0, 360])
      .domain([0, dataFilter.length]);

    let updatedVal = yAxis3.selectAll("g").data([]);
    updatedVal.exit().remove()

    let updatedVal2 = yTick3.selectAll("line").data([]);
    updatedVal2.exit().remove()

    let updatedVal3 = circles.selectAll("circle").data([]);
    updatedVal3.exit().remove()

    yTick3 = yAxis3
      .selectAll("g")
      .data(dataFilter)
      .enter().append("g");
        
    yTick3.append("line")
      .attr("transform", function(d,i) { return `rotate( ${-rScale(i)} )`; }) // 
      .attr("stroke", function(d, i){ return color_point(d);} )
      .attr("class", `linegraph`)
      .transition()
        .duration(2000)
        .attr("x2", function(d,i){ return x(d.Edad); })
        .delay(function(d,i){ return i * (2000 / dataFilter.length); })

    chart = circles
    .selectAll("circle")
    .data(dataFilter)
    .enter()
    .append('circle')
      .attr("fill", function(d, i){ return color_point(d) })
      .attr("class", `circlegraph`)
      .attr("r", 4)
      .attr("transform", function(d,i) { return `rotate( ${ -rScale(i)} )`; })
      .on("mouseover", (event, d) => {
        let indice = null;

        d3.selectAll('.circlegraph')
          .style('opacity', (e, j) => {
            if (e['Relación víctima-femicida'] != d['Relación víctima-femicida']) {
              return 0
            } 

            if (e['Nombre víctima'] == d['Nombre víctima']) {
              indice = j;
            } 
          })
          .attr('r', (e, j) => {
            if (e['Relación víctima-femicida'] == d['Relación víctima-femicida']) {
              return 6
            } else {
              return 4
            }
          });
        d3.selectAll('.linegraph')
          .style('opacity', 0)
        d3.select('#name')
          .text(`Nombre: ${d['Nombre víctima']}`)
        d3.select('#fecha')
          .text(`Fecha: ${d['Fecha']}`)
        d3.select('#edad')
          .text(`Edad: ${d['Edad']} años`)
        d3.select('#lugar')
          .text(`Lugar: ${d['Lugar']}, ${d['Región']}`)
        d3.select('#femicida')
          .text(`Femicida: ${d['Nombre femicida']}`)
        d3.select('#violencia')
          .text(`Violencia Sexual: ${d['Violencia sexual']}`)
        d3.select('#Información')
          .text(`Información: ${d['Información sobre el hecho']}`)
        

        if (d['Link'].includes('http')) {
          d3.select('#Link')
            .attr('href', `${d['Link']}`)
        } else {
          d3.select('#Link')
            .attr('href', `#`)
        }

        d3.selectAll('#text-legend')
          .attr('text-decoration', (e, j) => {
            if (d['Relación víctima-femicida'] == leyendas[e]) {
              return 'underline'

            } else {
              return 'none'
            }
          })

      })
      .on("mouseout", (event, d) => {
        d3.selectAll('.circlegraph')
          .style('opacity', 1)
          .attr('r', 4);
        d3.selectAll('.linegraph')
          .style('opacity', 1)
        d3.selectAll('#text-legend')
          .attr('text-decoration', 'none')
      })
      .transition()
        .duration(2000)
        .attr("cx", function(d,i){ return x(d.Edad) })
        .delay(function(d,i){ return i * (2000 / dataFilter.length); })

    
  }

}

const WIDTH = 800;
const HEIGHT = 700;
glifo(HEIGHT, WIDTH);