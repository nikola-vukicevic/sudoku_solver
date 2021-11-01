/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

let BROJ_REDOVA  = 9;
let BROJ_KOLONA  = 9;
let BROJ_BLOKOVA = 9;
let BROJ_POLJA   = 81;

let STEK_GLAVNI = {
	stekUndo: [ ] ,
	stekRedo: [ ] ,
};

let sudoku_tabela_glavna = {
    aktivnoPolje:             0 ,
    aktivniKandidatKlik:      0 ,
    aktivniKandidatDupliKlik: 0 ,
    izabraniHint:             -1 ,
    brojHintova:              0 ,
    brojPreostalihPolja:      BROJ_POLJA ,
    imaLiGresaka:             false ,
    cestitkaUpucena:          false ,
    iskljuceniKandidat:       0 ,
    iskljuceniKandidatTip:    0 ,
    hintoviAktivni:           false , 
    automatskoAzuriranje:     true  ,
    rezimKreiranjaTabele:     false ,

	tabela: [ ] , // GLAVNA TABELA - popunjava se preko funkcija
                  // generisanjePolja i generisanjeTabele

    zagonetka:  [
		0 ,
		6 , 3 , 7 , 0 , 0 , 0 , 0 , 8 , 1 ,
		0 , 2 , 0 , 0 , 0 , 3 , 0 , 0 , 0 ,
		0 , 0 , 0 , 0 , 1 , 7 , 4 , 3 , 0 ,
		2 , 9 , 6 , 4 , 0 , 0 , 5 , 7 , 0 ,
		0 , 0 , 0 , 7 , 6 , 2 , 0 , 0 , 0 ,
		0 , 8 , 0 , 0 , 0 , 0 , 6 , 2 , 0 ,
		0 , 6 , 0 , 0 , 2 , 0 , 0 , 0 , 0 ,
		3 , 0 , 9 , 0 , 0 , 0 , 0 , 6 , 0 ,
		0 , 0 , 2 , 0 , 0 , 0 , 0 , 0 , 9 ,
	] ,
	
	redovi: [
		[  ] ,
		[  1,  2,  3,  4,  5,  6,  7,  8,  9 ] ,
		[ 10, 11, 12, 13, 14, 15, 16, 17, 18 ] ,
		[ 19, 20, 21, 22, 23, 24, 25, 26, 27 ] ,
		
		[ 28, 29, 30, 31, 32, 33, 34, 35, 36 ] ,
		[ 37, 38, 39, 40, 41, 42, 43, 44, 45 ] ,
		[ 46, 47, 48, 49, 50, 51, 52, 53, 54 ] ,
		
		[ 55, 56, 57, 58, 59, 60, 61, 62, 63 ] ,
		[ 64, 65, 66, 67, 68, 69, 70, 71, 72 ] ,
		[ 73, 74, 75, 76, 77, 78, 79, 80, 81 ] ,
	] ,

	kolone: [
		[  ] ,
		[  1,  10,  19,  28,  37,  46,  55,  64,  73 ] ,
		[  2,  11,  20,  29,  38,  47,  56,  65,  74 ] ,
		[  3,  12,  21,  30,  39,  48,  57,  66,  75 ] ,

		[  4,  13,  22,  31,  40,  49,  58,  67,  76 ] ,
		[  5,  14,  23,  32,  41,  50,  59,  68,  77 ] ,
		[  6,  15,  24,  33,  42,  51,  60,  69,  78 ] ,

		[  7,  16,  25,  34,  43,  52,  61,  70,  79 ] ,
		[  8,  17,  26,  35,  44,  53,  62,  71,  80 ] ,
		[  9,  18,  27,  36,  45,  54,  63,  72,  81 ] ,
	] ,

	blokovi: [
		[  ] ,
		[  1,  2,  3, 10, 11, 12, 19, 20, 21 ] ,
		[  4,  5,  6, 13, 14, 15, 22, 23, 24 ] ,
		[  7,  8,  9, 16, 17, 18, 25, 26, 27 ] ,
		
		[ 28, 29, 30, 37, 38, 39, 46, 47, 48 ] ,
		[ 31, 32, 33, 40, 41, 42, 49, 50, 51 ] ,
		[ 34, 35, 36, 43, 44, 45, 52, 53, 54 ] ,
		
		[ 55, 56, 57, 64, 65, 66, 73, 74, 75 ] ,
		[ 58, 59, 60, 67, 68, 69, 76, 77, 78 ] ,
		[ 61, 62, 63, 70, 71, 72, 79, 80, 81 ] ,
	] ,

	duplikati_redovi: [
		[ ] ,
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  1  2  3  4  5  6  7  8  9
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 10 11 12 13 14 15 16 17 18
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 19 20 21 22 23 24 25 26 27
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 28 29 30 31 32 33 34 35 36
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 37 38 39 40 41 42 43 44 45
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 46 47 48 49 50 51 52 53 54
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 55 56 57 58 59 60 61 62 63
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 64 65 66 67 68 69 70 71 72
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 73 74 75 76 77 78 79 80 81
	] ,

	duplikati_kolone: [
		[ ] ,
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  1 10 19 28 37 46 55 64 73
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  2 11 20 29 38 47 56 65 74
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  3 12 21 30 39 48 57 66 75
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  4 13 22 31 40 49 58 67 76
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  5 14 23 32 41 50 59 68 77
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  6 15 24 33 42 51 60 69 78
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  7 16 25 34 43 52 61 70 79
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  8 17 26 35 44 53 62 71 80
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  9 18 27 36 45 54 63 72 81
	] ,

	duplikati_blokovi: [
		[ ] ,
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  1  2  3 10 11 12 19 20 21
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  4  5  6 13 14 15 22 23 24
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  7  8  9 16 17 18 25 26 27
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 28 29 30 37 38 39 46 47 48
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 31 32 33 40 41 42 49 50 51
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 34 35 36 43 44 45 52 53 54
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 55 56 57 64 65 66 73 74 75
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 58 59 60 67 68 69 76 77 78
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 61 62 63 70 71 72 79 80 81
	] ,
}

function generisanjePolja() {
	let polje = {
		indeks:        -1 ,
		red:           -1 ,
		kolona:        -1 ,
		blok:          -1 ,
		vrednost:       0 ,
		boja:          "#fff" ,
		kandidati:     [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ] ,
		jedanKandidat: false ,
		otkrivanje:    true  ,
		fiksno:        false ,
		greska:        false ,
		okvir:         false ,
	};

	return polje;
}

function generisanjeTabele(sudoku_tabela) {
	let tabela = sudoku_tabela.tabela;
	for(let i = 0; i <= BROJ_POLJA; i++) {
		let polje = generisanjePolja();
		polje.indeks = i;
		polje.red    = Math.floor((polje.indeks - 1) / BROJ_KOLONA) + 1 ,
		polje.kolona = Math.floor((polje.indeks - 1) % BROJ_KOLONA) + 1 , 
		tabela.push(polje);
	}

	upisivanjeBlokova(sudoku_tabela);
}

function upisivanjeBlokova(sudoku_tabela) {
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let blok = sudoku_tabela.blokovi[i];

		for(j = 0; j < blok.length; j++) {
			let polje  = sudoku_tabela.tabela[blok[j]];
			polje.blok = i;
		}
	}
}

function tabelaSnapshot(sudoku_tabela) {
	let json_podaci    = JSON.stringify(sudoku_tabela);
	return JSON.parse(json_podaci);
}

function kopiranjeStrukture(t1, t2) {

	/* ---- obična polja ---------------------------------------------------- */

	t2.aktivnoPolje             = t1.aktivnoPolje;
	t2.aktivniKandidatKlik      = t1.aktivniKandidatKlik;
	t2.aktivniKandidatDupliKlik = t1.aktivniKandidatDupliKlik;
	t2.iskljuceniKandidat       = t1.iskljuceniKandidat;

	/* ----- nizovi --------------------------------------------------------- */

	t2.tabela                   = t1.tabela;
	//t2.zagonetka                = t1.zagonetka.map(x => x);
	//t2.redovi                   = t1.redovi.map(x =>    x);
	//t2.kolone                   = t1.kolone.map(x =>    x);
	//t2.blokovi                  = t1.blokovi.map(x =>   x);
	//t2.duplikati_redovi         = t1.redovi.map(x =>    x);
	//t2.duplikati_kolone         = t1.kolone.map(x =>    x);
	//t2.duplikati_blokovi        = t1.blokovi.map(x =>   x);
}

function generisanjeHTMLPolja(id) {
	let sablon = `<div class='sudoku_polje iskljucena_selekcija' id='sudoku_polje_${id}' ondblclick='poljeDupliKlik(event, sudoku_tabela_glavna, ${id}, 0)'>
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_1' onclick='obradaKlika(event, sudoku_tabela_glavna, ${id}, 1)' oncontextmenu='toggleParKandidata(event, sudoku_tabela_glavna, ${id}, 1)'>1</div>
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_2' onclick='obradaKlika(event, sudoku_tabela_glavna, ${id}, 2)' oncontextmenu='toggleParKandidata(event, sudoku_tabela_glavna, ${id}, 2)'>2</div>
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_3' onclick='obradaKlika(event, sudoku_tabela_glavna, ${id}, 3)' oncontextmenu='toggleParKandidata(event, sudoku_tabela_glavna, ${id}, 3)'>3</div>
	
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_4' onclick='obradaKlika(event, sudoku_tabela_glavna, ${id}, 4)' oncontextmenu='toggleParKandidata(event, sudoku_tabela_glavna, ${id}, 4)'>4</div>
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_5' onclick='obradaKlika(event, sudoku_tabela_glavna, ${id}, 5)' oncontextmenu='toggleParKandidata(event, sudoku_tabela_glavna, ${id}, 5)''>5</div>
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_6' onclick='obradaKlika(event, sudoku_tabela_glavna, ${id}, 6)' oncontextmenu='toggleParKandidata(event, sudoku_tabela_glavna, ${id}, 6)'>6</div>
	
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_7' onclick='obradaKlika(event, sudoku_tabela_glavna, ${id}, 7)' oncontextmenu='toggleParKandidata(event, sudoku_tabela_glavna, ${id}, 7)'>7</div>
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_8' onclick='obradaKlika(event, sudoku_tabela_glavna, ${id}, 8)' oncontextmenu='toggleParKandidata(event, sudoku_tabela_glavna, ${id}, 8)'>8</div>
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_9' onclick='obradaKlika(event, sudoku_tabela_glavna, ${id}, 9)' oncontextmenu='toggleParKandidata(event, sudoku_tabela_glavna, ${id}, 9)'>9</div>
</div>`;
	
	return sablon;
}

function generisanjeHTMLBloka(blok, blok_id) {
	let sadrzaj = "";
		
	blok.forEach(polje => {
		sadrzaj += generisanjeHTMLPolja(polje);
	});

	let sablon = `<div class='sudoku_blok' id='sudoku_blok_${blok_id}'>
	${sadrzaj}
</div>`
	
	return sablon;
}

function generisanjeHTMLTabele(id_tabela, blokovi) {
	let polje   = document.getElementById(id_tabela);
	let sadrzaj = "";

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let blok = blokovi[i];
		sadrzaj += generisanjeHTMLBloka(blok, i);
	}

	polje.innerHTML = sadrzaj;
}

