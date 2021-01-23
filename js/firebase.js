
var firebaseConfig = {
    apiKey: "AIzaSyBfhiC7QuqAK5ox4DxQ1KhSK8yPgP70mqA",
    authDomain: "good-voice-47bb1.firebaseapp.com",
    projectId: "good-voice-47bb1",
    storageBucket: "good-voice-47bb1.appspot.com",
    messagingSenderId: "557917590993",
    appId: "1:557917590993:web:5b2e42a76a8c7e992f3cf0",
    measurementId: "G-212K3LSWMB"
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