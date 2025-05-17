const apiURL = "https://mindicador.cl/api"
const input = document.querySelector('#pesosCLP')
const select = document.querySelector('#typeMoney')
const btn = document.querySelector('#btnSearch')
const divConv = document.querySelector('#converter')
const ctx = document.querySelector('#graphic').getContext('2d')
let graphic = null

async function cargarMonedas() {
  try {
    const res = await fetch(apiURL)
    const data = await res.json()

    const monedas = ["dolar", "euro"]
    monedas.forEach((moneda) => {
      const option = document.createElement("option")
      option.value = moneda
      option.textContent = data[moneda].nombre
      select.appendChild(option)
    });
  } catch (error) {
    divConv.textContent = `Error al cargar monedas: ${error.message}`
  }
}

async function convertirMoneda() {
  const monto = parseFloat(input.value)
  const moneda = select.value

  if (!monto || !moneda) {
    divConv.textContent = "Por favor, ingrese un monto y seleccione una moneda."
    return
  }

  try {
    const res = await fetch(`${apiURL}/${moneda}`)
    const data = await res.json();

    const valorActual = data.serie[0].valor
    const conversion = (monto / valorActual).toFixed(2)

    divConv.textContent = `Resultado: ${conversion} ${data.nombre}`

    dibujarGrafico(data)
  } catch (error) {
    divConv.textContent = `Error al realizar la conversión: ${error.message}`
  }
}

function dibujarGrafico(data) {
  const fechas = data.serie.slice(0, 10).map((item) => item.fecha.split("T")[0]).reverse()
  const valores = data.serie.slice(0, 10).map((item) => item.valor).reverse()

  if (graphic) {
    graphic.destroy()
  }

  graphic = new Chart(ctx, {
    type: "line",
    data: {
      labels: fechas,
      datasets: [{
        label: `Historial últimos 10 días (${data.nombre})`,
        data: valores,
        borderColor: "rgb(225, 0, 255)",
        backgroundColor: "rgba(216, 7, 235, 0.2)",
        borderWidth: 2,
        fill: true
      }]
    }
  })
}

btn.addEventListener("click", convertirMoneda)

cargarMonedas()