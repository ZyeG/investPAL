let currentChart = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch of the report list
    refreshReportList();
});

async function refreshReportList() {
    const reportList = document.getElementById('report-list');
    const statusEl = document.getElementById('file-status');

    try {
        // Standard python http.server returns a directory listing as HTML when fetching a directory
        const response = await fetch('../output/');
        if (!response.ok) throw new Error("Could not list output/ folder.");
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract all .md file links
        const links = Array.from(doc.querySelectorAll('a'))
            .map(a => a.getAttribute('href'))
            .filter(href => href && href.endsWith('.md'))
            .sort((a, b) => b.localeCompare(a)); // Newest sounding first by filename

        if (links.length === 0) {
            reportList.innerHTML = '<li class="empty-msg">No reports found.</li>';
            return;
        }

        reportList.innerHTML = '';
        links.forEach(filename => {
            const li = document.createElement('li');
            li.textContent = filename.split('/').pop().replace(/%20/g, ' ');
            li.className = 'report-item';
            li.addEventListener('click', () => {
                fetchReport('../output/' + filename);
                document.querySelectorAll('#report-list li').forEach(el => el.classList.remove('active'));
                li.classList.add('active');
            });
            reportList.appendChild(li);
        });

        // Auto-load the newest one
        if (links[0]) {
            fetchReport('../output/' + links[0]);
            reportList.firstChild.classList.add('active');
        }

    } catch (error) {
        console.error("Auto-load failed, falling back to static check.", error);
        reportList.innerHTML = '<li class="empty-msg">Folder listing disabled. Add a report to output/.</li>';
    }
}

async function fetchReport(path) {
    const statusEl = document.getElementById('file-status');
    const filename = decodeURIComponent(path.split('/').pop());
    
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error("Failed to load report.");
        const markdown = await response.text();
        statusEl.textContent = `Viewing: ${filename}`;
        processMarkdown(markdown);
    } catch (e) {
        statusEl.textContent = "Error loading report: " + filename;
    }
}

function processMarkdown(markdown) {
    document.getElementById('welcome-state').classList.add('hidden');
    document.getElementById('report-view').classList.remove('hidden');

    const mdContainer = document.getElementById('markdown-container');
    mdContainer.innerHTML = marked.parse(markdown);

    buildTOC(mdContainer);
    attemptChartExtraction(markdown);
}

function buildTOC(container) {
    const toc = document.getElementById('toc');
    toc.innerHTML = '';

    const headers = container.querySelectorAll('h2, h3');
    
    if (headers.length === 0) {
        toc.innerHTML = '<li class="empty-msg">No sections found.</li>';
        return;
    }

    headers.forEach((header, index) => {
        const id = `section-${index}`;
        header.id = id;

        const li = document.createElement('li');
        li.textContent = header.textContent;
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
        chartSection.classList.remove('hidden');
        renderPieChart(labels, data);
    } else {
        chartSection.classList.add('hidden');
    }
}

function renderPieChart(labels, data) {
    const ctx = document.getElementById('extractedChart').getContext('2d');
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
                backgroundColor: ['#58a6ff', '#3fb950', '#d29922', '#f85149', '#a371f7', '#8b949e'],
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
