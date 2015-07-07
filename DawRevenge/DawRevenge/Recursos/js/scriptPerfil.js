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