const fs = require('fs');
const path = require('path');

const pastaSamples = './samples'; // Substitua pelo caminho completo da pasta "samples"

fs.readdir(pastaSamples, { withFileTypes: true }, (err, pastas) => {
  if (err) {
    console.error('Erro ao ler a pasta "samples":', err);
    return;
  }

  const arrayDeNomes = pastas
    .filter(pasta => pasta.isDirectory())
    .map(pasta => path.join('ts', pasta.name));

  console.log(arrayDeNomes);
});
