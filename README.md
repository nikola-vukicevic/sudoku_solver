# sudoku_solver

Sudoku solver koji traži rešenje korak po korak (WIP; za sada još uvek mestimično ima sitnih UI bagova).

## Demo

https://www.sudokublog.net

## Info

Za sada implementirane tehnike:

- ažuriranje kandidata (prosta eliminacija kandidata ukrštanjem reda, kolone i bloka)
- jedini kandidat
- skriveni singl / par / triplet / kvartet
- prepoznati par / triplet / kvartet
- upereni par / triplet
- prisvajajući par / triplet
- x-wing
- xy-wing
- xyz-wing
- wxyz-wing
- coloring
- x-cycles

U planu:

- xy-chain (proširenje xy-wing koncepta, ne mnogo komplikovanije)
- alternating inference chains (proširenje i objedinjavanje coloring i x-cycles koncepata, ponešto komplikovanije)
- unique rectangles
- forcing chains
- verovatno i sve ostalo što stignem :)
