

const URL_PLANILHA = "https://script.google.com/macros/s/AKfycbwe7aeLK11_TW2n8sdjh1RHEDhzfaS8Hh1kMVJuznV2yKoC3KgzXFaU8jd_XSt8a_87yA/exec";

const form = document.getElementById("formulario");
const aviso = document.getElementById("aviso");
const btnSubmit = document.getElementById("btn-submit");
const btnText = document.getElementById("btn-text");
const btnIcon = document.getElementById("btn-icon");

lucide.createIcons();

// Máscara CNPJ
document.getElementById('cnpj').addEventListener('input', function (e) {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 14) v = v.slice(0, 14);
  v = v.replace(/^(\d{2})(\d)/, '$1.$2');
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
  v = v.replace(/(\d{4})(\d)/, '$1-$2');
  e.target.value = v;
});

// Máscara Telefone
document.getElementById('telefone').addEventListener('input', function (e) {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
  v = v.replace(/(\d)(\d{4})$/, '$1-$2');
  e.target.value = v;
});

// Máscara e busca de CEP
document.getElementById('cep').addEventListener('input', function (e) {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 8) v = v.slice(0, 8);
  v = v.replace(/^(\d{5})(\d)/, '$1-$2');
  e.target.value = v;

  const rawCep = v.replace(/\D/g, '');
  if (rawCep.length === 8) {
    buscarCEP(rawCep);
  }
});

function buscarCEP(cep) {
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (!data.erro) {
        document.getElementById('logradouro').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('estado').value = data.uf || '';
        document.getElementById('numero').focus();
      }
    })
    .catch(err => console.error("Erro ao buscar CEP:", err));
}

// Envio do Formulário
form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  btnSubmit.disabled = true;
  btnText.textContent = "Enviando...";
  btnIcon.setAttribute("data-lucide", "loader-2");
  btnIcon.classList.add("spinner");
  lucide.createIcons();

  mostrarAviso("Salvando dados da empresa...", "info");

  fetch(URL_PLANILHA, {
    method: "POST",
    mode: "no-cors",
    body: new FormData(form)
  })
    .then(function () {
      mostrarAviso("Empresa cadastrada com sucesso!", "sucesso");
      form.reset();
    })
    .catch(function (error) {
      console.error(error);
      mostrarAviso("Erro ao enviar dados. Tente novamente.", "erro");
    })
    .finally(function () {
      btnSubmit.disabled = false;
      btnText.textContent = "Cadastrar Empresa";
      btnIcon.setAttribute("data-lucide", "send");
      btnIcon.classList.remove("spinner");
      lucide.createIcons();
    });
});

function mostrarAviso(texto, tipo) {
  aviso.textContent = texto;
  aviso.className = `aviso ${tipo}`;
}