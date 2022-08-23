// search.js
const router = require('express').Router();
const config = require('./config.json');
const audio = require('theaudiodb_module/audio')

// GET search/artistName to return a count of results, name, and id of artists found.
router.get('/artistName', async (req, res) => {
    try {
        const artistInfo = []; // array to store data to output

        // get artistName from body
        const { artistName } = req.body;

        // get artistID from theaudiodb_module
        const artistResults = await audio.searchArtist(artistName);
        
        // get count of artists found 
        const count = artistResults.artists.length;

        // loop through each object in the results and save data to output into array
        for(let i = 0; i < count; i++){
            
                const displayText ={
                    ArtistName: artistResults.artists[i].strArtist, 
                    ID: artistResults.artists[i].idArtist,
                    Genre: artistResults.artists[i].strGenre,
                    Bio: artistResults.artists[i].strBiographyEN.substring(0, 200)
                }
                artistInfo.push(displayText)
        }
        // return response to user
        // response contains: # of results, results
        res.json({ keyword: artistName, resultCount: count, artists: artistInfo });
    } catch (error) {
        res.status(500).json(error);
    }
});

// POST search/artistID/detail to return id and information of the artists.
// post keyword, resultCount, ID, ArtistName, Genre, Bio, and timestamp to MongoDB
router.post('/artistID/details', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const collection = db.collection('History');
  
        const { keyword, resultCount, ID, ArtistName, Genre, Bio } = req.body;

        // get artist details from theaudiodb_module using ID
        const artistResults = await audio.searchByID(ID);
    
        // Post to MongoDB
        const timestamp = Date().toString();
        await collection.insertOne({ keyword, resultCount, ID, ArtistName, Genre, Bio, timestamp });

        // return response to user
        // response contains: artist information
        res.json({ 
            ID: artistResults.artists[0].idArtist,
            ArtistName: artistResults.artists[0].strArtist, 
            Record_Label: artistResults.artists[0].strLabel,
            Year_Born: artistResults.artists[0].intBornYear,
            Formed_Year: artistResults.artists[0].intFormedYear,
            Genre: artistResults.artists[0].strGenre,
            Style: artistResults.artists[0].strStyle,
            Website: artistResults.artists[0].strWebsite,
            Bio: artistResults.artists[0].strBiographyEN
         });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
