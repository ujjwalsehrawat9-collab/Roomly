if (typeof locationString !== "undefined") {
  fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      locationString
    )}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];

        const map = L.map("map").setView([lat, lon], 9);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap",
        }).addTo(map);

        const title =
          typeof listingTitle !== "undefined" && listingTitle
            ? listingTitle
            : display_name;

        const popupHtml = `
          <div class="map-click">
            <h4><b>${title}</b></h4>
            <p>Exact location will be provided after booking.</p>
          </div>
        `;

        L.marker([lat, lon]).addTo(map).bindPopup(popupHtml).openPopup();

        const popup = L.popup();
        function onMapClick(e) {
          popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
        }
        map.on("click", onMapClick);
      } else {
        console.error("Location not found.");
      }
    })
    .catch((err) => {
      console.error("Geocoding failed:", err);
    });
}