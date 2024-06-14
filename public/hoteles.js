class Hoteles {
  constructor() {
    this.onSubmit = this.onSubmit.bind(this);
    this.onResponse = this.onResponse.bind(this);
    this.onJsonReady = this.onJsonReady.bind(this);

    document.addEventListener('DOMContentLoaded', () => {
      const form = document.querySelector('#search-hotel');
      if (form) {
        form.addEventListener('submit', this.onSubmit);
      } else {
        console.error('Formulario con ID #search-hotel no encontrado.');
      }
    });
  }

  onSubmit(event) {
    event.preventDefault();
    const cityNameInput = document.querySelector("#hotel-city-name");
    if (cityNameInput) {
      const cityName = cityNameInput.value.toLowerCase();
      console.log('City Name:', cityName); // Añadir log para verificar el nombre de la ciudad
      this.loadHoteles(cityName);
    } else {
      console.error('Input con ID #hotel-city-name no encontrado.');
    }
  }

  loadHoteles(cityName) {
    fetch('/loadhotels/')
      .then(this.onResponse)
      .then(json => {
        console.log('Data fetched:', json); // Añadir log para verificar los datos obtenidos
        this.onJsonReady(json, cityName);
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  onJsonReady(json, cityName) {
    const hotelContainer = document.querySelector("#hotel-container");
    if (hotelContainer) {
      hotelContainer.innerHTML = "";

      if (json.hotels) { // Asegurarse de que json tiene una propiedad hotels

        let i=1; 
        for (const hotel of json.hotels) {
          i=i+1;
          if (hotel.city.toLowerCase() === cityName) {
            console.log('Hotel encontrado:', hotel); // Añadir log para verificar los hoteles encontrados
            const hotelDiv = document.createElement('div');
            hotelDiv.className = 'hotel';
            hotelDiv.innerHTML = `
              <p><strong>Ciudad:</strong> <span id="city_`+i+`">${hotel.city}</span></p>
              <p><strong>Hotel:</strong> <span id="hotel_`+i+`">${hotel.hotel_name}</span></p>
              <p><strong>Precio:</strong> ${hotel.price}</p>
              <button id="`+i+`" class="botoncin">Seleccionar opcion</button>
              <hr>
            `;
            hotelContainer.appendChild(hotelDiv);

        const button = hotelDiv.querySelector('button');
        button.addEventListener('click', function() {
            const postBody = {
              city : document.querySelector('#city_'+button.id).innerHTML,
              hotel : document.querySelector('#hotel_'+button.id).innerHTML,
            };

            const fetchOptions = {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
             body: JSON.stringify(postBody)
            };
        
            return fetch('/save/', fetchOptions)
            .then(alert('Opcion guardada correctamente!'));
        });

          }
        }
      } else {
        console.error('Formato de respuesta inesperado:', json);
      }
    } else {
      console.error('Contenedor con ID #hotel-container no encontrado.');
    }
  }

  onResponse(response) {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  const app = new Hoteles();
});

export default Hoteles;