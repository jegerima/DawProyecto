var token;
window.addEventListener("load", inicializar, false);

function inicializar() {
    token = getCookie('csrftoken');
}

function iniciarSesion() {
    var user = document.getElementById("txtUser").value;
    var pasw = document.getElementById("txtPass").value;
    if (user != "" && pasw != "") {
        var parametros = "user=" + user + "&pasw=" + pasw;
        var request = new XMLHttpRequest();        
        request.open("POST", "/2014_1T/Grupo11/login/", true);
        request.addEventListener("load", respuestaLogin, false);
        request.setRequestHeader("X-CSRFToken", token);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        request.send(parametros);
    }
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function respuestaLogin(e) {
    var user = document.getElementById("txtUser").value;
    //var csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    var pasw = document.getElementById("txtPass").value;
    if (e.target.responseText == "success") {
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
    } else {
        mostrarXLogin();
    }
}


function crearFrmRegistro() {
    var registro, titulo, leyenda, form, userBox, passBox, carro, nocarro, btn;

    document.getElementById("login").style.display = "none";

    registro = document.createElement("div");
    registro.setAttribute("id", "registro");
    registro.setAttribute("class", "formReg");

    titulo = document.createElement("p");
    titulo.setAttribute("id", "titulo");
    titulo.innerHTML = "\u00BF Nuevo ?";
    titulo.style.marginTop = "10px";
    registro.appendChild(titulo);

    leyenda = document.createElement("div");
    leyenda.setAttribute("class", "leyenda");
    leyenda.innerHTML = "Registrate ahora";
    registro.appendChild(leyenda);

    form = document.createElement("form");
    form.setAttribute("id", "formRegistro");
    form.method = "POST";
    form.action = "/2014_1T/Grupo11/registro/";

    input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "csrfmiddlewaretoken");
    input.setAttribute("value", token);

    form.appendChild(input);
    leyenda = document.createElement("div");
    leyenda.setAttribute("class", "cuadroRegistro");
    leyenda.setAttribute("id", "cuentaEspol");
    var title = document.createElement("div");
    title.setAttribute("class", "tituloCuadro");
    title.setAttribute("id", "tituloCuentaEspol");
    title.innerHTML = "Cuenta ESPOL";
    leyenda.appendChild(title);
    var box = document.createElement("input");
    box.setAttribute("id", "userESPOL");
    box.setAttribute("name", "userESPOL");
    box.setAttribute("type", "text");
    box.onchange = validarCuentaEspol;
    box.setAttribute("required", "required");
    box.setAttribute("class", "textBox");
    box.setAttribute("placeholder", "Usuario ESPOL");
    box.setAttribute("autofocus", "true");

    leyenda.appendChild(box);
    var box = document.createElement("input");
    box.setAttribute("id", "passESPOL");
    box.setAttribute("name", "passESPOL");
    box.setAttribute("type", "password");

    box.onchange = validarCuentaEspol;
    box.setAttribute("required", "required");
    box.setAttribute("class", "textBox");
    box.setAttribute("placeholder", "Contrase\u00f1a ESPOL");
    box.setAttribute("autofocus", "true");
    box.style.marginLeft = "10px";
    leyenda.appendChild(box);
    form.appendChild(leyenda);

    leyenda = document.createElement("div");
    leyenda.setAttribute("class", "cuadroRegistro");
    leyenda.setAttribute("id", "datosPers");
    var title = document.createElement("div");
    title.setAttribute("class", "tituloCuadro");
    title.innerHTML = "Datos Personales";
    leyenda.appendChild(title);
    var box = document.createElement("input");
    box.setAttribute("id", "nameBox");
    box.setAttribute("name", "newNombre");
    box.setAttribute("type", "text");
    box.setAttribute("required", "required");
    box.setAttribute("class", "textBox");
    box.setAttribute("placeholder", "Nombre");
    box.setAttribute("readonly", "");
    leyenda.appendChild(box);
    var box = document.createElement("input");
    box.setAttribute("id", "lnameBox");
    box.setAttribute("name", "newApellido");
    box.setAttribute("type", "text");
    box.setAttribute("required", "required");
    box.setAttribute("class", "textBox");
    box.setAttribute("placeholder", "Apellido");
    box.setAttribute("readonly", "");
    box.style.marginLeft = "10px";
    leyenda.appendChild(box);

    var div = document.createElement("div");
    div.setAttribute("class", "leyenda");
    div.style.marginTop = "5px";
    passBox = document.createElement("input");
    passBox.setAttribute("id", "passBox");
    passBox.setAttribute("name", "newPassword");
    passBox.setAttribute("type", "password");
    passBox.setAttribute("required", "required");
    passBox.setAttribute("class", "textBox");
    passBox.setAttribute("placeholder", "Contrase\u00f1a");
    passBox.onchange = validarPass;
    div.appendChild(passBox);
    leyenda.appendChild(div);

    div = document.createElement("div");
    div.setAttribute("class", "leyenda");
    passBox = document.createElement("input");
    passBox.setAttribute("id", "cpassBox");
    passBox.setAttribute("type", "password");
    passBox.setAttribute("required", "required");
    passBox.setAttribute("class", "textBox");
    passBox.setAttribute("placeholder", "Confirmar contrase\u00f1a");
    passBox.onchange = validarPass;
    div.appendChild(passBox);
    leyenda.appendChild(div);

    div = document.createElement("div");
    div.setAttribute("class", "leyenda");
    carro = document.createElement("input");
    carro.setAttribute("type", "radio");
    carro.setAttribute("id", "carro");
    carro.setAttribute("value", "carro");
    carro.setAttribute("name", "carro");
    carro.setAttribute("checked", "checked");
    carro.setAttribute("onfocus", "javascript:mostrarPlaca()");
    var label = document.createElement("label");
    label.setAttribute("id", "carro");
    label.innerHTML = "Tengo carro";
    label.style.color = "White";
    div.appendChild(carro);
    div.appendChild(label);
    leyenda.appendChild(div);

    var div = document.createElement("div");
    div.setAttribute("class", "leyenda");
    nocarro = document.createElement("input");
    nocarro.setAttribute("type", "radio");
    nocarro.setAttribute("id", "noCarro");
    nocarro.setAttribute("value", "noCarro");
    nocarro.setAttribute("name", "carro");
    nocarro.setAttribute("onfocus", "javascript:ocultarPlaca()");
    carro.style.color = "White";
    var label = document.createElement("label");
    label.setAttribute("id", "noCarro");
    label.innerHTML = "No tengo carro";
    label.style.color = "White";
    div.appendChild(nocarro);
    div.appendChild(label);
    leyenda.appendChild(div);

    if (carro.checked) {
        var div = document.createElement("div");
        div.setAttribute("class", "leyenda");
        var placa = document.createElement("input");
        placa.setAttribute("id", "placa");
        placa.setAttribute("name", "placa");
        placa.setAttribute("type", "text");
        placa.setAttribute("required", "required");
        placa.setAttribute("class", "textBox");
        placa.setAttribute("placeholder", "Placa (Ej:ABC0123)");
        placa.setAttribute("autofocus", "true");
        div.appendChild(placa);
        leyenda.appendChild(div);
    }

    form.appendChild(leyenda);

    leyenda = document.createElement("div");
    leyenda.setAttribute("class", "leyenda");
    btn = document.createElement("input");
    btn.setAttribute("type", "submit");
    btn.setAttribute("class", "botonSubmit");
    btn.setAttribute("id", "btnRegistrar");
    btn.setAttribute("value", "Registrar");
    leyenda.appendChild(btn);
    form.appendChild(leyenda);

    registro.appendChild(form);

    leyenda = document.createElement("div");
    leyenda.setAttribute("class", "leyenda");
    var a = document.createElement("a");
    a.setAttribute("href", "#");
    a.setAttribute("onclick", "javascript:cambiarFrms()");
    a.innerHTML = "<< Atr\u00e1s";
    a.style.fontWeight = "bold";
    a.style.color = "#000000";
    leyenda.appendChild(a);
    registro.appendChild(leyenda);

    seccion = document.getElementById("content");
    seccion.appendChild(registro);
}

function validarPass() {
    pass1=document.getElementById("passBox").value ;
    pass2 = document.getElementById("cpassBox").value;
    if (pass1 != '' && pass2 != '') {
        if (pass1 != pass2) {
            document.getElementById("passBox").value = document.getElementById("cpassBox").value = '';
            alert(" Contrase\u00f1as  no coinciden !")
        }
    }
}

function cambiarFrms() {
    document.getElementById("login").style.display = "block";
    var registro = document.getElementById("registro");
    registro.parentNode.removeChild(registro);
}

function mostrarLoading() {
    var popup, figure, gif, seccion;

    popup = document.createElement("div");
    popup.setAttribute("class", "popup");
    popup.setAttribute("id", "loading");

    figure = document.createElement("figure");
    gif = document.createElement("img");
    gif.setAttribute("src", "/2014_1T/Grupo11/Recursos/images/loading.gif");
    gif.setAttribute("class", "loading");
    figure.appendChild(gif);
    popup.appendChild(figure);

    seccion = document.getElementById("content");
    seccion.appendChild(popup);
}

function quitarLoading() {
    var popup = document.getElementById("loading");
    popup.parentNode.removeChild(popup);

}

function mostrarPlaca() {
    if (document.getElementById("placa")) {
        ocultarPlaca();
    }
    var form = document.getElementById("datosPers");
    var btn = document.getElementById("btnRegistrar");
    var leyenda = document.createElement("div");
    leyenda.setAttribute("class", "leyenda");
    var placa = document.createElement("input");
    placa.setAttribute("id", "placa");
    placa.setAttribute("name", "placa");
    placa.setAttribute("type", "text");
    placa.setAttribute("required", "required");
    placa.setAttribute("class", "textBox");
    placa.setAttribute("placeholder", "Placa (Ej:ABC0123)");
    placa.setAttribute("autofocus", "true");
    leyenda.appendChild(placa);
    form.appendChild(leyenda);
}

function ocultarPlaca() {
    var nocarro = document.getElementById("placa");
    var frm = document.getElementById("datosPers");
    var div = nocarro.parentNode;
    frm.removeChild(div);
}

function mostrarVisto() {
    var div = document.getElementById("tituloCuentaEspol");
    ocultarVisto();
    ocultarX();
    var img = document.createElement("img");

    img.setAttribute("src", "/2014_1T/Grupo11/Recursos/images/visto.png");
    img.setAttribute("id", "visto");
    img.style.width = "20px";
    img.style.height = "20px";
    img.style.position = "absolute";
    div.appendChild(img);

    var texto = document.createElement("div");
    texto.setAttribute("class", "userValido");
    texto.innerHTML = "Usuario v\u00e1lido";
    div.appendChild(texto);
}

function ocultarVisto() {
    var div = document.getElementById("tituloCuentaEspol");
    var img = document.getElementById("visto");
    var txt = document.getElementsByClassName("userValido")[0];
    if (txt != null && img != null) {
        div.removeChild(img);
        div.removeChild(txt);
    }

}

function mostrarX() {
    var div = document.getElementById("tituloCuentaEspol");
    ocultarVisto();
    ocultarX();
    var img = document.createElement("img");
    img.setAttribute("src", "/2014_1T/Grupo11/Recursos/images/equis.png");
    img.setAttribute("id", "equis");
    img.style.width = "20px";
    img.style.height = "20px";
    img.style.position = "absolute";
    div.appendChild(img);

    var texto = document.createElement("div");
    texto.setAttribute("class", "userinValido");
    texto.innerHTML = "Usuario inv\u00e1lido";
    div.appendChild(texto);
}

function ocultarX() {
    var div = document.getElementById("tituloCuentaEspol");
    var img = document.getElementById("equis");
    var txt = document.getElementsByClassName("userinValido")[0];
    if (img != null && txt != null) {
        div.removeChild(img);
        div.removeChild(txt);
    }
}

function validarCuentaEspol() {
    userT = document.getElementById("userESPOL").value;
    passT = document.getElementById("passESPOL").value;
    if (userT != "" && passT != "") {
        parametros = "user=" + userT + "&pasw=" + passT;
        request = new XMLHttpRequest();
        // csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        request.open("POST", "/2014_1T/Grupo11/usuario/", true);
        request.addEventListener("load", procesarValidacionCuentaEspol, false);
        request.setRequestHeader("X-CSRFToken", token);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        request.send(parametros);
       // mostrarLoading();
    } else {
        ocultarVisto();
        ocultarX();
    }
}

function procesarValidacionCuentaEspol(e) {

    if (e.target.responseText == "success") {
        mostrarVisto();

        buscarNombres();

    } else {
        //quitarLoading();
        mostrarX();
    }
}

function buscarNombres() {

    var usuario = document.getElementById("userESPOL").value;
    var request = new XMLHttpRequest();
    // var csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    request.open("POST", "/2014_1T/Grupo11/datosuser/", true);
    request.addEventListener("load", respuestaNombres, false);
    request.setRequestHeader("X-CSRFToken", token);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    request.send("user=" + usuario);


}

function respuestaNombres(e) {

    nombres = e.target.responseText.split(" ");
    document.getElementById("nameBox").value = nombres[2] + " " + nombres[3];
    document.getElementById("lnameBox").value = nombres[0] + " " + nombres[1];
  //  quitarLoading();
}

function mostrarXLogin() {
    var div = document.getElementById("txtUser").parentNode;
    ocultarXLogin();
    var img = document.createElement("img");
    img.setAttribute("src", "/2014_1T/Grupo11/Recursos/images/equis.png");
    img.setAttribute("id", "equis");
    img.style.width = "20px";
    img.style.height = "20px";
    img.style.position = "absolute";
    div.appendChild(img);
}

function ocultarXLogin() {
    var div = document.getElementById("txtUser").parentNode;
    var img = document.getElementById("equis");
    if (img != null) {
        div.removeChild(img);
    }
}
