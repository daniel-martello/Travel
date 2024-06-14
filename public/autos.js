class Autos {
  constructor() {
    this.onSubmit = this.onSubmit.bind(this);
    this.onResponse = this.onResponse.bind(this);
    this.onJsonReady = this.onJsonReady.bind(this);

    const form = document.querySelector('#search-cars');
    form.addEventListener('submit', this.onSubmit);
  }

  loadAutos(cityName) {
    fetch('/loadcars/')
      .then(this.onResponse)
      .then(json => this.onJsonReady(json, cityName))
      .catch(error => console.error('Error fetching autos:', error));
  }

  onSubmit(event) {
    event.preventDefault();
    const cityName = document.querySelector("#city-name").value.trim().toLowerCase();
    this.loadAutos(cityName);
  }

  onJsonReady(json, cityName) {
    console.log("JSON response: ", json);
    const autoContainer = document.querySelector("#auto-container");
    autoContainer.innerHTML = "";
    const autos = json.autos || [];

    const filteredAutos = autos.filter(auto => auto.city.toLowerCase() === cityName);

    let i=1; 
    for (const auto of filteredAutos) {
      i=i+1;
      this.renderAuto(autoContainer, auto.img, auto.car_name, auto.price, i);
    }
  }

  onResponse(response) {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  }

  renderAuto(autoContainer, imageUrl, name, price, i) {
    const autoDiv = document.createElement('div');
    autoDiv.classList.add('auto');

    const image = new Image();
    image.src = imageUrl;
    image.alt = name;
    image.title = name;

    const nameElement = document.createElement('h2');
    nameElement.textContent = name;
    nameElement.id = 'carname_' + i;

    const priceElement = document.createElement('p');
    priceElement.textContent = `Price: $${price}`;

    const button = document.createElement('button');
    button.textContent = 'Seleccionar opción';
    button.classList.add('botoncin');
    button.id = i;

    button.addEventListener('click', function() {
        const postBody = {
          car_name : document.querySelector('#carname_'+button.id).innerHTML
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

    autoDiv.appendChild(image);
    autoDiv.appendChild(nameElement);
    autoDiv.appendChild(priceElement);
    autoDiv.appendChild(button); 

    autoContainer.appendChild(autoDiv);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new Autos();
  });

  export default Autos;
