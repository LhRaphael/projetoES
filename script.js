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

async function exibirMaterias(){
  let area = document.getElementById("materias")
  let conteudo = await coletarJson()
  console.log(conteudo);
  
  conteudo.forEach(element => {
    let div = document.createElement("div")
    let nome = document.createElement("span")
    nome.innerText = element.materia
    let check = document.createElement("input")
    check.type = "checkbox"
    div.appendChild(nome)
    div.appendChild(check)
    area.appendChild(div)
  });
}

document.addEventListener("DOMContentLoaded",exibirMaterias)