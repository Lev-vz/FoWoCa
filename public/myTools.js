
function createDictTableShow(text){
  window.dictArr = JSON.parse(text);
  showDictTableList();
}

function showDictTableList(){
  let str = "";
  for(let i in window.dictArr){
    let isCurr = window.dictArr[i].dictName == window.currDict;
    let dictNameClass = isCurr? "currDictName" : "dictTableName";
    str += "<table id='dictTable"+ i +"' class='dictTable' onclick='selectDictTable(this.id)'><tbody>"+
              "<tr><th class='" + dictNameClass + "'>" + (isCurr ? "Current: " : "") + 
              window.dictArr[i].dictName + "</th></tr>"
    for(let j in window.dictArr[i].words){
      str += "<tr><td>" + 
        window.dictArr[i].words[j].w + " = " + window.dictArr[i].words[j].t + "</td></tr>";
    }
    str += "<tr><td>.........</td></tr>";
    str += "</tbody></table>";
  }
  
  document.getElementById("DictArr").innerHTML = str;
}

function selectDictTable(id){
  let n = +id.substr(9);
  let isCurr = window.dictArr[n].dictName == window.currDict;
  let dictNameClass = isCurr? "currDictName" : "dictTableName";
  let str = "<table id='dictTable"+ n +"' class='dictTable2' onclick='selectDictTable(this.id)'><tbody>"+
            "<tr><th class='" + dictNameClass + "'>" + (isCurr ? "Current: " : "") + 
            window.dictArr[n].dictName + "</th></tr>"
  //let str = "<table id='dictTable"+ n +"' class='dictTable2' onclick='selectDictTable(this.id)'><tbody>"+
  //            "<tr><th class='dictTableName'>" + window.dictArr[n].dictName + "</th></tr>";
  for(let j in window.dictArr[n].words){
    str += "<tr><td>" + 
      window.dictArr[n].words[j].w + " = " + window.dictArr[n].words[j].t + "</td></tr>";
  }
  str += "<tr><td>.........</td></tr>";
  str += "</tbody></table>";
  str +=  
    '<div>'+
          (isCurr ? '':
           '<input class="button1" type="button" value="Select this dictionary" onclick="SelectThisDict('+n+')"/>') +
          '<input class="button1" type="button" value="Get link" onclick="GetLinkToDikt('+ n +')" />'+
          '<input class="button1" type="button" value="Cancel" onclick="showDictTableList()" />'+
    '</div>'

  document.getElementById("DictArr").innerHTML = str;
}

function setAlarmEl(el){
  el.style.color = "red";
  el.style.borderColor = "red";
  el.style.border = "solid";
  el.style.boxShadow = "10px 10px 10px rgba(0, 0, 0, 5)";
}
function setNormalEl(el){
  el.style.color = "black";
  el.style.borderColor = "black";
  el.style.border = "";
  el.style.boxShadow = "";
  el.style.display="";
}

function Alarm(waitingBox, text, err){
  const okButton = "<br/><input class=\'button1\' type=\'button\' value=\'OK\' onclick=\'closeAlarm()\' " + 
             "style=\'box-shadow:5px 5px 6px rgba(0, 0, 0, 5);color:#FF0000; border:solid 2px #FF0000;float:right;\' />";
  setAlarmEl(waitingBox);
  if (typeof err === 'object' && !Array.isArray(err)){
    waitingBox.innerHTML = text + JSON.stringify(err) + okButton;
  }else{
    waitingBox.innerHTML = text + err + okButton;
  }
}

function Info(infoDesk, text){
  const okButton = "<br/><input class=\'button1\' type=\'button\' value=\'OK\' onclick=\'closeInfo()\' " + 
             "style=\'box-shadow:5px 5px 6px rgba(0, 0, 0, 5);color:#000000; border:solid 2px #000000;float:right;\'/>";
  setNormalEl(infoDesk);
  infoDesk.innerHTML = text + okButton;
}

function GetLinkToDikt(n){
  let str = "https://fowoca.glitch.me/t" + window.currUser + ":" + window.dictArr[n].dictName;
  navigator.clipboard.writeText(str)
  .then(() => {
    Info(document.getElementById("waitingBox"), "The link to this dictionary \"" + str + "\" has been copied to the clipboard.");
  })
  .catch(err => {
    Alarm(document.getElementById("waitingBox"), "Something went wrong", err)
    //console.log('Something went wrong', err);
  });
}
/*
function createEl(){
  
}

<table>
    <thead>
        <tr>
            <th colspan="2">The table header</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>The table body</td>
            <td>with two columns</td>
        </tr>
    </tbody>
</table>
*/