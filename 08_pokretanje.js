/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

generisanjeTabele(sudoku_tabela.tabela);
generisanjeHTMLTabele("sudoku_tabela", sudoku_tabela.blokovi);
ucitavanjeZagonetke(sudoku_tabela.zagonetka, sudoku_tabela);
azuriranjePrikazaTabele(sudoku_tabela, true);

upisNaUndoStek(sudoku_tabela, STEK_GLAVNI);
localStorageUpis(sudoku_tabela);

//console.log(sudoku_tabela)
