const SHEET_ID = '10RIk0_Zlq0uY7Gl9m-eOv16G4W0U32SinsyqZdvpDHo';
const API_KEY = 'AIzaSyCUDhkoPJ5kQs4sthWCfLCEDNayt4nraVQ';

const iconMap = {
    'Ev': 'home',
    'Bina': 'building',
    'Depo': 'warehouse',
    'İşyeri': 'store-alt'
};

async function fetchProperties() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A2:J1000?key=${API_KEY}`);
    const data = await response.json();
    const rows = data.values;

    return rows.map(([address, description, price, type, bed, bath, size, lat, lng]) => ({
        address,
        description,
        price,
        type,
        bed: Number(bed),
        bath: Number(bath),
        size: Number(size),
        position: {
            lat: Number(lat),
            lng: Number(lng)
        }
    }));
}

async function initMap() {
    const properties = await fetchProperties();
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { LatLng } = await google.maps.importLibrary("core");
    const center = new LatLng(41.0082, 28.9784);
    const map = new Map(document.getElementById("map"), {
        zoom: 11,
        center,
        mapId: "4504f8b37365c3d0",
    });

    for (const property of properties) {
        const markerElement = new google.maps.marker.AdvancedMarkerElement({
            map,
            content: buildContent(property),
            position: property.position,
            title: property.description,
        });

        markerElement.addListener("click", () => {
            toggleHighlight(markerElement, property);
        });
    }
}

function toggleHighlight(markerView, property) {
    const { content } = markerView;
    if (content.classList.contains("highlight")) {
        content.classList.remove("highlight");
        markerView.zIndex = null;
    } else {
        content.classList.add("highlight");
        markerView.zIndex = 1;
    }
}

function buildContent({ type, price, address, bed, bath, size }) {
    const content = document.createElement("div");
    content.classList.add("property");

    const iconType = iconMap[type] || 'building';

    content.innerHTML = `
        <div class="icon">
            <i aria-hidden="true" class="fa fa-icon fa-${iconType}" title="${type}"></i>
            <span class="fa-sr-only">${iconType}</span>
        </div>
        <div class="details">
            <div class="price">${price}</div>
            <div class="address">${address}</div>
            <div class="features">
                <div>
                    <i aria-hidden="true" class="fa fa-bed fa-lg bed" title="Yatak Odası"></i>
                    <span class="fa-sr-only">bedroom</span>
                    <span>${bed}</span>
                </div>
                <div>
                    <i aria-hidden="true" class="fa fa-bath fa-lg bath" title="Banyo"></i>
                    <span class="fa-sr-only">bathroom</span>
                    <span>${bath}</span>
                </div>
                <div>
                    <i aria-hidden="true" class="fa fa-ruler fa-lg size" title="Büyüklük"></i>
                    <span class="fa-sr-only">size</span>
                    <span>${size} ft<sup>2</sup></span>
                </div>
            </div>
        </div>
    `;
    return content;
}


initMap();
