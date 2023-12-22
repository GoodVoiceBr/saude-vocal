const firebaseConfig = {
	apiKey: "AIzaSyDWrj7TLq9ej_BywETaICzMtfLZk7pclQY",
	authDomain: "saudedavoz-e5cc5.firebaseapp.com",
	databaseURL: "https://saudedavoz-e5cc5-default-rtdb.firebaseio.com",
	projectId: "saudedavoz-e5cc5",
	storageBucket: "saudedavoz-e5cc5.appspot.com",
	messagingSenderId: "987500916652",
	appId: "1:987500916652:web:b2d2d1721215e9ea5d9409",
	measurementId: "G-DY6T6KK50L"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

var database = firebase.database();
var auth = firebase.auth();

var currentUser;

var connectedRef = firebase.database().ref(".info/connected");
var connected;

var firstLoad = true;

connectedRef.on("value", function (snap) {
	if (snap.val() === true && currentUser != null && firstLoad == false) {
		database.ref(`users/${currentUser.uid}/dados`).set(localStorage['DADOS']);
		console.log("conectado");
	} else if (snap.val() === false) {
		console.log("desconectado");
		if (firstLoad == false) {
			//alert(`Você está sem conexão com a internet. Os dados serão salvos localmente. Caso a conexão seja reestabelecida e o aplicativo ainda esteja aberto seus dados serão sincronizados.`);
		}
	}

	connected = snap.val();
});

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
auth.languageCode = 'pt-br';

auth.onAuthStateChanged(function (user) {
	currentUser = user;
	if (user) {
		let ref = database.ref(`users/${user.uid}/dados`);

		ref.on('value', function (snapshot) {
			if (snapshot.val() == null) {
				ref.set(localStorage['DADOS']);
			} else {
				localStorage['DADOS'] = snapshot.val();
				recarregarDados();
			}
			firstLoad = false;
			console.log("Dados Alterados");
		});
		$("#email_user").text(user.email);
		$("#logout_wrapper").show();
		$("#tela_login").hide();
		salvarDataHora('acessos');
		setInterval(function () { incrementaTempoUso(1); }, 60000);
	}
	else {
		$("#tela_login").show();
		// firebase.auth().signInAnonymously()
		// .then(() => {
		// 	console.log("Login anônimo.");
		// })
		// .catch((error) => {
		//   var errorCode = error.code;
		//   var errorMessage = error.message;
		//   console.log("Erro login anônimo -> " + errorCode);
		// });

	}
});

async function cadastro(email, password, confirmPassword) {
	let msgErro = "";
	if ((email != "") && (password != "") && (confirmPassword != "")) {
		if ((password === confirmPassword)) {
			await auth.createUserWithEmailAndPassword(email, password).catch(function (error) {
				console.log(error);
				let errorCode = error.code;

				if (errorCode == "auth/email-already-exists" || error.code == "auth/email-already-in-use") {
					msgErro = "O endereço de email já está cadastrado."
				}
				else
					msgErro = "Ocorreu um erro ao efetuar o cadastro.";
			});
		}

		else{
			msgErro = "As senhas são diferentes";
		}
	}
	else {
		msgErro = "Preencha todos os campos";
	}

	if (msgErro == "") {
		return [true];
	}
	else {
		return [false, msgErro];
	}
}

async function login(email, password) {
	let msgErro = "";
	if ((email != "") && (password != "")) {
		await auth.signInWithEmailAndPassword(email, password).catch(function (error) {
			console.log(error);
			usuarioNaoVerificado = null;
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode == "auth/invalid-email") {
				msgErro = "O endereço de e-mail está formatado incorretamente.";
			}
			else if (errorCode == "auth/user-not-found") {
				msgErro = "Não há registro de usuário correspondente a este e-mail.";
			}
			else if (errorCode == "auth/wrong-password") {
				msgErro = "A senha está incorreta.";
			}
			else if (errorCode == "auth/too-many-requests") {
				msgErro = "O acesso a esta conta foi temporariamente desativado devido a muitas tentativas de login mal sucedidas. Você pode restaurá-lo imediatamente redefinindo sua senha ou pode tentar novamente mais tarde.";
			}
			else {
				msgErro = "Ocorreu um erro ao efetuar o login.";
			}
		});
	}
	else {
		msgErro = "Preencha todos os campos";
	}

	if (msgErro == "") {
		return [true];
	}
	else {
		return [false, msgErro];
	}

}

async function sendResetPassword(email) {
	var msg;
	await auth.sendPasswordResetEmail(email).then(function () {
		msg = "Um e-mail para a redefinição da senha foi enviado!";
	}).catch(function (error) {
		msg = "Erro ao enviar e-mail de redefinição de senha!";
		if (error.code == "auth/invalid-email") {
			msg = " O endereço de e-mail está formatado incorretamente!";
		}
		else if (error.code == "auth/user-not-found") {
			msg = " Não há registro de usuário correspondente a este e-mail.";
		}
	});
	return msg;
}

async function logout() {
	let msgErro = "";
	auth.signOut().catch(function (error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		msgErro = "Ocorreu um erro ao efetuar o logout.";
		console.log("Erro logout");
	});

	if (msgErro == "") {
		return [true];
	}
	else {
		return [false, msgErro];
	}
}

function atualiazarDados(DADOS) {
	if (currentUser != null) {
		if (connected) {
			database.ref(`users/${currentUser.uid}/dados`).set(JSON.stringify(DADOS));
		} else {
			localStorage['DADOS'] = JSON.stringify(DADOS);
			recarregarDados();
		}
	}

}

function salvarDataHora(refStr) {
	const option = {
		year: 'numeric',
		month: 'long',
		weekday: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	}
	let dataHora = new Date().toLocaleDateString('pt-br', option);
	database.ref(`users/${currentUser.uid}/${refStr}`).push().set(dataHora);
}

function incrementaTempoUso(tempo) {
	tempoUsoRef = database.ref(`users/${currentUser.uid}/tempo_uso`);
	tempoUsoRef.transaction((tempoUso) => {
		if (tempoUso) {
			tempoUso++;
		}
		else {
			tempoUso = tempo;
		}
		return tempoUso;
	});
}