var transactions;
var topRowColor = "#C0C0C0";

function run(){
   var folders = DriveApp.getFolders();
  var spendAPP;
 while (folders.hasNext()) {
   var folder = folders.next();
   if (folder.getName() == "SpendAPP"){
   spendAPP = folder;
   }
   
 }
  
  var files = spendAPP.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    if (file.getName() == "spendapp2-2016.xml"){
      var fileId = file.getId();
      var url = DocsList.getFileById(fileId).getUrl();
      XMLparser(url);
    }
  }
  // var files = DriveApp.getFiles();
//while (files.hasNext()) {
 // var file = files.next();
  //if (file.getName() == "spendapp2-2016.xml"){
   //var id = file.getId();
  
  
}


function XMLparser(url) {
  
  
 // var files = DriveApp.getFiles();
//while (files.hasNext()) {
  //var file = files.next();
  //if (file.getName() == "spendapp2-2016.xml"){
 // var id = file.getId();
    
 //potreba dodelat nacitani vice XML
  var oldUrl ='https://docs.google.com/uc?authuser=0&id=0B90-fJFXL7rPMW0xbXB6MF9faUE&export=download'

     var xml = UrlFetchApp.fetch(url).getContentText();
     var document = XmlService.parse(xml);
     var root = document.getRootElement();
  
     var entries = document.getRootElement().getChildren();  
     transactions = new Array(entries.length);
    for (var i = 0; i < entries.length; i++) {
      var trasaction =  entries[i].getChildren();
       transactions [i]= new Array(trasaction.length);
      for (var j = 0; j < trasaction.length; j++) {
        
         transactions [i][j] = trasaction[j].getText();
      }
    }
 
  
  
    //promazani puvodnich grafù
  var sheet = SpreadsheetApp.getActiveSheet();
  var charts = sheet.getCharts();
  for (var i = 0; i < charts.length; i++){
    sheet.removeChart(charts[i]);
  }
  
  //vytvoreni ejdnotlivých tabulek 

    sumOfTransactionTab();
    sumOfCategoryTab();
    sumOfMainCategoryTab();
    
}

function sumOfTransactionTab(){

   //nadpis tabulky
   var sheet = SpreadsheetApp.getActiveSheet();
   var date = sheet.getRange(3, 3).setValue("Datum").setBackground(topRowColor).setFontWeight("bold").setBorder(true, true, true, true, false, false);
   var mainCategory = sheet.getRange(3, 4).setValue("Hlavní Kategorie").setBackground(topRowColor).setFontWeight("bold").setBorder(true, true, true, true, false, false);
   var category = sheet.getRange(3, 5).setValue("Kategorie").setBackground(topRowColor).setFontWeight("bold").setBorder(true, true, true, true, false, false);
   var value = sheet.getRange(3, 6).setValue("Èáska").setBackground(topRowColor).setFontWeight("bold").setBorder(true, true, true, true, false, false);
  
  //naplneni tabulky
  var end 
  for (var i = 0; i < transactions.length; i++){
    var dateValue = sheet.getRange(i + 4, 3).setValue(transactions[i][2]).setBorder(true, true, true, true, false, false);
    var mainCategorValue = sheet.getRange(i + 4, 4).setValue(transactions[i][4]).setBorder(true, true, true, true, false, false);
    var categorValue = sheet.getRange(i + 4, 5).setValue(transactions[i][3]).setBorder(true, true, true, true, false, false);
    
    //rozlišeni pøijmu od vydaju 
    if (transactions[i][6] == 1){
      var valueValue = sheet.getRange(i + 4, 6).setValue(0 - transactions[i][1]).setFontColor("RED").setBorder(true, true, true, true, false, false);
    }else{
      var valueValue = sheet.getRange(i + 4, 6).setValue(1 * transactions[i][1]).setBorder(true, true, true, true, false, false);  
    }
    end = i + 4;
  }
  
  //vysledna suma
  var sum = sheet.getRange(47, 6).setValue("=SUM(F"+4+":F"+end+")").setBackground(topRowColor).setFontWeight("bold").setBorder(true, true, true, true, false, false);
 

}

function sumOfMainCategoryTab(){
  //suma neprijmových kategorii 
  var sheet = SpreadsheetApp.getActiveSheet();
  var mainCategories = getMainCategories(); 
  for (var i = 0; i < mainCategories.length; i++){
    var categoryCell = sheet.getRange(3, i + 8).setValue(mainCategories[i]).setBackground(topRowColor).setFontWeight("bold").setBorder(true, true, true, true, false, false);
    var value = 0;
    for (var j = 0; j < transactions.length; j++){
      if (transactions[j][4].localeCompare(mainCategories[i]) == 0){
        value = eval(value)+ eval(transactions[j][1]); 
      }  
    }
    var valueCell = sheet.getRange(4, i + 8).setValue(value).setFontColor("RED").setBorder(true, true, true, true, false, false);;
  }
  
  //vytvoreni grafu zatim docastne reseni
  var x = 6;
  var y = 10;
  var range = "H3:P4";
  var name = "Master Category"
  makePieChart(range, name, x, y);
  
}

function sumOfCategoryTab(){
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var categories = getCategories();
  for (var i = 0; i < categories.length; i++){
    if (i == 0){
      var categoryCell = sheet.getRange(28, i + 8).setValue(categories[i].masterCategoryName).setBackground(topRowColor).setFontWeight("bold").setBorder(true, true, true, true, false, false);
    }else{  
      if (categories[i].masterCategoryName != categories[i-1].masterCategoryName){
        var categoryCell = sheet.getRange(28, i + 8).setValue(categories[i].masterCategoryName).setBackground(topRowColor).setFontWeight("bold").setBorder(true, true, true, true, false, false);
    }
      
  }
    var categoryCell = sheet.getRange(29, i + 8).setValue(categories[i].categoryName).setBackground(topRowColor).setFontWeight("bold").setBorder(true, true, true, true, false, false);
    
    //naplneni datama 
    var value = 0;  
    for (var j = 0; j < transactions.length; j++){
      if (transactions[j][3].localeCompare(categories[i].categoryName) == 0){
        value = eval(value)+ eval(transactions[j][1]); 
      }  
    }
    var valueCell = sheet.getRange(30, i + 8).setValue(value).setFontColor("RED").setBorder(true, true, true, true, false, false);
    
    
  
    
  }
      //vytvoreni grafu zatim docastne reseni
    var x = 32;
    var y = 10;
    var range = "H29:W30";
    var name = "Category"
    makeBarChart(range, name, x, y)
  
  
}

function getCategories(){
  //vraci pole kategorii
  var categories = [];
  for (var i = 0; i < transactions.length; i++){
    
    var check = 0;
    for (var j = 0; j < categories.length; j++){
      if (transactions[i][3].localeCompare(categories[j].categoryName) == 0 || transactions[i][4].localeCompare("Pøíjem") == 0){
        check = 1;
      }
    }
    if(check == 0){
      var category = {
    categoryName:transactions[i][3],
    masterCategoryName:transactions[i][4],
      };
      categories.push(category);
    }
  }
  
  return categories.sort(compareByMasterCategory);  

}

function compareByMasterCategory(a,b) {
  //serazeni podle master category
  if (a.masterCategoryName < b.masterCategoryName)
    return -1;
  else if (a.masterCategoryName > b.masterCategoryName)
    return 1;
  else 
    return 0;
}


function getMainCategories(){
  //vraci pole  main kategorii bez Pøíjmu
  var mainCategories = [];
  for (var i = 0; i < transactions.length; i++){
    
    var check = 0;
    for (var j = 0; j < mainCategories.length; j++){
      if (transactions[i][4].localeCompare(mainCategories[j]) == 0 || transactions[i][4].localeCompare("Pøíjem") == 0 ){
        check = 1;
      }
    }
    if(check == 0){  
      mainCategories.push(transactions[i][4]);
    }
  }
  
  return mainCategories.sort();  

}


  

function getTransaction(){
  
  
 var sheet = SpreadsheetApp.getActiveSheet();
 var cell = sheet.getRange(5, 5);
  cell.setValue("dvdfg")
    var x = transactions[0];
  sheet.appendRow(x);
  var cell = sheet.getRange(5, 5);
  cell.setValue("dvdfg")
}

function makePieChart(range, name, x, y){
  
  var taskSheet = SpreadsheetApp.getActiveSheet();
  var lChartBuilder = taskSheet.newChart(); 
  var srcData = taskSheet.getRange(range).getValues();

  // Transpose the table (using 2D Array Library)
  var scratchData = ArrayLib.transpose(srcData);

  var numRows = scratchData.length;
  var numCols = scratchData[0].length; // assume all rows are same width

  // Write scratch values to scratch sheet.
  var scratchSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Scratch");
  scratchSheet.getRange(x, y, numRows, numCols).setValues(scratchData );
  SpreadsheetApp.flush();

  
  lChartBuilder.addRange(scratchSheet.getRange(x, y, numRows, numCols));
  lChartBuilder.setOption("title", name);

  var lChart = lChartBuilder.asPieChart().setPosition(x, y, 1, 1).build();
  taskSheet.insertChart(lChart);
  

}

function makeBarChart(range, name, x, y){
  
  var taskSheet = SpreadsheetApp.getActiveSheet();
  var lChartBuilder = taskSheet.newChart(); 
  var srcData = taskSheet.getRange(range).getValues();
  

  // Transpose the table (using 2D Array Library)
  var scratchData = ArrayLib.transpose(srcData);

  var numRows = scratchData.length;
  var numCols = scratchData[0].length; // assume all rows are same width

  // Write scratch values to scratch sheet.
  var scratchSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Scratch");
  scratchSheet.getRange(x, y, numRows, numCols).setValues(scratchData );
  SpreadsheetApp.flush();

  
  lChartBuilder.addRange(scratchSheet.getRange(x, y, numRows, numCols));
  lChartBuilder.setOption("title", name);

  var lChart = lChartBuilder.asBarChart().setPosition(x, y, 1, 1).build();
  taskSheet.insertChart(lChart);
  

}



