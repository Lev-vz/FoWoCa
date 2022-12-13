function ExDictLoad(userData, errSuff, fs, ret){
  let partsExDict = userData.exDict.split(":");
  if(partsExDict.length != 2 ){
    ret["text"] = "Invalid link to external dictionary: " + userData.exDict + errSuff;
    return false;
  }
  let path = "users/" + partsExDict[0].toLowerCase() + "/" + partsExDict[1];
  try {
    if (fs.existsSync(path)){
      let dictStr = fs.readFileSync(path, 'utf8');
      ret["text"] = JSON.stringify({text:"User signing", text1:userData.log,
                                    text2:userData.pass, text3:dictStr, currDict:userData.exDict});
      return true;
    } else {
      ret["text"] = "Invalid link to external dictionary: " + userData.exDict + errSuff;
      return false;
    }
  }catch (err) {
    ret["obj"] = {text:"File system error", err:err};
    return false;
  }
}

module.exports.postAnswers = function (command, data, fs) {
  let userData = JSON.parse(data);
  switch(command){
    case  "newUser": {
      console.log("Sign up: login=" + userData.log + ", password=" + userData.pass);
      let logCaseLw = userData.log.toLowerCase();
      try {
        if (fs.existsSync("users/" + logCaseLw)){
          return JSON.stringify({text:"User already exists", text1:userData.log});
        }    
        fs.mkdirSync("users/" + logCaseLw);
        let userParam = JSON.stringify({"abc":userData.pass, "login":userData.log});
        fs.writeFileSync("users/" + logCaseLw + "/__@@@.##__", userParam, 'utf8');
        if("exDict" in userData && userData.exDict != ""){
          let ret = {};
          if(ExDictLoad(userData, "", fs, ret)){
            return ret["text"];
          }
          if("obj" in ret){
            return JSON.stringify({text:ret.text, text1:ret.err});
          }
          return JSON.stringify({text:"External Dict error", exDictErr : ret.text});
        }
      }catch (err) {
        return JSON.stringify({text:"File system error", text1:err});
      }
      return JSON.stringify({text:"User signing", text1:userData.log, text2:userData.pass, text3:"", currDict:""});
    } break;
    case "signIn": {
      //console.log("Sign in: login=" + userData.log + ", password=" + userData.pass);
      let logCaseLw = userData.log.toLowerCase();
      try {
        if (fs.existsSync("users/" + logCaseLw)){ //Если такой юзер есть
          if(fs.existsSync("users/" + logCaseLw + "/__@@@.##__")){ //Если есть файл с паролем
            let savedUserData = JSON.parse(fs.readFileSync("users/" + logCaseLw + "/__@@@.##__", 'utf8'));
            let savedPass = savedUserData["abc"];
            if(!savedPass){                      // если в файле нет пароля
              return JSON.stringify({text:"Password error. ", text2:"Need reset password."});
            }
            if(userData.pass == savedPass){      // если пароль есть и совпадает с введённым
              let exDictErr = "";
              if("exDict" in userData && userData.exDict != ""){
                let ret = {};
                if(ExDictLoad(userData, "<br><br>Default dictionary loaded.", fs, ret)){
                  return ret["text"];
                }
                if("obj" in ret){
                  return JSON.stringify({text:ret.text, text1:ret.err});
                }
                exDictErr = ret.text;
              }
              let currDict = savedUserData["currDict"];
              if(currDict && currDict != ""){
                if(fs.existsSync("users/" + logCaseLw + "/" + currDict)){
                  let dict = fs.readFileSync("users/" + logCaseLw + "/" + currDict, 'utf8');
                  return JSON.stringify({text:"User signing", text1:userData.log, text2:savedPass, 
                                         text3:dict, exDictErr : exDictErr, currDict:currDict});
                }
              }
              return JSON.stringify({text:"User signing", text1:userData.log, 
                                     text2:savedPass, text3:"", exDictErr : exDictErr, currDict:""});
            }
            return JSON.stringify({text:"Wrong password", text1:userData.log});
          }
          return JSON.stringify({text:"System error: ", text1:"Need reset password."});
        }
        return JSON.stringify({text:"User not found: ", text1:userData.log});
      }catch (err) {
        return JSON.stringify({text:"File system error: ", text1:err});
      }
    } break;
    case "loadDict":{
      let logCaseLw = userData.user.toLowerCase();
      try {
                //({ user: user, dictName: dictName, dictBody: dictBody});
        if (!fs.existsSync("users/" + logCaseLw)){
          return JSON.stringify({text:"User not found", text1:userData.log});
        }
        fs.writeFileSync("users/" + logCaseLw + "/" + userData.dictName, JSON.stringify(userData.dictBody), 'utf8');
        let userDataSave = JSON.parse(fs.readFileSync("users/" + logCaseLw + "/__@@@.##__", 'utf8'));
        userDataSave["currDict"] = userData.dictName;
        fs.writeFileSync("users/" + logCaseLw + "/__@@@.##__", JSON.stringify(userDataSave), 'utf8');
        return JSON.stringify({text:"Dict download"});
      }catch (err) {
        return JSON.stringify({text:"File system error", text1:err});
      }
    } break;
    case "loadExDict":{
      let partsExDict = userData.exDict.split(":");
      if(partsExDict.length != 2 ){
        return JSON.stringify({text:"Invalid link to external dictionary: ", text1:userData.exDict});
      }
      let path = "users/" + partsExDict[0].toLowerCase() + "/" + partsExDict[1];
      try {
        if (!fs.existsSync(path)){
          return JSON.stringify({text:"Dictionary not found: ", text1:userData.exDict});
        }
        let dictStr = fs.readFileSync(path, 'utf8');
        return JSON.stringify({text:"Dict selected", dict:dictStr});
      }catch (err) {
        return JSON.stringify({text:"File system error", text1:err});
      }
    } break;
    case "selectDict":{
      let logCaseLw = userData.user.toLowerCase();
      try {
        if (!fs.existsSync("users/" + logCaseLw)){
          return JSON.stringify({text:"User not found", text1:userData.log});
        }
        let userDataSave = JSON.parse(fs.readFileSync("users/" + logCaseLw + "/__@@@.##__", 'utf8'));
        userDataSave["currDict"] = userData.dictName;
        fs.writeFileSync("users/" + logCaseLw + "/__@@@.##__", JSON.stringify(userDataSave), 'utf8');
        let dictStr = fs.readFileSync("users/" + logCaseLw + "/" + userData.dictName, 'utf8');
        return JSON.stringify({text:"Dict selected", dict:dictStr, currDict:userData.dictName});
      }catch (err) {
        return JSON.stringify({text:"File system error", text1:err});
      }
    } break;
      
    case "CheckFileExist":{
      let logCaseLw = userData.user.toLowerCase();
      try {
        if (!fs.existsSync("users/" + logCaseLw)){
          return JSON.stringify({text:"Didn't found user" + userData.log});
        }       
        if (fs.existsSync("users/" + logCaseLw + "/" + userData.dictName)){
          return JSON.stringify({text:"Exist", goal:userData.goal, text1:userData.dictName});
        } else {
          return JSON.stringify({text:"Not exist", goal:userData.goal});
        }
      }catch (err) {
        return JSON.stringify({text:"File system error", text2:err});
      }
    } break;
    case "ChangeDict":{
      let logCaseLw = userData.log.toLowerCase();
      try {
        let path = "users/" + logCaseLw;
        if (!fs.existsSync(path)){
          return JSON.stringify({text:"User not found", text1:userData.log});
        }
        let dictArr = fs.readdirSync(path);
        let ret = [];
        for(let i in dictArr){
          if(dictArr[i] != "__@@@.##__"){
            let dict = JSON.parse(fs.readFileSync("users/" + logCaseLw + "/" + dictArr[i], 'utf8'));
            let tmpStruct = {dictName:dictArr[i],words:[]};
            for(let j=0; j<3 && j< dict.length; j++){
              tmpStruct.words.push(dict[j]);
            }
            ret.push(tmpStruct);
          }
        }
        return JSON.stringify({text:"Dict array", text1:JSON.stringify(ret)});
      }catch (err) {
        return JSON.stringify({text:"File system error", text1:err});
      }
      
    } break;
      
  }
  return JSON.stringify({text:"No command handler", text2:command});
}
