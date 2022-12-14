function SetHelp(chapter){
  const plasButton = "<input type=\'button\' value=\'+\' onclick=\'openHelp("+chapter+")\'/>"// " + 
             //"style=\'box-shadow:5px 5px 6px rgba(0, 0, 0, 5);color:#000000; border:solid 2px #000000;float:right;\';//class=\'button1\' 
  
  const minusButton = "<input class=\'button1\' type=\'button\' value=\'-\' onclick=\'closeHelp("+chapter+")\' " + 
             "style=\'box-shadow:5px 5px 6px rgba(0, 0, 0, 5);color:#000000; border:solid 2px #000000;float:right;\'/>";
  
  document.getElementById("helpText").innerHTML = plasButton + GetHelpText(chapter, true);
  window.openBlock('helpWindow');
}

function GetHelpText(){
  let help = [
    {title: 'How to enter FoWoCa',
    text:'При первой загрузке форма регистрации должна появится автоматически. Если этого не произошло, следует нажать на кнопку \"user: …\" наверху экрана.<br/>' + 
    'Ввести е-майл - он должен быть действующий, потому что на него будет приходить сообщение при восстановлении забытого пароля.<br/>' + 
    'Если вход осуществляется для существующего на FoWoCa аккаунта, далее следует нажать кнопку \"Sign in\". Если аккаунта ещё нет, следует нажать кнопку \"Sign up\" '+
    '- откроется поле для ввода подтверждения пароля - ввести подтверждение и ещё раз нажать кнопку \"Sign up\".'},
    {title: 'How to load ',
    text:'При первой загрузке форма регистрации должна появится автоматически. Если этого не произошло, следует нажать на кнопку \"user: …\" наверху экрана.<br/>' + 
    'Ввести е-майл - он должен быть действующий, потому что на него будет приходить сообщение при восстановлении забытого пароля.<br/>' + 
    'Если вход осуществляется для существующего на FoWoCa аккаунта, далее следует нажать кнопку \"Sign in\". Если аккаунта ещё нет, следует нажать кнопку \"Sign up\" '+
    '- откроется поле для ввода подтверждения пароля - ввести подтверждение и ещё раз нажать кнопку \"Sign up\".'},
  ];
  return help;
}



