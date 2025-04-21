
document.getElementById('searchBtn').addEventListener('click', async () => {
  const keyword = document.getElementById('keyword').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = 'Loading...';

  try {
    const res = await fetch(\`http://localhost:3000/api/scrape?keyword=\${encodeURIComponent(keyword)}\`);
    const data = await res.json();

    if (data.error) {
      resultsDiv.innerHTML = `<p>Error: \${data.error}</p>`;
      return;
    }

    resultsDiv.innerHTML = data.results.map(p => `
      <div class="product">
        <h2>\${p.title}</h2>
        <img src="\${p.image}" width="150" />
        <p>⭐ \${p.rating}</p>
        <p>Reviews: \${p.reviews}</p>
      </div>
    `).join('');
  } catch (err) {
    resultsDiv.innerHTML = '<p>Failed to fetch data. Please try again later.</p>';
    console.error(err);
  }
});
