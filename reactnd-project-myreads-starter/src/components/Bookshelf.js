import React from 'react';
import { Link } from "react-router-dom";

//creates bookshelf and populates the shelves using mappingBooks from App.js
const Bookshelf = (props) => {

	return(
		<div className="app">
			<div className="list-books">
	            <div className="list-books-title">
	              <h1>MyReads</h1>
	            </div>
	            <div className="list-books-content">
	              <div>
	                <div className="bookshelf">
	                  <h2 className="bookshelf-title">Currently Reading</h2>
	                  <div className="bookshelf-books">
	                    <ol className="books-grid">

	                    	{props.currentlyReading
	                    		? (props.mappingBooks(props.currentlyReading))
	                    		: (<div></div>)
	                    	}

	                    </ol>
	                  </div>
	                </div>
	                <div className="bookshelf">
	                  <h2 className="bookshelf-title">Want to Read</h2>
	                  <div className="bookshelf-books">
	                    <ol className="books-grid">

	                    	{props.wantToRead
	                    		? (props.mappingBooks(props.wantToRead))
	                    		: (<div></div>)
	                    	}
	                     
	                    </ol>
	                  </div>
	                </div>
	                <div className="bookshelf">
	                  <h2 className="bookshelf-title">Read</h2>
	                  <div className="bookshelf-books">
	                    <ol className="books-grid">
	                     
	                    	{props.read
	                    		? (props.mappingBooks(props.read))
	                    		: (<div></div>)
	                    	}

	                    </ol>
	                  </div>
	                </div>
	              </div>
	            </div>
	            <div className="open-search">
	              <Link to ='/search'><button>Add a book</button></Link>
	            </div>
			</div>
		</div>
	)
}

export default Bookshelf; 


