let MATERIASMARCADAS = []

async function startMateria(){
  let materias = await coletarJson()

  for(let i = 0; i < materias.length; i++){
    let element = {nome: materias[i].materia, ativo: false, horarios: materias[i].horarios}
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
    if(element.nome == materia.nome){
      element.ativo = false
    }
  })
}

function adicionarMateria(materia){
  MATERIASMARCADAS.forEach(element =>{
    if(element.nome == materia.nome){
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

function marcarMateria(){  
  MATERIASMARCADAS.forEach(materia =>{
    let idReferencia = []
    for(let i = 0; i < materia.horarios.length; i++){
      idReferencia.push(materia.horarios[i])
    }

    idReferencia.forEach(item =>{
      let horario = document.getElementById(item)
      if(materia.ativo == true && horario.textContent == ""){
        horario.textContent = materia.nome
      }
    })
  })

  console.log(MATERIASMARCADAS)

}

async function exibirMaterias(){
  let area = document.getElementById("materias")
  let conteudo = await coletarJson()
  console.log(conteudo);
  
  conteudo.forEach(element => {
    const materia = {
      nome: element.materia,
    }
    let div = document.createElement("div")
    
    let nome = document.createElement("span")
    nome.innerText = element.materia
    
    let check = document.createElement("input")
    check.type = "checkbox"
    check.addEventListener('change', function (){
      verificar(this, materia)
    })
    
    div.appendChild(nome)
    div.appendChild(check)
    area.appendChild(div)
  });

 
}

async function pesquisar(){
  let area = document.getElementById("materias")
  let conteudo = await coletarJson()
  let input = document.getElementById("input-de-pesquisa")

  if (input.value == ""){
    let divs = area.querySelectorAll("div")
    divs.forEach(div => div.remove())

    exibirMaterias()
    return
  }

  let divs = area.querySelectorAll("div")
  divs.forEach(div => div.remove())

  conteudo.forEach(e => {
    const periodo = {
      nome: e.materia
    }

    if (periodo.nome.toLowerCase().includes(input.value)){
      let div = document.createElement("div")

      let nome = document.createElement("span")
      nome.innerText = e.materia

      let check = document.createElement("input")
      check.type = "checkbox"
      check.addEventListener('change', function (){
        verificar(this, materia)
      })
      
      div.appendChild(nome)
      div.appendChild(check)
      area.appendChild(div)
    }
    
  })

}

// marcarMateria()
startMateria()
document.addEventListener("DOMContentLoaded",exibirMaterias)