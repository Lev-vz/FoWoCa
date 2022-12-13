let waitingCnt = 0;
let serverResponse = null;
//let user = "Stranger";

function waiting(){
  let waitingBox = document.getElementById("waitingBox");
  if(!waitingBox) return;
  
  if(serverResponse!== null){
    try{
      let servAns = JSON.parse(serverResponse);
      serverResponse = null;
      let success = false;
      switch(servAns.text){
        case "User signing": 
          window.currUser = servAns.text1;
          document.getElementById("user").innerHTML = "user: " + window.currUser;
          hideBlock("SignInBlock");
          document.cookie = "user=" + escape(window.currUser)+";"
          document.cookie = "pass=" + escape(servAns.text2)+";"
          if(servAns.text3 == ""){
            servAns.text = "Default dictionary not found. "
            servAns.text1 = "Select or load dictionary.";
            openBlock("DictManipulation");
            break;
          }
          window.wordCard = JSON.parse(servAns.text3);
          window.dictReload();
          hideBlock("SignInBlock");
          openBlock("wordCardsBlock");
          document.getElementById("login").value = "";
          document.getElementById("password").value = "";
          document.getElementById("repPassword").value = "";
          window.currDict = servAns.currDict;
          if("exDictErr" in servAns && servAns["exDictErr"] != ""){
            window.Alarm(waitingBox, servAns["exDictErr"], 
                         '<br/><input class=\'button1\' type=\'button\' value=\'OK\' onclick=\'closeAlarm()\' '+
              'style=\'box-shadow:5px 5px 6px rgba(0, 0, 0, 5);color:#FF0000; border:solid 2px #FF0000;float:right;\'/>');
          }else{
            success = true;
          }
          break;  
        case "External Dict error":
          window.Alarm(waitingBox, servAns["exDictErr"], 
              '<br/><input class=\'button1\' type=\'button\' value=\'OK\' onclick=\'closeAlarm()\' '+
              'style=\'box-shadow:5px 5px 6px rgba(0, 0, 0, 5);color:#FF0000; border:solid 2px #FF0000;float:right;\'/>');

          break;
        case "Dict selected": 
          hideBlock("DictManipulation");
          window.wordCard = JSON.parse(servAns.dict);
          window.dictReload();
          window.currDict = servAns.currDict;
          openBlock("wordCardsBlock");
          success = true;
          break;              
        case "Dict download": 
          hideBlock("SignInBlock");
          openBlock("wordCardsBlock");
          success = true;
          break;              
        case "Dict array": 
          openBlock("DictArr");
          window.createDictTableShow(servAns.text1);
          success = true;
          break;              
        case "Wrong password": 
          window.currUser = "Stranger";
          document.getElementById("user").innerHTML = "Stranger";
          openBlock("SignInBlock");
          document.getElementById("login").value = servAns.text1;
          servAns.text1 = ".";
          //window.Alarm(waitingBox, "Wrong password", ".");
          break;              
        case "User not foun": 
          window.currUser = "Stranger";
          document.getElementById("user").innerHTML = "Stranger";
          openBlock("SignInBlock");
          window.Alarm(waitingBox, "User not foun", "");
          break;         
        case "Exist":
          switch(servAns.goal){
            case "LoadDictionary":
              if(confirm("The dictionary '" + servAns.text + 
                         "' already exists. Want to rewrite it?")){
                LoadDictionary();
              }else{
                alert("Change dictionary name");
                document.getElementById("dictName").focus();
              }
              break;
          }
          success = true;
          break;
        case "Not exist":
          switch(servAns.goal){
            case "LoadDictionary":
              LoadDictionary();
              break;
          }
          success = true;
          break;
      }
      waitingCnt = 0;
      if(success){
        waitingBox.style.display="none";
      } else {
        window.Alarm(waitingBox, servAns.text, servAns.text1);
      }
    }catch(err){
      window.Alarm(waitingBox, "System client error: ", err);
    }
    return;
  }
  window.setNormalEl(waitingBox);
  waitingBox.display= "";
  waitingCnt++;
  const DELAY = 30;
  if(waitingCnt > DELAY){
    waitingCnt = 0;
    window.Alarm(waitingBox, "Server did not respond. ", "Timeout.");
    return;
  }

  let time = new Date();
  waitingBox.innerHTML = "Waiting for server answer ... " + 
    time.getHours() + ":" +time.getMinutes()+ ":" +time.getSeconds();

  setTimeout(waiting, 1000);

}

function setDict(){
  let data = document.getElementById("textarea").value.trim();
  setData('replaceDict', data);
}

function setData(command, data){
  if(data == "") return;
	let funcSend = function() { //когда iframe загрузится - тогда и выполним запрос
		new_rcv.contentWindow.document.getElementById('value').value = data;//value 
		new_rcv.contentWindow.document.getElementById('command').value = command;//variable; 
		new_rcv.onload = funcRec;
		new_rcv.contentWindow.document.getElementById('form').submit();
	}	
	let funcRec = function() { //когда придёт ответ, тогда и обработаем его
		serverResponse = new_rcv.contentWindow.document.body.textContent;
		new_rcv.remove();
	}	
	let new_rcv     = document.createElement("iframe");
	new_rcv.src 	= "setDate.html";
	new_rcv.onload = funcSend;
	new_rcv.style.display = "none";
	document.body.append(new_rcv);
}

function showText(Pass, ShowPass){
  let pass = document.getElementById(Pass);
  if(pass.type == "password"){
    pass.type = "text";
    document.getElementById(ShowPass).innerHTML = "&#x1F441;";
  }else{
    pass.type = "password";
    document.getElementById(ShowPass).innerHTML = "&#128374;";        
  }
}

function hideBlock(blokName){
  document.getElementById(blokName).style.display = "none";
}
function openBlock(blokName){
  document.getElementById(blokName).style.display = "";
}
function getCookie(cookie_name)
{
  let results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

  if ( results )
    return ( unescape ( results[2] ) );
  else
    return null;
}

function logout() {
  document.cookie = "user=Stranger;"
  document.cookie = "pass=false;"
  window.currUser = "Stranger";
  document.getElementById("user").innerHTML = "user: " + window.currUser;
  window.ContinueWithoutAuthorization();
}

const warningColor = "#ffff88";
const normColor = "#ffffff";

function signIn() {
  resetSigningBoxesColor();
  let login = document.getElementById("login").value.trim();
  let password = document.getElementById("password").value.trim();

  if (login == "") {
    document.getElementById("login").style.backgroundColor = warningColor;
  }
  if (password == "") {
    document.getElementById("password").style.backgroundColor = warningColor;
  }

  if (login == "" || password == "") return;

  let str = JSON.stringify({ log: login, pass: password, exDict:window.getAttr });
  setData("signIn", str);

  waiting();
}

function signUp() {
  resetSigningBoxesColor();
  document.getElementById("repPassDiv").style.display = "";
  let login = document.getElementById("login").value.trim();
  let password = document.getElementById("password").value.trim();
  let repPassword = document.getElementById("repPassword").value.trim();

  if (login == "") {
    document.getElementById("login").style.backgroundColor = warningColor;
  }
  if (password == "") {
    document.getElementById("password").style.backgroundColor = warningColor;
  }
  if (repPassword == "") {
    document.getElementById("repPassword").style.backgroundColor =
      "#ffff88";
  }

  if (login == "" || password == "" || repPassword == "") return;

  if (password != repPassword) {
    document.getElementById("password").style.backgroundColor = warningColor;
    document.getElementById("repPassword").style.backgroundColor = warningColor;
    return;
  }
  let str = JSON.stringify({ log: login, pass: password, exDict:window.getAttr });
  setData("newUser", str);

  waiting();
}

function resetSigningBoxesColor() {
  document.getElementById("login").style.backgroundColor = normColor;
  document.getElementById("password").style.backgroundColor = normColor;
  document.getElementById("repPassword").style.backgroundColor = normColor;
}

function setWarning(elName){
  document.getElementById(elName).style.backgroundColor = warningColor;
}

function dictProcessing(dictText, cards) {
  let cardStr = dictText.split("\n");
  let i = 0;
  cards.length = 0;
  let errs = "";
  for (let str in cardStr) {
    let trimStr = cardStr[str].trim();
    if (trimStr == "") continue;
    let tmp = trimStr.split(/\s\t+|\t+|=/);
    if(tmp.length > 1){
      let tmpW = tmp[0].trim();
      let tmpT = tmp[1].trim();
      if(tmpW != "" && tmpT != ""){
        cards[i] = {w:"", t:"", rem:false};
        cards[i].w = tmpW;
        cards[i].t = tmpT;
        i++;  
      }else{
        if(tmpW == ""){
          errs += "'??? = " + tmpT + "'";
        } else {
          errs += "'" + tmpW + " = ???";
        }
      }
    }else if(tmp.length == 1){
      errs += "'" + trimStr + "' - ???";
    }
  }
  return errs;
}

function CheckFileExist(fileName, goal){
  let str = JSON.stringify({ user: window.currUser, dictName: fileName, goal: goal});
  setData("CheckFileExist", str);
  waiting();
}

function BeforeLoadDict(){
  let dictName = document.getElementById("dictName").value.trim();
  CheckFileExist(dictName, "LoadDictionary");
}

function ChangeCurrDict(){
  if(window.currUser == "Stranger"){
    return;
  }
  if(window.dictArr.length == 0){
    setData("ChangeDict", JSON.stringify({ log: window.currUser}));
    waiting();
  } else {
    openBlock("DictArr");
    window.showDictTableList();
  }
}

function LoadDictionary(){
  let dictName = document.getElementById("dictName").value.trim();
  let dictBody = document.getElementById("dictBody").value.trim();
  if(dictName == ""){
    setWarning("dictName");
    document.getElementById("dictName").focus();
  }
  if(dictName == "" || dictBody == "") return;
  let cards = [];
  let errs = dictProcessing(dictBody, cards);
  if(errs != ""){
    alert("There are mistakes in this dictionary:\n-------------------\n"+errs);
    document.getElementById("dictBody").focus();
    return;
  }
  if(cards.length == 0){
    alert("There are no words in this dictionary")
    return;
  }
  //alert('check');
  window.wordCard = cards;
  window.dictReload();
  if(window.currUser == "Stranger"){
    hideBlock('DictManipulation');
    openBlock('wordCardsBlock');
    return;
  } 
  window.dictArr = [];
  let str = JSON.stringify({ user: window.currUser, dictName: dictName, dictBody:cards });
  setData("loadDict", str);
  waiting();
}

function SelectThisDict(n){
  setData("selectDict", JSON.stringify({ user: window.currUser, dictName: window.dictArr[n].dictName}));
  waiting();
}
