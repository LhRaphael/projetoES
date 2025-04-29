let MATERIASMARCADAS = []
let TABELA = []
let filtro = false
let PERIODOS = []

async function startMateria(){
  let materias = await coletarJson()

  for(let i = 0; i < materias.length; i++){
    let element = {
      nome: materias[i].materia, 
      ativo: false, 
      horarios: materias[i].horarios,
      periodo:materias[i].periodo, 
      professor: materias[i].professor,
      link: materias[i].link
    }
    MATERIASMARCADAS.push(element)
  }

}

function coletarJson(){
  return fetch('./dados.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao carregar o arquivo JSON');
    }
    return response.json();  // Converte a resposta para um objeto JavaScript
  })
  
  .catch(error => {
    console.error('Erro:', error);
  });

}


function removerMateria(materia){
  MATERIASMARCADAS.forEach(element =>{
    if(element.nome == materia){
      element.ativo = false
    }
  })
}

function adicionarMateria(materia){
  MATERIASMARCADAS.forEach(element =>{
    if(element.nome == materia){
      element.ativo = true
    }
  })
}

function verificar(check, materia){
  if(check.checked){
    adicionarMateria(materia)
  }
  else{
    removerMateria(materia)
  }
  marcarMateria()
}

function limparMaterias(){
  for (let m = 0; m < MATERIASMARCADAS.length; m++) {

    let materia = MATERIASMARCADAS[m];
    for (let i = 0; i < materia.horarios.length; i++) {

      let item = materia.horarios[i];
      let horario = document.getElementById(item);
      if (horario) {
        horario.textContent = "";
      }
    }
  }
}

function marcarMateria() {
  
  limparMaterias()

  for (let m = 0; m < MATERIASMARCADAS.length; m++) {

    let materia = MATERIASMARCADAS[m];
    if (materia.ativo) {
      for (let i = 0; i < materia.horarios.length; i++) {

        let item = materia.horarios[i];
        let horario = document.getElementById(item);
        if (horario) {
          if (horario.textContent !== "") {
            alert("Conflito de horários com " + horario.textContent);
            const dados = Array.from(TABELA)
            exibirTabela(dados)
            break
          } else {
            horario.textContent = materia.nome;
          }
        }
      }
    }
  }
  capturarTabela()
  
  console.log(TABELA);
}

function informacoes(arg){
  let element = MATERIASMARCADAS.find(element => element.nome == arg)
  let link = element.link
  window.open(link,"_blank")
}

function filtrar(check,arg){
  if(check.checked){
    PERIODOS.push(arg)
    exibirMaterias()
    console.log(PERIODOS)
  }
  else{
    PERIODOS = PERIODOS.filter(item => item !== arg)
  }
}

function exibirMaterias(arg){
  let area = document.getElementById("materias")
  let conteudo = Array.from(MATERIASMARCADAS)
  console.log(conteudo);
  area.innerHTML = ""
  
  conteudo.forEach(element => {
    
    if (!arg || element.nome.toLowerCase().includes(arg.toLowerCase())) {
  
      // Verifica também se o período do elemento está incluso nos períodos filtrados
      if (PERIODOS.length === 0 || PERIODOS.includes(element.periodo)) {
    
        let materia = element.nome;
    
        let div = document.createElement("div");
    
        let nome = document.createElement("span");
        nome.innerText = materia;
    
        let buttons = document.createElement("div");
    
        let check = document.createElement("input");
        check.type = "checkbox";
        check.addEventListener('change', function () {
          verificar(this, materia);
        });
    
        let info = document.createElement("button");
        info.textContent = "?";
        info.addEventListener("click", () => {
          informacoes(materia);
        });
    
        buttons.appendChild(info);
        buttons.appendChild(check);
        div.appendChild(nome);
        div.appendChild(buttons);
        area.appendChild(div);
    
      }
        
    }
  })
}

function filtrarPeriodo(){
  let area = document.getElementById("periodos")
  let periodos = ["1° periodo","2° periodo","3° periodo","4° periodo","5° periodo","6° periodo"]
  area.innerHTML = ""

  periodos.forEach(periodo=>{
    let box = document.createElement("div")
    
    let nome = document.createElement("span")
    nome.textContent = periodo

    let marcar = document.createElement("input")
    marcar.type = "checkbox"
    marcar.addEventListener('change',function(){
      filtrar(this, Number(nome.textContent[0]))
      console.log(marcar.checked)
    })

    box.appendChild(nome)
    box.appendChild(marcar)
    area.appendChild(box)
  })

}

function capturarTabela() {
  const tabela = document.getElementById("tabela-principal");
  const linhas = tabela.querySelectorAll("tbody tr");
  TABELA = []

  for (let i = 0; i < linhas.length; i++) {
    const celulas = linhas[i].querySelectorAll("td");
    const linhaDados = [];

    for (let j = 0; j < celulas.length; j++) {
      linhaDados.push({
        id: celulas[j].id || null,
        texto: celulas[j].textContent.trim()
      });
    }
   TABELA.push(linhaDados);
  }
}
function exibirTabela(dados) {
  const tabela = document.getElementById("tabela-principal");
  const tbody = tabela.querySelector("tbody");

  tbody.innerHTML = "";

  for (let i = 0; i < dados.length; i++) {
    const linha = document.createElement("tr");

    for (let j = 0; j < dados[i].length; j++) {
      const celula = document.createElement("td");
      if (dados[i][j].id) {
        celula.id = dados[i][j].id
      }
      celula.textContent = dados[i][j].texto
      linha.appendChild(celula);
    }

    tbody.appendChild(linha);
  }

}

function exportarTabela() {
  const elemento = document.getElementById('tabela-principal')

  const { jsPDF } = window.jspdf
  const doc = new jsPDF()

  doc.autoTable({ html: elemento });

  doc.save('tabela-sem-estilos.pdf');
}

// marcarMateria()

const filtroPeriodo = document.getElementById("filtro")
filtroPeriodo.addEventListener("click",()=>{
  filtro = filtro ? false:true
  console.log(filtro)
  let div = document.getElementById("periodos")
  if(filtro){
    filtrarPeriodo()
    div.style.border = "2px solid black"
  }
  else{
    div.innerHTML = ""
    div.style.border = "none"
  }
})

const input = document.getElementById("input-de-pesquisa")
input.addEventListener("focus",()=>{
  exibirMaterias("")
})
input.addEventListener("input", function(){
  exibirMaterias(input.value)
})

startMateria()
// document.addEventListener("DOMContentLoaded",exibirMaterias)