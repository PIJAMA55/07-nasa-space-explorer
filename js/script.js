// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const apiKey = `6ueVy1OIvUIv9cSyYVmdYHcSxXw3RNQsxa5264dn`;
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;


// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Get the gallery container and the button
const gallery = document.getElementById('gallery');
const getImagesButton = document.querySelector('button');

// Function to create and show the modal
function showModal(image) {
  // Create the modal background
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  // Create the modal content
  const modal = document.createElement('div');
  modal.className = 'modal';

  // Set the modal inner HTML with image, title, date, and explanation
  modal.innerHTML = `
    <button class="modal-close" aria-label="Close modal">&times;</button>
    <img src="${image.hdurl || image.url}" alt="${image.title}" class="modal-img" />
    <h2>${image.title}</h2>
    <p class="modal-date">${image.date}</p>
    <p class="modal-explanation">${image.explanation}</p>
  `;

  // Add modal to overlay
  modalOverlay.appendChild(modal);

  // Add overlay to the body
  document.body.appendChild(modalOverlay);

  // Close modal when clicking the close button
  const closeButton = modal.querySelector('.modal-close');
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modalOverlay);
  });

  // Close modal when clicking outside the modal content
  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });
}

// This function creates and displays the gallery of images
function displayGallery(images) {
  // Clear the gallery first
  gallery.innerHTML = '';

  // If there are no images, show a message
  if (!images || images.length === 0) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🔭</div>
        <p>No images found for this date range.</p>
      </div>
    `;
    return;
  }

  // Loop through each image and create a gallery item
  images.forEach(image => {
    // Only show images (not videos)
    if (image.media_type === 'image') {
      // Create a div for the gallery item
      const item = document.createElement('div');
      item.className = 'gallery-item';

      // Set the inner HTML with image, title, and date
      item.innerHTML = `
        <img src="${image.url}" alt="${image.title}" />
        <h3>${image.title}</h3>
        <p>${image.date}</p>
      `;

      // Add click event to open modal
      item.addEventListener('click', () => {
        showModal(image);
      });

      // Add the item to the gallery
      gallery.appendChild(item);
    }
  });
}

// This function fetches images from the NASA API for the selected date range
async function fetchImages(startDate, endDate) {
  // Show a loading message in the gallery
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔄</div>
      <p>Loading space photos…</p>
    </div>
  `;

  // Build the API URL with start and end dates
  const url = `${apiURL}&start_date=${startDate}&end_date=${endDate}`;

  try {
    // Fetch data from the API
    const response = await fetch(url);
    const data = await response.json();

    // If only one image is returned, put it in an array
    const images = Array.isArray(data) ? data : [data];

    // Display the images in the gallery
    displayGallery(images);
  } catch (error) {
    // Show an error message in the gallery
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🚨</div>
        <p>Error fetching images. Please try again.</p>
      </div>
    `;
    console.error('Error fetching images:', error);
  }
}

// When the button is clicked, get the selected dates and fetch images
getImagesButton.addEventListener('click', () => {
  // Get the values from the date inputs
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Only fetch if both dates are selected
  if (startDate && endDate) {
    fetchImages(startDate, endDate);
  }
});

// Initial fetch to display the image of the day
async function fetchImageOfTheDay() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching image of the day:', error);
  }
}

fetchImageOfTheDay();
