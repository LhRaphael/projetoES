function coletarJson(){
    fetch('./dados.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao carregar o arquivo JSON');
    }
    return response.json();  // Converte a resposta para um objeto JavaScript
  })
  .then(data => {
    console.log(data);  // Agora você pode trabalhar com o objeto JavaScript
  })
  .catch(error => {
    console.error('Erro:', error);
  });

}

function exibirMaterias(){
    let area = document.getElementById("materias")
    let conteudo = coletarJson()

    conteudo.forEach(element => {
        let div = document.createElement("div")
        let nome = document.createElement("span")
        nome.innerText = element.materia
        let check = document.createElement("input").type = "checkbox"
        div.appendChild(nome)
        div.appendChild(check)
        area.appendChild(div)
    });
}

document.addEventListener("DOMContentLoaded",exibirMaterias)