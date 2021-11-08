# sudoku_solver

Sudoku solver koji traži rešenje korak po korak (WIP; za sada još uvek mestimično ima sitnih UI bagova).

## Demo

https://www.codeblog.rs/primeri/sudoku_solver/

## Info

Za sada implementirane tehnike:

- ažuriranje kandidata (prosta eliminacija kandidata ukrštanjem reda, kolone i bloka)
- jedini kandidat
- skriveni singl / par / triplet
- prepoznati par / triplet / kvartet
- upereni par / triplet
- prisvajajući par / triplet
- x-wing
- xy-wing
- coloring
- x-cycles (za sada još uvek ima sitnih bagova koji ne utiču na korektnost rezultata)

U planu:

- xyz-wing (proširenje xy-wing koncepta, ne mnogo komplikovanije) - WIP 
- wxyz-wing (proširenje xy-wing koncepta, ne mnogo komplikovanije)
- xy-chain (proširenje xy-wing koncepta, ne mnogo komplikovanije)
- alternating inference chains (proširenje i objedinjavanje coloring i x-cycles koncepata, ponešto komplikovanije)
