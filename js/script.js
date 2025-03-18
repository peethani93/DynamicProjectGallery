const owner = 'peethani93';
const repo = 'DynamicProjectGallery';
const folder = 'projects';

async function loadProjectTitles() {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        const htmlFiles = data.filter(file => file.name.endsWith('.html'));

        const navbar = document.getElementById('navbar');
        navbar.innerHTML = '';

        htmlFiles.forEach((file, index) => {
            const taskNumber = index + 1;
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = `Task ${taskNumber}`;
            link.href = "#";
            link.addEventListener('click', (event) => {
                event.preventDefault();
                loadProjectContent(file.name, listItem);
            });

            listItem.appendChild(link);
            navbar.appendChild(listItem);
        });

    } catch (error) {
        console.error('Error fetching project files:', error);
        document.getElementById('navbar').innerHTML = '<li>Error loading projects</li>';
    }
}

async function loadProjectContent(project, selectedItem) {
    const contentDiv = document.getElementById('content');
    contentDiv.style.opacity = '0';

    try {
        const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${folder}/${project}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load content');

        const data = await response.text();

        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data;

        
        contentDiv.innerHTML = tempDiv.innerHTML;

        
        setTimeout(() => {
            contentDiv.style.opacity = '1';
        }, 200);

        
        executeScripts(tempDiv);

       
        document.querySelectorAll('#navbar li').forEach(li => li.classList.remove('active'));
        selectedItem.classList.add('active');

    } catch (err) {
        contentDiv.innerHTML = "<p>Sorry, there was an error loading the project.</p>";
    }
}


function executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach((script) => {
        const newScript = document.createElement('script');
        if (script.src) {
            newScript.src = script.src; 
            newScript.async = true; 
        } else {
            newScript.textContent = script.textContent;  
        }
        document.body.appendChild(newScript);
        document.body.removeChild(newScript); 
    });
}

// Initialize the page by loading project titles
loadProjectTitles();
