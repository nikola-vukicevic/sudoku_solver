/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function generisanjeHintaXYWing(lista_hintova, xy_wing, sudoku_tabela) {
	let hint = {
		indeks: -1 ,
		naslov: `XY-Wing - [P${xy_wing.pivot.indeks}|P${xy_wing.krak_1.indeks}|P${xy_wing.krak_2.indeks}]  - Isključivanje vrednosti ${xy_wing.zajednickiKandidat}`,
		opis : `<h3 class='sudoku_h3'>XY-Wing (P${xy_wing.pivot.indeks}, P${xy_wing.krak_1.indeks}, P${xy_wing.krak_2.indeks})</h3>

<p class='sudoku_p'>
	Parovi vrednosti u poljima <strong>P${xy_wing.pivot.indeks}</strong>, <strong>P${xy_wing.krak_1.indeks}</strong> i <strong>P${xy_wing.krak_2.indeks}</strong>, obrazuju <strong>XY-Wing</strong> (specifičan triplet), koji funkcioniše na sledeći način:
</p>

<ul class='sudoku_ul'>
	<li>Polje <strong>P${xy_wing.pivot.indeks}</strong>, koje sadrži par kandidata <strong>${xy_wing.pivotKandidati[0]}</strong> i <strong>${xy_wing.pivotKandidati[1]}</strong> predstavlja uporišno polje ('<strong>pivot</strong>'), koje 'vidi' preostala dva polja ('<strong>krakove</strong>') - <strong>P${xy_wing.krak_1.indeks}</strong> i <strong>P${xy_wing.krak_2.indeks}</strong>, koji se ne 'vide' međusobno</li>
	<li>Ukoliko je kandidat <strong>${xy_wing.pivotKandidati[0]}</strong> rešenje za polje <strong>P${xy_wing.pivot.indeks}</strong>, u polju <strong>P${(xy_wing.krak_1_Kandidati.includes(xy_wing.pivotKandidati[0]))? xy_wing.krak_1.indeks : xy_wing.krak_2.indeks}</strong>, kandidat <strong>${xy_wing.pivotKandidati[0]}</strong> ne može biti rešenje, pa rešenje za polje <strong>P${(xy_wing.krak_1_Kandidati.includes(xy_wing.pivotKandidati[0]))? xy_wing.krak_1.indeks : xy_wing.krak_2.indeks}</strong> mora biti <strong>${xy_wing.zajednickiKandidat}</strong></li>
	<li>Ukoliko je kandidat <strong>${xy_wing.pivotKandidati[1]}</strong> rešenje za polje <strong>P${xy_wing.pivot.indeks}</strong>, u polju <strong>P${(xy_wing.krak_2_Kandidati.includes(xy_wing.pivotKandidati[1]))? xy_wing.krak_2.indeks : xy_wing.krak_1.indeks}</strong>, kandidat <strong>${xy_wing.pivotKandidati[1]}</strong> ne može biti rešenje, pa rešenje za polje <strong>P${(xy_wing.krak_2_Kandidati.includes(xy_wing.pivotKandidati[1]))? xy_wing.krak_2.indeks : xy_wing.krak_1.indeks}</strong> mora biti <strong>${xy_wing.zajednickiKandidat}</strong></li>
<p>
	Budući da jedan od 'krakova' na kraju mora sadržati vrednost <strong>${xy_wing.zajednickiKandidat}</strong> kao rešenje, zaključujemo da se vrednost <strong>${xy_wing.zajednickiKandidat}</strong> može <strong>isključiti</strong> kao kandidat u svim poljima koja istovremeno 'vide' oba 'kraka' - polja <strong>P${xy_wing.krak_1.indeks}</strong> i <strong>P${xy_wing.krak_2.indeks}</strong></li>
</ul>
` ,
		
		listaHint: [
			[ xy_wing.pivot.indeks , -1 , xy_wing.pivotKandidati[0] , 6 , true , true ] ,
			[ xy_wing.pivot.indeks , -1 , xy_wing.pivotKandidati[1] , 6 , true , true ] ,

			[ xy_wing.krak_1.indeks , -1 , xy_wing.krak_1_Kandidati[0] , 6 , true , true ] ,
			[ xy_wing.krak_1.indeks , -1 , xy_wing.krak_1_Kandidati[1] , 6 , true , true ] ,

			[ xy_wing.krak_2.indeks , -1 , xy_wing.krak_2_Kandidati[0] , 6 , true , true ] ,
			[ xy_wing.krak_2.indeks , -1 , xy_wing.krak_2_Kandidati[1] , 6 , true , true ] ,
		] ,

		listaIzvrsavanje: [

		] ,
	}

	iskljucivanjeKandidataXYWing(hint, xy_wing.poljaNaKojaSeUtice, xy_wing.zajednickiKandidat);
	
	lista_hintova.push(hint);
}

function iskljucivanjeKandidataXYWing(hint, polja, zajednicki_kandidat) {
	polja.forEach(polje => {
		if(!polje.otkrivanje) return;
		hint.listaHint.push(        [ polje.indeks, -1 , zajednicki_kandidat , 3 , true , true  ] );
		hint.listaIzvrsavanje.push( [ polje.indeks, -1 , zajednicki_kandidat , 0 , true , false ] );
	})
}

function generisanjeHintovaXYWing(lista_hintova, lista_kandidata, sudoku_tabela) {
	lista_kandidata.forEach(xy_wing => {
		generisanjeHintaXYWing(lista_hintova, xy_wing, sudoku_tabela);
	});
}

function kreiranjeXYWingStruktura(lista_kandidata, sudoku_tabela) {
	let nova_lista = [ ];

	lista_kandidata.forEach(kandidati => {
		let xy_wing = pripremaStruktureXYWing(kandidati, sudoku_tabela);
		if(xy_wing.poljaNaKojaSeUtice.length == 0) return;
		nova_lista.push(xy_wing);
	});

	return nova_lista;
}

function pripremaStruktureXYWing(kandidati, sudoku_tabela) {
	let XY_WingStruktura = {
		pivot:              kandidati[0][0] ,
		pivotKandidati:     kandidati[0][1] ,
		krak_1:             kandidati[1][0] ,
		krak_1_Kandidati:   kandidati[1][1] ,
		krak_2:             kandidati[2][0] ,
		krak_2_Kandidati:   kandidati[2][1] ,
		zajednickiKandidat: null ,
		poljaNaKojaSeUtice: null ,
	}

	XY_WingStruktura.zajednickiKandidat = ocitavanjeZajednickogKandidataXYWing(XY_WingStruktura.krak_1_Kandidati, XY_WingStruktura.krak_2_Kandidati);
	XY_WingStruktura.poljaNaKojaSeUtice = pronalazenjeZajednickihPoljaXYWing(XY_WingStruktura.pivot, XY_WingStruktura.krak_1, XY_WingStruktura.krak_2, XY_WingStruktura.zajednickiKandidat, sudoku_tabela);

	return XY_WingStruktura;
}

function proveraNizaMogucihPoljaXYWing(niz_mogucih, pivot, krak_1, krak_2, zajednicki_kandidat, sudoku_tabela) {
	let niz_proverenih = [ ];
	
	niz_mogucih.forEach(poljeIndeks => {
		let polje = sudoku_tabela.tabela[poljeIndeks];
		if(!polje.otkrivanje)                         return;
		if(polje.kandidati[zajednicki_kandidat] == 0) return;
		if(polje.indeks == pivot.indeks)              return;
		niz_proverenih.push(polje);
	})

	return niz_proverenih;
}

function kreiranjeNizaMogucihPoljaXYWing(pivot, krak_1, krak_2, sudoku_tabela) {
	let red_1    = sudoku_tabela.redovi[krak_1.red];
	let kolona_1 = sudoku_tabela.kolone[krak_1.kolona];
	let blok_1   = sudoku_tabela.blokovi[krak_1.blok];

	let red_2    = sudoku_tabela.redovi[krak_2.red];
	let kolona_2 = sudoku_tabela.kolone[krak_2.kolona];
	let blok_2   = sudoku_tabela.blokovi[krak_2.blok];

	let niz1 = [ ];
	
	niz1 = niz1.concat(red_1);
	niz1 = niz1.concat(kolona_1);
	niz1 = niz1.concat(blok_1);
	
	let niz2 = [ ];
	
	niz2 = niz2.concat(red_2);
	niz2 = niz2.concat(kolona_2);
	niz2 = niz2.concat(blok_2);

	niz1.sort((a, b) => a - b);
	niz2.sort((a, b) => a - b);

	niz1 = uklanjanjeDuplikataNiz(niz1);
	niz2 = uklanjanjeDuplikataNiz(niz2);

	let niz = niz1.concat(niz2);
	niz.sort((a, b) => a - b);
	
	return kopiranjeDuplikataNiz(niz);
}

function pronalazenjeZajednickihPoljaXYWing(pivot, krak_1, krak_2, zajednicki_kandidat, sudoku_tabela) {
	let nizMogucih    = kreiranjeNizaMogucihPoljaXYWing(pivot, krak_1, krak_2, sudoku_tabela);
	let nizProverenih = proveraNizaMogucihPoljaXYWing(nizMogucih, pivot, krak_1, krak_2, zajednicki_kandidat, sudoku_tabela);
	return nizProverenih;
}

function ocitavanjeZajednickogKandidataXYWing(krak_1, krak_2) {
	if(krak_1[0] == krak_2[0]) return krak_1[0];
	if(krak_1[0] == krak_2[1]) return krak_1[0];
	return krak_1[1]
}

function krakoviZajednickiXYWing2(krak_1, krak_2) {
	let niz = [ ];
	
	niz.push(krak_1[0]);
	niz.push(krak_1[1]);
	niz.push(krak_2[0]);
	niz.push(krak_2[1]);

	niz.sort();

	if(niz[0] == niz[1]) return niz[0];
	if(niz[1] == niz[2]) return niz[1];
	if(niz[2] == niz[3]) return niz[2];
}

function daLiSuXYWing(kandidati) {
	let p1 = kandidati[0][0];
	let p2 = kandidati[1][0];
	let p3 = kandidati[2][0];

	let uslov1 = daLiSeVideXYWing(p1, p2) && daLiSeVideXYWing(p1, p3) && !daLiSeVideXYWing(p2, p3);
	if(uslov1) return [ kandidati[0] , kandidati[1] , kandidati[2] ];

	let uslov2 = daLiSeVideXYWing(p2, p1) && daLiSeVideXYWing(p2, p3) && !daLiSeVideXYWing(p1, p3);
	if(uslov2) return [ kandidati[1] , kandidati[0] , kandidati[2] ];

	let uslov3 = daLiSeVideXYWing(p3, p1) && daLiSeVideXYWing(p3, p2) && !daLiSeVideXYWing(p1, p2);
	if(uslov3) return [ kandidati[2] , kandidati[0] , kandidati[1] ];
	
	return null;
}

function daLiSuTripletXYWing(kandidati) {
	let niz = [];
	
	niz.push(kandidati[0][1][0]);
	niz.push(kandidati[0][1][1]);
	niz.push(kandidati[1][1][0]);
	niz.push(kandidati[1][1][1]);
	niz.push(kandidati[2][1][0]);
	niz.push(kandidati[2][1][1]);
	
	niz.sort();

	return niz[0] == niz[1] && niz[2] == niz[3] && niz[4] == niz[5];
}

function daLiSeVideXYWing(polje_1, polje_2) {
	return polje_1.red    == polje_2.red    ||
	       polje_1.kolona == polje_2.kolona ||
	       polje_1.blok   == polje_2.blok;
}

function filtriranjeKombinacijaXYWing(lista_kandidata) {
	let novaLista = [ ];

	lista_kandidata.forEach(kandidati => {
		if(!daLiSuTripletXYWing(kandidati)) return;
		let rez = daLiSuXYWing(kandidati);
		if(!rez) return;
		novaLista.push(rez);
		//novaLista.push(kandidati);
	});

	return novaLista;
}

function kreiranjeKombinacijaXYWing(lista_kandidata) {
	let novaLista = [ ];

	for(let i = 0; i < lista_kandidata.length - 2; i++) {
		for(let j = i + 1; j < lista_kandidata.length - 1; j++) {
			for(let k = j + 1; k < lista_kandidata.length; k++) {
				novaLista.push( [ lista_kandidata[i] , lista_kandidata[j] , lista_kandidata[k] ] );
			}
		}
	}

	return novaLista;
}

function prebrojavanjeKandidataXYWing(polje) {
	let listaKandidata = [ ];

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(polje.kandidati[i] > 0) {
			listaKandidata.push(i);
		}

		if(listaKandidata.length > 2) return null;
	}

	if(listaKandidata.length < 2) return null;

	return( [ polje, listaKandidata ] );
}

function pronalazenjeParovaXYWing(sudoku_tabela, lista_parova) {
	let polja = sudoku_tabela.tabela;
	
	for(let i = 1; i <= BROJ_POLJA; i++) {
		let rez = prebrojavanjeKandidataXYWing(polja[i]);
		if(rez != null) {
			lista_parova.push(rez);
		}
	}
}

function potragaZaHintovimaXYWing(sudoku_tabela) {
	if(!PRETRAGA_XY_WING) return [ ];

	/* ----- Telemetrija ---------------------------------------------------- */
	let T1 = performance.now();
	/* ---------------------------------------------------------------------- */

	let listaHintova   = [ ];
	let listaKandidata = [ ];

	pronalazenjeParovaXYWing(sudoku_tabela, listaKandidata);
	if(listaKandidata.length < 3) return [ ];

	listaKandidata = kreiranjeKombinacijaXYWing(listaKandidata);
	listaKandidata = filtriranjeKombinacijaXYWing(listaKandidata);
	console.log(listaKandidata);
	listaKandidata = kreiranjeXYWingStruktura(listaKandidata, sudoku_tabela);
	console.log(listaKandidata);

	if(listaKandidata.length < 1) return [ ];

	generisanjeHintovaXYWing(listaHintova, listaKandidata, sudoku_tabela);
	
	/* ----- Telemetrija ---------------------------------------------------- */
	let T2    = performance.now();
	let ODZIV = T2 - T1;
	console.log(`Vreme obrade XY-Wing: ${ODZIV}ms`);
	/* ---------------------------------------------------------------------- */

	return listaHintova;
}