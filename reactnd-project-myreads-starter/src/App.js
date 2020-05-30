import React from 'react'
import { BrowserRouter, Route} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Bookshelf from './components/Bookshelf.js'
import Book from './components/Book.js'
import Search from './components/Search.js'


class BooksApp extends React.Component {

  /***
    INITIAL SETUP
  ***/

  
  //setting initial state
  //bookshelf object stores all book data. Keys are book ids 
  //currentlyReading, wantToRead, and read store ids of book on each shelf
  //currentQuery and searchResults store current query and matching books
  state = {
    bookshelf: {},
    currentlyReading: [],
    wantToRead: [],
    read: [],
    currentQuery: "",
    searchResults: []
  }


  //sets initial state when mounting
  componentDidMount(){
    BooksAPI.getAll()
      .then(data => {
        let collectBooks = {}
        let currentReads = []
        let futureReads = []
        let pastReads = []

        data.forEach(book => {
            collectBooks[book.id] = book
            if (book.shelf === "currentlyReading"){
              currentReads.push(book.id)
            } 
            else if (book.shelf === "wantToRead"){
              futureReads.push(book.id)
            }
            else if (book.shelf === "read"){
              pastReads.push(book.id)
            }
        })

        this.setState({
          bookshelf: collectBooks,
          currentlyReading: currentReads,
          wantToRead: futureReads,
          read: pastReads
        })
      })

  }

  /***
    Updating State During Shelf Selections and Searches
  ***/

  //called when a new shelf is selected for a book
  updateBookshelf = async(bookID, shelf) => {

    //if the book is currently in search results, update the shelf in the searchResults array
    const searchIDs=this.state.searchResults.map(book => book.id)
    if(searchIDs.indexOf(bookID)>-1){
      this.state.searchResults[searchIDs.indexOf(bookID)].shelf = shelf
    }

    let modifiedBook = await BooksAPI.get(bookID)
    let updatedIDs = await BooksAPI.update(modifiedBook, shelf)

    //if this is a new book on the bookshelf (on any shelf), it will added as an object
    if(this.state.currentlyReading.includes(modifiedBook.id) === false&&
       this.state.wantToRead.includes(modifiedBook.id) === false&&
       this.state.read.includes(modifiedBook.id) === false){

          this.state.bookshelf[modifiedBook.id] = modifiedBook

    } else {
      //if the book already exists, update the shelf it's on
      //needed to make sure the default 'select' value is correct
      this.state.bookshelf[modifiedBook.id].shelf = shelf
    }

    //resetting the ids of what shelf each book belongs on 
    this.setState({
          currentlyReading: updatedIDs.currentlyReading,
          wantToRead: updatedIDs.wantToRead,
          read: updatedIDs.read
    })
  }


  searchForBooks = async(query) => {
    try{
      //set the query every time something is typed
      //at the top for performance reasons
      this.setState({
        currentQuery: query
      })

      //api call passing on the search query
      let searchedBooks = await BooksAPI.search(query)


      //filtering out returned errors or undefined arrays
      if(searchedBooks !== undefined && searchedBooks.error === undefined){
        //filtering out books where there isn't a title, thumbnail image, or author
        let filteredBooks = searchedBooks.filter(book => book.title !== undefined && book.authors !== undefined && book.imageLinks.thumbnail !== undefined)

        //iterates through the filtered books and determines what shelf they're currently on
        //creates a new shelf key for storing the shelf
        for(let b=0; b<filteredBooks.length; b++){
          if(this.state.bookshelf[filteredBooks[b].id] !== undefined){
            filteredBooks[b].shelf = this.state.bookshelf[filteredBooks[b].id].shelf
          }else{
            filteredBooks[b].shelf = "none"
          }
        }


        this.setState({
          searchResults: filteredBooks
        })
      } else {
        this.setState({
          searchResults: []
        })
      }
      
    }catch(error){
      this.setState({
        searchResults: []
      })
      console.log(error)

    }
    
  }

  /***
    Functions to Create Book.js Components
  ***/


  //used by the Bookshelf.js component to create Book elements
  mappingBooks = (bookArray) => {
    return(
      bookArray.map(bookKey => 
        <Book
              book={this.state.bookshelf[bookKey]}
              updateBookshelf={this.updateBookshelf}
              key={bookKey}
        />
      )
    )
  }

  //used by Search.js component to create Book elements
  mappingSearches = (searchArray) => {

    if(searchArray[0] !== undefined){
      return(
        searchArray.map(bookResult =>
          <Book
            book={bookResult}
            updateBookshelf={this.updateBookshelf}
            key={bookResult.id}
          /> 
        )
      )
    } else {
      return(<div></div>)
    }
    
  }

  render() {

    return (
      <BrowserRouter>
          <Route exact path='/'>
            <Bookshelf 
              bookshelf={this.state.bookshelf}
              currentlyReading={this.state.currentlyReading}
              wantToRead={this.state.wantToRead}
              read={this.state.read}
              updateBookshelf={this.updateBookshelf}
              mappingBooks={this.mappingBooks}
            /> 
          </Route>
          <Route path='/search'>
            <Search
              searchForBooks={this.searchForBooks}
              currentQuery={this.state.currentQuery}
              searchResults={this.state.searchResults}
              mappingSearches={this.mappingSearches}
            /> 
          </Route>
      </BrowserRouter>
    )
  }
}

export default BooksApp
