/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

let PRETRAGA_JEDINI_KANDIDAT = true;
let PRETRAGA_SKRIVENI_SINGL  = true;
let PRETRAGA_UPERENI_PAR     = true;
let PRETRAGA_SKRIVENI_PAR    = true;

let potragaPodaci = {
	lista:       [ ] ,
	indeksHinta: -1 ,
}

let INDEKS_HINTA = 0;

function dodavanjeUListuHintova(lista, hintovi) {
	hintovi.forEach(hint => {
		lista.push(hint);
	});
}

function praznjenjeListeHintova(lista) {
	while(lista.length > 0) {
		lista.pop();
	}
}

function potragaZaHintovima(sudoku_tabela, lista_hintova, automatik) {
	let tabelaRadna   = tabelaSnapshot(sudoku_tabela);
	potragaPodaci.indeksHinta = 0;
	
	if(automatik) {
		azuriranjeKandidataOsnovno(tabelaRadna, automatik)
	}

	praznjenjeListeHintova(lista_hintova);

	let rezJediniKandidat = potragaZaHintovimaJediniKandidat(tabelaRadna, potragaPodaci);
	dodavanjeUListuHintova(lista_hintova, rezJediniKandidat);
	
	let rezSkriveniSingl = potragaZaHintovimaSkriveniSingl(tabelaRadna, potragaPodaci);
	dodavanjeUListuHintova(lista_hintova, rezSkriveniSingl);
	
	let rezUpereniPar = potragaZaHintovimaUpereniPar(tabelaRadna, potragaPodaci);
	dodavanjeUListuHintova(lista_hintova, rezUpereniPar);

	let rezSkriveniPar = potragaZaHintovimaSkriveniPar(tabelaRadna, potragaPodaci);
	dodavanjeUListuHintova(lista_hintova, rezSkriveniPar);

	for(let i = 0; i < lista_hintova.length; i++) {
		lista_hintova[i].indeks = i + 1;
	}
}
