
const firebaseConfig = {
	apiKey: "AIzaSyDWrj7TLq9ej_BywETaICzMtfLZk7pclQY",
	authDomain: "saudedavoz-e5cc5.firebaseapp.com",
	projectId: "saudedavoz-e5cc5",
	storageBucket: "saudedavoz-e5cc5.appspot.com",
	messagingSenderId: "987500916652",
	appId: "1:987500916652:web:84942684834504f05d9409",
	measurementId: "G-FFL7WH8WS2"
  };

firebase.initializeApp(firebaseConfig);
firebase.analytics();

var database = firebase.database();

$(document).ready(function(){
	$("#solicitar_cadastro").submit(function(){
		let email = $("#email").val();
		let nome = $("#nome").val();

		if(email != "" && nome != ""){
			$('#mensagem_cadastro').hide();
			
			database.ref(`interessados`).push().set({'email': email, "nome": nome}).then(function(){
				$('#mensagem_cadastro').css('background-color', 'rgb(75, 192, 192)');
				$('#mensagem_cadastro').html("Seus dados foram enviados com sucesso.<br> Em breve a nossa equipe entrará em contato!");
				$("#email").val("");
				$("#nome").val("");
				$('#mensagem_cadastro').show();
			}).catch(function(error){
				$('#mensagem_cadastro').css('background-color', 'rgb(255, 80, 100)');
				$('#mensagem_cadastro').text("Ocorreu um erro ao enviar a solicitação!");
				$('#mensagem_cadastro').show();
			});
		}else{
			$('#mensagem_cadastro').css('background-color', 'rgb(255, 80, 100)');
			$('#mensagem_cadastro').text("Você precisa preencher todos os campos!");
			$('#mensagem_cadastro').show();
		}
		return false;
	});
});

function atualiazarDados(DADOS){
	if (currentUser != null) {
		if (connected) {
			database.ref(`users/${currentUser.uid}`).set(JSON.stringify(DADOS));
		}else{
			localStorage['DADOS'] = JSON.stringify(DADOS);
			recarregarDados();
		}
	}

}