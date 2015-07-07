var tokenC;
var userSel;
var siguiendoSiNo;
var usuarioActual;
function buscarDato(token, usuario) {
    usuarioActual = usuario;
    tokenC = token;
    user = document.getElementById("campo_busqueda").value;
    document.getElementById("divSiguiendoInfo").innerHTML = '';
    if (user != '') {
        var request = new XMLHttpRequest();
        document.getElementById("divSiguiendoInfo").innerHTML = '';
        request.open("POST", "/2014_1T/Grupo11/busquedaAmigos/", true);
        request.addEventListener("load", respuestaBusqueda, false);
      //  request.setRequestHeader("X-CSRFToken", token);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        request.send("user=" + user);

    } else {

        document.getElementById("ulListaSiguiendo").innerHTML = '';

    }


}

function respuestaBusqueda(e) {
    json = e.target.responseText;
    obj = JSON.parse(json);
    divLista = document.getElementById("ulListaSiguiendo");
    contenido = "";
    for (i = 0; i < obj.length; i++) {
        contenido = contenido + '<a href="javascript:mostrarInfoUser(\'' + tokenC + '\',\'' + obj[i]["nombUsuario"] + '\')"><li class="itemSiguiendo">' + obj[i]["nombUsuario"] + '</li></a>';
    }
    divLista.innerHTML = contenido;
}


function mostrarInfoUser(token, usuario) {

    userSel=usuario;
    var request = new XMLHttpRequest();
 
    request.open("POST", "/2014_1T/Grupo11/infoPerfilUsuario/", true);
    request.addEventListener("load", respuestaInfoUser, false);
   // request.setRequestHeader("X-CSRFToken", token);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    request.send("userSel=" + usuario+"&userActual="+usuarioActual);


}

function respuestaInfoUser(e) {
    
    var json = e.target.responseText;
   
    obj = JSON.parse(json)[0];
    
    obj2 = JSON.parse(json)[1];
    if (obj2 == 'si') {
        siguiendoSiNo = 1; 
    } else {
        siguiendoSiNo = 0;
    }
    document.getElementById("divSiguiendoInfo").innerHTML = '';
    var frm = document.getElementById("divSiguiendoInfo");
    nombre = document.createElement("p");
    nombre.setAttribute("id", "nombrePerfil");
    nombre.innerHTML = obj.nombres + " " + obj.apellidos;
    frm.appendChild(nombre);

    var div = document.createElement("div");
    div.setAttribute("id", "divPerfil");
    user = document.createElement("text");
    user.setAttribute("id", "userPerfil");
    user.innerHTML = obj.nombusuario;
    div.appendChild(user);

    carro = document.createElement("text");
    carro.setAttribute("class", "leyendaPerfil");
    if (obj.tienecarro == "1")
        carro.innerHTML = "- Tiene carro";
    else
        carro.innerHTML = "- No tiene carro";
    div.appendChild(carro);
    frm.appendChild(div);

    if (userSel != usuarioActual) {
        var sino = document.createElement("div");
        sino.addEventListener("click", seguirSiNoAction, false);
        if (siguiendoSiNo == 0) {
            sino.setAttribute("class", "botonSeguirNo");
            sino.innerHTML = "Seguir";
        }
        else {
            sino.setAttribute("class", "botonSeguirSi");
            sino.innerHTML = "Siguiendo";
        }
        frm.appendChild(sino);
    }

    var fig = document.createElement("figure");
    foto = document.createElement("img");
    foto.setAttribute("src", "/2014_1T/Grupo11/Recursos/images/no-photo.jpg");
    foto.setAttribute("id", "fotoPerfil");
    fig.appendChild(foto);
    frm.appendChild(fig);

    var div = document.createElement("div");
    div.setAttribute("id", "divTable");
    var tabla = document.createElement("table");
    tabla.setAttribute("id", "tableSigSeg");

    var trSigSeg = document.createElement("tr");
    trSigSeg.setAttribute("id", "trSigSeg");
    var sig = document.createElement("td");
    sig.setAttribute("class", "leyendaPerfil");
    sig.innerHTML = "Siguiendo";
    var seg = document.createElement("td");
    seg.setAttribute("class", "leyendaPerfil");
    seg.innerHTML = "Seguidores";
    trSigSeg.appendChild(sig);
    trSigSeg.appendChild(seg);

    var trNums = document.createElement("tr");
    trNums.setAttribute("id", "trNums");
    var nSig = document.createElement("td");
    nSig.setAttribute("class", "leyendaPerfil");
    nSig.innerHTML = obj.nsiguiendo;
    var nSeg = document.createElement("td");
    nSeg.setAttribute("class", "leyendaPerfil");
    nSeg.innerHTML = obj.nseguidores;
    trNums.appendChild(nSig);
    trNums.appendChild(nSeg);

    tabla.appendChild(trSigSeg);
    tabla.appendChild(trNums);
    div.appendChild(tabla);
    frm.appendChild(div);
    pruebaComentario(obj.nombusuario);
}

function pruebaComentario(user) {


    var request = new XMLHttpRequest();

    request.open("POST", "/2014_1T/Grupo11/comentariosUsuario/", true);
    request.addEventListener("load", respuestaComentarios, false);
    request.setRequestHeader("X-CSRFToken", tokenC);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    request.send("user=" + user);

}

function respuestaComentarios(e) {
    divCon = document.getElementById("divSiguiendoInfo");
   
    json = e.target.responseText;
   
    obj = JSON.parse(json);

    for (i = 0; i < obj.length; i++) {
        div=document.createElement("div");
        div.setAttribute("id","miComent"+i);
        div.setAttribute("class", "miComent");
        fecha = obj[i].fecha;
        div.innerHTML="<b>"+userSel+"("+fecha+"):</b> "+obj[i].contenidotext;
        divCon.appendChild(div);


    } 
}

function seguirSiNoAction()
{
    if (siguiendoSiNo == 1) {
        this.setAttribute("class", "botonSeguirNo");
        this.innerHTML = "Seguir";
        siguiendoSiNo = 0;
        seguirEnviarInfo("dejar");

    }
    else
    {
        this.setAttribute("class", "botonSeguirSi");
        this.innerHTML = "Siguiendo";
        siguiendoSiNo = 1;
        seguirEnviarInfo("seguir");
    }
}

function seguirEnviarInfo(seguirSiguiendo) {
    var request = new XMLHttpRequest();

    request.open("POST", "/2014_1T/Grupo11/seguirUsuario/", true);
   
    request.setRequestHeader("X-CSRFToken", tokenC);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    request.send("sig=" + usuarioActual + "&seg=" + userSel + "&estado=" + seguirSiguiendo);

}

function mostrarSiguiendo(user, token) {
    form = document.createElement('form');
    form.method = 'POST';
    form.action = "/2014_1T/Grupo11/siguiendo/";
    input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "user");
    input.setAttribute("value", user);
    form.appendChild(input);

    input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "csrfmiddlewaretoken");
    input.setAttribute("value", token);
    form.appendChild(input);
    form.submit();
}


function mostrarSeguidores(user, token) {
    form = document.createElement('form');
    form.method = 'POST';
    form.action = "/2014_1T/Grupo11/seguidores/";
    input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "user");
    input.setAttribute("value", user);
    form.appendChild(input);

    input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "csrfmiddlewaretoken");
    input.setAttribute("value", token);
    form.appendChild(input);
    form.submit();
}

function mostrarInicio(user, token) {
    form = document.createElement('form');
    form.method = 'POST';
    form.action = "/2014_1T/Grupo11/main/";
    input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "user");
    input.setAttribute("value", user);
    form.appendChild(input);

    input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "csrfmiddlewaretoken");
    input.setAttribute("value", token);
    form.appendChild(input);
    form.submit();

}



function mostraPerfil(user, token) {
    form = document.createElement('form');
    form.method = 'POST';
    form.action = "/2014_1T/Grupo11/perfil/";
    input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "user");
    input.setAttribute("value", user);
    form.appendChild(input);

    input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "csrfmiddlewaretoken");
    input.setAttribute("value", token);
    form.appendChild(input);
    input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "2");
    input.setAttribute("value", token);
    form.appendChild(input);
    form.submit();
}