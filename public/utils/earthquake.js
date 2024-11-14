export function loadEarthquakeData(csvFile) {
    fetch(csvFile)
        .then((response) => response.text())
        .then((data) => {
            const rows = data.split("\n");
            const earthquakes = [];
            const header = rows[0].split(",");
            const indexes = {
                dateTime: header.indexOf("time"),
                latitude: header.indexOf("latitude"),
                longitude: header.indexOf("longitude"),
                depth: header.indexOf("depth"),
                magnitude: header.indexOf("mag"),
                place: header.indexOf("place")
            }
            for (let i = 1; i < rows.length; i++) {
                const columns = rows[i].split(",");
                const earthquake = {
                    dateTime: columns[indexes.dateTime],
                    latitude: columns[indexes.latitude],
                    longitude: columns[indexes.longitude],
                    depth: columns[indexes.depth],
                    magnitude: columns[indexes.magnitude],
                    place: columns[indexes.place]
                };
                earthquakes.push(earthquake);
            }
            console.log(earthquakes);
            return earthquakes;
        });
}
