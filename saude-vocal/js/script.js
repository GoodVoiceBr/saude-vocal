IS_MOBILE = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
DIAS_SEMANA = ['dom','seg','ter','qua','qui','sex','sab'];

tempo_inicial = 0;
tempo_total = 0;
nota_atual = 0;

var tipoAvaliacao = 0;

let tempos_avaliacao = [];
/* 
    Checa se o localStorage já foi iniciado.
    Caso não tenha sido, cria a estrutura de dados
*/
if(!localStorage['DADOS']){
    console.log('Criando estrutura inicial dos dados');
    var DADOS = {};
    DADOS['turno'] = {'m': [], 't': [], 'n': []};
    DADOS['dia_semana'] = {'dom': [], 'seg': [], 'ter': [], 'qua': [], 'qui': [], 'sex': [], 'sab': []};
    DADOS['resultados_por_dia'] = []; // ['10/12/2020', [80, 75, 20]]
    DADOS['turno_hoje'] = {'m': 0, 't': 0, 'n': 0};
    DADOS['meses'] = {};
    for (var mes = 1; mes <= 12; mes++) {
        DADOS['meses'][mes] = {};
    }

    localStorage['DADOS'] = JSON.stringify(DADOS);

    atualiazarDados(DADOS);
}

function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}

function lanca_nota_emoji(nota, botao){
    nota_atual = nota;
    botao.addClass('animate__animated animate__bounceIn');
    setTimeout(function(){
        botao.removeClass('animate__animated animate__bounceIn');
        tipoAvaliacao = 1;
        $('#salvar_avaliacao').click();
    }, 1000);
}

// async function registerSW() {
//   if ('serviceWorker' in navigator) {
//     try {
//       await navigator.serviceWorker.register('./sw.js');
//     } catch (e) {
//       console.log(`SW registration failed`);
//     }
//   }
// }

function update_avaliacao_diaria(){
    var DADOS = JSON.parse(localStorage['DADOS']);
    var DADOS_BKP = JSON.parse(localStorage['DADOS']);
    var hoje = new Date();
    var str_data = hoje.toLocaleDateString('pt-BR');
    var hora = hoje.getHours();
    var t;
    if(hora < 12){
        t = "m";
    } else if(hora >= 12 && hora < 18){
        t = "t";
    } else{
        t = "n";
    }

    if(DADOS['resultados_por_dia'].length > 0){
        if((DADOS['resultados_por_dia'].slice(-1)[0][0] == str_data) && (DADOS['turno_hoje'] != undefined)){
            for(var turno in DADOS['turno_hoje']){
                if(DADOS['turno_hoje'][turno] != 0){
                    if(DADOS['turno_hoje'][turno] != 2) {
                        $(`#${turno}`).css('background-color', 'rgba(255, 99, 132, 0.5)');
                        $('#status_voz > *').css('font-weight', 'normal');
                        $('#status_voz > *').css('border-bottom', '0');
                        if(t == turno){
                            $('#btn_voz_alterada').css('font-weight', 'bold');
                            $('#btn_voz_alterada').css('border-bottom', '3px solid rgba(255, 99, 132, 0.7)');
                        }
                    } else{
                        $(`#${turno}`).css('background-color', 'rgba(75, 192, 192, 0.5)');
                        $('#status_voz > *').css('font-weight', 'normal');
                        $('#status_voz > *').css('border-bottom', '0');
                        if(t == turno){
                            $('#btn_voz_boa').css('font-weight', 'bold');
                            $('#btn_voz_boa').css('border-bottom', '3px solid rgba(75, 192, 192, 0.7)');
                        }
                    }
                }
                else{
                    $(`#${turno}`).css('background-color', 'transparent');
                }
            }
        }else{
            DADOS['turno_hoje'] = {'m': 0, 't': 0, 'n': 0};
        }
    }else{
        DADOS['turno_hoje'] = {'m': 0, 't': 0, 'n': 0};
        $("#turnos > *").css('background-color', 'transparent');
        $("#status_voz > *").css('font-weight', 'normal');
    }
    if (DADOS_BKP != DADOS) {
        atualiazarDados(DADOS);
    }
       
}

function criaMatrizHoras(){
    var DADOS = JSON.parse(localStorage['DADOS']);
    if(!DADOS['matriz_horas']){

        M.Tabs.getInstance($(".tabs")).select('tab3');

        DADOS['matriz_horas'] = {'dom': {}, 'seg': {}, 'ter': {}, 'qua': {}, 'qui': {}, 'sex': {}, 'sab': {}};
        for(var dia in DADOS['matriz_horas']){
            DADOS['matriz_horas'][dia] = {'manha': {}, 'tarde': {}, 'noite': {}};
        }

        $('.horas_voz').each(function(){
            let id = $(this).attr('id').split('_');
            DADOS['matriz_horas'][id[0]][id[1]] = $(this).val();
        });
        atualiazarDados(DADOS);
    }
}

function criarDadosPessoais(){
    var DADOS = JSON.parse(localStorage['DADOS']);
    if(!DADOS['dados_pessoais']){

        DADOS['dados_pessoais'] = {"idade": "0", "fumante": "", "sexo": "", "tempo_fumante": [0,0], "tempo_parou_fumar": [0,0]};
        atualiazarDados(DADOS);
    }
}

function carregaDadosPessoais(){
    var DADOS = JSON.parse(localStorage['DADOS']);
    $("#idade").val(DADOS['dados_pessoais']['idade']);
    $(`#sexo_${DADOS['dados_pessoais']['sexo']}`).prop("checked", true);
    $(`#fumante_${DADOS['dados_pessoais']['fumante']}`).prop("checked", true);
    $("#tempo_anos").val(DADOS['dados_pessoais']['tempo_fumante'][0]);
    $("#tempo_meses").val(DADOS['dados_pessoais']['tempo_fumante'][1]);
    $("#parou_anos").val(DADOS['dados_pessoais']['tempo_parou_fumar'][0]);
    $("#parou_meses").val(DADOS['dados_pessoais']['tempo_parou_fumar'][1]);
    toggleInputsTempo();
}

function toggleInputsTempo(){
    let valor = $("input[name=fumante]:checked").val();
    switch (valor) {
      case 'sim':
        $(".tempo_fumante").removeClass('grey-text');
        $(".tempo_parou").addClass('grey-text');
        $("#tempo_anos, #tempo_meses").prop("disabled", false);
        $("#parou_anos, #parou_meses").prop("disabled", true);
        break;
      case 'nao':
        $(".tempo_fumante").addClass('grey-text');
        $(".tempo_parou").addClass('grey-text');
        $("#tempo_anos, #tempo_meses, #parou_anos, #parou_meses").prop("disabled", true);
        break;
      case 'ja_fui':
        $(".tempo_fumante").removeClass('grey-text');
        $(".tempo_parou").removeClass('grey-text');
        $("#tempo_anos, #tempo_meses, #parou_anos, #parou_meses").prop("disabled", false);
        break;
    }
}

function carregarDadosTabela(){
    var DADOS = JSON.parse(localStorage['DADOS']);
    if(DADOS['matriz_horas']){
        for(var dia in DADOS['matriz_horas']){
            for(var turno in DADOS['matriz_horas'][dia]){
                $(`#${dia}_${turno}`).val(parseInt(DADOS['matriz_horas'][dia][turno]));
            }
        }
    }
}

function carregaCoresTabela(){
    $('.horas_voz').each(function(){
        atualizaCorSelect($(this));
    });
}

function atualizaCorSelect(e){
    if (e.val() > 0) {
        if(e.val() <= 2){
            e.siblings().css('color', 'rgb(75, 192, 192)');
            e.siblings().css('border-color', 'rgb(75, 192, 192)');
        }else if (e.val() <= 5){
            e.siblings().css('color', 'rgb(255, 159, 64)');
            e.siblings().css('border-color', 'rgb(255, 159, 64)');
        }else{
            e.siblings().css('color', 'rgb(255, 99, 132)');
            e.siblings().css('border-color', 'rgb(255, 99, 132)');
        }
    }else{
        e.siblings().css('color', 'black');
        e.siblings().css('border-color', 'gray');
    }
}

function carregarDica(){
    var DADOS = JSON.parse(localStorage['DADOS']);

    var hoje = new Date();
    var hora = hoje.getHours();

    let turno;

    if(hora < 12){
        turno = 'm';
    } else if(hora >= 12 && hora < 18){
        turno = 't';
    } else{
        turno = 'n';
    }

    if (DADOS['turno_hoje'][turno] > 0) {
        if (DADOS['turno_hoje'][turno] != 2) {

            if (DADOS['turno_hoje'][turno] == 3) {
                $("#template_4").show();
            }else{
                $("#template_4").hide();
            }

            $("#template_1").show();
            $("#template_3").hide();
        }else{
            $("#template_1").hide();
            $("#template_3").show();
        }
    }

    $("#template_2").show();
}

function recarregarDados(){
    criaMatrizHoras();
    update_avaliacao_diaria();
    update_graficos();
    carregarDadosTabela();
    $('select').formSelect();
    carregaCoresTabela();
    criarDadosPessoais();
    carregaDadosPessoais();
    carregarDica();
}

function msgDadosPerfilSalvos(){
    const option = {
        year: 'numeric',
        month: 'long',
        weekday: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    $("#dados_perfil_salvo").html("Dados salvos: " + new Date().toLocaleDateString( 'pt-br', option));
    $("#dados_perfil_salvo").show();
}

$(document).ready(function(){

    $("#tela_login").hide();

    // registerSW();

    let deferredPrompt;
    const addBtn = document.querySelector('.add-button');
    const addBtnSpace = document.querySelector('.add-button-space');
    addBtn.style.display = 'none';
    addBtnSpace.style.display = 'none';

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      addBtn.style.display = 'block';
      addBtnSpace.style.display = 'block';

      addBtn.addEventListener('click', (e) => {
        addBtn.style.display = 'none';
        addBtnSpace.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the A2HS prompt');
            } else {
              console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
          });
      });
    });

    /*Aba de rotina*/
    $('.horas_voz').each(function(){
        for (var i = 0; i <=8; i++) {
            $(this).append(new Option(i, i));
        }
    });

    $('select').formSelect();


    $('.tabs').tabs();

    /* Gerenciando a matriz_horas */

    $('.horas_voz').change(function(){
        carregaCoresTabela();
    });

    $("#idade").change(function(){
        let valor = this.value;

        if(valor > 0){
            // var DADOS = JSON.parse(localStorage['DADOS']);

            // DADOS['dados_pessoais']['idade'] = valor;

            // msgDadosPerfilSalvos();
            // atualiazarDados(DADOS);
            $("#idade").removeClass("red-text");
            $("#idade").css('border-color', 'grey');
        }else{
            $("#idade").addClass("red-text");
            $("#idade").css('border-color', 'rgb(255, 99, 132)');
        }
    });


    // $("input[name=sexo]:radio").change(function(){
    //     let valor = this.value;

    //     var DADOS = JSON.parse(localStorage['DADOS']);

    //     DADOS['dados_pessoais']['sexo'] = valor;

    //     msgDadosPerfilSalvos();
    //     atualiazarDados(DADOS);
    // });

    $("input[name=fumante]:radio").change(function(){
        toggleInputsTempo();

    });

    $("#tempo_anos, #tempo_meses").change(function(){
        let valorAno = $("#tempo_anos").val();
        let valorMes = $("#tempo_meses").val();

        if (valorAno >= 0 && valorMes >=0 && valorMes < 12) {
            $("#tempo_anos").removeClass("red-text");
            $("#tempo_meses").removeClass("red-text");
            $("#tempo_anos").css('border-color', 'gray');
            $("#tempo_meses").css('border-color', 'gray');
            // var DADOS = JSON.parse(localStorage['DADOS']);
            // DADOS['dados_pessoais']["tempo_fumante"] = [valorAno,valorMes];

            // msgDadosPerfilSalvos();
            // atualiazarDados(DADOS);
        }else if(valorAno < 0){
            $("#tempo_anos").addClass("red-text");
            $("#tempo_anos").css('border-color', 'rgb(255, 99, 132)');
        }
        else if(valorMes < 0 || valorMes > 12){
            $("#tempo_meses").addClass("red-text");
            $("#tempo_meses").css('border-color', 'rgb(255, 99, 132)');
        }
    });

    $("#parou_anos, #parou_meses").change(function(){
        let valorAno = $("#parou_anos").val();
        let valorMes = $("#parou_meses").val();

        if (valorAno >= 0 && valorMes >=0 && valorMes < 12){
            $("#parou_anos").removeClass("red-text");
            $("#parou_meses").removeClass("red-text");
            $("#parou_meses").css('border-color', 'gray');
            $("#parou_anos").css('border-color', 'gray');
            // var DADOS = JSON.parse(localStorage['DADOS']);
            // DADOS['dados_pessoais']["tempo_parou_fumar"] = [valorAno,valorMes];

            // msgDadosPerfilSalvos();
            // atualiazarDados(DADOS);
        }else if(valorAno < 0){
            $("#parou_anos").addClass("red-text");
            $("#parou_anos").css('border-color', 'rgb(255, 99, 132)');
        }
        else if(valorMes < 0 || valorMes > 12){
            $("#parou_meses").addClass("red-text");
            $("#parou_meses").css('border-color', 'rgb(255, 99, 132)');
        }
    });

// -------------------------------------------

    $('#salvar_dados_perfil').click(function(){

        var DADOS = JSON.parse(localStorage['DADOS']);

        let idade = $("#idade").val();

        if(idade > 0){
            DADOS['dados_pessoais']['idade'] = idade;
        }

        if (document.querySelector('input[name=sexo]:checked') != null) {
            DADOS['dados_pessoais']['sexo'] = document.querySelector('input[name=sexo]:checked').value;
        }
        if (document.querySelector('input[name=fumante]:checked') != null) {
            DADOS['dados_pessoais']['fumante'] = document.querySelector('input[name=fumante]:checked').value;
        }

        let valorAno = $("#tempo_anos").val();
        let valorMes = $("#tempo_meses").val();

        if (valorAno >= 0 && valorMes >=0 && valorMes < 12) {
            DADOS['dados_pessoais']["tempo_fumante"] = [valorAno,valorMes];
        }

        valorAno = $("#parou_anos").val();
        valorMes = $("#parou_meses").val();

        if (valorAno >= 0 && valorMes >=0 && valorMes < 12){
            DADOS['dados_pessoais']["tempo_parou_fumar"] = [valorAno,valorMes];
        }

        $('.horas_voz').each(function(e){
            let id = this.id.split('_');
            DADOS['matriz_horas'][id[0]][id[1]] = $(this).val();
        })
        
        msgDadosPerfilSalvos();
        atualiazarDados(DADOS);
        M.Tabs.getInstance($(".tabs")).select('tab1');
        window.scrollTo(0, 0);
    })


    $('.sidenav').sidenav();

    $('#login_btn').click(function(){
        let email = $('#email_input').val();
        let password = $('#senha_input').val();

        login(email, password).then(function(value) {
            if (value[0] == false) {
                $("#erro_login").html(value[1]);
                $("#erro_login").show();
            }else{
            }
        });
    });

    $("#tela_login").keypress(function(e){
        if(e.keyCode == 13){
            $('#login_btn').click();
        }
    });

    $("#btn_reset_password").click(function(){
        let email = $("#email_input").val();

        sendResetPassword(email).then(function(value){
            $("#erro_login").text(value);
            $("#erro_login").show();
        });
    });

    $('#logout_btn').click(function(){
        logout().then(function(value) {
            if (value[0] == false) {
                $("#erro_logout").text(value[1]);
                $("#erro_logout").show();
            }else{
                localStorage.clear();
                location.reload(true);
            }
        });
    });

    $('#limpar_dados').click(function(){
        if(window.confirm('Isso apagará todos os registros de voz. Tem certeza?')){
            localStorage.clear();
            var DADOS = {};
            DADOS['turno'] = {'m': [], 't': [], 'n': []};
            DADOS['dia_semana'] = {'dom': [], 'seg': [], 'ter': [], 'qua': [], 'qui': [], 'sex': [], 'sab': []};
            DADOS['resultados_por_dia'] = [];
            DADOS['turno_hoje'] = {'m': 0, 't': 0, 'n': 0};
            DADOS['meses'] = {};
            for (var mes = 1; mes <= 12; mes++) {
                DADOS['meses'][mes] = {};
            }

            DADOS['matriz_horas'] = {'dom': {}, 'seg': {}, 'ter': {}, 'qua': {}, 'qui': {}, 'sex': {}, 'sab': {}};
            for(var dia in DADOS['matriz_horas']){
                DADOS['matriz_horas'][dia] = {'manha': {}, 'tarde': {}, 'noite': {}};
            }

            $('.horas_voz').each(function(){
                let id = $(this).attr('id').split('_');
                DADOS['matriz_horas'][id[0]][id[1]] = $(this).val();
            });

            atualiazarDados(DADOS);

            M.Sidenav.getInstance($('.sidenav')).close();
            M.Tabs.getInstance($(".tabs")).select('tab3');
        }        
    });

    $('#btn_avaliar').click(function(){
        var DADOS = JSON.parse(localStorage['DADOS']);

        if (DADOS['dados_pessoais']['sexo'] == "") {
            M.Tabs.getInstance($(".tabs")).select('tab3');
            alert("Por gentileza, forneça algumas informações para completarmos seu perfil.");
        }else{
            $('#tela_avaliacao').css({
                'visibility': 'visible'
            });
        }
    });

    $('#btn_voz_alterada').click(function(){
        lanca_nota_emoji(1, $(this));        
    });

    $('#btn_voz_boa').click(function(){
        lanca_nota_emoji(2, $(this));
    });

    $('#fechar_avaliacao').click(function(){
        $('#resultado_voz').hide();
        $('.botoes_avaliacao').hide();
        tempos_avaliacao = [];
        
        $('#tela_avaliacao').css({
            'visibility': 'hidden'
        });
    });

    $('#cancelar_avaliacao').click(function(){
        $('#resultado_voz').hide();
        $('.botoes_avaliacao').hide();
        tempos_avaliacao = [];
        
        $('#tela_avaliacao').css({
            'visibility': 'hidden'
        });
    });

    /*** 
        Eventos do botão têm tratamento diferente 
        em mobile e desktop
    ***/
    var segurou_botao = function(){
        $('#resultado_voz').hide();
        $('.botoes_avaliacao').hide();
        beep();
        $('.loader').fadeIn();
        console.log('clicou');
        tempo_inicial = new Date();
    };

    var soltou_botao = function(){

        if (tempos_avaliacao.length == 3) {
            tempos_avaliacao = [];
        }

        let tempo_media;

        var DADOS = JSON.parse(localStorage['DADOS']);
        beep();
        console.log('soltou');
        $('.loader').fadeOut();
        tempo_total = (new Date() - tempo_inicial) / 1000;
        console.log(tempo_total);

        tempos_avaliacao[tempos_avaliacao.length] = tempo_total;

        tempo_media = 0;

        for (var i = 0; i < tempos_avaliacao.length; i++) {
            tempo_media += tempos_avaliacao[i];
        }

        tempo_media = tempo_media / tempos_avaliacao.length;

        var qualidade = 'NORMAL';
        nota_atual = 2;
        if (DADOS['dados_pessoais']['sexo'] == 'masculino') {
            if(tempo_media < 25){
                qualidade = 'ALTERADA';
                nota_atual = 1;
            }else if(tempo_media > 35) {
                qualidade = 'ALTERADA';
                nota_atual = 3;
            }
        }else{
            if(tempo_media < 15){
                qualidade = 'ALTERADA';
                nota_atual = 1;
            }else if (tempo_media > 25) {
                qualidade = 'ALTERADA';
                nota_atual = 3;
            }
        }

        let resultadoHtml;

        if (tempos_avaliacao.length == 3) {
            resultadoHtml = '<div>' + tempos_avaliacao.length + '/3</div><strong>Qualidade estimada da voz:</strong> <span class="' + qualidade + '">' + qualidade + '</span>';
            $('#salvar_avaliacao').show();
        }else{
            $('#salvar_avaliacao').hide();
            resultadoHtml = '<div>' + tempos_avaliacao.length + '/3</div>';
        }

        $('#resultado_voz').fadeIn(2500);
        $('#resultado_voz').html(resultadoHtml);
        $('.botoes_avaliacao').fadeIn(2500);
    };

    $('#btn_tmf').mousedown(function(e){
        e.preventDefault();
        if(!IS_MOBILE){
            segurou_botao();
        }
        return false;
    });

    $('#btn_tmf').mouseup(function(e){
        e.preventDefault();
        if(!IS_MOBILE){
            soltou_botao();
        }
        return false;
    });

    $('#btn_tmf').on('touchstart', function(e){
        e.preventDefault();
        if(IS_MOBILE){
            segurou_botao();
        }
        return false;
    });

    $('#btn_tmf').on('touchend', function(e){
        e.preventDefault();
        if(IS_MOBILE){
            soltou_botao();
        }
        return false;
    });


    $('#salvar_avaliacao').click(function(){

        if (tipoAvaliacao == 0) {
            salvarDataHora('avaliacoes_tmf');
        }else{
            salvarDataHora('avaliacoes_emoji');
        }

        tipoAvaliacao = 0;

        var DADOS = JSON.parse(localStorage['DADOS']);

        var hoje = new Date();
        var dia_semana = DIAS_SEMANA[hoje.getDay()];
        
        let t;

        // Turno e Dia semana
        var hora = hoje.getHours();
        if(hora < 12){
            t = "m";
        } else if(hora >= 12 && hora < 18){
            t = "t";
        } else{
            t = "n";
        }

        if (DADOS['turno_hoje'][t] != 0) {
            DADOS['turno'][t][DADOS['turno'][t].length - 1] = nota_atual;
            DADOS['dia_semana'][dia_semana][DADOS['dia_semana'][dia_semana].length - 1] = nota_atual;
        }else{
            DADOS['turno'][t].push(nota_atual);
            DADOS['dia_semana'][dia_semana].push(nota_atual);
        }
        DADOS['turno_hoje'][t] = nota_atual;

        $(`#${t}`).addClass('animate__animated animate__bounceIn');
        setTimeout(function(){
            $(`#${t}`).removeClass('animate__animated animate__bounceIn');
        }, 1000);

        // Resultados por dia. Formato:
        //DADOS['resultados_por_dia'] = [['10/12/2020', [80, 75, 20]], ...]
        var str_data = hoje.toLocaleDateString('pt-BR');

        var achou = false;
        for(var i=0; i < DADOS['resultados_por_dia'].length; i++){
            if(DADOS['resultados_por_dia'][i][0] == str_data){
                DADOS['resultados_por_dia'][i][1] = [];
                for(var turno in DADOS['turno_hoje']){
                    if(DADOS['turno_hoje'][turno] != 0)
                         DADOS['resultados_por_dia'][i][1].push(DADOS['turno_hoje'][turno]);
                }
                achou = true;
                break
            }
        }
        if(!achou){
            DADOS['resultados_por_dia'].push([str_data, [nota_atual]]);
        }

        DADOS['meses'][hoje.getMonth()+1][hoje.getDate()] = DADOS['turno_hoje'];

        atualiazarDados(DADOS);

        $('#resultado_voz').hide(); 
        $('.botoes_avaliacao').hide();
        tempos_avaliacao = [];

        $('#tela_avaliacao').css({
            'visibility': 'hidden'
        });

        console.log('Dados registrados com sucesso');
    });
});