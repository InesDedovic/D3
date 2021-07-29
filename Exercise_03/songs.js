//d3.select('body').style('background-color', 'pink');
const topRockSongs = [
    { artist: "Fleetwod Mac", title: "Dreams", sales_and_streams: 1882000 },
    { artist: "AJR", title: "Bang!", sales_and_streams: 1627000 },
    { artist: "Imagine Dragons", title: "Believer", sales_and_streams: 1571000 },
    { artist: "Journey", title: "Don't Stop Believin'", sales_and_streams: 1497000 },
    { artist: "Eagles", title: "Hotel California", sales_and_streams: 1393000 }
 ];
 const topSongsSection = d3.select('#top-songs');

 topSongsSection
    .append('h3')
        .text('Top Rock Songs');

const circlesChartWidth = 600;
const circlesChartHeight = 130;
const marginTopBottom = 20;
const circlesChart = topSongsSection
           .append('svg')
              .attr('viewbox', [0, 0, circlesChartWidth, circlesChartHeight])
              .attr('width', circlesChartWidth)
              .attr('height', circlesChartHeight);

const circleChartMiddle = circlesChartHeight / 2;
circlesChart
    .append('line')
        .attr('x1', 0)
        .attr('y1', circleChartMiddle)
        .attr('x2', circlesChartWidth)
        .attr('y2', circleChartMiddle)
        .attr('stroke', '#333')
        .attr('stroke-width', 2);

const circlesChartGroup = 
    circlesChart.selectAll('g')
            .data(topRockSongs)
            .join('g');

const circlesScale = d3.scaleLinear()
            .domain([0, d3.max(topRockSongs, d => d.sales_and_streams)]) // In our data, the number of song-equivalent goes up to about 2,000,000
            .range([0, ((0.5*Math.min(circlesChartHeight - (4 * marginTopBottom), 
                            (circlesChartWidth / circlesChartGroup.size())))**2)*Math.PI]);

function calcXPos(i)
{
    if (circlesChartGroup.size() > 0)
    { 
        return ((i+0.5)*circlesChartWidth / circlesChartGroup.size()); 
    }
    else
    {
        return 0
    }  
}

circlesChartGroup
    .append('circle')
        .attr('cx', (d, i) => calcXPos(i))
        .attr('cy', circleChartMiddle)
        .attr('r', d => Math.sqrt(circlesScale(d.sales_and_streams)/Math.PI))
        .attr('fill', '#A78');

circlesChartGroup
        .append('text')
            .attr('x', (d, i) => calcXPos(i))
            .attr('y', marginTopBottom)
            .attr('text-anchor', 'middle')
            .text(d => d.artist)

circlesChartGroup
        .append('text')
            .attr('x', (d, i) => calcXPos(i))
            .attr('y', circlesChartHeight - marginTopBottom)
            .attr('text-anchor', 'middle')
            .text(d => d.title)
            .attr('font-size','0.6em')