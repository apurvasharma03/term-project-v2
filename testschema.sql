USE musicoset;

SELECT song_name, artists, popularity
FROM songs
WHERE artists LIKE '%Ariana Grande%'
ORDER BY popularity DESC;


