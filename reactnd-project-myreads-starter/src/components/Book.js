import React from 'react';

const Book = (props) => {

	if (props.book){
		return(
			<li>
			    <div className="book">
			      <div className="book-top">
			        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${props.book.imageLinks.thumbnail})` }}></div>
			        <div className="book-shelf-changer">
			          <select value={props.book.shelf} onChange={(event) => props.updateBookshelf(props.book.id, event.target.value)}>
			            <option value="move" disabled>Move to...</option>
			            <option value="currentlyReading">Currently Reading</option>
			            <option value="wantToRead">Want to Read</option>
			            <option value="read">Read</option>
			            <option value="none">None</option>
			          </select>
			        </div>
			      </div>
			      <div className="book-title">{props.book.title}</div>
			      {props.book.authors.map(author=>
			      	<div className="book-authors" key={author}>{author}</div>
		      		)
			      }
			    </div>
		  	</li>
	  	)	
  	}else{
  		return(	<li><div className="book"></div></li>)
  	}
}

export default Book;