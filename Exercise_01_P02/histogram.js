const margin = {top: 30, right: 20, bottom: 50, left: 60};
const width = 1200;
const height = 600;
const padding = 1;
const color = 'steelblue';

console.log('this loaded')

function createHistogram(array_vals)
{
    var bin_func = d3.bin();
    return bin_func(array_vals);
}

const tennisData = d3.csv('data/pay_by_gender_tennis.csv')
    .then( data => {
        
        var earning_array = []
        data.forEach(element => {
            console.log(element)
            var earn_val_str = element.earnings_USD_2019
            earn_val_str = earn_val_str.replaceAll(',', '')
            earning_array.push(parseFloat(earn_val_str)) 
            });
        const earning_bins = createHistogram(earning_array)
        console.log(earning_bins)  

        const earningChartSvg = d3.select('#viz')
            .append('svg')
                .attr('viewbox', margin)
                .attr('width', width)
                .attr('height', height);

        const earnTennisPlayerScale = d3.scaleLinear()
            .domain([d3.min(earning_array), d3.max(earning_array)])
            .range([margin.left, width - margin.right]);
        
        const earnTennisBinsScale = d3.scaleLinear()
            .domain([0, d3.max(earning_bins, d => d.length)])
            .range([height - margin.bottom, margin.top]);

        earningChartSvg
            .append('g')
                .attr('width', width - margin.left - margin.right)
                .attr('transform', `translate(0, ${height - margin.bottom})`)
                .call(d3.axisBottom(earnTennisPlayerScale));
       
        earningChartSvg
            .append('text')
                .attr('x', margin.left + 2)
                .attr('y', height - margin.bottom - 5)
                .attr('text-anchor', 'left')
                .text('Earnings by tennis players');

        earningChartSvg
            .append('g')
            .attr('height', height - margin.top - margin.bottom)
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(earnTennisBinsScale));
    
        earningChartSvg
            .append('text')
                .attr('x', 0)
                .attr('y', 0)
                .attr('text-anchor', 'left')
                .text('Number of data points')
                .attr('transform', `translate(${margin.top + 5}, ${margin.left}), rotate(90)`);
        
        const earnRectBins = earningChartSvg.selectAll('rect')
                        .data(earning_bins)
                        .join('rect')
                            .attr('x', (d, i) => {
                                console.log(d)
                                return padding + margin.left +
                                    + (i*(earnTennisPlayerScale(d3.max(earning_array)) 
                                    - earnTennisPlayerScale(d3.min(earning_array)))/ 
                                    earning_bins.length)
                                })
                            .attr('y', d=> earnTennisBinsScale(d.length))
                            .attr('width', -2*padding + (earnTennisPlayerScale(d3.max(earning_array)) 
                                        - earnTennisPlayerScale(d3.min(earning_array)))/ 
                                        earning_bins.length)
                            .attr('height', d => {
                                console.log(earnTennisBinsScale(d.length));
                                return height - earnTennisBinsScale(d.length) 
                                            - margin.bottom;
                                })
                            .attr('fill', '#657')
        
        var earnInterpLine = d3.line()
                                .x((d, i) => margin.left +
                                    + ((i+0.5)*(earnTennisPlayerScale(d3.max(earning_array)) 
                                    - earnTennisPlayerScale(d3.min(earning_array)))/ 
                                    earning_bins.length))
                                .y(d => earnTennisBinsScale(d.length))
                                .curve(d3.curveCatmullRom)
        earningChartSvg
            .append('path')
            .attr('d', earnInterpLine(earning_bins))
            .attr('fill', 'none')
            .attr('stroke', '#ff88aa')
            .attr('stroke-width', 2)
        
        var earnInterpArea = d3.area()
                .x((d, i) => margin.left +
                    + ((i+0.5)*(earnTennisPlayerScale(d3.max(earning_array)) 
                    - earnTennisPlayerScale(d3.min(earning_array)))/ 
                    earning_bins.length))
                .y0(height-margin.bottom)
                .y1(d => earnTennisBinsScale(d.length))
                .curve(d3.curveCatmullRom)       
                
        earningChartSvg
            .append('path')
            .attr('d', earnInterpArea(earning_bins))
            .attr('fill', '#88ddaa')
            .attr('stroke', 'none') 
            .attr('fill-opacity', 0.5)                     
    }
    );
