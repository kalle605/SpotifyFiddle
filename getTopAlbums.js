let accessToken = null;
let offset = 0;

let allAlbums = [];
let allArtists = [];

async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data_1 = await response.json();

    accessToken = data_1.access_token;
}

async function getTopAlbums() {
    // Show the loading indicator
    document.getElementById('loading-indicator').style.display = 'block';

    return getAccessToken()
        .then(async () => {
            // Get the top 50 albums
            try {
                const response = await fetch(`https://api.spotify.com/v1/search?q=type&Dalbum&type=track&Calbum&market=ES&limit=50&offset=${offset}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    }
                });
                const data = await response.json();
                // Get the list element
                const list = document.getElementById('albums-list');

                // Add the name of each album and its artists to the list
                data.tracks.items.forEach(track => {
                    allAlbums.push(track.album.name);
                    
                    // Create an anchor element for the album name
                    const albumLink = document.createElement('a');
                    albumLink.textContent = track.album.name;
                    albumLink.href = track.album.external_urls.spotify;
                    albumLink.target = '_blank';

                    // Create a div element to hold the album name and release date
                    const albumDiv = document.createElement('div');
                    albumDiv.appendChild(albumLink);

                    // Add the release date to the div element
                    const releaseDate = document.createElement('p');
                    releaseDate.textContent = track.album.release_date;
                    albumDiv.appendChild(releaseDate);

                    // Add the album div element and the list of artists to the list item
                    const albumItem = document.createElement('li');
                    albumItem.appendChild(albumDiv);

                    const artistsList = document.createElement('ul');
                    track.artists.forEach(artist => {
                        const artistItem = document.createElement('li');
                        artistItem.textContent = artist.name;
                        artistsList.appendChild(artistItem);
                        allArtists.push(artist.name);
                    });
                    albumItem.appendChild(artistsList);

                    // Set the background image for the album
                    albumItem.style.backgroundImage = `url(${track.album.images[0].url})`;

                    // Add the list item to the list
                    list.appendChild(albumItem);
                });

                // Increment the offset
                offset += 50;

                const footer = document.getElementById('footer');
                footer.textContent = `Total albums: ${allAlbums.length} | Different artists: ${allArtists.length}`;

                // Hide the loading indicator
                document.getElementById('loading-indicator').style.display = 'none';
            } catch (error) {
                console.error(error);
            }
        });
}



