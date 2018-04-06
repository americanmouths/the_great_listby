$(document).ready(function(){
  authorsIndex();
  displayBooks();
  authorsIndexLink();
  nextAuthor();
  authorsShow();
})


//////////////Constructors & Prototypes//////////////

//Author Constructor
function Author(data){
  this.id = data.id
  this.name = data.name
  this.books = data.books
}

//Author Index Prototype
Author.prototype.indexTemplate = function() {
  let authorHTML = `<a href="/authors/${this.id}" data-id="${this.id}" class="author-show">
  <h2><u>${ this.name }</u></h2>
  </a>
  <div id="authors_books-${this.id}"></div>
  <ul><a href="#" data-id="${this.id}" class="seeBooks" id="books-${this.id}">See Books</a></ul>
  `
  return authorHTML
}

//Author Show Prototype
Author.prototype.showTemplate = function() {
  let authorHTML = `<u>${ this.name }</u>`
  return authorHTML
}

//Book Constructor
function Book(data) {
  this.id = data.id
  this.title = data.title
}

//Book prototype
Book.prototype.showTemplate = function(){
  let bookHTML = `<ul><a href="/books/${this.id}"><li>${this.title}</li></a></ul>`
  return bookHTML
}


//////////////Author Index via AJAX//////////////

//Append Author Name to Index
function appendAuthorIndex(data){
  data.forEach(function(author){
    let newAuthor = new Author(author)
    let authorHTML = newAuthor.indexTemplate()
    $("#authors_container").append(authorHTML)
  })
}

//Author Index
function authorsIndex(){
  $.getJSON("/authors").done(function(data){
    appendAuthorIndex(data)
    })
  }

//Author Index via LINK in NAV bar
function authorsIndexLink(){
  $(document).on('click', 'a.author_index', function(){
    $.get("/authors").done(function(){
      $.getJSON("/authors").done(function(data){
        appendAuthorIndex(data)
      })
    })
  })
}

//Display each Book when See Books link is clicked
function displayBooks(){
  $(document).on('click', '.seeBooks', function(e){
    e.preventDefault();
    let id = $(this).attr('data-id')
    $.getJSON(`/authors/${id}.json`, appendBooks)
  })
}

//Render each book & hide see book link on click
function appendBooks(data){
  var authorId = data.id
  data["books"].forEach(function(book){
    let newBook = new Book(book)
    let bookHTML = newBook.showTemplate()
    $("#authors_books-" + authorId).append(bookHTML)
    $("a#books-" + authorId).hide();
  })
}

//////////////Author Show via AJAX//////////////

//Append Author & Books to Show Page
function appendAuthorsShow(data){
  var newAuthor = new Author(data)
  var authorHTML = newAuthor.showTemplate()
  $("#authorName").append(authorHTML)

  data["books"].forEach(function(book){
    let newBook = new Book(book)
    let bookHTML = newBook.showTemplate()
    $("#authors_books").append(bookHTML)
  })
}

//clear DIVS on show page
function clearDivs(){
  document.getElementById("htmlAuthorName").innerHTML = ""
  document.getElementById("authorName").innerHTML = ""
  document.getElementById("htmlAuthorBooks").innerHTML = ""
  document.getElementById("authors_books").innerHTML = ""
}

//Show Page via AJAX
function authorsShow(){
  $(document).on('click', 'a.author-show', function(){
    let id = $(this).attr('data-id')
    $.get("/authors/" + id).done(function (){
      $.getJSON("/authors/" + id).done(function(data){
        clearDivs();
        appendAuthorsShow(data);
        })
      })
    })
  }

//Next Author Via AJAX
function nextAuthor(){
  $(document).on('click', '.js-next', function(e){
    e.preventDefault();
    clearDivs();
    var nextId = parseInt($("a.js-next").attr("data-id")) + 1;

    $.get("/authors/" + nextId + ".json", function(data){
      appendAuthorsShow(data)
      $("a.js-next").attr("data-id", data["id"]);
    })
  })
}
