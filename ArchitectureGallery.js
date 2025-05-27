const client = supabase.createClient(
  'https://wljyuchpddhobtvkitgs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsanl1Y2hwZGRob2J0dmtpdGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NTU2ODcsImV4cCI6MjA2MzEzMTY4N30.rgiNqBnDYRqGQBSbRlin1AGIcUyCJJRhjDnD-8U7dXw'
);

async function uploadImage() {
  const fileInput = document.getElementById('fileInput');
  const titleInput = document.getElementById('titleInput');
  const categories = document.getElementById('category');
  const file = fileInput.files[0];
  const title = titleInput.value.trim();
  const category = categories.value;

  if (!file || !title) {
    alert('Please select an image and enter a title');
    return;
  }

  const filepath = `${category}/${Date.now()}_${file.name}`;

  // Upload to storage
  const { data: uploadData, error: uploadError } = await client.storage
    .from('image')
    .upload(filepath, file);

  if (uploadError) {
    console.error('Upload error:', uploadError.message);
    alert('Failed to upload image.');
    return;
  }

  // Get public URL
  const { data: publicUrlData } = client.storage
    .from('image')
    .getPublicUrl(filepath);

  // Insert to database
  const { error: insertError } = await client
    .from('gallery') // Ensure this matches your table name
    .insert([{ title: title, image_url: publicUrlData.publicUrl }]);

  if (insertError) {
    console.error('Database insert error:', insertError.message);
    alert('Failed to save image information.');
    return;
  }

  fileInput.value = '';
  titleInput.value = '';
  await fetchGallery(); // Refresh the gallery
}

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
      galleryDiv.innerHTML = '<p>No images found in gallery</p>';
      return;
    }

    // In your fetchGallery() function
images.forEach(image => {
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.display = 'inline-block';
    container.style.margin = '10px';
  

    // Lightbox anchor
    const anchor = document.createElement('a');
    anchor.href = image.image_url;
    anchor.setAttribute('data-fslightbox', 'gallery');
    anchor.setAttribute('data-caption', image.title);
    anchor.style.position='relative';

    // Image element
    const imgElement = document.createElement('img');
    imgElement.src = image.image_url;
    imgElement.style.width = '150px';
    imgElement.style.background = '#eaffff';

    // Delete button (keep previous implementation)
    const deleteBtn = document.createElement('button');
    
    // ... (your existing delete button code)

    // Assemble elements
    anchor.appendChild(imgElement);
    container.appendChild(anchor);
    container.appendChild(deleteBtn);
    galleryDiv.appendChild(container);
});

// Initialize lightbox after images load
if (window.refreshFsLightbox) {
    window.refreshFsLightbox();
}
    
  } catch (error) {
    console.error('Full Error:', JSON.stringify(error, null, 2));
    galleryDiv.innerHTML = `<p style="color: red">Error: ${error.message}</p>`;
  } finally {
    hideSpinner();
  }
}

window.onload = fetchGallery;


// Spinner functions (make sure these exist)

function hideSpinner() {
    document.getElementById('spinner').style.display='none';
}