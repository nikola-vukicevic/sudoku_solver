/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

let sacuvanaTabela     = null;
let listaHintova       = [ ];
let BOJA_POLJA_DEFAULT = "#fff";
let BOJA_POLJA_GRESKA  = "#ee625c";
let BOJA_POLJA_1       = "#f3fff3";
let BOJA_POLJA_2       = "#f3fff3";
let BOJA_POLJA_3       = "#f3fff3";
let BOJA_POLJA_4       = "#f3fff3";
let BOJA_POLJA_5       = "#f3fff3";
let BOJA_HINT_1_1      = "#f3fff3"; // zeleno - traka
let BOJA_HINT_1_2      = "#E2FFE2"; // zeleno - polje
let BOJA_HINT_2_1      = "#f3f9ff"; // plavo  - traka
let BOJA_HINT_2_2      = "#e1f0ff"; // plavo  - polje
let BOJA_HINT_3_1      = "#fff6f5"; // crveno - traka
let BOJA_HINT_3_2      = "#fbe5e4"; // crveno - polje

function generisanjeHintova(sudoku_tabela, automatik, samo_prvi) {
	if(sudoku_tabela.hintoviAktivni) {
		alert("Nije moguće pozivati komande dok su hintovi aktivni.");
		return;
	}
	
	/* ----- telemetrija ---------------------------------------------------- */
	let t1 = performance.now();
	/* ---------------------------------------------------------------------- */

	sudoku_tabela.automatskoAzuriranje = automatik;

	sacuvanaTabela = tabelaSnapshot(sudoku_tabela);
	potragaZaHintovima(sudoku_tabela, listaHintova, automatik, samo_prvi);

	if(listaHintova.length == 0) return;

	popunjavanjeListeHintova(sudoku_tabela, listaHintova);
	biranjePrvogHinta(sudoku_tabela);

	sudoku_tabela.hintoviAktivni = true;
	sudoku_tabela.brojHintova    = listaHintova.length;

	/* ----- telemetrija ---------------------------------------------------- */
	let t2 = performance.now();
	let odziv = t2 - t1;
	console.log("------------------------------")
	console.log(`GENERISANJE HINTOVA: ${odziv}ms`)
	console.log("------------------------------")
}

function biranjePrvogHinta(sudoku_tabela) {
	prikazHinta(sudoku_tabela, sacuvanaTabela, listaHintova, 1);
}

function izvrsavanjeHinta(sudoku_tabela, hint) {
	let polje = sudoku_tabela.tabela[hint[0]];

	/*
		      0          1            2             3          4          5      6
		[ polje_id , vrednost , poljeKandidat , vrednost , otkrivanje , okvir , boja ]
	*/

	if(hint[1] != -1) polje.vrednost = hint[1];
	
	if(hint[2] != -1 && hint[3] != -1) {
		polje.kandidati[hint[2]] = hint[3];
	}
	
	polje.otkrivanje = hint[4];
	polje.okvir      = hint[5];
	if(hint[6] != null) polje.boja = hint[6];
}

function izvrsavanjeListeHintova(sudoku_tabela, hint, rezim) {
	if(rezim == 1) {
		for(let i = 0; i < hint.listaHint.length; i++) {
			izvrsavanjeHinta(sudoku_tabela, hint.listaHint[i]);
		}
	}
	else {
		for(let i = 0; i < hint.listaIzvrsavanje.length; i++) {
			izvrsavanjeHinta(sudoku_tabela, hint.listaIzvrsavanje[i]);
		}	
	}

}

// Generisanje tabele sa "utisnutim" oznakama koje odgovaraju listi hintova

function generisanjeHintTabele(sudoku_tabela, hint, rezim) {
	let tabela_hintovi = tabelaSnapshot(sudoku_tabela);
	
	if(sudoku_tabela.automatskoAzuriranje) {
		if(rezim == 1) azuriranjeKandidataOsnovno(tabela_hintovi, true);
	}

	izvrsavanjeListeHintova(tabela_hintovi, hint, rezim);
	return tabela_hintovi;
}

function popunjavanjeListeHintova(sudoku_tabela, lista_hintova) {
	let poljeHintovi = document.getElementById("hintovi_lista");
	let s = "";

	for(let i = 0; i < lista_hintova.length; i++) {
		s += generisanjeHinta(sudoku_tabela, lista_hintova[i]);
	}

	poljeHintovi.innerHTML = s;
}

function generisanjeHinta(sudoku_tabela, hint) {
	let sablon = `
<div class='hint_pojedinacni iskljucena_selekcija' id='hint_pojedinacni_${hint.indeks}' onclick='prikazHinta(sudoku_tabela_glavna, sacuvanaTabela, listaHintova, ${hint.indeks})'>
	<span class='hint_pojedinacni_tekst'>
		${hint.naslov}
	</span>
	<div class='hint_pojedinacni_razdvajac'>
	</div>
	<button id='dugme_hint_otkazivanje_${hint.indeks}' class='hint_pojedinacni_dugme dugme_skrivanje' onclick='otkazivanjeHintaEvent(event, sudoku_tabela_glavna, sacuvanaTabela)'>Otkazivanje</button>
	<button id='dugme_hint_ok_${hint.indeks}'          class='hint_pojedinacni_dugme'                 onclick='usvajanjeHintaEvent(event, sudoku_tabela_glavna, sacuvanaTabela, listaHintova, ${hint.indeks})'>OK</button>
</div>
`;

	return sablon;
}

function deselektovanjeHintTraka() {
	let listaHintova = document.getElementById("hintovi_lista");
	let hintovi      = listaHintova.children;
	
	for(let i = 0; i < hintovi.length; i++) {
		hintovi[i].classList.remove("hint_pojedinacni_izabrani");
		let dugmeOtkazivanje = document.getElementById(`dugme_hint_otkazivanje_${i + 1}`);
		dugmeOtkazivanje.classList.add("dugme_skrivanje");
	}
}

function bojenjeNizaHint(hint, niz, boja, sudoku_tabela) {
	niz.forEach(poljeIndeks => {
		let polje = sudoku_tabela.tabela[poljeIndeks];
		hint.listaHint.push( [ poljeIndeks , -1 , -1  , -1 , polje.otkrivanje , false , boja  ] )
	});
}

function prikazHinta(sudoku_tabela, sacuvana_tabela, hintovi_lista, hint_indeks) {
	let hintTraka        = document.getElementById(`hint_pojedinacni_${hint_indeks}`);
	let hintoviInfo      = document.getElementById(`hintovi_info`);
	let dugmeOtkazivanje = document.getElementById(`dugme_hint_otkazivanje_${hint_indeks}`);

	sudoku_tabela.izabraniHint = hint_indeks;
	
	deselektovanjeHintTraka();
	hintTraka.classList.add("hint_pojedinacni_izabrani");
	
	hintoviInfo.innerHTML = hintovi_lista[hint_indeks - 1].opis;
	dugmeOtkazivanje.classList.remove("dugme_skrivanje");

	let tabelaHintovi = generisanjeHintTabele(sacuvana_tabela, hintovi_lista[hint_indeks - 1], 1);
	kopiranjeStrukture(tabelaHintovi, sudoku_tabela);
	azuriranjePrikazaTabele(sudoku_tabela, false);
}

function usvajanjeHintaEvent(event, sudoku_tabela, sacuvana_tabela, hintovi_lista, hint_indeks) {
	event.stopPropagation();
	usvajanjeHinta(sudoku_tabela, sacuvana_tabela, hintovi_lista, hint_indeks);
}

function usvajanjeHinta(sudoku_tabela, sacuvana_tabela, hintovi_lista, hint_indeks) {
	sudoku_tabela.hintoviAktivni       = false;
	sudoku_tabela.automatskoAzuriranje = true;
	let hintoviLista = document.getElementById(`hintovi_lista`);
	let hintoviInfo  = document.getElementById(`hintovi_info`);
	
	hintoviLista.innerHTML = "";
	hintoviInfo.innerHTML  = "";

	let tabelaHintovi = generisanjeHintTabele(sacuvana_tabela, hintovi_lista[hint_indeks - 1], 2);
	kopiranjeStrukture(tabelaHintovi, sudoku_tabela);
	azuriranjeKandidataOsnovno(sudoku_tabela, false); // ???
	upisNaUndoStek(sudoku_tabela, STEK_GLAVNI);
}

function otkazivanjeHintaEvent(event, sudoku_tabela, sacuvana_tabela){
	event.stopPropagation();
	otkazivanjeHinta(sudoku_tabela, sacuvana_tabela);
}

function otkazivanjeHinta(sudoku_tabela, sacuvana_tabela) {
	resetHintova();
	kopiranjeStrukture(sacuvana_tabela, sudoku_tabela);
	sudoku_tabela.hintoviAktivni       = false;
	sudoku_tabela.automatskoAzuriranje = true;
	//console.log(sudoku_tabela_glavna.automatskoAzuriranje)
	azuriranjePrikazaTabele(sudoku_tabela, false);
}
