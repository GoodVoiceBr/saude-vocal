var VOZ_BOA = 100;
var VOZ_MEDIA = 70;

CORES_VOZ = {
    'boa': {'background': 'rgba(75, 192, 192, 0.2)', 'border': 'rgba(75, 192, 192, 1)'},
    'media': {'background': 'rgba(255, 159, 64, 0.2)', 'border': 'rgba(255, 159, 64, 1)'},
    'ruim': {'background': 'rgba(255, 99, 132, 0.2)', 'border': 'rgba(255, 99, 132, 1)'},
}

var chartDiaSemana;
var chartPeriodo;

function media(lista){
    var total = 0;
    for(var i = 0; i < lista.length; i++) {
        total += lista[i];
    }
    return total / lista.length;
}

function update_chart_evolucao(lista_datas, lista_valores){
    /*
        A cor do gráfico depende da qualidade atual
        da voz.
    */

    // Tamanho dos pontos
    var pontos = [];
    for(var i=0; i < lista_valores.length; i++){
        pontos.push(3);
    }

    // Adiciona previsão
    lista_datas.push('TENDÊNCIA');

    // Média ponderada dos últimos dias
    var previsao = 0;
    var div = 0;
    var FATOR_PESOS = 2;

    for(var i=0; i<lista_valores.length; i++){
        previsao += lista_valores[i] * (i + 1) ** FATOR_PESOS;
        div += (i + 1) ** FATOR_PESOS;
    }

    previsao = previsao / div;

    lista_valores.push(previsao);
    pontos.push(10);

    // Voz boa. A cor depende da previsão
    var background_color = 'rgba(75, 192, 192, 0.2)';
    var border_color = 'rgba(75, 192, 192, 1)';

    if(previsao < VOZ_MEDIA){
        background_color = 'rgba(255, 99, 132, 0.2)';
        border_color = 'rgba(255, 99, 132, 1)';
    } else if(previsao < VOZ_BOA){
        background_color = 'rgba(255, 159, 64, 0.2)';
        border_color = 'rgba(255, 159, 64, 1)'; 
    }

    var ctx = document.getElementById('chart_evolucao').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: lista_datas,
            datasets: [{
                data: lista_valores,
                backgroundColor: background_color,
                borderColor: border_color,
                borderWidth: 1,
                pointRadius: pontos,
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function update_chart_dia_semana(){

    var DADOS = JSON.parse(localStorage['DADOS']);

    var lista_dia_normal = [];
    var lista_dia_alterada = [];

    let contNormal;
    let contAlterada;

    for(var dia=0; dia < DIAS_SEMANA.length; dia++){
        contNormal = 0;
        contAlterada = 0;
        for(var i=0; i < DADOS['dia_semana'][DIAS_SEMANA[dia]].length; i++){
            if (DADOS['dia_semana'][DIAS_SEMANA[dia]][i] == 2) {
                contNormal++;
            }else{
                contAlterada++;
            }
        }
        lista_dia_normal.push(contNormal);
        lista_dia_alterada.push(contAlterada);
    }

    if (chartDiaSemana) {
        chartDiaSemana.destroy();
    }

    var ctx = document.getElementById('chart_dia_semana').getContext('2d');
    chartDiaSemana = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            datasets: [{
                label: 'Normal',
                data: lista_dia_normal,
                backgroundColor: CORES_VOZ['boa']['background'],
                borderColor: CORES_VOZ['boa']['border'],
                borderWidth: 1
            },
            {
                label: 'Alterada',
                data: lista_dia_alterada,
                backgroundColor: CORES_VOZ['ruim']['background'],
                borderColor: CORES_VOZ['ruim']['border'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                xAxes: [{
                stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                        display: false
                    }
                }]
            }
        }
    });

}

function update_chart_periodo_dia(){
    var DADOS = JSON.parse(localStorage['DADOS']);

    var lista_dia_normal = [];
    var lista_dia_alterada = [];

    let contNormal;
    let contAlterada;

    for(var turno in DADOS['turno']){
        contNormal = 0;
        contAlterada = 0;
        for(var i=0; i < DADOS['turno'][turno].length; i++){
            if (DADOS['turno'][turno][i] == 2) {
                contNormal++;
            }else{
                contAlterada++;
            }
        }
        lista_dia_normal.push(contNormal);
        lista_dia_alterada.push(contAlterada);
    }

    if (chartPeriodo) {
        chartPeriodo.destroy();
    }

    var ctx = document.getElementById('chart_periodo_dia').getContext('2d');
    chartPeriodo = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Manhã', 'Tarde', 'Noite'],
            datasets: [{
                label: 'Normal',
                data: lista_dia_normal,
                backgroundColor: CORES_VOZ['boa']['background'],
                borderColor: CORES_VOZ['boa']['border'],
                borderWidth: 1
            },
            {
                label: 'Alterada',
                data: lista_dia_alterada,
                backgroundColor: CORES_VOZ['ruim']['background'],
                borderColor: CORES_VOZ['ruim']['border'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                xAxes: [{
                stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                        display: false
                    }
                }]
            }
        }
    });
}


function update_historico_avaliacoes_mes(){
    var weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    var DADOS = JSON.parse(localStorage['DADOS']);
    var hoje = new Date();
    let cont = 1;
    let html = `<table class="centered responsive-table">
                <colgroup>
                   <col span="1" style="width: 14.28%;">
                </colgroup>

                <thead>
                  <tr>
                      <th>Domingo</th>
                      <th>Segunda</th>
                      <th>Terça</th>
                      <th>Quarta</th>
                      <th>Quinta</th>
                      <th>Sexta</th>
                      <th>Sábado</th>
                  </tr>
                </thead>

                <tbody>
                <tr>`;

    let primeiroDiaMesStr = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toDateString().substring(0,3);
    let primeiroDiaMesPos = 0;

    for (var dia in weekDays) {
        if (weekDays[dia] == primeiroDiaMesStr) {
            primeiroDiaMesPos = dia;
        }
    }

    for(var i = 1; i <= primeiroDiaMesPos; i++){
        html += `<td></td>`;
        cont++;
        if (cont > 7) {
            html += '</tr><tr>';
            cont = 1;
        }
    }

    let valoresDia;
    let valorDia;
    let soma;
    let nrTurnos;

    for (var dia = 1; dia <= new Date(hoje.getFullYear(), hoje.getMonth()+1, 0).getDate(); dia++) {
        valoresDia = DADOS['meses'][hoje.getMonth()+1][dia];

        html += `<td style="background-color:` ;
        if (valoresDia != undefined) {
            soma = 0;
            nrTurnos = 0;
            
            for(var turno in valoresDia){
                if(valoresDia[turno] != 0){
                    if (valoresDia[turno] == 1 || valoresDia[turno] == 3) {
                        soma += -1;
                    }else{
                        soma += 1;
                    }
                    nrTurnos++;
                }
            }

            valorDia = soma / nrTurnos;

            if (valorDia > 0) {
                html += `rgba(75, 192, 192, ${valorDia})`;
            }else if(valorDia < 0){
                html += `rgba(255, 99, 132, ${-valorDia})`;
            }else{
                html += `rgba(255, 159, 64, 0.5)`;
            }
        }
        html += `">${String("0" + dia).slice(-2)}</td>`;
        cont++;
        if (cont > 7) {
            html += '</tr><tr>';
            cont = 1;
        }
    }

    if (cont > 1) {
        html += '</tr>';
    }

    html += `</tbody>
                </table>
            </div>`;

    $('#historico_avaliacoes_mes').html(html);
}

function update_media_dia_semana(){
    var DADOS = JSON.parse(localStorage['DADOS']);
    var dias_semana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    html = '<strong class="col s12">Média das avaliações por dia da semana</strong><div class="col s2">';

    for (var dia in dias_semana) {
        html += '<div>' + dias_semana[dia] + '</div><div class="divider"></div>';
        // console.log(DADOS['dia_semana'][dias_semana[dia].substring(0,3).toLowerCase()]);
    }

    html += '</div>';

    $("#media_dia_semana").html(html);
}

function update_graficos(){
    update_historico_avaliacoes_mes();
    update_chart_dia_semana();
    update_chart_periodo_dia();
}


update_graficos();