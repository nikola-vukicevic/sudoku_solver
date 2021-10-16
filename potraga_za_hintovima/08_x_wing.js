/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function generisanjeHintaXWing(lista_hintova, x_wing, sudoku_tabela) {
	let hint = {
		indeks: -1 ,
		naslov: `X-Wing - [P${x_wing.polje_1.indeks}|P${x_wing.polje_2.indeks}|P${x_wing.polje_3.indeks}|P${x_wing.polje_4.indeks}] - Isključivanje vrednosti ${x_wing.vrednostIsklj}`,
		opis : `<h3 class='sudoku_h3'>X-Wing (P${x_wing.polje_1.indeks}, P${x_wing.polje_2.indeks}, P${x_wing.polje_3.indeks}, P${x_wing.polje_4.indeks})</h3>

<p class='sudoku_p'>
	U <strong>${ (x_wing.tip == "Red")? x_wing.polje_1.red : x_wing.polje_1.kolona }</strong>. i <strong>${ (x_wing.tip == "Red")? x_wing.polje_3.red : x_wing.polje_3.kolona }. ${x_wing.gramatika_1}</strong>, kandidat <strong>${x_wing.vrednostIsklj}</strong> pojavljuje se po dva puta, u <strong>${ (x_wing.tip == "Red")? x_wing.polje_1.kolona : x_wing.polje_1.red }</strong>. i <strong>${ (x_wing.tip == "Red")? x_wing.polje_2.kolona : x_wing.polje_2.red }. ${x_wing.gramatika_2}</strong> (u poljima <strong>P${x_wing.polje_1.indeks}</strong>, <strong>P${x_wing.polje_2.indeks}</strong>, <strong>P${x_wing.polje_3.indeks}</strong> i <strong>P${x_wing.polje_4.indeks}</strong>).
</p>

<p class='sudoku_p'>
	U krajnjem rešenju, postoje dve mogućnosti za upisivanje vrednosti <strong>${x_wing.vrednostIsklj}</strong> u navedena polja:
</p>

<ul class='sudoku_ul'>
	<li>kandidat <strong>${x_wing.vrednostIsklj}</strong> može se pojaviti u poljima <strong>P${x_wing.polje_1.indeks}</strong> i <strong>P${x_wing.polje_4.indeks}</strong>, na suprotnim krajevima X-Wing strukture (ili)</li>
	<li>kandidat <strong>${x_wing.vrednostIsklj}</strong> može se pojaviti u preostala dva polja, <strong>P${x_wing.polje_2.indeks}</strong> i <strong>P${x_wing.polje_3.indeks}</strong> (takođe na suprotnim krajevima </strong>X-Wing</strong> strukture)</li>
</ul>

<p class='sudoku_p'>
	Budući da se kandidat <strong>${x_wing.vrednostIsklj}</strong> obavezno mora pojaviti u <strong>${ (x_wing.tip == "Red")? x_wing.polje_1.kolona : x_wing.polje_1.red }</strong>. i <strong>${ (x_wing.tip == "Red")? x_wing.polje_2.kolona : x_wing.polje_2.red }. ${x_wing.gramatika_2}</strong>, u okviru X-Wing strukture, svi ostali kandidati sa vrednošću <strong>${x_wing.vrednostIsklj}</strong>, u <strong>${ (x_wing.tip == "Red")? x_wing.polje_1.kolona : x_wing.polje_1.red }</strong>. i <strong>${ (x_wing.tip == "Red")? x_wing.polje_2.kolona : x_wing.polje_2.red }. ${x_wing.gramatika_2}</strong>, mogu se ukloniti.
</p>` ,
		
		listaHint: [
			[ x_wing.polje_1.indeks , -1 , x_wing.vrednostIsklj , 6 , true , true ] ,
			[ x_wing.polje_2.indeks , -1 , x_wing.vrednostIsklj , 6 , true , true ] ,
			[ x_wing.polje_3.indeks , -1 , x_wing.vrednostIsklj , 6 , true , true ] ,
			[ x_wing.polje_4.indeks , -1 , x_wing.vrednostIsklj , 6 , true , true ] ,
		] ,

		listaIzvrsavanje: [	] ,
	}

	iskljucivanjeKandidataXWing(hint, x_wing.poljaKandidati, x_wing.vrednostIsklj);
	
	lista_hintova.push(hint);
}

function iskljucivanjeKandidataXWing(hint, polja, vrednost) {
	polja.forEach(polje => {
		if(!polje.otkrivanje) return;
		hint.listaHint.push(        [ polje.indeks, -1 , vrednost , 3 , true , true  ] );
		hint.listaIzvrsavanje.push( [ polje.indeks, -1 , vrednost , 0 , true , false ] );
	})
}


function generisanjeHintovaXWing(lista_hintova, lista_kandidata, sudoku_tabela) {
	lista_kandidata.forEach(x_wing => {
		generisanjeHintaXWing(lista_hintova, x_wing, sudoku_tabela);
	});
}

function precesljavanjePoprecnihKolonaXWing(kandidati, niz, polje_1, polje_2, vrednost, sudoku_tabela) {
	niz.forEach(poljeIndeks => {
		let polje = sudoku_tabela.tabela[poljeIndeks];
		if(!polje.otkrivanje)                                                return;
		if(polje.kandidati[vrednost] == 0)                                   return;
		if(polje.indeks == polje_1.indeks || polje.indeks == polje_2.indeks) return;
		kandidati.push(polje);
	});
}

function precesljavanjePoprecnihXWing(kandidati, niz_1, niz_2, polje_1, polje_2, polje_3, polje_4, vrednost, sudoku_tabela) {
	precesljavanjePoprecnihKolonaXWing(kandidati, niz_1, polje_1, polje_3, vrednost, sudoku_tabela);
	precesljavanjePoprecnihKolonaXWing(kandidati, niz_2, polje_2, polje_4, vrednost, sudoku_tabela);
}

function imaLiSvrheXWing(polje_1, polje_2, polje_3, polje_4, niz_tip, vrednost, sudoku_tabela) {
	let niz_1, niz_2, kandidati = [ ];

	if(niz_tip == 1) {
		niz_1 = sudoku_tabela.kolone[polje_1.kolona];
		niz_2 = sudoku_tabela.kolone[polje_2.kolona];
	}
	else {
		niz_1 = sudoku_tabela.redovi[polje_1.red];
		niz_2 = sudoku_tabela.redovi[polje_2.red];
	}

	precesljavanjePoprecnihXWing(kandidati, niz_1, niz_2, polje_1, polje_2, polje_3, polje_4, vrednost, sudoku_tabela);

	return kandidati;
}

function kreiranjePojedinacneXWingStrukture(niz_kandidata, kandidati, niz_tip, sudoku_tabela) {
	let x_wing = {
		tip:            (niz_tip == 1)? "Red"    : "Kolona" ,
		gramatika_1:    (niz_tip == 1)? "redu"   : "koloni" ,
		gramatika_2:    (niz_tip == 1)? "koloni" : "redu"   ,
		vrednostIsklj:  kandidati[0][0] ,
		polje_1:        kandidati[0][2] ,
		polje_2:        kandidati[0][3] ,
		polje_3:        kandidati[1][2] ,
		polje_4:        kandidati[1][3] ,
		poljaKandidati: null ,
	}

	let rez = imaLiSvrheXWing(x_wing.polje_1, x_wing.polje_2, x_wing.polje_3, x_wing.polje_4, niz_tip, x_wing.vrednostIsklj, sudoku_tabela);
	if(rez.length == 0) return;

	x_wing.poljaKandidati = rez;

	niz_kandidata.push(x_wing);
}

function kreiranjeXWingStruktura(lista_kandidata, niz_kandidata, niz_tip, sudoku_tabela) {
	niz_kandidata.forEach(kandidati => {
		kreiranjePojedinacneXWingStrukture(lista_kandidata /* novi */, kandidati, niz_tip, sudoku_tabela);
	});
}

function filtriranjeKombinacijaXWing(kombinacije, niz_tip) {
	let novi = [ ];

	for(let i = 0; i < kombinacije.length; i++) {
		let k1 = kombinacije[i][0];
		let k2 = kombinacije[i][1];
		let uslov = null;
		
		if(k1[0] != k2[0]) continue
		
		if(niz_tip == 1) {
			uslov = k1[2].kolona != k2[2].kolona || k1[3].kolona != k2[3].kolona;
		}
		else {
			uslov = k1[2].red != k2[2].red || k1[3].red != k2[3].red;
		}
		
		if(uslov) continue;
		
		novi.push( [ k1, k2 ] );
	}

	return novi;
}

function kreiranjeKombinacijaXWing(kandidati, niz_tip) {
	let novi = [ ];

	for(let i = 0; i < kandidati.length - 1; i++) {
		for(let j = i + 1; j < kandidati.length; j++) {
			novi.push( [ kandidati[i] , kandidati [j] ] );
		}
	}

	return novi;
}

function popunjavanjeKandidataXWing(polje, niz_prebrojavanje) {
	polje.kandidati.forEach((kandidat, i) => {
		if(kandidat > 0) {
			niz_prebrojavanje[i][0]++;
			niz_prebrojavanje[i][1].push(polje);
		}
	})
}

function pronalazenjeParovaJedanNizXWing(niz_indeks, niz, niz_prebrojavanje, sudoku_tabela) {
	let nizPom = [ ];
	for(let i = 0; i <= BROJ_BLOKOVA; i++) nizPom.push( [ 0 , [ ] ] );
	
	for(let i = 0; i < niz.length; i++) {
		let polje = sudoku_tabela.tabela[niz[i]];
		if(!polje.otkrivanje) continue;
		popunjavanjeKandidataXWing(polje, nizPom);
	}
	
	for(let i = 1; i < nizPom.length; i++) {
		if(nizPom[i][0] == 2) {
			niz_prebrojavanje.push( [ i , niz_indeks, nizPom[i][1][0] , nizPom[i][1][1] ] );
		}
	}
}

function pronalazenjeParovaWing(niz_tip, sudoku_tabela) {
	let nizKandidati = [ ];

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let niz = (niz_tip == 1)? sudoku_tabela.redovi[i] : sudoku_tabela.kolone[i];
		let nizPom = [ ];
		
		pronalazenjeParovaJedanNizXWing(i, niz, nizPom, sudoku_tabela);
		if(nizPom.length == 0) continue;
		
		nizPom.forEach(kandidat => {
			nizKandidati.push(kandidat);
		});
	}

	return nizKandidati;
}

function pretragaXWingNiz(lista_kandidata, niz_tip, sudoku_tabela) {
	let nizKandidati = null;
	nizKandidati = pronalazenjeParovaWing(niz_tip, sudoku_tabela);
	console.log(nizKandidati);
	nizKandidati = kreiranjeKombinacijaXWing(nizKandidati, niz_tip);
	nizKandidati = filtriranjeKombinacijaXWing(nizKandidati, niz_tip);
	kreiranjeXWingStruktura(lista_kandidata, nizKandidati, niz_tip, sudoku_tabela);
}

function potragaZaHintovimaXWing(sudoku_tabela) {
	if(!PRETRAGA_X_WING) return [ ];

	let listaHintova   = [ ];
	let listaKandidata = [ ];

	pretragaXWingNiz(listaKandidata, 1, sudoku_tabela); // 1 - red
	pretragaXWingNiz(listaKandidata, 2, sudoku_tabela); // 2 - kolona
	generisanjeHintovaXWing(listaHintova, listaKandidata, sudoku_tabela);
	
	return listaHintova;
}