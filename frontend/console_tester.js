import Crossword from "./Crossword.js";

let testBasicJSON = {"acrossmap":null,"admin":false,"answers":{"across":["EHUDBARAK","TAPIN","VARIEGATE","UDINE","ARISTOTLE","BANTU","DECK","REEL","SPEER","EDH","CASABA","TARO","RUE","SOUL","PPS","GOAT","TARA","PRE","JAVELIN","TANGLES","ARE","EVES","DUET","PAR","TEXT","GIN","AGHA","STAIRS","GST","NEEDS","TIRE","BEER","EMAIL","INATRANCE","SARGE","METEORITE","ENDED","EDELWEISS"],"down":["EVADE","HARED","URICH","DISK","BET","AGORAE","RATES","ATLEAST","KEELBOAT","TUBS","ADAPT","PINEAPPLE","INTERPRET","NEUROSES","CUTLET","AURA","RAE","LANDIS","GARAGEMAN","OVERHEARD","JAPANESE","IVES","NEXTTIME","GUN","STAINED","GRETEL","ADIGE","IRATE","GENII","SECTS","TREES","SLED","BARE","ROW"]},"author":"Richard Silvestri","autowrap":null,"bbars":null,"circles":null,"clues":{"across":["1. Mideast V.I.P.","10. Green gimme","15. Dapple","16. Province of Italy","17. Subject in a Rembrandt painting","18. Language group that includes Xhosa","19. King's place","20. It holds the line","21. \"Inside the Third Reich\" author","22. Letter in runes","23. Fruit named for a city in Turkey","25. Starch source","26. ___ anemone","27. Essence","29. Ltr. addendum","30. Attack","32. Butler's quarters?","33. Columbian starter","34. Decathlon event","37. Shampooing problem","39. Is multiplied?","40. Twain's \"___ Diary\"","42. You can't do it alone","43. Something to shoot for","44. Editor's concern","45. Snare","46. Ottoman title","48. Way down, perhaps","50. Standard setting at 0 degrees long.","53. Required things","55. Drain","56. Harp, for one","57. Modern memoranda","58. Mesmerized","60. Busted looie","61. Source of rare metals, maybe","62. Wound up","63. Flower that's a symbol of purity"],"down":["1. Duck","2. Ran fast, to Brits","3. Spenser portrayer","4. Floppy","5. Play favorites?","6. Early malls","7. Hotel posting","8. Minimally","9. Freight carrier at sea","10. Some like them hot","11. Go with the flow","12. Luau serving","13. Gloss","14. Personality disorders","23. Butcher's offering","24. Kirlian photography image","26. Scottish arctic explorer","28. \"Animal House\" director","30. Service station employee","31. Got an earful, in a way","34. Kind of lantern","35. Pulitzer winner for \"Symphony No. 3\"","36. When to have better luck?","38. Hit man","41. Not clean","45. Humperdinck heroine","47. Adriatic feeder","49. Storming","50. Wish granters of myth","51. Shakers and others","52. Apples and oranges","54. Runners carry it","56. In the raw","59. Lineup"]},"code":null,"copyright":"2000, The New York Times","date":"4\/7\/2000","dow":"Friday","downmap":null,"editor":"Will Shortz","grid":["E","H","U","D","B","A","R","A","K",".","T","A","P","I","N","V","A","R","I","E","G","A","T","E",".","U","D","I","N","E","A","R","I","S","T","O","T","L","E",".","B","A","N","T","U","D","E","C","K",".","R","E","E","L",".","S","P","E","E","R","E","D","H",".","C","A","S","A","B","A",".","T","A","R","O",".",".",".","R","U","E",".","S","O","U","L",".","P","P","S",".","G","O","A","T",".",".","T","A","R","A",".","P","R","E","J","A","V","E","L","I","N",".","T","A","N","G","L","E","S","A","R","E",".","E","V","E","S",".",".","D","U","E","T",".","P","A","R",".","T","E","X","T",".","G","I","N",".",".",".","A","G","H","A",".","S","T","A","I","R","S",".","G","S","T","N","E","E","D","S",".","T","I","R","E",".","B","E","E","R","E","M","A","I","L",".","I","N","A","T","R","A","N","C","E","S","A","R","G","E",".","M","E","T","E","O","R","I","T","E","E","N","D","E","D",".","E","D","E","L","W","E","I","S","S"],"gridnums":[1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,15,0,0,0,0,0,0,0,0,0,16,0,0,0,0,17,0,0,0,0,0,0,0,0,0,18,0,0,0,0,19,0,0,0,0,20,0,0,0,0,21,0,0,0,0,22,0,0,0,23,0,0,0,0,24,0,25,0,0,0,0,0,0,26,0,0,0,27,0,0,28,0,29,0,0,0,30,31,0,0,0,0,32,0,0,0,0,33,0,0,34,0,0,0,0,35,36,0,37,0,0,38,0,0,0,39,0,0,0,40,0,0,41,0,0,42,0,0,0,0,43,0,0,0,44,0,0,0,0,45,0,0,0,0,0,46,0,0,47,0,48,0,0,49,0,0,0,50,51,52,53,0,0,0,54,0,55,0,0,0,0,56,0,0,0,57,0,0,0,0,0,58,0,0,0,59,0,0,0,0,60,0,0,0,0,0,61,0,0,0,0,0,0,0,0,62,0,0,0,0,0,63,0,0,0,0,0,0,0,0],"hold":null,"id":null,"id2":null,"interpretcolors":null,"jnotes":null,"key":null,"mini":null,"notepad":null,"publisher":"The New York Times","rbars":null,"shadecircles":null,"size":{"cols":15,"rows":15},"title":"NY TIMES, FRI, APR 07, 2000","track":null,"type":null};
let regularGame = new Crossword(testBasicJSON);
//console.log(regularGame.gridNumsToString());
/*
console.log(regularGame.currentBoardToString());
console.log(regularGame.answerKeyToString());
console.log(regularGame.checkedGridToString());
console.log(regularGame.gridNumsToString());
console.log(regularGame.findWordfromTile(4,13, false));
console.log(regularGame.checkWord(4, 13, false));
regularGame.guess();
console.log(regularGame.checkWord(4, 13, false));
console.log(regularGame.checkedGridToString());
regularGame.reset();
console.log(regularGame.getScore());
*/
//console.log(regularGame.currentBoardToString());
//regularGame.revealGrid();
//console.log(regularGame.currentBoardToString());
//regularGame.reset();
//console.log(regularGame.currentBoardToString());
//console.log(regularGame.answerKeyToString());
//console.log(regularGame.checkedGridToString());
//console.log(regularGame.gridNumsToString());


//console.log(regularGame.currentBoardToString());
//console.log(regularGame.toString(regularGame.revealWord(4,13,false)));
//console.log(regularGame.toString(regularGame.revealWord(4,14,false)));


regularGame.reset();
regularGame.revealWord(4,12,true);
regularGame.revealWord(4,12,false);
regularGame.guess()
console.log(regularGame.checkWord(4,12,false, null, true));
console.log(regularGame.checkWord(4,12,true, null, true));
console.log(regularGame.checkedGridToString());


console.log(regularGame.currentBoardToString());
regularGame.revealTile(4,12,true);
console.log(regularGame.currentBoardToString());
regularGame.reset();
