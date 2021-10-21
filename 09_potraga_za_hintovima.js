/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

let DEBUG_PORUKE_FUNKCIJE       = false;

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

function skracivanjeListeHintova(lista_hintova) {
	while(lista_hintova.length > 1) lista_hintova.pop();
}

function azuriranjeIndeksaZaHintove(lista_hintova) {
	for(let i = 0; i < lista_hintova.length; i++) {
		lista_hintova[i].indeks = i + 1;
	}
}

function potragaZaHintovima(sudoku_tabela, lista_hintova, automatik, samo_prvi) {
	
	/* ----- Telemetrija ---------------------------------------------------- */
	// let T1 = performance.now();
	/* ---------------------------------------------------------------------- */

	let zaustavljanje = false;
	let tabelaRadna   = tabelaSnapshot(sudoku_tabela);
	potragaPodaci.indeksHinta = 0;
	
	if(automatik) azuriranjeKandidataOsnovno(tabelaRadna, automatik)
	praznjenjeListeHintova(lista_hintova);

	if(!zaustavljanje) {
		let rezJediniKandidat = potragaZaHintovimaJediniKandidat(tabelaRadna, potragaPodaci);
		dodavanjeUListuHintova(lista_hintova, rezJediniKandidat);
		zaustavljanje = samo_prvi && lista_hintova.length > 0;
	}
	
	if(!zaustavljanje) {
		let rezSkriveniSingl = potragaZaHintovimaSkriveniSingl(tabelaRadna, potragaPodaci);
		dodavanjeUListuHintova(lista_hintova, rezSkriveniSingl);
		zaustavljanje = samo_prvi && lista_hintova.length > 0;
	}
	
	if(!zaustavljanje) {
		let rezUsmereniPar = potragaZaHintovimaUsmereniPar(tabelaRadna, potragaPodaci);
		dodavanjeUListuHintova(lista_hintova, rezUsmereniPar);
		zaustavljanje = samo_prvi && lista_hintova.length > 0;
	}

	if(!zaustavljanje) {
		let rezSkriveniPar = potragaZaHintovimaSkriveniPar(tabelaRadna, potragaPodaci);
		dodavanjeUListuHintova(lista_hintova, rezSkriveniPar);
		zaustavljanje = samo_prvi && lista_hintova.length > 0;
	}

	if(!zaustavljanje) {
		let rezPrepoznatiPar = potragaZaHintovimaPrepoznatiPar(tabelaRadna, potragaPodaci);
		dodavanjeUListuHintova(lista_hintova, rezPrepoznatiPar);
		zaustavljanje = samo_prvi && lista_hintova.length > 0;
	}

	if(!zaustavljanje) {
		let rezPrisvajajuciPar = potragaZaHintovimaPrisvajajuciPar(tabelaRadna, potragaPodaci);
		dodavanjeUListuHintova(lista_hintova, rezPrisvajajuciPar);
		zaustavljanje = samo_prvi && lista_hintova.length > 0;
	}

	if(!zaustavljanje) {
		let rezPrepoznatiTriplet = potragaZaHintovimaPrepoznatiTriplet(tabelaRadna, potragaPodaci);
		dodavanjeUListuHintova(lista_hintova, rezPrepoznatiTriplet);
		zaustavljanje = samo_prvi && lista_hintova.length > 0;
	}

	if(!zaustavljanje) {
		let rezXWing = potragaZaHintovimaXWing(tabelaRadna, potragaPodaci);
		dodavanjeUListuHintova(lista_hintova, rezXWing);
		zaustavljanje = samo_prvi && lista_hintova.length > 0;
	}

	if(!zaustavljanje) {
		let rezXYWing = potragaZaHintovimaXYWing(tabelaRadna, potragaPodaci);
		dodavanjeUListuHintova(lista_hintova, rezXYWing);
		zaustavljanje = samo_prvi && lista_hintova.length > 0;
	}

	if(samo_prvi) skracivanjeListeHintova(lista_hintova);
	azuriranjeIndeksaZaHintove(lista_hintova);
	
	/* ----- Telemetrija ---------------------------------------------------- */
	// let T2    = performance.now();
	// let ODZIV = T2 - T1;
	// console.log(`Vreme obrade Potraga za hintovima: ${ODZIV}ms`);
	/* ---------------------------------------------------------------------- */
}
