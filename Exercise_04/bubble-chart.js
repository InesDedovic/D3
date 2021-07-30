function createBubbleChart(data)
{
    const margin = {top: 40, right: 0, bottom: 60, left: 40};
    const width = 1160;
    const height = 380;
    const metrics = ['total_album_consumption_millions', 'album_sales_millions', 'song_sales', 'on_demand_audio_streams_millions', 'on_demand_video_streams_millions'];
    const artists = [];

    data.forEach(elem => {
        console.log(elem);
        metrics.forEach(metric => {
           elem[metric] = parseFloat(elem[metric]); // Convert strings to numbers
        });
        console.log("After change:");
        console.log(elem);
        artists.push(elem.artist); // Populate the artists array
     });

     const bubbleChart = d3.select('#bubble-chart');
     const bubbleChartSvg = bubbleChart.append('svg')
        .attr('viewbox', margin)
        .attr('width', width)
        .attr('height', height);

    const audioStreamsScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.on_demand_audio_streams_millions)])
                .range([margin.left, width - margin.right]);
    
    console.log(audioStreamsScale(100));
    bubbleChartSvg
        .append('g')
            .attr('width', width - margin.left - margin.right)
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(audioStreamsScale));
    
    bubbleChartSvg
        .append('text')
            .attr('x', margin.left + 2)
            .attr('y', height - margin.bottom - 5)
            .attr('text-anchor', 'left')
            .text('On-demand Audio Streams (millions)');

    const videoStreamsScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.on_demand_video_streams_millions)])
            .range([height - margin.bottom, margin.top]);

    bubbleChartSvg
        .append('g')
            .attr('height', height - margin.top - margin.bottom)
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(videoStreamsScale));
        
    bubbleChartSvg
        .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('text-anchor', 'left')
            .text('On-demand Video Streams (millions)')
            .attr('transform', `translate(${margin.top + 5}, ${margin.left}), rotate(90)`);

    const bubblesAreaScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.album_sales_millions)])
        .range([0, 3000])

    const colorScale = d3.scaleOrdinal()
        .range(d3.schemeTableau10)
        .domain(artists)

    const circlesBubbleGroup = 
            bubbleChartSvg.selectAll('.bubble')
                    .data(data)
                    .join('g');

    circlesBubbleGroup
            .append('circle')
                .attr('cx', d => audioStreamsScale(d.on_demand_audio_streams_millions))
                .attr('cy', d => videoStreamsScale(d.on_demand_video_streams_millions))
                .attr('r', d => Math.sqrt(bubblesAreaScale(d.album_sales_millions)/Math.PI))
                .attr('fill', d => colorScale(d.artist));
    
    const bubbleColorLegend = d3.select('.legend-color');
    const groupLegendColor = bubbleColorLegend.selectAll('li')
                                .data(data)
                                .join('li')
    
    groupLegendColor
            .append('span')
            .attr('style', d => `width: 15px; border-radius: 50%; 
            background-color: ${colorScale(d.artist)}`)
                    
    groupLegendColor
            .append('span')
            .text(d => d.artist)

    const   legendSizeWidth = 400;
    const   legendSizeHeight = 100;

    const   rad1_5M = Math.sqrt(bubblesAreaScale(1.5)/Math.PI);
    const   rad1_0M = Math.sqrt(bubblesAreaScale(1.0)/Math.PI);
    const   rad0_5M = Math.sqrt(bubblesAreaScale(0.5)/Math.PI);

    const legendSizeMargins = {top : 20, left: 20, bottom: 20, right: 200}
    const legendSizeSvg = d3.select('.legend-area')
                    .append('svg')
                    .attr('viewbox', legendSizeMargins)
                    .attr('width', legendSizeWidth)
                    .attr('height', legendSizeHeight);
    
    legendSizeSvg
        .append('circle')
        .attr('cx', rad1_5M + legendSizeMargins.left)
        .attr('cy', legendSizeHeight - rad1_5M - legendSizeMargins.bottom)
        .attr('r', rad1_5M)
        .attr('opacity', '0.4')
        .attr('stroke', 'black')
        .attr('stroke-width', '2')
        .style("stroke-dasharray", ("3, 3")) 
        .attr('fill', '#727a87');

    legendSizeSvg
        .append('circle')
        .attr('cx', rad1_5M + legendSizeMargins.left)
        .attr('cy', legendSizeHeight - rad1_0M - legendSizeMargins.bottom)
        .attr('r', rad1_0M)
        .attr('opacity', '0.4')
        .attr('stroke', 'black')
        .attr('stroke-width', '2')
        .style("stroke-dasharray", ("3, 3")) 
        .attr('fill', '#727a87');

    legendSizeSvg
        .append('circle')
        .attr('cx', rad1_5M + legendSizeMargins.left)
        .attr('cy', legendSizeHeight - rad0_5M - legendSizeMargins.bottom)
        .attr('r', rad0_5M)
        .attr('opacity', '0.4')
        .attr('stroke', 'black')
        .attr('stroke-width', '2')
        .style("stroke-dasharray", ("3, 3")) 
        .attr('fill', '#727a87');
    
    legendSizeSvg
        .append('line')
        .attr('x1', rad1_5M + legendSizeMargins.left)
        .attr('x2', legendSizeWidth - legendSizeMargins.left - legendSizeMargins.right)
        .attr('y1', legendSizeHeight - (2*rad1_5M) - legendSizeMargins.bottom)
        .attr('y2', legendSizeHeight - (2*rad1_5M) - legendSizeMargins.bottom)
        .attr('stroke', '#333')
        .attr('stroke-width', 2)
        .style("stroke-dasharray", ("5, 1"));
    
    legendSizeSvg
        .append('line')
        .attr('x1', rad1_5M + legendSizeMargins.left)
        .attr('x2', legendSizeWidth - legendSizeMargins.left - legendSizeMargins.right)
        .attr('y1', legendSizeHeight - (2*rad1_0M) - legendSizeMargins.bottom)
        .attr('y2', legendSizeHeight - (2*rad1_0M) - legendSizeMargins.bottom)
        .attr('stroke', '#333')
        .attr('stroke-width', 2)
        .style("stroke-dasharray", ("5, 1"));

    legendSizeSvg
        .append('line')
        .attr('x1', rad1_5M + legendSizeMargins.left)
        .attr('x2', legendSizeWidth - legendSizeMargins.left - legendSizeMargins.right)
        .attr('y1', legendSizeHeight - (2*rad0_5M) - legendSizeMargins.bottom)
        .attr('y2', legendSizeHeight - (2*rad0_5M) - legendSizeMargins.bottom)
        .attr('stroke', '#333')
        .attr('stroke-width', 2)
        .style("stroke-dasharray", ("5, 1"));

    legendSizeSvg
        .append('text')
        .attr('x', legendSizeWidth - legendSizeMargins.left - legendSizeMargins.right)
        .attr('y', legendSizeHeight - (2*rad1_5M) - legendSizeMargins.bottom)
        .text('1.5M')
    
    legendSizeSvg
        .append('text')
        .attr('x', legendSizeWidth - legendSizeMargins.left - legendSizeMargins.right)
        .attr('y', legendSizeHeight - (2*rad1_0M) - legendSizeMargins.bottom)
        .text('1.0M')

    legendSizeSvg
        .append('text')
        .attr('x', legendSizeWidth - legendSizeMargins.left - legendSizeMargins.right)
        .attr('y', legendSizeHeight - (2*rad0_5M) - legendSizeMargins.bottom)
        .text('0.5M')
}

d3.csv('data/top_albums.csv').then(data => {
    // Do something with data
    createBubbleChart(data);
 });

