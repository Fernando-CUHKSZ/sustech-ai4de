// Function to draw the knowledge graph
function drawGraph(data) {
    d3.select('#graph-container').selectAll('*').remove(); // Clear previous graph

    const width = 960, height = 600;
    const svg = d3.select('#graph-container').append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(d3.zoom().on("zoom", function (event) {
            svg.attr("transform", event.transform);
        }))
        .append('g');

    // Define the tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Create links
    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("stroke-width", 2)
        .attr("stroke", "#999");

    // Create nodes
    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return d.type === "author" ? "#ffab00" : "#df65b0"; })
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Paper: " + d.id + "<br/>" + "Type: " + d.type)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add labels to nodes
    const labels = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(data.nodes)
        .enter().append("text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function(d) { return d.id; });

    // Update force simulation
    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    simulation
        .nodes(data.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(data.links);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        labels
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
    }
}

// Function to fetch data and initialize the graph
function initializeGraph(dataFile) {
    d3.json(dataFile).then(data => {
        drawGraph(data);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    const staticData = {
        "nodes": [
            {"id": "Paper1", "type": "paper"},
            {"id": "Author1", "type": "author"},
            {"id": "Keyword1", "type": "keyword"}
        ],
        "links": [
            {"source": "Paper1", "target": "Author1"},
            {"source": "Paper1", "target": "Keyword1"}
        ]
    };
    drawGraph(staticData);
    console.log('Static graph drawn');
});

async function fetchGraphData(scenario) {
    console.log('Fetching data for scenario:', scenario);
    try {
        const response = await fetch(`/api/data/${scenario}`);
        const data = await response.json();
        console.log('Fetched data:', data); // Log the data to verify
        drawGraph(data);
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

// Add event listeners to buttons
document.querySelectorAll('.x-dt-buttons button').forEach(button => {
    button.addEventListener('click', function() {
        const scenario = this.id.replace('-dt', '');
        fetchGraphData(scenario);
    });
});
