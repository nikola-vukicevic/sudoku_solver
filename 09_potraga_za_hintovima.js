/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

let DEBUG_PORUKE_FUNKCIJE       = true;

/* ----- Pojedinačne tehnike - uključivanje / isključivanje ----------------- */

let PRETRAGA_JEDINI_KANDIDAT    = true;
let PRETRAGA_SKRIVENI_SINGL     = true;
let PRETRAGA_USMERENI_PAR       = true;
let PRETRAGA_SKRIVENI_PAR       = true;
let PRETRAGA_PREPOZNATI_PAR     = true;
let PRETRAGA_PRISVAJAJUCI_PAR   = true;
let PRETRAGA_PREPOZNATI_TRIPLET = true;
let PRETRAGA_X_WING             = true;
let PRETRAGA_XY_WING            = true;

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
	
	/* ----- Telemetrija ---------------------------------------------------- */
	let T1 = performance.now();
	/* ---------------------------------------------------------------------- */

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
	
	let rezUsmereniPar = potragaZaHintovimaUsmereniPar(tabelaRadna, potragaPodaci);
	dodavanjeUListuHintova(lista_hintova, rezUsmereniPar);

	let rezSkriveniPar = potragaZaHintovimaSkriveniPar(tabelaRadna, potragaPodaci);
	dodavanjeUListuHintova(lista_hintova, rezSkriveniPar);

	let rezPrepoznatiPar = potragaZaHintovimaPrepoznatiPar(tabelaRadna, potragaPodaci);
	dodavanjeUListuHintova(lista_hintova, rezPrepoznatiPar);

	let rezPrisvajajuciPar = potragaZaHintovimaPrisvajajuciPar(tabelaRadna, potragaPodaci);
	dodavanjeUListuHintova(lista_hintova, rezPrisvajajuciPar);

	let rezPrepoznatiTriplet = potragaZaHintovimaPrepoznatiTriplet(tabelaRadna, potragaPodaci);
	dodavanjeUListuHintova(lista_hintova, rezPrepoznatiTriplet);

	let rezXWing = potragaZaHintovimaXWing(tabelaRadna, potragaPodaci);
	dodavanjeUListuHintova(lista_hintova, rezXWing);

	let rezXYWing = potragaZaHintovimaXYWing(tabelaRadna, potragaPodaci);
	dodavanjeUListuHintova(lista_hintova, rezXYWing);

	for(let i = 0; i < lista_hintova.length; i++) {
		lista_hintova[i].indeks = i + 1;
	}

	/* ----- Telemetrija ---------------------------------------------------- */
	let T2    = performance.now();
	let ODZIV = T2 - T1;
	console.log(`Vreme obrade Potraga za hintovima: ${ODZIV}ms`);
	/* ---------------------------------------------------------------------- */
}
