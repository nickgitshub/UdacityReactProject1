
import React from 'react' 
import { Link } from "react-router-dom";


const Search = (props) => {

  return(
    <div className="app">
      <div className="search-books">
        <div className="search-books-bar">
          <Link to='/'><button className="close-search" >Close</button></Link>
          <div className="search-books-input-wrapper">
            <input 
              type="text" 
              placeholder="Search by title or author"
              value={props.currentQuery}
              //referencing searchForBooks within app.js and passing it the search field value onChange
              onChange={(event)=>{
                props.searchForBooks(event.target.value)

              }}
            />

          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">

            {props.searchResults.error === undefined && props.searchResults
              ? (props.mappingSearches(props.searchResults))
              : (<div></div>)
            }   

          </ol>
        </div>
      </div>
    </div>  
  )
  
}

export default Search; 