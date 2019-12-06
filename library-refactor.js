const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const library = {
  tracks: { t01: { id: "t01",
    name: "Code Monkey",
    artist: "Jonathan Coulton",
    album: "Thing a Week Three" },
  t02: { id: "t02",
    name: "Model View Controller",
    artist: "James Dempsey",
    album: "WWDC 2003"},
  t03: { id: "t03",
    name: "Four Thirty-Three",
    artist: "John Cage",
    album: "Woodstock 1952"}
  },
  playlists:  { p01: { id: "p01",
    name: "Coding Music",
    tracks: ["t01", "t02"]
  },
  p02: { id: "p02",
    name: "Other Playlist",
    tracks: ["t03"]
  }
  },
  printPlaylists: function() {
    let list = "";
    for (const x of playKeys) {
      const playTracks = Object.keys(this.playlists[x].tracks);
      if (playTracks.length < 2) {
        list += `${[x]}: ${this.playlists[x].name} - ${playTracks.length} track\n`;
      } else if (playTracks.length > 1) {
        list += (`${[x]}: ${this.playlists[x].name} - ${playTracks.length} tracks\n`);
      }
    }
    console.log(list);
  },
  printTracks: function() {
    for (const x of trackKeys) {
      console.log(`${[x]}: ${this.tracks[x].name} by ${this.tracks[x].artist} (${this.tracks[x].album})`);
    }
  },
  printPlaylist: function(playlistId) {
    if (playlistId.tracks.length < 2) {
      console.log(`${playlistId.id}: ${playlistId.name} - ${playlistId.tracks.length} track`);
    } else if (playlistId.tracks.length > 1) {
      console.log(`${playlistId.id}: ${playlistId.name} - ${playlistId.tracks.length} tracks`);
    }
    const tracksToPlay = playlistId.tracks;
    for (const x of tracksToPlay) {
      if (tracksToPlay[x] === this.tracks.id) {
        console.log(`${this.tracks[x].id}: ${this.tracks[x].name} by ${this.tracks[x].artist} (${this.tracks[x].album})`);
      }
    }
  },
  addTrackToPlaylist: function(trackId, playlistId) {
    for (const x of playlistId) {
      if (x !== trackId) {
        playlistId.push(trackId);
        playlistId.sort();
        break;
      }
    }
  },
  addTrack: function(name, artist, album) {
    let trackKeys = Object.keys(this.tracks);
    let newId = "t";
    if (trackKeys.length < 10) {
      newId += "0" + (trackKeys.length + 1);
    } else {
      newId += (trackKeys.length + 1);
    }
    this.tracks[newId] = { id: newId, name: '', artist: '', album: ''};
    name !== undefined ? this.tracks[newId].name += name : this.tracks[newId].name += "Unknown Track";
    artist !== undefined ? this.tracks[newId].artist += artist : this.tracks[newId].artist += "Unknown Artist";
    album !== undefined ? this.tracks[newId].album += album : this.tracks[newId].album += "Unknown Album";
  },
  addPlaylist: function(name) {
    let playKeys = Object.keys(this.playlists);
    let newId = "p";
    if (playKeys.length < 10) {
      newId += "0" + (playKeys.length + 1);
    } else {
      newId += (playKeys.length + 1);
    }
    this.playlists[newId] = { id: newId, name: '', tracks: []};
    name !== undefined ? this.playlists[newId].name += name : this.playlists[newId].name += "Unnamed Playlist";
  },
  search: function() {
    rl.question('Enter search string: ', (answer) => {
      rl.close();
      let searchQuery = new RegExp(`${answer}`, 'gi');
      let tracks = Object.values(this.tracks);
      let filtered = tracks.filter((track) => {
        let queryString = track.name + track.artist + track.album;
        return queryString.search(searchQuery) > -1;
      });
      for (let i = 0; i < filtered.length; i++) {
        console.log(`\nTrack:  ${filtered[i].name}\nArtist: ${filtered[i].artist}\nAlbum:  ${filtered[i].album}\n`);
      }
    });
  },
  addTrackPrompt: function() {
    function askTitle() {
      return new Promise((resolve) => {
        rl.question('Enter track title: ', (title) => {
          resolve(title);
        });
      });
    }
    function askArtist(title) {
      return new Promise((resolve) => {
        rl.question('Enter track artist: ', (artist) => {
          resolve([title, artist]);
        });
      });
    }
    function askAlbum([title, artist]) {
      return new Promise((resolve) => {
        rl.question('Enter track album: ', (album) => {
          resolve([title, artist, album]);
        });
      });
    }
    function createTrack([title, artist, album]) {
      library.addTrack(title, artist, album);
      console.log(library.tracks);
      console.log(`Title: ${title}\nArtist: ${artist}\nAlbum: ${album}\nHas been successfuly added to library.\n`);
      rl.question('Continue using music library? [Y/N]', (answer) => {
        if (answer === 'Y') {
          prompt();
        } else if (answer === 'N') {
          rl.close();
        }
      });
    }
    askTitle().then(askArtist).then(askAlbum).then(createTrack);
  }
};

// LATEST SUCCESFUL IMPLEMENTATION
// Added ability to add track via user input ^_^

// CURRENT ISSUE TO SOLVE:
// Updated track list not displaying.
// Suspect that it may be due to trackKeys variable not updating.

// LONGER TERM TO-DO
// Refactor using OOP
//   -Ex: Each track is a class that comes with built-in prompts, and querty functions to build new track object containing track name, etc.

// Keys
const playKeys = Object.keys(library.playlists);
const trackKeys = Object.keys(library.tracks);

// Main Menu
const prompt = () => {
  rl.question('Welcome to the Music Library.\nPlease select from the following options:\n1) Display all tracks: SHOW TRACKS\n2) Display all playlists: SHOW PLAYLISTS\n3) Add track to library: ADD TRACK\n4) Add track to specific playlist: ADD TO PLAYLIST\n5) Add playlist to library: ADD PLAYLIST\n6) Search library: SEARCH \n', (answer) => {
    if (answer === 'SHOW TRACKS') {
      library.printTracks();
      rl.close();
    } else if (answer === 'SHOW PLAYLISTS') {
      library.printPlaylists(library);
      rl.close();
    } else if (answer === 'ADD TRACK') {
      library.addTrackPrompt();
    }
  });
};

//Run Prompt
prompt();


// Method Tests
// console.log("Print Playlists");
// library.printPlaylists(library);

// console.log("Print Tracks");
// library.printTracks();
// console.log("\n");

// console.log("Print Single Playlist");
// library.printPlaylist(library.playlists.p01);
// console.log("\n");

// console.log("Add Track to Playlist (Should have three items)");
// library.addTrackToPlaylist(library.tracks.t03.id, library.playlists.p01.tracks);
// console.log(library.playlists.p01.tracks + "\n");

// console.log("Add Track to Library");
// library.addTrack("Holy Terrain", "FKA Twigs", "Magdalene");
// console.log(library.tracks);
// console.log("\n");

// console.log("Add Playlist to Library");
// library.addPlaylist("Dub/Reggae");
// console.log(library.playlists);