let MOBILNI_UNOS = true;

let MENI_MOBILNI = {
	event:           null ,
	koordinate:      null ,
	polje_id:        null ,
	sudoku_tabela:   null ,
}

let wrapperDOM        = document.getElementById("wrapper");
// let sudokuTabela      = document.getElementById("sudoku_tabela");
// let sudokuMeni        = document.getElementById("sudoku_klik_meni");
let sudokuMeniOtvoren = false;

let sudokuTabelaSirina = 768;
let sudokuTabelaVisina = 768;
let meniSirina         = 126;
let meniVisina         = 146;

//sudokuTabela.addEventListener("click", klikObrada);

function klikPronalazenjeKvadranta(x, y, sirina, visina) {
	if(x <= sirina / 2 && y <= visina / 2) return 1;
	if(x >  sirina / 2 && y <= visina / 2) return 2;
	if(x <= sirina / 2 && y >  visina / 2) return 3;
	if(x >  sirina / 2 && y >  visina / 2) return 4;
}

function generisanjeMeniKoordinata(x, y, kvadrant, meni_sirina, meni_visina) {
	let koordinate = {
		x: -1 ,
		y: -1 ,
	}

	korekcija = 24;

	if(kvadrant == 1) {
		koordinate.x = x;
		koordinate.y = y;
	}

	if(kvadrant == 2) {
		koordinate.x = x - meni_sirina - korekcija;
		koordinate.y = y;
	}

	if(kvadrant == 3) {
		koordinate.x = x;
		koordinate.y = y - meni_visina;
	}

	if(kvadrant == 4) {
		koordinate.x = x - meni_sirina - korekcija;
		koordinate.y = y - meni_visina;
	}

	return koordinate;
}

function sudokuMenKreiranje(event, koordinate, polje_id, sudoku_tabela) {
	if(sudokuMeniOtvoren) return;

	MENI_MOBILNI.event         = event;
	MENI_MOBILNI.koordinate    = koordinate;
	MENI_MOBILNI.polje_id      = polje_id;
	MENI_MOBILNI.sudoku_tabela = sudoku_tabela;

	let sudokuMeni = document.createElement("div");
	sudokuMeni.id  = "sudoku_klik_meni";
	sudokuMeni.innerHTML = `<div id='sudoku_meni_dugmici'>
		<button class='sudoku_meni_daljinski_upravljac_dugme_1' onclick='kreiranjeMenijaDaljinskiUpravljac(MENI_MOBILNI, 1)'>Vrednost</button>
		<button class='sudoku_meni_daljinski_upravljac_dugme_1' onclick='kreiranjeMenijaDaljinskiUpravljac(MENI_MOBILNI, 2)'>Kandidat</button>
		<button class='sudoku_meni_daljinski_upravljac_dugme_1' onclick='kreiranjeMenijaDaljinskiUpravljac(MENI_MOBILNI, 3)'>Kandidat Par</button>
	</div>	
	<button class='sudoku_meni_dugme_otkazivanje_1' onclick='sudokuMeniOtkazivanje()'>Otkazivanje</button>`;
	sudokuMeniOtvoren = true;

	return sudokuMeni;
}

function sudokuMeniOtkazivanje() {
	let sudokuMeni    = document.getElementById("sudoku_klik_meni");
	sudokuMeni.remove();
	sudokuMeniOtvoren = false;
}

function klikMobilniObrada(event, polje_id, sudoku_tabela) {
	let polje = sudoku_tabela.tabela[polje_id];
	if(polje.fiksno) return;

	let kvadrant   = klikPronalazenjeKvadranta(event.clientX, event.clientY, sudokuTabelaSirina, sudokuTabelaVisina);
	let koordinate = generisanjeMeniKoordinata(event.clientX, event.clientY, kvadrant, meniSirina, meniVisina);

	let sudokuMeni = sudokuMenKreiranje(event, koordinate, polje_id, sudoku_tabela);
	sudokuMeni.style.left = koordinate.x + "px";
	sudokuMeni.style.top  = koordinate.y + "px";
	wrapperDOM.appendChild(sudokuMeni);
}

function kreiranjeDaljinskogUpravljacaZaMeni(tip_poteza) {
	return `<div id='sudoku_meni_daljinski_upravljac'>
	<button class='sudoku_meni_daljinski_upravljac_dugme_2' onclick='upisMobilni(MENI_MOBILNI, ${tip_poteza}, 1)'>1</button>
	<button class='sudoku_meni_daljinski_upravljac_dugme_2' onclick='upisMobilni(MENI_MOBILNI, ${tip_poteza}, 2)'>2</button>
	<button class='sudoku_meni_daljinski_upravljac_dugme_2' onclick='upisMobilni(MENI_MOBILNI, ${tip_poteza}, 3)'>3</button>
	<button class='sudoku_meni_daljinski_upravljac_dugme_2' onclick='upisMobilni(MENI_MOBILNI, ${tip_poteza}, 4)'>4</button>
	<button class='sudoku_meni_daljinski_upravljac_dugme_2' onclick='upisMobilni(MENI_MOBILNI, ${tip_poteza}, 5)'>5</button>
	<button class='sudoku_meni_daljinski_upravljac_dugme_2' onclick='upisMobilni(MENI_MOBILNI, ${tip_poteza}, 6)'>6</button>
	<button class='sudoku_meni_daljinski_upravljac_dugme_2' onclick='upisMobilni(MENI_MOBILNI, ${tip_poteza}, 7)'>7</button>
	<button class='sudoku_meni_daljinski_upravljac_dugme_2' onclick='upisMobilni(MENI_MOBILNI, ${tip_poteza}, 8)'>8</button>
	<button class='sudoku_meni_daljinski_upravljac_dugme_2' onclick='upisMobilni(MENI_MOBILNI, ${tip_poteza}, 9)'>9</button>
</div>
<button class='sudoku_meni_dugme_otkazivanje_2' onclick='sudokuMeniOtkazivanje()'>Zatvaranje</button>`;
}

function kreiranjeMenijaDaljinskiUpravljac(meni_mobilni, tip_poteza) {
	console.log(meni_mobilni.event)
	console.log(meni_mobilni.koordinate)
	console.log(meni_mobilni.polje_id)
	console.log(meni_mobilni.sudoku_tabela)
	console.log("---------------")

	let sudokuMeni = document.getElementById("sudoku_klik_meni");
	let daljinskiUpravljacHTML = kreiranjeDaljinskogUpravljacaZaMeni(tip_poteza);
	sudokuMeni.innerHTML = daljinskiUpravljacHTML;
}

function upisMobilni(meni_mobilni, tip_poteza, kandidat_indeks) {
	console.log(meni_mobilni)

	if(tip_poteza == 1) {
		poljeDupliKlik(meni_mobilni.event, meni_mobilni.sudoku_tabela, meni_mobilni.polje_id, kandidat_indeks);
		sudokuMeniOtkazivanje();
		return;
	}

	if(tip_poteza == 2) {
		toggleKandidata(meni_mobilni.event, meni_mobilni.sudoku_tabela, meni_mobilni.polje_id, kandidat_indeks);
		return;
	}

	if(tip_poteza == 3) {
		toggleParKandidata(meni_mobilni.event, meni_mobilni.sudoku_tabela, meni_mobilni.polje_id, kandidat_indeks);
		return;
	}
}
