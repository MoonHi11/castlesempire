const client = supabase.createClient(
  'https://wljyuchpddhobtvkitgs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsanl1Y2hwZGRob2J0dmtpdGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NTU2ODcsImV4cCI6MjA2MzEzMTY4N30.rgiNqBnDYRqGQBSbRlin1AGIcUyCJJRhjDnD-8U7dXw'
);

async function fetchGallery() {
const galleryDiv = document.getElementById('gallery');

try {
    const { data: images, error } = await client
      .from('Gallery')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      throw new Error(`Supabase Error: ${error.message}`);
    }

    galleryDiv.innerHTML = '';
    
    if (images.length === 0) {
      galleryDiv.innerHTML = '<p style="text-align:center;">No images found in gallery</p>';
      return;
    }
    
      // In your fetchGallery() function
images.forEach(image => {
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.display = 'inline-block';
    container.style.margin = '10px';
  
      // Image element
    const imgElement = document.createElement('img');
    imgElement.src = image.image_url;
    imgElement.style.width = '150px';
    imgElement.style.background = '#eaffff';
    
    // Lightbox anchor
    const anchor = document.createElement('a');
    anchor.href = image.image_url;
    anchor.setAttribute('data-fslightbox', 'gallery');
    anchor.setAttribute('data-caption', image.title);
    
    // Assemble elements
    anchor.appendChild(imgElement);
    container.appendChild(anchor);
  //  container.appendChild(deleteBtn);
    galleryDiv.appendChild(container);
        });
        // Initialize lightbox after images load
if (window.refreshFsLightbox) {
    window.refreshFsLightbox();
}
    }
catch (error) {
    console.error('Full Error:', JSON.stringify(error, null, 2));
    galleryDiv.innerHTML = `<p style="color: red ; font-size:13px;">Error: ${error.message}</p>`;
  } 
finally {
    hideSpinner();
  }
}


window.onload = fetchGallery;


function hideSpinner() {
    document.getElementById('spinner').style.display='none';
}