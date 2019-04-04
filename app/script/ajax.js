// Получение всех пользователей
function GetUsers() {
    $.ajax({
        url: "/notes",
        type: "GET",
        contentType: "application/json",
        success: function (articles) {
            var rows = "";
            $.each(articles, function (index, article) {
                // добавляем полученные элементы в таблицу
                rows += row(article);
            })
            $("table tbody").append(rows);
        }
    });
}
// Получение одного пользователя
function GetUser(id) {
    $.ajax({
        url: "/notes/"+id,
        type: "GET",
        contentType: "application/json",
        success: function (article) {
            var form = document.forms["articlesForm"];
            form.elements["id"].value = article.id;
            form.elements["theme"].value = article.theme;
            form.elements["articleText"].value = article.articleText;
        }
    });
}
// Добавление пользователя
function CreateUser(articleTheme, articleText) {
    $.ajax({
        url: "/notes",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            theme: articleTheme,
            text: articleText
        }),
        success: function (article) {
            reset();
            $("table tbody").append(row(article));
        }
    })
}
// Изменение пользователя
function EditUser(articleId, articleTheme, articleText) {
    $.ajax({
        url: "/notes",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: articleId,
            theme: articleTheme,
            text: articleText
        }),
        success: function (article) {
            reset();
            $("tr[data-rowid='" + article.id + "']").replaceWith(row(article));
        }
    })
}

// сброс формы
function reset() {
    var form = document.forms["articlesForm"];
    form.reset();
    form.elements["id"].value = 0;
}

// Удаление пользователя
function DeleteUser(id) {
    $.ajax({
        url: "/notes/"+id,
        contentType: "application/json",
        method: "DELETE",
        success: function (articles) {
            console.log(articles);
            $("tr[data-rowid='" + articles.id + "']").remove();
        }
    })
}
// создание строки для таблицы
var row = function (articles) {
    return "<tr data-rowid='" + articles.id + "'><td>" + articles.id + "</td>" +
        "<td>" + articles.theme + "</td> <td>" + articles.text + "</td>" +
        "<td><a style='cursor: pointer' class='editLink' data-id='" + articles.id + "'>Изменить</a> | " +
        "<a style='cursor: pointer' class='removeLink' data-id='" + articles.id + "'>Удалить</a></td></tr>";
}
// сброс значений формы
$("#reset").click(function (e) {

    e.preventDefault();
    reset();
})

// отправка формы
$("form").submit(function (e) {
    e.preventDefault();
    var id = this.elements["id"].value;
    var theme = this.elements["theme"].value;
    var text = this.elements["articleText"].value;
    if (id == 0)
        CreateUser(theme, text);
    else
        EditUser(id, theme, text);
});

// нажимаем на ссылку Изменить
$("body").on("click", ".editLink", function () {
    var id = $(this).data("id");
    GetUser(id);
})
// нажимаем на ссылку Удалить
$("body").on("click", ".removeLink", function () {
    var id = $(this).data("id");
    DeleteUser(id);
})

// загрузка пользователей
GetUsers();
