let currentChart = null;

document.addEventListener('DOMContentLoaded', () => {
    // Automatically fetch the latest report on load
    autoLoadLatest();
});

async function autoLoadLatest() {
    const statusEl = document.getElementById('file-status');
    
    // Check for the most specific file names produced by the tools
    const targets = [
        '../output/latest-report.md',
        '../output/quick-portfolio-output.md',
        '../output/backtest-output.md',
        '../output/sample.md'
    ];

    for (const path of targets) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const rawMarkdown = await response.text();
                statusEl.textContent = `Viewing: ${path.split('/').pop()}`;
                processMarkdown(rawMarkdown);
                return; // Stop at the first one found
            }
        } catch (e) {
            console.error(`Skipping ${path}`);
        }
    }
    
    statusEl.textContent = "No reports found in output/";
}

function processMarkdown(markdown) {
    // Hide welcome state, show report view
    document.getElementById('welcome-state').classList.add('hidden');
    document.getElementById('report-view').classList.remove('hidden');

    // 1. Render Markdown to HTML 
    const mdContainer = document.getElementById('markdown-container');
    mdContainer.innerHTML = marked.parse(markdown);

    // 2. Build Table of Contents (Sections)
    buildTOC(mdContainer);

    // 3. Extract data for charts
    attemptChartExtraction(markdown);
}

function buildTOC(container) {
    const toc = document.getElementById('toc');
    toc.innerHTML = ''; // clear

    // Find all H2 and H3 elements
    const headers = container.querySelectorAll('h2, h3');
    
    if (headers.length === 0) {
        toc.innerHTML = '<li class="empty-msg">No sections found.</li>';
        return;
    }

    headers.forEach((header, index) => {
        // Assign an ID so we can scroll to it
        const id = `section-${index}`;
        header.id = id;

        const li = document.createElement('li');
        li.textContent = header.textContent;
        // Indent H3s
        if (header.tagName.toLowerCase() === 'h3') {
            li.style.paddingLeft = '1rem';
            li.style.fontSize = '0.9em';
        }

        li.addEventListener('click', () => {
            header.scrollIntoView({ behavior: 'smooth' });
        });

        toc.appendChild(li);
    });
}

function attemptChartExtraction(markdown) {
    // Generic regex for matching "- Label: XX%" in any markdown context.
    const regex = /-\s+([a-zA-Z\s]+):\s+(\d+(?:\.\d+)?)%/g;
    
    let match;
    const labels = [];
    const data = [];

    while ((match = regex.exec(markdown)) !== null) {
        labels.push(match[1].trim());
        data.push(parseFloat(match[2]));
    }

    const chartSection = document.getElementById('chart-section');

    if (labels.length > 0 && data.length > 0) {
        // Show chart section
        chartSection.classList.remove('hidden');
        renderPieChart(labels, data);
    } else {
        // Hide if no data found
        chartSection.classList.add('hidden');
    }
}

function renderPieChart(labels, data) {
    const ctx = document.getElementById('extractedChart').getContext('2d');

    // Destroy existing chart to prevent overlap
    if (currentChart) {
        currentChart.destroy();
    }

    currentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Allocation (%)',
                data: data,
                backgroundColor: [
                    '#58a6ff', // blue
                    '#3fb950', // green
                    '#d29922', // orange/yellow
                    '#f85149', // red
                    '#a371f7', // purple
                    '#8b949e', // grey
                ],
                borderColor: '#0d1117',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#c9d1d9' }
                }
            }
        }
    });
}