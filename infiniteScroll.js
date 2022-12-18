async function setupInfiniteScroll() {
    // Get the window height and list element
    const windowHeight = window.innerHeight;
    const list = document.getElementById('albums-list');
  
    // Set up an event listener to load more albums when the user scrolls to the bottom of the page
    window.addEventListener('scroll', async () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        await getTopAlbums();
      }
    });
  }
  