const timeLoja = ["Pedro Henrique", "Derick", "João Pedro", "Eduardo", "Thamires",
                    "Ianca", "Fernanda", "Renata", "Gabriel", "Jeferson"];

const timeSAC = ["Jamille", "Fabiana", "Micaele", "Thalita", "Cris",
                "Kelly Paiva", "Marília", "Felipe"];

const escala = [];

const start = new Date("2025-05-20T00:00:00");
const end = new Date("2025-07-20T00:00:00");

let index1 = 0;
let index2 = 0;

function formatDate(date) {
  return date.toLocaleDateString('pt-BR');
}

function getDayName(date) {
  const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  return days[date.getDay()];
}

function getNextPerson(time, idxRef) {
  const person = time[idxRef % time.length];
  return person;
}

for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
  const data = new Date(d);
  const diaSemana = data.getDay();
  const formattedDate = formatDate(data);

  if (formattedDate === "24/06/2025") {
    escala.push([formattedDate, getDayName(data), "Fechado", "Fechado", "Fechado", "Fechado", diaSemana]);
    continue;
  }

  if (formattedDate === "19/06/2025" || formattedDate === "02/07/2025") {
    const p1 = getNextPerson(timeLoja, index1++);
    const p2 = getNextPerson(timeSAC, index2++);
    escala.push([formattedDate, getDayName(data), "Feriado", "14h às 20h", p1, p2, diaSemana]);
    continue;
  }

  if (formattedDate === "20/07/2025") {
    escala.push([formattedDate, getDayName(data), "DOMINGO", "14h às 20h", "Ianca", getNextPerson(timeSAC, index2++), diaSemana]);
    continue;
  }

  if (diaSemana === 0) {
    const p1 = getNextPerson(timeLoja, index1++);
    const p2 = getNextPerson(timeSAC, index2++);
    escala.push([formattedDate, getDayName(data), "DOMINGO", "14h às 20h", p1, p2, diaSemana]);
  } else {
    const m1 = getNextPerson(timeLoja, index1++);
    const m2 = getNextPerson(timeSAC, index2++);
    const t1 = getNextPerson(timeLoja, index1++);
    const t2 = getNextPerson(timeSAC, index2++);
    escala.push([formattedDate, getDayName(data), "MATUTINO", "10h às 19h", m1, m2, diaSemana]);
    escala.push([formattedDate, "", "VESPERTINO", "14h às 22h", t1, t2, diaSemana]);
  }
}

const tbody = document.getElementById("tabela-corpo");
const filtro = document.getElementById("filtro");
const diaSemana = document.getElementById("diaSemana");
const turnoFiltro = document.getElementById("turno");

function renderTabela() {
  const filtroTexto = filtro.value.toLowerCase();
  const filtroDia = diaSemana.value;
  const turnoSelecionado = turnoFiltro.value;

  tbody.innerHTML = "";
  escala.forEach(([data, diaNome, turno, horario, t1, t2, dia]) => {
    if (filtroTexto && ![t1.toLowerCase(), t2.toLowerCase()].some(n => n.includes(filtroTexto))) return;
    if (filtroDia !== "" && dia.toString() !== filtroDia) return;
    if (turnoSelecionado !== "" && turno !== turnoSelecionado) return;

    let turnoClass = '';
    switch(turno) {
      case 'MATUTINO':
        turnoClass = 'matutino'; // Amarelo
        break;
      case 'VESPERTINO':
        turnoClass = 'vespertino'; // Azul
        break;
      case 'DOMINGO':
        turnoClass = 'domingo'; // Vermelho
        break;
      case 'Fechado':
        turnoClass = 'fechado'; // Preto com letras brancas
        break;
        case 'Feriado':
        turnoClass = 'feriado'; // Preto com letras brancas
        break;
    }

    const row = `<tr class="${turnoClass}">
      <td>${data}</td><td>${diaNome}</td><td>${turno}</td><td>${horario}</td><td>${t1}</td><td>${t2}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

filtro.addEventListener("input", renderTabela);
diaSemana.addEventListener("change", renderTabela);
turnoFiltro.addEventListener("change", renderTabela);

renderTabela();
