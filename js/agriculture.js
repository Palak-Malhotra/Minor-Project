document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dataForm');
    const dataContainer = document.getElementById('data-container');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;
        const date = document.getElementById('date').value;

        // Fetch data from NASA API
        const apiKey = 'Az3BdNTjcMbtFFZCzbxmG1oj3wu5e0U7RG1wiFW6';
        const apiUrl = `https://api.nasa.gov/planetary/earth/assets?lon=${longitude}&lat=${latitude}&dim=0.1&date=${date}&api_key=${apiKey}`;

        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.url) {
                const content = `
                    <h2>NASA Earth Data</h2>
                    <p>Date: ${data.date}</p>
                    <img src="${data.url}" alt="NASA Earth Image" style="max-width: 100%; height: auto;">
                `;
                dataContainer.innerHTML = content;
            } else {
                dataContainer.innerHTML = `<p>No data available for the selected date and location.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            dataContainer.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        });

    });
});
