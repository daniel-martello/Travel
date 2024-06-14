class Home {
  constructor() {
    this.onSubmit = this.onSubmit.bind(this);
    const form = document.querySelector('form');
    form.addEventListener('submit', this.onSubmit);
  }

  onSubmit(event) {
    event.preventDefault();
    const countryName = document.querySelector("#country-name").value.toLowerCase();
    this.loadFlights(countryName);
  }

  loadFlights(destinationName) {
    fetch('/loadflights/')
      .then(this.onResponse)
      .then(json => this.onJsonReady(json, destinationName));
  }


  onJsonReady(json, destinationName) {
    const countryContainer = document.querySelector("#country-container");
    countryContainer.innerHTML = "";

    let i=1; 
    for (const flight of json.vuelos) {
      i=i+1;
      if (flight.from.toLowerCase().includes(destinationName)) {
        const flightDiv = document.createElement('div');
        flightDiv.innerHTML = `
          <p><strong>Fecha de Salida:</strong> <span id="fecha_salida_`+i+`">${flight.departure_date}</span></p>
          <p><strong>Hora de Salida:</strong> <span id="hora_salida_`+i+`">${flight.departure_hour}</span></p>
          <p><strong>Desde:</strong> ${flight.from}</p>
          <p><strong>Hacia:</strong> ${flight.to}</p>
          <p><strong>Aerolínea:</strong> <span id="aerolinea_`+i+`">${flight.airline}</span></p>
          <p><strong>Duración:</strong> ${flight.hours}</p>
          <p><strong>Precio:</strong> ${flight.price}</p>
          <button id="`+i+`" class="botoncin">Seleccionar opción</button>
          <hr>
        `;
        countryContainer.appendChild(flightDiv);

        const button = flightDiv.querySelector('button');
        button.addEventListener('click', function() {            
            const postBody = {
              fecha_salida : document.querySelector('#fecha_salida_'+button.id).innerHTML,
              hora_salida : document.querySelector('#hora_salida_'+button.id).innerHTML,
              aerolinea : document.querySelector('#aerolinea_'+button.id).innerHTML
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
  }

  onResponse(response) {
    return response.json();
  }
}


document.addEventListener('DOMContentLoaded', () => {
    const app = new Home();
  });

export default Home;