let BROJ_POLJA   = 81;
let BROJ_BLOKOVA = 9;

let sudoku_jednostavni = [
 	0 ,
 	
 	6 , 3 , 7   ,   0 , 0 , 0   ,   0 , 8 , 1 ,
 	0 , 2 , 0   ,   0 , 0 , 3   ,   0 , 0 , 0 ,
 	0 , 0 , 0   ,   0 , 1 , 7   ,   4 , 3 , 0 ,
 	
 	2 , 9 , 6   ,   4 , 0 , 0   ,   5 , 7 , 0 ,
 	0 , 0 , 0   ,   7 , 6 , 2   ,   0 , 0 , 0 ,
 	0 , 8 , 0   ,   0 , 0 , 0   ,   6 , 2 , 0 ,
 	
 	0 , 6 , 0   ,   0 , 2 , 0   ,   0 , 0 , 0 ,
 	3 , 0 , 9   ,   0 , 0 , 0   ,   0 , 6 , 0 ,
 	0 , 0 , 2   ,   0 , 0 , 0   ,   0 , 0 , 9 ,
 ];

let sudoku_tabela = [
	0 ,

    //-                 //-                 //-                     //-                 //-                  //                     //-                 //-                 //-
	
	[ 0 , 1 , 1 , 1 ] , [ 0 , 1 , 2 , 1 ] , [ 0 , 1 , 3 , 1 ]   ,   [ 0 , 1 , 4 , 2 ] , [ 0 , 1 , 5 , 2 ] , [ 0 , 1 , 6 , 2 ]   ,   [ 0 , 1 , 7 , 3 ] , [ 0 , 1 , 8 , 3 ] , [ 0 , 1 , 9 , 3 ] ,  // 1
	[ 0 , 2 , 1 , 1 ] , [ 0 , 2 , 2 , 1 ] , [ 0 , 2 , 3 , 1 ]   ,   [ 0 , 2 , 4 , 2 ] , [ 0 , 2 , 5 , 2 ] , [ 0 , 2 , 6 , 2 ]   ,   [ 0 , 2 , 7 , 3 ] , [ 0 , 2 , 8 , 3 ] , [ 0 , 2 , 9 , 3 ] ,  // 2
	[ 0 , 3 , 1 , 1 ] , [ 0 , 3 , 2 , 1 ] , [ 0 , 3 , 3 , 1 ]   ,   [ 0 , 3 , 4 , 2 ] , [ 0 , 3 , 5 , 2 ] , [ 0 , 3 , 6 , 2 ]   ,   [ 0 , 3 , 7 , 3 ] , [ 0 , 3 , 8 , 3 ] , [ 0 , 3 , 9 , 3 ] ,  // 3
	
	//-                 //-                 //-                     //-                 //-                  //                     //-                 //-                 //-
	
	[ 0 , 4 , 1 , 4 ] , [ 0 , 4 , 2 , 4 ] , [ 0 , 4 , 3 , 4 ]   ,   [ 0 , 4 , 4 , 5 ] , [ 0 , 4 , 5 , 5 ] , [ 0 , 4 , 6 , 5 ]   ,   [ 0 , 4 , 7 , 6 ] , [ 0 , 4 , 8 , 6 ] , [ 0 , 4 , 9 , 6 ] ,  // 4
	[ 0 , 5 , 1 , 4 ] , [ 0 , 5 , 2 , 4 ] , [ 0 , 5 , 3 , 4 ]   ,   [ 0 , 5 , 4 , 5 ] , [ 0 , 5 , 5 , 5 ] , [ 0 , 5 , 6 , 5 ]   ,   [ 0 , 5 , 7 , 6 ] , [ 0 , 5 , 8 , 6 ] , [ 0 , 5 , 9 , 6 ] ,  // 5
	[ 0 , 6 , 1 , 4 ] , [ 0 , 6 , 2 , 4 ] , [ 0 , 6 , 3 , 4 ]   ,   [ 0 , 6 , 4 , 5 ] , [ 0 , 6 , 5 , 5 ] , [ 0 , 6 , 6 , 5 ]   ,   [ 0 , 6 , 7 , 6 ] , [ 0 , 6 , 8 , 6 ] , [ 0 , 6 , 9 , 6 ] ,  // 6
	
	//-                 //-                 //-                     //-                 //-                  //                     //-                 //-                 //-
	
	[ 0 , 7 , 1 , 7 ] , [ 0 , 7 , 2 , 7 ] , [ 0 , 7 , 3 , 7 ]   ,   [ 0 , 7 , 4 , 8 ] , [ 0 , 7 , 5 , 8 ] , [ 0 , 7 , 6 , 8 ]   ,   [ 0 , 7 , 7 , 9 ] , [ 0 , 7 , 8 , 9 ] , [ 0 , 7 , 9 , 9 ] ,  // 7
	[ 0 , 8 , 1 , 7 ] , [ 0 , 8 , 2 , 7 ] , [ 0 , 8 , 3 , 7 ]   ,   [ 0 , 8 , 4 , 8 ] , [ 0 , 8 , 5 , 8 ] , [ 0 , 8 , 6 , 8 ]   ,   [ 0 , 8 , 7 , 9 ] , [ 0 , 8 , 8 , 9 ] , [ 0 , 8 , 9 , 9 ] ,  // 8
	[ 0 , 9 , 1 , 7 ] , [ 0 , 9 , 2 , 7 ] , [ 0 , 9 , 3 , 7 ]   ,   [ 0 , 9 , 4 , 8 ] , [ 0 , 9 , 5 , 8 ] , [ 0 , 9 , 6 , 8 ]   ,   [ 0 , 9 , 7 , 9 ] , [ 0 , 9 , 8 , 9 ] , [ 0 , 9 , 9 , 9 ] ,  // 9

]

let redovi = [
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
];

let	kolone = [
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
];

let blokovi = [
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
];

 function pronalazenjeSledecePrazneCelije(sudoku_tabela) {
 	let i = 1;

 	while(i <= BROJ_POLJA) {
 		if(sudoku_tabela[i][0] == 0) return i;
 		i++;
 	}

 	return -1;
 }

function proveraNizaSudokuBacktrack(blok_nizova, sudoku_tabela) {

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let niz           = blok_nizova[i];
		let prebrojavanje = [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ];
		
		for(let j = 0; j < niz.length; j++) {
			let kandidat = sudoku_tabela[niz[j]][0];
			if(kandidat > 0) prebrojavanje[kandidat]++;
			if(prebrojavanje[kandidat] > 1) {
				return false;
			}
		}
	}


	return true;
}

function daLiJeResenjeOk_v1(sudoku_tabela, polje_indeks = 0, vrednost = 0) {
	let polje  = sudoku_tabela[polje_indeks];
	// red    - polje[1];
	// kolona - polje[2];
	// blok   - polje[3];

	if(!proveraNizaSudokuBacktrack(redovi,  sudoku_tabela)) return false;
	if(!proveraNizaSudokuBacktrack(kolone,  sudoku_tabela)) return false;
	if(!proveraNizaSudokuBacktrack(blokovi, sudoku_tabela)) return false;
	
	return true;
}

function daLiJeResenjeOk_v2(sudoku_tabela, polje_indeks = 0, vrednost = 0) {
	let polje  = sudoku_tabela[polje_indeks];
	// red    - polje[1];
	// kolona - polje[2];
	// blok   - polje[3];

	let niz_red    = redovi[polje[1]];
	let niz_kolona = kolone[polje[2]];
	let niz_blok   = blokovi[polje[3]];

	for (let i = 0; i < niz_red.length; i++) {
		if(sudoku_tabela[niz_red[i]][0] == vrednost) return false;
	}

	for (let i = 0; i < niz_kolona.length; i++) {
		if(sudoku_tabela[niz_kolona[i]][0] == vrednost) return false;
	}

	for (let i = 0; i < niz_red.length; i++) {
		if(sudoku_tabela[niz_blok[i]][0] == vrednost) return false;
	}
	
	return true;
}



function resavanjeSudokuBacktrack(sudoku_tabela) {
	let indeks = pronalazenjeSledecePrazneCelije(sudoku_tabela);
	if(indeks == -1) return true;

	for(let pokusaj = 1; pokusaj <= 9; pokusaj++) {
		if(daLiJeResenjeOk_v2(sudoku_tabela, indeks, pokusaj)) {
			sudoku_tabela[indeks][0] = pokusaj;
			if(resavanjeSudokuBacktrack(sudoku_tabela)) {
				return true; 
			}
		}

		sudoku_tabela[indeks][0] = 0;
	}

	return false;
}

function ucitavanjeZagonetke(simple, tabela) {
	for(let i = 1; i <= BROJ_POLJA; i++) {
		tabela[i][0] = simple[i];
	}
}

function formatiranjeZagonetke(sudoku_tabela) {
	let b = 1;
	let horizontalnaLinija = `------------------------------------------`;
	let s = `\n${horizontalnaLinija}\n`;

	for(let i = 1; i <= 9; i++) {
		for(let j = 1; j <= 9; j++, b++) {
			if(j == 1) s+=`| `;  
			s += `${sudoku_tabela[b][0]} `;
			if(j < 9 && !(j % 3 == 0)) s += `, `
			let uslov = j < 9 && j % 3 == 0;
			if(j == 9) s += ` |`;
			if(uslov) s += ` |  `;
			//s += `, `;
			//if(uslov) s += ` `;

		}

		s+= '\n';
		if(i % 3 == 0) s += `${horizontalnaLinija}\n`;
	}

	return s;
}

/* ----- Telemetrija -------------------------------------------------------- */
let T1 = performance.now();
/* -------------------------------------------------------------------------- */

ucitavanjeZagonetke(sudoku_jednostavni, sudoku_tabela);
if(!daLiJeResenjeOk_v1(sudoku_tabela)) {
	console.log("BAAAAAD!");
	exit();
}

let rez   = resavanjeSudokuBacktrack(sudoku_tabela);

/* ----- Telemetrija -------------------------------------------------------- */
let T2    = performance.now();
let ODZIV = T2 - T1;
console.log(`Sudoku backtrack; ${ODZIV}ms`);
/* -------------------------------------------------------------------------- */

let ispis = formatiranjeZagonetke(sudoku_tabela);
console.log(rez);
// console.log(sudoku_tabela)
console.log(ispis)



