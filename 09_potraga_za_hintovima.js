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

function potragaZaHintovima(sudoku_tabela, lista_hintova) {
	let tabelaRadna = tabelaSnapshot(sudoku_tabela);
	azuriranjeKandidataOsnovno(tabelaRadna, true)

	praznjenjeListeHintova(lista_hintova);
	potragaPodaci.indeksHinta = 0;

	let rezJediniKandidat = potragaZaHintovimaJediniKandidat(tabelaRadna, potragaPodaci);
	dodavanjeUListuHintova(lista_hintova, rezJediniKandidat);
	
	/* Ovde će biti i ostali:
	       - skriveni singlovi
	       - parovi
	       - skriveni parovi
	       - pokazujuci parovi
	       - etc ....
	*/
}

function generisanjeHintaJediniKandidat(polje, kandidat, potraga_podaci) {
	let hint = {
		indeks: potraga_podaci.indeksHinta ,
		naslov: `P${polje.indeks} - ${kandidat} - Jedini kandidat` ,
		opis : `<span>Polje #${polje.indeks}</span>
<span>Red: ${polje.red} Kolona: ${polje.kolona}</span>
<span>Vrednost - ${kandidat}</span>
<span>Jedini kandidat</span>

` ,
		listaHint: [
			[ polje.indeks, -1, kandidat , 5 , true, true ] ,
		] ,

		listaIzvrsavanje: [
			[ polje.indeks, kandidat , -1 , 5, false, false ] ,
		] ,
	}

	return hint;
}

function potragaZaHintovimaJediniKandidatJednoPolje(listaHintova, polje, potraga_podaci) {
	if(!polje.otkrivanje) return;
	let kandidati   = polje.kandidati;
	let brKandidata = 0;
	let indeks      = -1; 
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(kandidati[i] > 0) {
			brKandidata++;
			indeks = i;
		}
		if(brKandidata > 1) break;
	}

	if(brKandidata == 1) {
		potraga_podaci.indeksHinta++;
		let hint = generisanjeHintaJediniKandidat(polje, indeks, potraga_podaci);
		listaHintova.push(hint); 
	}
}

function potragaZaHintovimaJediniKandidat(sudoku_tabela, potraga_podaci) {
	let lista_hintova = [ ];

	for(let i = 1; i <= BROJ_POLJA; i++) {
		let polje = sudoku_tabela.tabela[i];
		potragaZaHintovimaJediniKandidatJednoPolje(lista_hintova, polje, potraga_podaci);
	}
	sudoku_tabela

	return lista_hintova;
}