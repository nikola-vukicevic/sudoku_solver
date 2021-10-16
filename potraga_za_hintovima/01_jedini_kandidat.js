/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function generisanjeHintaJediniKandidat(polje, kandidat) {
	let hint = {
		indeks: -1 ,
		naslov: `Jedini kandidat [P${polje.indeks}] - ${kandidat}` ,
		opis : `<h3 class='sudoku_h3'>Jedini kandidat (P${polje.indeks})</h3>

<p class='sudoku_p'>
	Prostim ažuriranjem kandidata za polje <strong>P${polje.indeks}</strong>, shodno uključenim vrednostima u <strong>${polje.red}</strong>. redu, <strong>${polje.kolona}</strong>. koloni i bloku <strong>#${polje.blok}</strong> (kojima polje pripada), dobija se da je vrednost <strong>${kandidat} jedini kandidat</strong> u polju <strong>P${polje.indeks}</strong>.
</p>		

<p class='sudoku_p'>
	Vrednost se može neposredno usvojiti kao <strong>rešenje</strong>.
</p>` ,
		listaHint: [
			[ polje.indeks, -1, kandidat , 5 , true, true ] ,
		] ,

		listaIzvrsavanje: [
			[ polje.indeks, kandidat , -1 , 5, false, false ] ,
		] ,
	}

	return hint;
}

function potragaZaHintovimaJediniKandidatJednoPolje(listaHintova, polje) {
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
		polje.jedanKandidat = true;
		let hint = generisanjeHintaJediniKandidat(polje, indeks);
		listaHintova.push(hint); 
	}
}

function potragaZaHintovimaJediniKandidat(sudoku_tabela) {
	if(!PRETRAGA_JEDINI_KANDIDAT) return [ ];
	
	let lista_hintova = [ ];

	for(let i = 1; i <= BROJ_POLJA; i++) {
		let polje = sudoku_tabela.tabela[i];
		potragaZaHintovimaJediniKandidatJednoPolje(lista_hintova, polje);
	}
	
	return lista_hintova;
}