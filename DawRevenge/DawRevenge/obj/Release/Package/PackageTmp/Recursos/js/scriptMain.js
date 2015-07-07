var map;
var latitud, longitud;
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
var markers = [];
var bounds;
var polyline;
var nodioClicDedo = true;
var dioClicRuta = false;
var permitirHacerDedo = false;
var cont = 0;
var myLatlngDestino;
var myLatlngOrigen;
var ventanaDedo;
var points;
var usuario, tok;
var puntoA;
var puntoB;
var A_B = false;
var fechaHora;
var creacionRuta = false;
var rutaSel;
var nombreRutaSel;
var rutaUsuarioSel;
var tokenGen;

function detectarLocalizacionPorIP() {
    request = new XMLHttpRequest();
    request.open("GET", "http://freegeoip.net/xml/" + myip, true);
    request.addEventListener("load", obtenerLatLon, false);
    request.send();
}

function obtenerLatLon(e) {
    xml = e.target.responseText;
    div = document.createElement("div");
    div.innerHTML = xml;
    latitud = div.getElementsByTagName("Latitude")[0].innerHTML;
    longitud = div.getElementsByTagName("Longitude")[0].innerHTML;
    mostrarUbicacionActual();
}

function mostrarUbicacionActual() {
    limpiarMarkers();
    limpiarRutas();
    var mapOptions = {
        zoom: 17
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    // Intentar la geolocalización
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);


            var marker = new google.maps.Marker({

                position: pos,
                animation: google.maps.Animation.BOUNCE,
                map: map,
                title: 'Informacion '
            });
            var infowindow = new InfoBubble({
                content: '<p>Usted esta aqui</p>',
                hideCloseButton: true,
            });

            infowindow.open(map, marker);

            map.setCenter(pos);

        }, function () {
            // No se pudo obtener localización por medio del navegador
            mostrarLocalizacionPorIP();
        });
    } else {
        // El navegador no permite obtener localización
        mostrarLocalizacionPorIP();
    }
}

function mostrarLocalizacionPorIP() {


    var position = new google.maps.LatLng(latitud, longitud);

    var marker = new google.maps.Marker({

        position: new google.maps.LatLng(latitud, longitud),
        animation: google.maps.Animation.BOUNCE,
        map: map,
        title: ''
    });
    var infowindow = new InfoBubble({

        content: 'Usted esta aqui !',
        hideCloseButton: true,
    });



    infowindow.open(map, marker);

    map.setCenter(position);
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
    input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "2");
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
window.addEventListener("load", detectarLocalizacionPorIP, false);




function dibujarRuta(usuario, ruta,nombreRuta, lat_origen, lon_origen, lat_destino, lon_destino, lat_posicionDedo, lon_posicionDedo, crearInfoDedo, token, enviada) {
    tokenGen = token;
    permitirHacerDedo = false;
    limpiarRutas();
    limpiarMarkers();
    inicioRutaSel = lat_origen + ',' + lon_origen;
    finRutaSel = lat_destino + ',' + lon_destino;
    directionsDisplay = new google.maps.DirectionsRenderer({
        //  draggable:true,             // Si es que se desea hacer modificable la ruta
        // suppressMarkers: true,    // Si es que se desea tener markers persnoalizados
        suppressInfoWindows: false
    });
    directionsDisplay.setMap(map);

    var request = {
        origin: new google.maps.LatLng(lat_origen, lon_origen),
        destination: new google.maps.LatLng(lat_destino, lon_destino),
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            polyline = new google.maps.Polyline({
                strokeColor: "#0000ff",
                strokeOpacity: 0.2,
                strokeWeight: 7,
                clickable: true,
                //  editable: true,  
                geodesic: true,
                zIndex: 1,
                map: map,
                myID: 1,
            });

            bounds = new google.maps.LatLngBounds();
            points = []
            var legs = response.routes[0].legs;
            for (i = 0; i < legs.length; i++) {
                var steps = legs[i].steps;
                for (j = 0; j < steps.length; j++) {
                    var nextSegment = steps[j].path;
                    for (k = 0; k < nextSegment.length; k++) {
                        polyline.getPath().push(nextSegment[k]);
                        bounds.extend(nextSegment[k]);
                        points.push(nextSegment[k]);
                    }
                }
            }

            polyline.setMap(map);
            map.fitBounds(bounds);


            google.maps.event.addListener(polyline, 'click', clicPolyline);

            if (crearInfoDedo == true) {
                if (enviada=='ACEPTADA') {
                    crearVentana('Solicitud ha sido aceptada !', points[parseInt(points.length / 2)], null);
                } else if (enviada == 'ESPERA') {

                    crearVentana('Solicitud ya ha sido enviada !', points[parseInt(points.length / 2)], null);
                } else {


                    crearVentana('<IMG BORDER="0" ALIGN="Left" src="/2014_1T/Grupo11/Recursos/images/dedo.png" height="50" width="50" onclick="confirmarPeticion(' + ruta + ',&#39' + nombreRuta + '&#39,&#39' + usuario + '&#39)">', points[parseInt(points.length / 2)], null);
                }
            } else {
                google.maps.event.clearListeners(map, 'click');
            }


            google.maps.event.addListener(polyline, 'mousemove', polylineMouseMove);

            google.maps.event.addListener(polyline, 'mouseout', polylineMouseOut);


            if (lat_posicionDedo != null && lon_posicionDedo != null) {
                marcador = crearMarker(new google.maps.LatLng(lat_posicionDedo, lon_posicionDedo), "");
                crearVentana('<input type="submit" class="botonSubmit" value="Aceptar" onclick="javascript:aceptarPeticion(' + ruta + ',&#39' + usuario + '&#39,&#39aceptar&#39)">' +
                    '<input type="submit" class="botonSubmit" value="Rechazar" onclick="javascript:aceptarPeticion(' + ruta + ',&#39' + usuario + '&#39,&#39rechazar&#39)">' 
                    , new google.maps.LatLng(lat_posicionDedo, lon_posicionDedo), marcador);

            }

            mostrarNombreLocalizacion(legs[0].start_location);

            mostrarNombreLocalizacion(legs[0].end_location);

        } else {
            alert("Ruta Imposible de dibujar ! ");
        }
    });
}

function crearMarker(position, title) {

    var mark = new google.maps.Marker({
        position: position,
        map: map,
        title: title,
        //  draggable:true,
    });

    // Se guarda en el arreglo de markers
    markers.push(mark);
    return mark;

}
function limiparVentana() {
    if (ventanaDedo != null) {

        ventanaDedo.close();
        ventanaDedo = null;
    }
}
function limpiarRutas() {
    if (directionsDisplay != null && polyline != null) {
        limiparVentana();
        directionsDisplay.setMap(null);
        directionsDisplay = null;
        polyline.setMap(null);
        polyline = null;
        nodioClicDedo = true;
    }
}

function limpiarMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function hacerDedo(ruta,nombreRuta, usuarioSel) {

    rutaSel = ruta;
    nombreRutaSel = nombreRuta;
    rutaUsuarioSel = usuarioSel;

    permitirHacerDedo = true;
    var popup = document.getElementById("popup");
    popup.parentNode.removeChild(popup);
    limiparVentana();
    alert(" Marque en el mapa el punto donde desea que lo recojan ! ");
}

function indicarHoraRuta(user, token) {
    usuario = user;
    tokenGen = token;
    creacionRuta = true;
    mostrarUbicacionActual();

    var popup, form, leyenda, fecha, hora, btn;

    popup = document.createElement("div");
    popup.setAttribute("class", "popup");
    popup.setAttribute("id", "datosRuta");
    salirPopupId = "datosRuta";
    window.onkeyup = salirPopUp;
    form = document.createElement("form");
    form.setAttribute("id", "frmFechaHora");
    form.setAttribute("action", "javascript:marcar()");

    leyenda = document.createElement("div");
    leyenda.innerHTML = "Fecha de inicio del recorrido: ";
    fecha = document.createElement("input");
    fecha.setAttribute("type", "date");
    fecha.setAttribute("id", "fechaRuta");
    form.appendChild(leyenda);
    form.appendChild(fecha);

    leyenda = document.createElement("div");
    leyenda.innerHTML = "Hora de inicio del recorrido: ";
    hora = document.createElement("input");
    hora.setAttribute("type", "time");
    hora.setAttribute("id", "horaRuta");
    form.appendChild(leyenda);
    form.appendChild(hora);

    leyenda = document.createElement("div");
    leyenda.setAttribute("class", "leyenda");
    btn = document.createElement("input");
    btn.setAttribute("type", "submit");
    btn.setAttribute("class", "botonSubmit");
    btn.setAttribute("value", "Aceptar");
    leyenda.appendChild(btn);
    form.appendChild(leyenda);

    popup.appendChild(form);

    seccion = document.getElementById("map-canvas");
    seccion.appendChild(popup);
}

function marcar() {

    var fecha = document.getElementById("fechaRuta").value;
    var hora = document.getElementById("horaRuta").value;

    if (fecha == "" || hora == "") {
        return;
    }

    fechaHora = fecha + " " + hora;
    
    permitirMarcado = true;
    popup = document.getElementById("datosRuta");
    popup.parentNode.removeChild(popup);

    google.maps.event.addListener(map, "click", darclick);
    alert("Comienze marcar en el mapa");

}

function salirPopUp(e) {
    key = e.keyCode;
    if (key == 27) { //27 = escape
        if (dioClicRuta) {
            limpiarRutas();
            limpiarMarkers();
            dioClicRuta = false;
        }
        popup = document.getElementById(salirPopupId);
        popup.parentNode.removeChild(popup);

    }
}

function darclick(evento) {
    if (cont == 0) {
        myLatlngOrigen = evento.latLng;
        crearMarker(myLatlngOrigen, "" + myLatlngOrigen);
        cont = 1;


    } else {
        myLatlngDestino = evento.latLng;

        crearMarker(myLatlngDestino, "" + myLatlngDestino);

        dioClicRuta = true;
        dibujarRuta(usuario, null,null, myLatlngOrigen.lat(), myLatlngOrigen.lng(), myLatlngDestino.lat(), myLatlngDestino.lng(), null, null, false, tokenGen, 'NO');

        cont = 0;

    }
}

function confirmarPeticion(ruta,nombreRuta, usuario) {
    var popup, form, leyenda, txtComent, hora, btn;

    popup = document.createElement("div");
    popup.setAttribute("class", "popup");
    popup.setAttribute("id", "popup");
    salirPopupId = "popup";
    window.onkeyup = salirPopUp;

    form = document.createElement("form");
    form.setAttribute("id", "frmPeticion");
    form.setAttribute("action", "javascript:hacerDedo(" + ruta + ",'"+nombreRuta+"','" + usuario + "'" + ")");

    leyenda = document.createElement("div");
    leyenda.innerHTML = "&iquest;Seguro que desea enviar una peticion a esta ruta?";
    form.appendChild(leyenda);

    leyenda = document.createElement("div");
    leyenda.setAttribute("class", "leyenda");
    btn = document.createElement("input");
    btn.setAttribute("type", "submit");
    btn.setAttribute("class", "botonSubmit");
    btn.setAttribute("value", "Aceptar");
    leyenda.appendChild(btn);
    form.appendChild(leyenda);

    popup.appendChild(form);

    seccion = document.getElementById("map-canvas");
    seccion.appendChild(popup);
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

function crearVentana(contenidoV, posicionV, marker) {
    //   ventanaDedo = new google.maps.InfoWindow({
    //     content: contenidoV,
    //  });


    ventanaDedo = new InfoBubble({
        map: map,
        content: contenidoV,

        hideCloseButton: true,

    });
    ventanaDedo.setPosition(posicionV);
    if (marker != null) {
        ventanaDedo.open(map, marker);
    } else {
        ventanaDedo.open(map);
    }



}

function clicPolyline(e) {
    if (permitirHacerDedo) {

        var myLatLng = e.latLng;

        crearMarker(myLatLng, "" + myLatLng);
        nodioClicDedo = false;
        google.maps.event.clearListeners(polyline, 'click');

        enviarPeticionRuta(rutaUsuarioSel, rutaSel,nombreRutaSel, myLatLng.lat(), myLatLng.lng());
    }
}

function enviarPeticionRuta(user, ruta,nombreRuta, posicionLat, posicionLon) {
    fechaActual = new Date();
    fechaString = fechaActual.getFullYear() + "-" + fechaActual.getMonth() + "-" + fechaActual.getDate();
    var parametros = "user=" + user + "&ruta=" + ruta + "&nombreRuta=" + nombreRuta + "&fecha=" + fechaString + "&inicioRuta=" + inicioRutaSel + "&finRuta=" + finRutaSel + "&posicion=" + posicionLat + "," + posicionLon;
    var request = new XMLHttpRequest();
    request.open("POST", "/2014_1T/Grupo11/envioPeticionRuta/", true);
  //  request.setRequestHeader("X-CSRFToken", tokenGen);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    request.send(parametros);


}





function aceptarPeticion(ruta, user,aceptar) {
    
    var parametros = "user=" + user + "&ruta=" + ruta + "&aceptacion=" + aceptar;
    var request = new XMLHttpRequest();
    request.open("POST", "/2014_1T/Grupo11/aceptarPeticion/", true);
    request.setRequestHeader("X-CSRFToken", tokenGen);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    request.send(parametros);
    
    limiparVentana();
}

function polylineMouseMove(e) {

    if (permitirHacerDedo) {
        if (nodioClicDedo) {
            limpiarMarkers();
            var myLatLng = e.latLng;
            crearMarker(myLatLng, "" + myLatLng);
        }

    }
}


function polylineMouseOut(e) {
    if (permitirHacerDedo) {

        if (nodioClicDedo) {
            limpiarMarkers();
        }

    }

}

function buscarAmigos(user, token) {
    form = document.createElement('form');
    form.method = 'POST';
    form.action = "/2014_1T/Grupo11/amigos/";
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

function nuevoComentario(user, token) {

    var popup, form, leyenda, txtComent, hora, btn;

    popup = document.createElement("div");
    popup.setAttribute("class", "popup");
    popup.setAttribute("id", "popup");
    salirPopupId = "popup";
    window.onkeyup = salirPopUp;

    form = document.createElement("form");
    form.setAttribute("id", "frmNewComent");
    form.setAttribute("action", "javascript:guardarComentario('" + user + "','" + token + "')");

    leyenda = document.createElement("div");
    leyenda.innerHTML = "Ingrese su comentario: ";
    txtComent = document.createElement("input");

    txtComent.setAttribute("type", "text");
    txtComent.setAttribute("id", "txtComent");
    txtComent.setAttribute("required", "required");
    txtComent.setAttribute("oninvalid", "setCustomValidity('Campo obligatorio')");
    txtComent.setAttribute("oninput", "setCustomValidity('')");
    form.appendChild(leyenda);
    form.appendChild(txtComent);

    leyenda = document.createElement("div");
    leyenda.setAttribute("class", "leyenda");
    btn = document.createElement("input");
    btn.setAttribute("type", "submit");
    btn.setAttribute("class", "botonSubmit");
    btn.setAttribute("value", "Aceptar");
    leyenda.appendChild(btn);
    form.appendChild(leyenda);

    popup.appendChild(form);

    seccion = document.getElementById("map-canvas");
    seccion.appendChild(popup);



}

function guardarComentario(user, token) {
    comentario = document.getElementById("txtComent").value;
    fechaActual = new Date();
    fechaString = fechaActual.getFullYear() + "-" + fechaActual.getMonth() + "-" + fechaActual.getDate() + " " + fechaActual.getHours() + ":" + fechaActual.getMinutes() + ":" + fechaActual.getSeconds();
    var parametros = "user=" + user + "&comentario=" + comentario + "&fecha=" + fechaString;
    var request = new XMLHttpRequest();
    request.open("POST", "/2014_1T/Grupo11/agregarComentario/", true);
    request.setRequestHeader("X-CSRFToken", token);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    request.send(parametros);

    var popup = document.getElementById("popup");
    popup.parentNode.removeChild(popup);
}

function confirmarRuta() {
    var popup, form, leyenda, txtComent, hora, btn;

    popup = document.createElement("div");
    popup.setAttribute("class", "popup");
    popup.setAttribute("id", "popup");
    salirPopupId = "popup";
    window.onkeyup = salirPopUp;

    form = document.createElement("form");
    form.setAttribute("id", "frmPeticion");
    form.setAttribute("action", "javascript:confRuta()");

    leyenda = document.createElement("div");
    leyenda.innerHTML = "&iquest;Seguro que desea agregar esta ruta?";
    form.appendChild(leyenda);

    leyenda = document.createElement("div");
    leyenda.setAttribute("class", "leyenda");
    btn = document.createElement("input");
    btn.setAttribute("type", "submit");
    btn.setAttribute("class", "botonSubmit");
    btn.setAttribute("value", "Aceptar");
    leyenda.appendChild(btn);
    form.appendChild(leyenda);

    popup.appendChild(form);

    seccion = document.getElementById("map-canvas");
    seccion.appendChild(popup);
}


function confRuta() {

    var parametros = "user=" + usuario + "&origen=" + myLatlngOrigen.lat() +
        "," + myLatlngOrigen.lng() + "&destino=" + myLatlngDestino.lat() +
        "," + myLatlngDestino.lng() + "&nombre=" + puntoA + "," + puntoB + "&fecha=" + fechaHora;
    var request = new XMLHttpRequest();
    request.open("POST", "/2014_1T/Grupo11/agregarRuta/", true);
    request.setRequestHeader("X-CSRFToken", tokenGen);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    request.send(parametros);

    popup = document.getElementById(salirPopupId);
    popup.parentNode.removeChild(popup);

}

function mostrarNombreLocalizacion(lat_long) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'latLng': lat_long
    }, respuestaNombreLoca);
}

function respuestaNombreLoca(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
            respuesta = results[0].address_components[0].long_name + "-" + results[1].address_components[0].long_name;
            if (!A_B) {
                puntoA = respuesta;
                A_B = true;
            } else {
                puntoB = respuesta;
                A_B = false;
                if (dioClicRuta && creacionRuta) {
                    confirmarRuta();
                    creacionRuta = false;

                }
            }
        } else {
            respuesta = 'No results found';
        }
    } else {
        respuesta = 'Geocoder failed due to: ' + status;
    }

}

google.maps.event.addDomListener(window, "resize", function () {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
});


function popupPeticionRecibida(user) {
    var popup, frm, titulo, leyenda, btn;
    popup = document.createElement("div");
    popup.setAttribute("class", "popup");
    popup.setAttribute("id", "popup");
    frm = document.createElement("div");
    frm.setAttribute("id", "frmPopupPeticiones");
    frm.setAttribute("class", "frmPopupPeticiones");
    titulo = document.createElement("p");
    titulo.setAttribute("id", "titulo");
    titulo.style.marginTop = "0px";
    titulo.style.fontSize = "30px";
    titulo.innerHTML = "Peticion";
    frm.appendChild(titulo);
    leyenda = document.createElement("div");
    leyenda.setAttribute("class", "leyenda");
    leyenda.style.fontSize = "13px";
    leyenda.innerHTML = "El usuario " + user + " ha enviado una petición a una de sus rutas."
    frm.appendChild(leyenda);
    popup.appendChild(frm);
    leyenda = document.createElement("div");
    leyenda.setAttribute("class", "leyenda");
    btn = document.createElement("input");
    btn.setAttribute("type", "button");
    btn.setAttribute("id", "cerrarPet");
    btn.setAttribute("class", "botonSubmit");
    btn.style.fontSize = "13px";
    btn.style.width = "70px";
    btn.style.height = "30px";
    btn.setAttribute("value", "Aceptar");
    btn.addEventListener("click", function () {
        var popup = document.getElementById("popup");
        popup.parentNode.removeChild(popup);
    }, false);
    leyenda.appendChild(btn);
    frm.appendChild(leyenda);
    seccion = document.getElementById("map-canvas");
    seccion.appendChild(popup);
}
function popupPeticionAceptada(user) {
    var popup, frm, titulo, leyenda, btn;
    popup = document.createElement("div");
    popup.setAttribute("class", "popup");
    popup.setAttribute("id", "popup");
    frm = document.createElement("div");
    frm.setAttribute("id", "frmPopupPeticiones");
    frm.setAttribute("class", "frmPopupPeticiones");
    titulo = document.createElement("p");
    titulo.setAttribute("id", "titulo");
    titulo.style.marginTop = "0px";
    titulo.style.fontSize = "30px";
    titulo.innerHTML = "Peticion";
    frm.appendChild(titulo);
    leyenda = document.createElement("div");
    leyenda.setAttribute("class", "leyenda");
    leyenda.style.fontSize = "13px";
    leyenda.innerHTML = "El usuario " + user + " ha aceptado su petición."
    frm.appendChild(leyenda);
    popup.appendChild(frm);
    leyenda = document.createElement("div");
    leyenda.setAttribute("class", "leyenda");
    btn = document.createElement("input");
    btn.setAttribute("type", "button");
    btn.setAttribute("id", "cerrarPet");
    btn.setAttribute("class", "botonSubmit");
    btn.style.fontSize = "13px";
    btn.style.width = "70px";
    btn.style.height = "30px";
    btn.setAttribute("value", "Aceptar");
    btn.addEventListener("click", function () {
        var popup = document.getElementById("popup");
        popup.parentNode.removeChild(popup);
    }, false);
    leyenda.appendChild(btn);
    frm.appendChild(leyenda);
    seccion = document.getElementById("map-canvas");
    seccion.appendChild(popup);
}